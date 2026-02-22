package com.example.BACKEND_HMS.repository;

import com.example.BACKEND_HMS.Entity.Product;
import com.example.BACKEND_HMS.Entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findBySubCategory(SubCategory subCategory);
    List<Product> findByIsAvailableTrue();
    List<Product> findByNameContainingIgnoreCase(String name);
}