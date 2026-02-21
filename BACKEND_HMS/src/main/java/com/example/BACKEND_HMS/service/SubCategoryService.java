package com.example.BACKEND_HMS.service;

import com.example.BACKEND_HMS.DTO.SubCategoryRequestDTO;
import com.example.BACKEND_HMS.DTO.SubCategoryResponseDTO;
import com.example.BACKEND_HMS.Entity.Category;
import com.example.BACKEND_HMS.Entity.SubCategory;
import com.example.BACKEND_HMS.repository.SubCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubCategoryService {

    private final SubCategoryRepository subCategoryRepository;
    private final CategoryService       categoryService;
    private final CloudinaryService     cloudinaryService;

    // ─────────────────────────────────────────────
    //  MAPPER  Entity → ResponseDTO
    // ─────────────────────────────────────────────
    private SubCategoryResponseDTO toDTO(SubCategory sc) {
        return SubCategoryResponseDTO.builder()
                .subCategoryId(sc.getSubCategory_id())
                .name(sc.getName())
                .imageUrl(sc.getImageUrl())
                .isActive(sc.getIsActive())
                .createdAt(sc.getCreatedAt())
                .categoryId(sc.getCategory() != null ? sc.getCategory().getCategory_id() : null)
                .categoryName(sc.getCategory() != null ? sc.getCategory().getName() : null)
                .build();
    }

    // ─────────────────────────────────────────────
    //  ADD
    // ─────────────────────────────────────────────
    public SubCategoryResponseDTO addSubCategory(SubCategoryRequestDTO dto) {
        Category category = categoryService.getEntityById(dto.getCategoryId());
        SubCategory subCategory = SubCategory.builder()
                .name(dto.getName())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .category(category)
                .build();
        return toDTO(subCategoryRepository.save(subCategory));
    }

    // ─────────────────────────────────────────────
    //  UPLOAD IMAGE  (separate endpoint)
    // ─────────────────────────────────────────────
    public SubCategoryResponseDTO uploadImage(Long id, MultipartFile image) throws IOException {
        SubCategory sc = getEntityById(id);
        cloudinaryService.deleteImage(sc.getImageUrl());
        sc.setImageUrl(cloudinaryService.uploadImage(image));
        return toDTO(subCategoryRepository.save(sc));
    }

    // ─────────────────────────────────────────────
    //  GET ALL
    // ─────────────────────────────────────────────
    public List<SubCategoryResponseDTO> getAllSubCategories() {
        return subCategoryRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────
    //  GET BY ID
    // ─────────────────────────────────────────────
    public SubCategoryResponseDTO getSubCategoryById(Long id) {
        return toDTO(getEntityById(id));
    }

    // ─────────────────────────────────────────────
    //  UPDATE
    // ─────────────────────────────────────────────
    public SubCategoryResponseDTO updateSubCategory(Long id, SubCategoryRequestDTO dto) {
        SubCategory sc = getEntityById(id);
        if (dto.getName()       != null) sc.setName(dto.getName());
        if (dto.getIsActive()   != null) sc.setIsActive(dto.getIsActive());
        if (dto.getCategoryId() != null)
            sc.setCategory(categoryService.getEntityById(dto.getCategoryId()));
        return toDTO(subCategoryRepository.save(sc));
    }

    // ─────────────────────────────────────────────
    //  DELETE BY ID
    // ─────────────────────────────────────────────
    public void deleteSubCategoryById(Long id) throws IOException {
        SubCategory sc = getEntityById(id);
        cloudinaryService.deleteImage(sc.getImageUrl());
        subCategoryRepository.deleteById(id);
    }

    // ─────────────────────────────────────────────
    //  DELETE ALL
    // ─────────────────────────────────────────────
    public void deleteAllSubCategories() throws IOException {
        List<SubCategory> list = subCategoryRepository.findAll();
        for (SubCategory sc : list) {
            cloudinaryService.deleteImage(sc.getImageUrl());
        }
        subCategoryRepository.deleteAll();
    }

    // ─────────────────────────────────────────────
    //  INTERNAL helper (used by ProductService)
    // ─────────────────────────────────────────────
    public SubCategory getEntityById(Long id) {
        return subCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubCategory not found with id: " + id));
    }
}