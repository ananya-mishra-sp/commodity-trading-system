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
@CrossOrigin(origins = "http://localhost:4200") // Allow frontend access
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

    // ✅ Upload commodities via CSV (No external dependency)
    @PostMapping("/commodities/upload")
    public ResponseEntity<String> uploadCommodities(@RequestParam("file") MultipartFile file) {
        adminService.uploadCommodities(file);
        return ResponseEntity.ok("Commodities uploaded successfully!");
    }

    // ✅ Delete commodity
    @DeleteMapping("/commodities/{id}")
    public ResponseEntity<String> deleteCommodity(@PathVariable Integer id) {
        adminService.deleteCommodity(id);
        return ResponseEntity.ok("Commodity deleted successfully!");
    }

    // ✅ Fetch paginated users
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String order) {

        Page<User> users = adminService.getPaginatedUsers(page, size, sortBy, order);
        return ResponseEntity.ok(users);
    }

    // ✅ Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully!");
    }
}
