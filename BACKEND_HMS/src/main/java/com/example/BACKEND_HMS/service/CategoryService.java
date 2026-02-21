package com.example.BACKEND_HMS.service;

import com.example.BACKEND_HMS.DTO.CategoryRequestDTO;
import com.example.BACKEND_HMS.DTO.CategoryResponseDTO;
import com.example.BACKEND_HMS.Entity.Category;
import com.example.BACKEND_HMS.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository    categoryRepository;
    private final CloudinaryService     cloudinaryService;

    // ─────────────────────────────────────────────
    //  MAPPER  Entity → ResponseDTO
    // ─────────────────────────────────────────────
    private CategoryResponseDTO toDTO(Category category) {
        return CategoryResponseDTO.builder()
                .categoryId(category.getCategory_id())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .isActive(category.getIsActive())
                .createdAt(category.getCreatedAt())
                .build();
    }

    // ─────────────────────────────────────────────
    //  ADD
    // ─────────────────────────────────────────────
    public CategoryResponseDTO addCategory(CategoryRequestDTO dto) {
        Category category = Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
        return toDTO(categoryRepository.save(category));
    }

    // ─────────────────────────────────────────────
    //  UPLOAD IMAGE  (separate endpoint)
    // ─────────────────────────────────────────────
    public CategoryResponseDTO uploadImage(Long id, MultipartFile image) throws IOException {
        Category category = getEntityById(id);
        cloudinaryService.deleteImage(category.getImageUrl());
        category.setImageUrl(cloudinaryService.uploadImage(image));
        return toDTO(categoryRepository.save(category));
    }

    // ─────────────────────────────────────────────
    //  GET ALL
    // ─────────────────────────────────────────────
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────
    //  GET BY ID
    // ─────────────────────────────────────────────
    public CategoryResponseDTO getCategoryById(Long id) {
        return toDTO(getEntityById(id));
    }

    // ─────────────────────────────────────────────
    //  UPDATE
    // ─────────────────────────────────────────────
    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO dto) {
        Category category = getEntityById(id);
        if (dto.getName()        != null) category.setName(dto.getName());
        if (dto.getDescription() != null) category.setDescription(dto.getDescription());
        if (dto.getIsActive()    != null) category.setIsActive(dto.getIsActive());
        return toDTO(categoryRepository.save(category));
    }

    // ─────────────────────────────────────────────
    //  DELETE BY ID
    // ─────────────────────────────────────────────
    public void deleteCategoryById(Long id) throws IOException {
        Category category = getEntityById(id);
        cloudinaryService.deleteImage(category.getImageUrl());
        categoryRepository.deleteById(id);
    }

    // ─────────────────────────────────────────────
    //  DELETE ALL
    // ─────────────────────────────────────────────
    public void deleteAllCategories() throws IOException {
        List<Category> categories = categoryRepository.findAll();
        for (Category c : categories) {
            cloudinaryService.deleteImage(c.getImageUrl());
        }
        categoryRepository.deleteAll();
    }

    // ─────────────────────────────────────────────
    //  INTERNAL helper (used by SubCategoryService)
    // ─────────────────────────────────────────────
    public Category getEntityById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }
}