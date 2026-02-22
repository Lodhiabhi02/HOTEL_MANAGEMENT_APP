package com.example.BACKEND_HMS.DTO;

import lombok.Data;

@Data
public class PaymentConfirmRequest {
    private Long orderId;
    private String transactionId;
    private String razorpayOrderId;
}