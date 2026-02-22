package com.example.BACKEND_HMS.service;

import com.example.BACKEND_HMS.DTO.PaymentConfirmRequest;
import com.example.BACKEND_HMS.Entity.Order;
import com.example.BACKEND_HMS.Entity.OrderStatus;
import com.example.BACKEND_HMS.Entity.Payment;

import com.example.BACKEND_HMS.Entity.PaymentStatus;
import com.example.BACKEND_HMS.repository.OrderRepository;
import com.example.BACKEND_HMS.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    // ✅ FIX: method naam controller ke saath match karna chahiye
    @Transactional
    public String confirmPayment(PaymentConfirmRequest req) {
        Payment payment = paymentRepository.findByOrder_OrderId(req.getOrderId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setTransactionId(req.getTransactionId());
        payment.setRazorpayOrderId(req.getRazorpayOrderId());
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        Order order = payment.getOrder();
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        return "Payment confirmed successfully";
    }

    @Transactional
    public String failPayment(Long orderId) {
        Payment payment = paymentRepository.findByOrder_OrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.FAILED);
        paymentRepository.save(payment);

        Order order = payment.getOrder();
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        return "Payment marked as failed";
    }
}