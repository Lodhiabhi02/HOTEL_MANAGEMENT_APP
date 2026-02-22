package com.example.BACKEND_HMS.service;

import com.example.BACKEND_HMS.DTO.*;
import com.example.BACKEND_HMS.Entity.*;
import com.example.BACKEND_HMS.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder().user(user).build()
                ));
    }

    @Transactional
    public CartDTO addToCart(String email, AddToCartRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getIsAvailable())
            throw new RuntimeException("Product is not available");
        if (product.getStockQuantity() < req.getQuantity())
            throw new RuntimeException("Insufficient stock");

        Cart cart = getOrCreateCart(user);

        CartItem existing = cartItemRepository
                .findByCartAndProduct(cart, product).orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + req.getQuantity());
            cartItemRepository.save(existing);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(req.getQuantity())
                    .priceAtTime(product.getPrice().doubleValue()) // BigDecimal → Double
                    .build();
            cart.getCartItems().add(item);
            cartItemRepository.save(item);
        }

        return buildCartDTO(cart);
    }

    @Transactional
    public CartDTO updateQuantity(String email, Long cartItemId, Integer quantity) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getCartId().equals(cart.getCartId()))
            throw new RuntimeException("Unauthorized");

        if (quantity <= 0) {
            cart.getCartItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            if (item.getProduct().getStockQuantity() < quantity)
                throw new RuntimeException("Insufficient stock");
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return buildCartDTO(cart);
    }

    @Transactional
    public CartDTO removeItem(String email, Long cartItemId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getCartId().equals(cart.getCartId()))
            throw new RuntimeException("Unauthorized");

        cart.getCartItems().remove(item);
        cartItemRepository.delete(item);
        return buildCartDTO(cart);
    }

    public CartDTO getCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = getOrCreateCart(user);
        return buildCartDTO(cart);
    }

    @Transactional
    public void clearCart(Cart cart) {
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    private CartDTO buildCartDTO(Cart cart) {
        List<CartItemDTO> items = cart.getCartItems().stream().map(item ->
                CartItemDTO.builder()
                        .cartItemId(item.getCartItemId())
                        .productId(item.getProduct().getProduct_id()) // ✅ FIX
                        .productName(item.getProduct().getName())
                        .productUnit(item.getProduct().getUnit())
                        .imageUrl(item.getProduct().getImageUrl())
                        .quantity(item.getQuantity())
                        .priceAtTime(item.getPriceAtTime())
                        .subtotal(item.getPriceAtTime() * item.getQuantity())
                        .build()
        ).collect(Collectors.toList());

        double total = items.stream()
                .mapToDouble(CartItemDTO::getSubtotal).sum();

        return CartDTO.builder()
                .cartId(cart.getCartId())
                .items(items)
                .totalAmount(total)
                .totalItems(items.stream()
                        .mapToInt(CartItemDTO::getQuantity).sum())
                .build();
    }
}