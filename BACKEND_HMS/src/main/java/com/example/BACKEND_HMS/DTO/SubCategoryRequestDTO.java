package com.example.BACKEND_HMS.DTO;

import lombok.Data;

@Data
public class SubCategoryRequestDTO {
    private String name;
    private Boolean isActive;
    private Long categoryId;
}