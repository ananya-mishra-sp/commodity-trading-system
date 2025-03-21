package com.trading.commodity.utility;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

//This is just a utility to generate hashed password for Admin to enter directly through db - No need of this in project
public class PasswordHasher {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode(""); // Change to your password
        System.out.println("Hashed Password: " + hashedPassword);
    }
}


