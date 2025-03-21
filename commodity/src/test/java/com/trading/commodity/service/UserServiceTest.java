package com.trading.commodity.service;

import com.trading.commodity.model.User;
import com.trading.commodity.repository.UserRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;


import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user1;
    private User user2;

    @Before
    public void setUp() {
        user1 = new User();
        user1.setId(1);
        user1.setUsername("userOne");

        user2 = new User();
        user2.setId(2);
        user2.setUsername("userTwo");
    }

    @Test
    public void testGetAllUsers() {
        List<User> userList = Arrays.asList(user1, user2);
        when(userRepository.findAll()).thenReturn(userList);

        List<User> result = userService.getAllUsers();

        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    public void testGetUserById_UserExists() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user1));

        Optional<User> result = userService.getUserById(1);

        assertTrue(result.isPresent());
        assertEquals("userOne", result.get().getUsername());
        verify(userRepository, times(1)).findById(1);
    }

    @Test
    public void testGetUserById_UserDoesNotExist() {
        when(userRepository.findById(3)).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserById(3);

        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findById(3);
    }

    @Test
    public void testDeleteUser() {
        doNothing().when(userRepository).deleteById(1);

        userService.deleteUser(1);

        verify(userRepository, times(1)).deleteById(1);
    }
}
