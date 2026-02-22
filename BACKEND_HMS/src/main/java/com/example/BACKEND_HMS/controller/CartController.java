package com.example.BACKEND_HMS.controller;

import com.example.BACKEND_HMS.DTO.AddToCartRequest;
import com.example.BACKEND_HMS.DTO.CartDTO;
import com.example.BACKEND_HMS.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getCart(Authentication auth) {
        return ResponseEntity.ok(cartService.getCart(auth.getName()));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(Authentication auth,
                                             @RequestBody AddToCartRequest req) {
        return ResponseEntity.ok(cartService.addToCart(auth.getName(), req));
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<CartDTO> updateQuantity(Authentication auth,
                                                  @PathVariable Long cartItemId,
                                                  @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(auth.getName(), cartItemId, quantity));
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<CartDTO> removeItem(Authentication auth,
                                              @PathVariable Long cartItemId) {
        return ResponseEntity.ok(cartService.removeItem(auth.getName(), cartItemId));
    }
}