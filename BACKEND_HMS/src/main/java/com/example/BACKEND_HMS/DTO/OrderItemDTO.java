package com.example.BACKEND_HMS.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemDTO {
    private Long orderItemId;
    private Long productId;
    private String productName;
    private String productUnit;
    private String imageUrl;
    private Integer quantity;
    private Double priceAtTime;
    private Double subtotal;
}