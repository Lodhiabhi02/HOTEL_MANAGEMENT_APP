package com.example.BACKEND_HMS.repository;

import com.example.BACKEND_HMS.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product,Long> {
}
