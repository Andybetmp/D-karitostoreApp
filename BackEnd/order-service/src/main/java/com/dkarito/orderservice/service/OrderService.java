package com.dkarito.orderservice.service;

import com.dkarito.orderservice.domain.Order;
import com.dkarito.orderservice.domain.OrderItem;
import com.dkarito.orderservice.dto.CreateOrderRequest;
import com.dkarito.orderservice.dto.OrderDto;
import com.dkarito.orderservice.dto.OrderItemRequest;
import com.dkarito.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private org.springframework.web.reactive.function.client.WebClient.Builder webClientBuilder;

    public List<OrderDto> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(OrderDto::new)
                .collect(Collectors.toList());
    }

    public Optional<OrderDto> getOrderById(Long orderId) {
        return orderRepository.findById(orderId).map(OrderDto::new);
    }

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setShippingAddress(request.getShippingAddress());

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.getItems()) {
            OrderItem orderItem = new OrderItem(
                    order,
                    itemRequest.getProductId(),
                    itemRequest.getProductTitle(),
                    itemRequest.getPrice(),
                    itemRequest.getQuantity());
            order.getOrderItems().add(orderItem);
            totalAmount = totalAmount.add(itemRequest.getTotalPrice());

            // Deduct inventory
            deductInventory(itemRequest.getProductId(), itemRequest.getQuantity());
        }
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        return new OrderDto(savedOrder);
    }

    private void deductInventory(Long productId, Integer quantity) {
        // Direct connection to Inventory Service (Bypassing Gateway for internal
        // communication)
        String inventoryServiceUrl = "http://localhost:8083/api/inventory";

        try {
            webClientBuilder.build()
                    .post()
                    .uri(inventoryServiceUrl + "/" + productId + "/deduct?quantity=" + quantity)
                    .retrieve()
                    .toBodilessEntity()
                    .block(); // Synchronous call for simplicity in this transactional scope
        } catch (Exception e) {
            e.printStackTrace(); // Debugging: Print stack trace to console
            throw new RuntimeException("Failed to deduct inventory for product " + productId + ": " + e.getMessage());
        }
    }

    @Transactional
    public Optional<OrderDto> updateOrderStatus(Long orderId, Order.OrderStatus status) {
        return orderRepository.findById(orderId).map(order -> {
            order.setStatus(status);
            Order updatedOrder = orderRepository.save(order);
            return new OrderDto(updatedOrder);
        });
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(OrderDto::new)
                .collect(Collectors.toList());
    }

    public List<OrderDto> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findAll().stream()
                .filter(order -> order.getStatus() == status)
                .map(OrderDto::new)
                .collect(Collectors.toList());
    }

    public long getOrderCountByStatus(Order.OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

    public com.dkarito.orderservice.dto.TodayStats getTodayStats() {
        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();
        BigDecimal totalSales = orderRepository.sumTotalAmountByCreatedAtAfter(startOfDay);
        if (totalSales == null)
            totalSales = BigDecimal.ZERO;

        Long orderCount = orderRepository.countOrdersByCreatedAtAfter(startOfDay);
        if (orderCount == null)
            orderCount = 0L;

        return new com.dkarito.orderservice.dto.TodayStats(totalSales, orderCount);
    }

    public com.dkarito.orderservice.dto.SummaryStats getSummaryStats() {
        long total = orderRepository.count();
        long pending = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long delivered = orderRepository.countByStatus(Order.OrderStatus.DELIVERED);
        return new com.dkarito.orderservice.dto.SummaryStats(total, pending, delivered);
    }

    public List<com.dkarito.orderservice.dto.TopProductDto> getTopSellingProducts() {
        return orderRepository.findTopSellingProducts(org.springframework.data.domain.PageRequest.of(0, 5));
    }
}
