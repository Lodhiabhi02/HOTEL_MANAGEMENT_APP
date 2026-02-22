package com.example.BACKEND_HMS.DTO;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CartDTO {
    private Long cartId;
    private List<CartItemDTO> items;
    private Double totalAmount;
    private Integer totalItems;
}