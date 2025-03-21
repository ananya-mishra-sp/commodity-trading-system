package com.trading.commodity.service;

import com.trading.commodity.dto.LoginRequest;
import com.trading.commodity.dto.RegisterRequest;
import com.trading.commodity.model.Role;
import com.trading.commodity.model.User;
import com.trading.commodity.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("John Doe");
        registerRequest.setUsername("johndoe");
        registerRequest.setEmail("johndoe@example.com");
        registerRequest.setPassword("password123");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("johndoe");
        loginRequest.setPassword("password123");

        testUser = new User("John Doe", "johndoe", "johndoe@example.com", "$2a$10$hashedPassword", Role.User);
    }

    @Test
    void testRegisterUser_Success() {
        when(userRepository.findByUsername(registerRequest.getUsername())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("$2a$10$hashedPassword");

        String result = authService.registerUser(registerRequest);

        assertEquals("User registered successfully!", result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUser_UsernameExists() {
        when(userRepository.findByUsername(registerRequest.getUsername())).thenReturn(Optional.of(testUser));

        String result = authService.registerUser(registerRequest);

        assertEquals("Username already exists!", result);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRegisterUser_EmailExists() {
        when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(Optional.of(testUser));

        String result = authService.registerUser(registerRequest);

        assertEquals("Email already exists!", result);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testAuthenticateUser_Success() {
        when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), testUser.getPassword())).thenReturn(true);

        User authenticatedUser = authService.authenticateUser(loginRequest);

        assertNotNull(authenticatedUser);
        assertEquals("johndoe", authenticatedUser.getUsername());
    }

    @Test
    void testAuthenticateUser_InvalidCredentials() {
        when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), testUser.getPassword())).thenReturn(false);

        User authenticatedUser = authService.authenticateUser(loginRequest);

        assertNull(authenticatedUser);
    }

    @Test
    void testAuthenticateUser_UserNotFound() {
        when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.empty());

        User authenticatedUser = authService.authenticateUser(loginRequest);

        assertNull(authenticatedUser);
    }
}
