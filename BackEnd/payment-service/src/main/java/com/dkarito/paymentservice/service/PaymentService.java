package com.dkarito.paymentservice.service;

import com.dkarito.paymentservice.domain.Payment;
import com.dkarito.paymentservice.dto.CreatePaymentRequest;
import com.dkarito.paymentservice.dto.PaymentDto;
import com.dkarito.paymentservice.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Optional<PaymentDto> getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId).map(PaymentDto::new);
    }

    @Transactional
    public PaymentDto createPayment(CreatePaymentRequest request) {
        if (paymentRepository.existsByOrderId(request.getOrderId())) {
            throw new RuntimeException("Payment already exists for order ID: " + request.getOrderId());
        }

        Payment payment = new Payment(
                request.getOrderId(),
                request.getUserId(),
                request.getAmount(),
                request.getPaymentMethod()
        );

        Payment savedPayment = paymentRepository.save(payment);
        return new PaymentDto(savedPayment);
    }

    @Transactional
    public Optional<PaymentDto> processPayment(Long orderId) {
        return paymentRepository.findByOrderId(orderId).map(payment -> {
            // Simulate payment processing
            boolean paymentSuccess = simulatePaymentProcessing(payment);

            if (paymentSuccess) {
                payment.setStatus(Payment.PaymentStatus.COMPLETED);
                payment.setTransactionId(UUID.randomUUID().toString());
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setFailureReason("Payment processing failed");
            }

            Payment updatedPayment = paymentRepository.save(payment);
            return new PaymentDto(updatedPayment);
        });
    }

    @Transactional
    public Optional<PaymentDto> refundPayment(Long orderId) {
        return paymentRepository.findByOrderId(orderId).map(payment -> {
            if (payment.getStatus() == Payment.PaymentStatus.COMPLETED) {
                payment.setStatus(Payment.PaymentStatus.REFUNDED);
                Payment updatedPayment = paymentRepository.save(payment);
                return new PaymentDto(updatedPayment);
            }
            return null;
        });
    }

    public long getPaymentCountByStatus(Payment.PaymentStatus status) {
        return paymentRepository.countByStatus(status);
    }

    private boolean simulatePaymentProcessing(Payment payment) {
        // Simulate payment gateway integration
        // In a real implementation, this would integrate with Stripe, PayPal, etc.
        return Math.random() > 0.1; // 90% success rate for simulation
    }
}
