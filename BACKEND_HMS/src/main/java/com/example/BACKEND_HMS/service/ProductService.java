package com.example.BACKEND_HMS.service;

import com.example.BACKEND_HMS.DTO.ProductRequestDTO;
import com.example.BACKEND_HMS.DTO.ProductResponseDTO;
import com.example.BACKEND_HMS.Entity.Product;
import com.example.BACKEND_HMS.Entity.SubCategory;
import com.example.BACKEND_HMS.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository  productRepository;
    private final SubCategoryService subCategoryService;
    private final CloudinaryService  cloudinaryService;

    // ─────────────────────────────────────────────
    //  MAPPER  Entity → ResponseDTO
    // ─────────────────────────────────────────────
    private ProductResponseDTO toDTO(Product product) {
        SubCategory sc = product.getSubCategory();
        return ProductResponseDTO.builder()
                .productId(product.getProduct_id())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .unit(product.getUnit())
                .brand(product.getBrand())
                .isAvailable(product.getIsAvailable())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .subCategoryId(sc != null ? sc.getSubCategory_id() : null)
                .subCategoryName(sc != null ? sc.getName() : null)
                .categoryId(sc != null && sc.getCategory() != null ? sc.getCategory().getCategory_id() : null)
                .categoryName(sc != null && sc.getCategory() != null ? sc.getCategory().getName() : null)
                .build();
    }

    // ─────────────────────────────────────────────
    //  ADD
    // ─────────────────────────────────────────────
    public ProductResponseDTO addProduct(ProductRequestDTO dto) {
        SubCategory subCategory = subCategoryService.getEntityById(dto.getSubCategoryId());
        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stockQuantity(dto.getStockQuantity())
                .unit(dto.getUnit())
                .brand(dto.getBrand())
                .isAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : true)
                .subCategory(subCategory)
                .build();
        return toDTO(productRepository.save(product));
    }

    // ─────────────────────────────────────────────
    //  UPLOAD IMAGE  (separate endpoint)
    // ─────────────────────────────────────────────
    public ProductResponseDTO uploadImage(Long id, MultipartFile image) throws IOException {
        Product product = getEntityById(id);
        cloudinaryService.deleteImage(product.getImageUrl());
        product.setImageUrl(cloudinaryService.uploadImage(image));
        product.setUpdatedAt(LocalDateTime.now());
        return toDTO(productRepository.save(product));
    }

    // ─────────────────────────────────────────────
    //  GET ALL
    // ─────────────────────────────────────────────
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────
    //  GET BY ID
    // ─────────────────────────────────────────────
    public ProductResponseDTO getProductById(Long id) {
        return toDTO(getEntityById(id));
    }

    // ─────────────────────────────────────────────
    //  UPDATE
    // ─────────────────────────────────────────────
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO dto) {
        Product product = getEntityById(id);
        if (dto.getName()          != null) product.setName(dto.getName());
        if (dto.getDescription()   != null) product.setDescription(dto.getDescription());
        if (dto.getPrice()         != null) product.setPrice(dto.getPrice());
        if (dto.getStockQuantity() != null) product.setStockQuantity(dto.getStockQuantity());
        if (dto.getUnit()          != null) product.setUnit(dto.getUnit());
        if (dto.getBrand()         != null) product.setBrand(dto.getBrand());
        if (dto.getIsAvailable()   != null) product.setIsAvailable(dto.getIsAvailable());
        if (dto.getSubCategoryId() != null)
            product.setSubCategory(subCategoryService.getEntityById(dto.getSubCategoryId()));
        product.setUpdatedAt(LocalDateTime.now());
        return toDTO(productRepository.save(product));
    }

    // ─────────────────────────────────────────────
    //  DELETE BY ID
    // ─────────────────────────────────────────────
    public void deleteProductById(Long id) throws IOException {
        Product product = getEntityById(id);
        cloudinaryService.deleteImage(product.getImageUrl());
        productRepository.deleteById(id);
    }

    // ─────────────────────────────────────────────
    //  DELETE ALL
    // ─────────────────────────────────────────────
    public void deleteAllProducts() throws IOException {
        List<Product> products = productRepository.findAll();
        for (Product p : products) {
            cloudinaryService.deleteImage(p.getImageUrl());
        }
        productRepository.deleteAll();
    }

    // ─────────────────────────────────────────────
    //  INTERNAL helper
    // ─────────────────────────────────────────────
    private Product getEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
}