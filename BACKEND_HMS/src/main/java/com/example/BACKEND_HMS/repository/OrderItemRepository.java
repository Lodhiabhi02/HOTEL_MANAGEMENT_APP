package com.example.BACKEND_HMS.repository;

import com.example.BACKEND_HMS.Entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}