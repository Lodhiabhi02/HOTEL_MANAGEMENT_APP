package com.example.BACKEND_HMS.repository;

import com.example.BACKEND_HMS.Entity.Cart;
import com.example.BACKEND_HMS.Entity.CartItem;
import com.example.BACKEND_HMS.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}