package com.trading.commodity.controller;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.service.CommodityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/commodities")
public class CommodityController {

    private final CommodityService commodityService;

    @Autowired
    public CommodityController(CommodityService commodityService) {
        this.commodityService = commodityService;
    }

    @GetMapping
    public ResponseEntity<List<Commodity>> getAllCommodities(
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String order) {
        return ResponseEntity.ok(commodityService.getAllCommodities(sortBy, order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commodity> getCommodityById(@PathVariable Integer id) {
        return commodityService.getCommodityById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Commodity> createCommodity(@RequestBody Commodity commodity) {
        return ResponseEntity.ok(commodityService.createCommodity(commodity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCommodity(@PathVariable Integer id) {
        commodityService.deleteCommodity(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Commodity deleted successfully!");
        return ResponseEntity.ok(response);
    }

    // Upload CSV - Update Commodities or Create new if new data found
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadCommodities(@RequestParam("file") MultipartFile file) {
        try {
            commodityService.processCSV(file);
            Map<String, String> response = new HashMap<>();
            response.put("message", "CSV file uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to upload CSV: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

}
