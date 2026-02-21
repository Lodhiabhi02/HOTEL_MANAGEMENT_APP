package com.example.BACKEND_HMS.controller;

import com.example.BACKEND_HMS.DTO.CategoryRequestDTO;
import com.example.BACKEND_HMS.DTO.CategoryResponseDTO;
import com.example.BACKEND_HMS.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // POST /api/categories/add
    // Body: { "name": "Fruits", "description": "Fresh fruits", "isActive": true }
    @PostMapping("/add")
    public ResponseEntity<CategoryResponseDTO> addCategory(@RequestBody CategoryRequestDTO dto) {
        return ResponseEntity.ok(categoryService.addCategory(dto));
    }

    // POST /api/categories/{id}/upload-image  (multipart - only for image)
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<CategoryResponseDTO> uploadImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image) throws IOException {
        return ResponseEntity.ok(categoryService.uploadImage(id, image));
    }

    // GET /api/categories/all
    @GetMapping("/all")
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // GET /api/categories/{id}
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    // PUT /api/categories/update/{id}
    // Body: { "name": "Vegetables", "isActive": false }  (sirf jo update karna ho woh bhejo)
    @PutMapping("/update/{id}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequestDTO dto) {
        return ResponseEntity.ok(categoryService.updateCategory(id, dto));
    }

    // DELETE /api/categories/delete/{id}
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCategoryById(@PathVariable Long id) throws IOException {
        categoryService.deleteCategoryById(id);
        return ResponseEntity.ok("Category deleted successfully");
    }

    // DELETE /api/categories/delete-all
    @DeleteMapping("/delete-all")
    public ResponseEntity<String> deleteAllCategories() throws IOException {
        categoryService.deleteAllCategories();
        return ResponseEntity.ok("All categories deleted successfully");
    }
}