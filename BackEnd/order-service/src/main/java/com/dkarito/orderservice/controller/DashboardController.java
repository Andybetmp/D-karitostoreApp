package com.dkarito.orderservice.controller;

import com.dkarito.orderservice.domain.Order;
import com.dkarito.orderservice.dto.TopProductDto;
import com.dkarito.orderservice.repository.OrderRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders/stats")
@Tag(name = "Dashboard Stats", description = "Statistics for Dashboard")
public class DashboardController {

    @Autowired
    private com.dkarito.orderservice.service.OrderService orderService;

    @GetMapping("/today")
    @Operation(summary = "Get Today's Sales statistics")
    public ResponseEntity<com.dkarito.orderservice.dto.TodayStats> getTodayStats() {
        return ResponseEntity.ok(orderService.getTodayStats());
    }

    @GetMapping("/summary")
    @Operation(summary = "Get overall summary statistics")
    public ResponseEntity<com.dkarito.orderservice.dto.SummaryStats> getSummaryStats() {
        return ResponseEntity.ok(orderService.getSummaryStats());
    }

    @GetMapping("/top-products")
    @Operation(summary = "Get Top Selling Products")
    public ResponseEntity<List<TopProductDto>> getTopProducts() {
        return ResponseEntity.ok(orderService.getTopSellingProducts());
    }
}
