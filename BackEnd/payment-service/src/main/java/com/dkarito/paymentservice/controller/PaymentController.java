package com.dkarito.paymentservice.controller;

import com.dkarito.paymentservice.domain.Payment;
import com.dkarito.paymentservice.dto.CreatePaymentRequest;
import com.dkarito.paymentservice.dto.PaymentDto;
import com.dkarito.paymentservice.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Payment management APIs")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get payment for an order")
    public ResponseEntity<PaymentDto> getPaymentByOrderId(@PathVariable Long orderId) {
        return paymentService.getPaymentByOrderId(orderId)
                .map(payment -> ResponseEntity.ok(payment))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create a new payment")
    public ResponseEntity<PaymentDto> createPayment(@Valid @RequestBody CreatePaymentRequest request) {
        try {
            PaymentDto payment = paymentService.createPayment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/order/{orderId}/process")
    @Operation(summary = "Process payment for an order")
    public ResponseEntity<PaymentDto> processPayment(@PathVariable Long orderId) {
        return paymentService.processPayment(orderId)
                .map(payment -> ResponseEntity.ok(payment))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/order/{orderId}/refund")
    @Operation(summary = "Refund payment for an order")
    public ResponseEntity<PaymentDto> refundPayment(@PathVariable Long orderId) {
        return paymentService.refundPayment(orderId)
                .map(payment -> ResponseEntity.ok(payment))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/count/{status}")
    @Operation(summary = "Get payment count by status")
    public ResponseEntity<Long> getPaymentCountByStatus(@PathVariable Payment.PaymentStatus status) {
        long count = paymentService.getPaymentCountByStatus(status);
        return ResponseEntity.ok(count);
    }
}
