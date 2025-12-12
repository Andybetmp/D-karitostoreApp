package com.dkarito.orderservice.dto;

import java.math.BigDecimal;

public class TodayStats {
    private BigDecimal totalSales;
    private long orderCount;

    public TodayStats() {
    }

    public TodayStats(BigDecimal totalSales, long orderCount) {
        this.totalSales = totalSales;
        this.orderCount = orderCount;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }

    public long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(long orderCount) {
        this.orderCount = orderCount;
    }
}
