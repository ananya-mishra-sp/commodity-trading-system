//package com.trading.commodity.service;
//
//import com.trading.commodity.dto.AuthRequest;
//import com.trading.commodity.dto.RegisterRequest;
//import com.trading.commodity.model.Role;
//import com.trading.commodity.model.User;
//import com.trading.commodity.repository.UserRepository;
//import com.trading.commodity.util.JwtUtil;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//public class AuthService {
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final JwtUtil jwtUtil;
//
//    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.jwtUtil = jwtUtil;
//    }
//
//    public String register(RegisterRequest request) {
//        if (userRepository.findByUsername(request.getUsername()).isPresent() ||
//                userRepository.findByEmail(request.getEmail()).isPresent()) {
//            return "Username or Email already exists!";
//        }
//
//        User user = new User();
//        user.setName(request.getName());
//        user.setUsername(request.getUsername());
//        user.setEmail(request.getEmail());
//        user.setPassword(passwordEncoder.encode(request.getPassword()));
//        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
//
//        userRepository.save(user);
//        return "User registered successfully!";
//    }
//
//    public String login(AuthRequest request) {
//        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
//
//        if (userOptional.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOptional.get().getPassword())) {
//            return "Invalid email or password!";
//        }
//
//        User user = userOptional.get();
//        return jwtUtil.generateToken(user.getUsername());
//    }
//}
