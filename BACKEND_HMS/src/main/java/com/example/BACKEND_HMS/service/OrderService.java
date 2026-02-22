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
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public OrderDTO placeOrder(String email, PlaceOrderRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getCartItems().isEmpty())
            throw new RuntimeException("Cart is empty");

        // Delivery address resolve karo
        String deliveryAddress;
        if (req.getAddressId() != null) {
            Address address = addressRepository.findById(req.getAddressId())
                    .orElseThrow(() -> new RuntimeException("Address not found"));
            deliveryAddress = address.getAddressLine1() + ", " +
                    (address.getAddressLine2() != null
                            ? address.getAddressLine2() + ", " : "") +
                    address.getCity() + ", " +
                    address.getState() + " - " +
                    address.getPincode();
        } else if (req.getDeliveryAddress() != null) {
            deliveryAddress = req.getDeliveryAddress();
        } else {
            throw new RuntimeException("Delivery address required");
        }

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .deliveryAddress(deliveryAddress)
                .deliveryNote(req.getDeliveryNote())
                .deliveryCharge(0.0)
                .build();

        Order savedOrder = orderRepository.save(order);

        double totalAmount = 0;

        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();

            if (product.getStockQuantity() < cartItem.getQuantity())
                throw new RuntimeException(
                        product.getName() + " ka stock kam ho gaya");

            // Stock kam karo
            product.setStockQuantity(
                    product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            double subtotal = cartItem.getPriceAtTime() * cartItem.getQuantity();
            totalAmount += subtotal;

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .priceAtTime(cartItem.getPriceAtTime())
                    .productName(product.getName())
                    .productUnit(product.getUnit())
                    .build();

            savedOrder.getOrderItems().add(orderItem);
        }

        // 500+ toh free delivery
        double deliveryCharge = totalAmount >= 500 ? 0.0 : 40.0;
        double finalAmount = totalAmount + deliveryCharge;

        savedOrder.setTotalAmount(totalAmount);
        savedOrder.setDeliveryCharge(deliveryCharge);
        savedOrder.setFinalAmount(finalAmount);
        orderRepository.save(savedOrder);

        // Payment record banao
        Payment payment = Payment.builder()
                .order(savedOrder)
                .method(req.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .amount(finalAmount)
                .build();
        paymentRepository.save(payment);

        // COD toh auto confirm
        if (req.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY) {
            savedOrder.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(savedOrder);
        }

        // Cart clear karo
        cartService.clearCart(cart);

        return buildOrderDTO(savedOrder);
    }

    public List<OrderDTO> getMyOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::buildOrderDTO).collect(Collectors.toList());
    }

    public OrderDTO getOrderById(String email, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // ✅ FIX: User mein 'id' field hai
        if (!order.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");

        return buildOrderDTO(order);
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::buildOrderDTO).collect(Collectors.toList());
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return buildOrderDTO(orderRepository.save(order));
    }

    private OrderDTO buildOrderDTO(Order order) {
        List<OrderItemDTO> items = order.getOrderItems().stream().map(item ->
                OrderItemDTO.builder()
                        .orderItemId(item.getOrderItemId())
                        // ✅ FIX: Product_id use karo
                        .productId(item.getProduct() != null
                                ? item.getProduct().getProduct_id() : null)
                        .productName(item.getProductName())
                        .productUnit(item.getProductUnit())
                        .imageUrl(item.getProduct() != null
                                ? item.getProduct().getImageUrl() : null)
                        .quantity(item.getQuantity())
                        .priceAtTime(item.getPriceAtTime())
                        .subtotal(item.getPriceAtTime() * item.getQuantity())
                        .build()
        ).collect(Collectors.toList());

        Payment payment = order.getPayment();

        return OrderDTO.builder()
                .orderId(order.getOrderId())
                .items(items)
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .deliveryCharge(order.getDeliveryCharge())
                .finalAmount(order.getFinalAmount())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryNote(order.getDeliveryNote())
                .paymentMethod(payment != null ? payment.getMethod() : null)
                .paymentStatus(payment != null ? payment.getStatus() : null)
                .transactionId(payment != null ? payment.getTransactionId() : null)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}