package com.dkarito.orderservice.dto;

import com.dkarito.orderservice.domain.OrderItem;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class OrderItemDto {

    private Long id;
    private Long productId;
    private String productTitle;
    private BigDecimal price;
    private Integer quantity;

    public OrderItemDto() {}

    public OrderItemDto(OrderItem orderItem) {
        this.id = orderItem.getId();
        this.productId = orderItem.getProductId();
        this.productTitle = orderItem.getProductTitle();
        this.price = orderItem.getPrice();
        this.quantity = orderItem.getQuantity();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductTitle() {
        return productTitle;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getTotalPrice() {
        return price != null && quantity != null ? price.multiply(BigDecimal.valueOf(quantity)) : BigDecimal.ZERO;
    }
}
