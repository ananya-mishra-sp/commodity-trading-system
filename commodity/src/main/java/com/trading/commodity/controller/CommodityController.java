package com.trading.commodity.controller;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.service.CommodityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/commodities")
public class CommodityController {

    private final CommodityService commodityService;

    @Autowired
    public CommodityController(CommodityService commodityService) {
        this.commodityService = commodityService;
    }

    @GetMapping
    public ResponseEntity<List<Commodity>> getAllCommodities() {
        return ResponseEntity.ok(commodityService.getAllCommodities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commodity> getCommodityById(@PathVariable Integer id) {
        Optional<Commodity> commodity = commodityService.getCommodityById(id);
        return commodity.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Commodity> createCommodity(@RequestBody Commodity commodity) {
        return ResponseEntity.ok(commodityService.createCommodity(commodity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Commodity> updateCommodity(@PathVariable Integer id, @RequestBody Commodity commodityDetails) {
        return ResponseEntity.ok(commodityService.updateCommodity(id, commodityDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCommodity(@PathVariable Integer id) {
        commodityService.deleteCommodity(id);
        return ResponseEntity.ok("Commodity deleted successfully");
    }
}
