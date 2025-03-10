package com.trading.commodity.controller;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.model.User;
import com.trading.commodity.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // 📌 Fetch paginated commodities
    @GetMapping("/commodities")
    public Page<Commodity> getCommodities(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String order) {
        return adminService.getPaginatedCommodities(page, size, sortBy, order);
    }

    // 📌 Upload commodities via CSV
    @PostMapping("/commodities/upload")
    public ResponseEntity<String> uploadCommodities(@RequestParam("file") MultipartFile file) {
        adminService.uploadCommodities(file);
        return ResponseEntity.ok("Commodities uploaded successfully!");
    }

    // 📌 Delete commodity
    @DeleteMapping("/commodities/{id}")
    public ResponseEntity<String> deleteCommodity(@PathVariable Integer id, @RequestParam String name) {
        adminService.deleteCommodity(id, name);
        return ResponseEntity.ok("Commodity deleted successfully!");
    }

    // 📌 Fetch paginated users
    @GetMapping("/users")
    public Page<User> getUsers(@RequestParam int page, @RequestParam int size) {
        return adminService.getPaginatedUsers(page, size);
    }

    // 📌 Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id, @RequestParam String username) {
        adminService.deleteUser(id, username);
        return ResponseEntity.ok("User deleted successfully!");
    }
}
