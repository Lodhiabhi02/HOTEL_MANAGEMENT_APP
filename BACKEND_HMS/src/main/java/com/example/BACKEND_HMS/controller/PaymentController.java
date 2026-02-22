package com.example.BACKEND_HMS.controller;

import com.example.BACKEND_HMS.DTO.PaymentConfirmRequest;
import com.example.BACKEND_HMS.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmPayment(@RequestBody PaymentConfirmRequest req) {
        return ResponseEntity.ok(paymentService.confirmPayment(req));
    }

    @PostMapping("/fail/{orderId}")
    public ResponseEntity<String> failPayment(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.failPayment(orderId));
    }
}