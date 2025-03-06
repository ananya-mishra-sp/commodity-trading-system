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

    @Autowired
    private CommodityService commodityService;

    @GetMapping
    public ResponseEntity<List<Commodity>> getAllCommodities() {
        List<Commodity> commodities = commodityService.getAllCommodities();
        return ResponseEntity.ok(commodities);
    }
}
