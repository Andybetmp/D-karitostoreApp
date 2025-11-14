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
                    itemRequest.getQuantity()
            );
            order.getOrderItems().add(orderItem);
            totalAmount = totalAmount.add(itemRequest.getTotalPrice());
        }
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        return new OrderDto(savedOrder);
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
}
