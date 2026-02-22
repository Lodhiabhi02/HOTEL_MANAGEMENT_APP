package com.example.BACKEND_HMS.DTO;

import com.example.BACKEND_HMS.Entity.PaymentMethod;
import lombok.Data;

@Data
public class PlaceOrderRequest {
    private Long addressId;
    private String deliveryAddress; // manual address agar addressId null ho
    private String deliveryNote;
    private PaymentMethod paymentMethod;
}