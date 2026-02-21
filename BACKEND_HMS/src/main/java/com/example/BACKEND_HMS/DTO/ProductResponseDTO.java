package com.example.BACKEND_HMS.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDTO {
    private Long productId;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private String unit;
    private String brand;
    private Boolean isAvailable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Parent SubCategory info
    private Long subCategoryId;
    private String subCategoryName;

    // Parent Category info
    private Long categoryId;
    private String categoryName;
}