package com.trading.commodity.service;

import com.trading.commodity.dto.LoginRequest;
import com.trading.commodity.dto.RegisterRequest;
import com.trading.commodity.model.Role;
import com.trading.commodity.model.User;
import com.trading.commodity.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String registerUser(RegisterRequest request) {
        // Check if username or email already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Username already exists!";
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists!";
        }

        // Create and save user
        User newUser = new User(
                request.getName(),
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()), // Hash password
                Role.User // Default role
        );

        userRepository.save(newUser);
        return "User registered successfully!";
    }

    public String authenticateUser(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return user.getRole().toString(); // Return role if authentication is successful
            }
        }
        return null; // Invalid login
    }
}
