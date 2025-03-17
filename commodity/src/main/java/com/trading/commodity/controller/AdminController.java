package com.trading.commodity.controller;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.model.User;
import com.trading.commodity.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ✅ Fetch paginated commodities
    @GetMapping("/commodities")
    public ResponseEntity<Page<Commodity>> getCommodities(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String order) {
        return ResponseEntity.ok(adminService.getPaginatedCommodities(page, size, sortBy, order));
    }

    // Upload commodities via CSV (No external dependency)
    @PostMapping("/commodities/upload")
    public ResponseEntity<String> uploadCommodities(@RequestParam("file") MultipartFile file) {
        adminService.uploadCommodities(file);
        return ResponseEntity.ok("Commodities uploaded successfully!");
    }

    // Delete commodity
    @DeleteMapping("/commodities/{id}")
    public ResponseEntity<Map<String, String>> deleteCommodity(@PathVariable Integer id) {
        adminService.deleteCommodity(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Commodity deleted successfully!");
        return ResponseEntity.ok(response);
    }

    // Fetch paginated users
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String order) {

        Page<User> users = adminService.getPaginatedUsers(page, size, sortBy, order);
        return ResponseEntity.ok(users);
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Integer id) {
        adminService.deleteUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully!");
        return ResponseEntity.ok(response);
    }
}
