package com.example.BACKEND_HMS.controller;

import com.example.BACKEND_HMS.DTO.ProductRequestDTO;
import com.example.BACKEND_HMS.DTO.ProductResponseDTO;
import com.example.BACKEND_HMS.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // POST /api/products/add
    // Body: { "name": "Apple", "description": "Fresh apple", "price": 50.0,
    //         "stockQuantity": 100, "unit": "kg", "brand": "FreshFarm",
    //         "isAvailable": true, "subCategoryId": 1 }
    @PostMapping("/add")
    public ResponseEntity<ProductResponseDTO> addProduct(@RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(productService.addProduct(dto));
    }

    // POST /api/products/{id}/upload-image  (multipart - only for image)
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<ProductResponseDTO> uploadImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image) throws IOException {
        return ResponseEntity.ok(productService.uploadImage(id, image));
    }

    // GET /api/products/all
    @GetMapping("/all")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // GET /api/products/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // PUT /api/products/update/{id}
    // Body: { "price": 60.0, "stockQuantity": 80 }  (sirf jo update karna ho woh bhejo)
    @PutMapping("/update/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    // DELETE /api/products/delete/{id}
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProductById(@PathVariable Long id) throws IOException {
        productService.deleteProductById(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    // DELETE /api/products/delete-all
    @DeleteMapping("/delete-all")
    public ResponseEntity<String> deleteAllProducts() throws IOException {
        productService.deleteAllProducts();
        return ResponseEntity.ok("All products deleted successfully");
    }
}