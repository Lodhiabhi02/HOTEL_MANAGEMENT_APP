package com.example.BACKEND_HMS.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequestDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String unit;   // kg, gram, litre, piece
    private String brand;
    private Boolean isAvailable;
    private Long subCategoryId;
}