package com.dkarito.orderservice.repository;

import com.dkarito.orderservice.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Pageable;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT o FROM Order o WHERE o.userId = :userId AND o.status = :status ORDER BY o.createdAt DESC")
    List<Order> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Order.OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(@Param("status") Order.OrderStatus status);

    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findAllOrderByCreatedAtDesc();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.createdAt >= :date")
    BigDecimal sumTotalAmountByCreatedAtAfter(@Param("date") LocalDateTime date);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :date")
    Long countOrdersByCreatedAtAfter(@Param("date") LocalDateTime date);

    @Query("SELECT new com.dkarito.orderservice.dto.TopProductDto(oi.productId, SUM(oi.quantity)) " +
            "FROM OrderItem oi GROUP BY oi.productId ORDER BY SUM(oi.quantity) DESC")
    List<com.dkarito.orderservice.dto.TopProductDto> findTopSellingProducts(Pageable pageable);
}
