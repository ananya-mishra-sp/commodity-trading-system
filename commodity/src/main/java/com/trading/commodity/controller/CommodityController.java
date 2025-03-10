package com.trading.commodity.controller;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.service.CommodityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
