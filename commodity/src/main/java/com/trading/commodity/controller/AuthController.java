//package com.trading.commodity.controller;
//
//import com.trading.commodity.dto.AuthRequest;
//import com.trading.commodity.dto.RegisterRequest;
//import com.trading.commodity.service.AuthService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/auth")
//@CrossOrigin(origins = "*")
//public class AuthController {
//    private final AuthService authService;
//
//    public AuthController(AuthService authService) {
//        this.authService = authService;
//    }
//
//    @PostMapping("/register")
//    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
//        String result = authService.register(request);
//        if (result.equals("User registered successfully!")) {
//            return ResponseEntity.ok(result);
//        } else {
//            return ResponseEntity.badRequest().body(result);
//        }
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestBody AuthRequest request) {
//        String token = authService.login(request);
//        if (token.equals("Invalid email or password!")) {
//            return ResponseEntity.badRequest().body(token);
//        }
//        return ResponseEntity.ok(token);
//    }
//}
