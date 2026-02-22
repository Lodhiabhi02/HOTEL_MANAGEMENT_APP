package com.example.BACKEND_HMS.controller;

import com.example.BACKEND_HMS.DTO.OrderDTO;
import com.example.BACKEND_HMS.DTO.PlaceOrderRequest;
import com.example.BACKEND_HMS.Entity.OrderStatus;
import com.example.BACKEND_HMS.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // User - order place karo
    @PostMapping("/place")
    public ResponseEntity<OrderDTO> placeOrder(Authentication auth,
                                               @RequestBody PlaceOrderRequest req) {
        return ResponseEntity.ok(orderService.placeOrder(auth.getName(), req));
    }

    // User - apne orders dekho
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDTO>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getMyOrders(auth.getName()));
    }

    // User - single order detail
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(Authentication auth,
                                                 @PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(auth.getName(), orderId));
    }

    // Admin - sab orders dekho
    @GetMapping("/admin/all")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Admin - order status update karo
    @PutMapping("/admin/update-status/{orderId}")
    public ResponseEntity<OrderDTO> updateStatus(@PathVariable Long orderId,
                                                 @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}