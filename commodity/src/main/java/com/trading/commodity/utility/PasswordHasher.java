package com.trading.commodity.utility;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHasher {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode("adminpass2"); // Change to your password
        System.out.println("Hashed Password: " + hashedPassword);
    }
}
