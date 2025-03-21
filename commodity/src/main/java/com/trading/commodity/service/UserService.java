package com.trading.commodity.service;

import com.trading.commodity.model.User;
import com.trading.commodity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

//    public User createUser(User user) {}
//    User Created through AuthService

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }
}
