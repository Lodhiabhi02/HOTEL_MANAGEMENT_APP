package com.example.BACKEND_HMS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class USER {

    @GetMapping("/test")
    public ResponseEntity<String> dashboard() {
        return ResponseEntity.ok("User Dashboard");
    }
}

