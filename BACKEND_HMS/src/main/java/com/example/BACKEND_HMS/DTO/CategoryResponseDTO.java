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
public class CategoryResponseDTO {
    private Long categoryId;
    private String name;
    private String description;
    private String imageUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
}