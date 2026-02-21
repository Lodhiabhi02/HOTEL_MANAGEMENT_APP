package com.example.BACKEND_HMS.DTO;

import lombok.Data;

@Data
public class CategoryRequestDTO {
    private String name;
    private String description;
    private Boolean isActive;
}