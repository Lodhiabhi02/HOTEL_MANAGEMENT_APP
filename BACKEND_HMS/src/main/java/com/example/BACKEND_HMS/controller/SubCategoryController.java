package com.example.BACKEND_HMS.controller;

import com.example.BACKEND_HMS.DTO.SubCategoryRequestDTO;
import com.example.BACKEND_HMS.DTO.SubCategoryResponseDTO;
import com.example.BACKEND_HMS.service.SubCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
@RequiredArgsConstructor
public class SubCategoryController {

    private final SubCategoryService subCategoryService;

    // POST /api/subcategories/add
    // Body: { "name": "Mango", "isActive": true, "categoryId": 1 }
    @PostMapping("/add")
    public ResponseEntity<SubCategoryResponseDTO> addSubCategory(@RequestBody SubCategoryRequestDTO dto) {
        return ResponseEntity.ok(subCategoryService.addSubCategory(dto));
    }

    // POST /api/subcategories/{id}/upload-image  (multipart - only for image)
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<SubCategoryResponseDTO> uploadImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image) throws IOException {
        return ResponseEntity.ok(subCategoryService.uploadImage(id, image));
    }

    // GET /api/subcategories/all
    @GetMapping("/all")
    public ResponseEntity<List<SubCategoryResponseDTO>> getAllSubCategories() {
        return ResponseEntity.ok(subCategoryService.getAllSubCategories());
    }

    // GET /api/subcategories/{id}
    @GetMapping("/{id}")
    public ResponseEntity<SubCategoryResponseDTO> getSubCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(subCategoryService.getSubCategoryById(id));
    }

    // PUT /api/subcategories/update/{id}
    // Body: { "name": "Updated Name", "categoryId": 2 }  (sirf jo update karna ho woh bhejo)
    @PutMapping("/update/{id}")
    public ResponseEntity<SubCategoryResponseDTO> updateSubCategory(
            @PathVariable Long id,
            @RequestBody SubCategoryRequestDTO dto) {
        return ResponseEntity.ok(subCategoryService.updateSubCategory(id, dto));
    }

    // DELETE /api/subcategories/delete/{id}
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSubCategoryById(@PathVariable Long id) throws IOException {
        subCategoryService.deleteSubCategoryById(id);
        return ResponseEntity.ok("SubCategory deleted successfully");
    }

    // DELETE /api/subcategories/delete-all
    @DeleteMapping("/delete-all")
    public ResponseEntity<String> deleteAllSubCategories() throws IOException {
        subCategoryService.deleteAllSubCategories();
        return ResponseEntity.ok("All SubCategories deleted successfully");
    }
}