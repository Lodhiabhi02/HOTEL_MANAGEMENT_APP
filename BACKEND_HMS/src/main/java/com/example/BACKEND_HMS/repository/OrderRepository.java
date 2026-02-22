package com.example.BACKEND_HMS.repository;

import com.example.BACKEND_HMS.Entity.Order;
import com.example.BACKEND_HMS.Entity.OrderStatus;
import com.example.BACKEND_HMS.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);
    List<Order> findAllByOrderByCreatedAtDesc();
}