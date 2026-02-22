package com.example.BACKEND_HMS.repository;

import com.example.BACKEND_HMS.Entity.Cart;
import com.example.BACKEND_HMS.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}