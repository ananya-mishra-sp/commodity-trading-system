package com.trading.commodity.controller;

import com.trading.commodity.dto.LoginRequest;
import com.trading.commodity.dto.RegisterRequest;
import com.trading.commodity.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        String response = authService.registerUser(registerRequest);
        if (response.equals("User registered successfully!")) {
            return ResponseEntity.ok().body("{\"message\": \"" + response + "\"}");
        }
        return ResponseEntity.badRequest().body("{\"message\": \"" + response + "\"}");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String role = authService.authenticateUser(loginRequest);

        if (role != null) {
            return ResponseEntity.ok().body("{\"message\": \"Login successful\", \"role\": \"" + role + "\"}");
        }

        return ResponseEntity.status(401).body("{\"message\": \"Invalid username or password\"}");
    }
}
