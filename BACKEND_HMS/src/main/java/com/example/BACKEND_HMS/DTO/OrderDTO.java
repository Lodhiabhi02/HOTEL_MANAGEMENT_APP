package com.example.BACKEND_HMS.DTO;


import com.example.BACKEND_HMS.Entity.OrderStatus;
import com.example.BACKEND_HMS.Entity.PaymentMethod;
import com.example.BACKEND_HMS.Entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDTO {
    private Long orderId;
    private List<OrderItemDTO> items;
    private OrderStatus status;
    private Double totalAmount;
    private Double deliveryCharge;
    private Double finalAmount;
    private String deliveryAddress;
    private String deliveryNote;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String transactionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}