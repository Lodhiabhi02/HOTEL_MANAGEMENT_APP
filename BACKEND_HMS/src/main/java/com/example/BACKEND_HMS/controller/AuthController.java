package com.example.BACKEND_HMS.controller;




import com.example.BACKEND_HMS.DTO.AuthResponse;
import com.example.BACKEND_HMS.DTO.LoginRequest;
import com.example.BACKEND_HMS.DTO.RegisterRequest;
import com.example.BACKEND_HMS.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")   // optional (frontend ke liye)
public class AuthController {

    private final AuthService authService;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(authService.register(request));
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }


}

