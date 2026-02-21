package com.example.BACKEND_HMS.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubCategoryResponseDTO {
    private Long subCategoryId;
    private String name;
    private String imageUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;

    // Parent category info
    private Long categoryId;
    private String categoryName;
}