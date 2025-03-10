package com.trading.commodity.service;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.repository.CommodityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommodityService {

    private final CommodityRepository commodityRepository;

    @Autowired
    public CommodityService(CommodityRepository commodityRepository) {
        this.commodityRepository = commodityRepository;
    }

    public List<Commodity> getAllCommodities() {
        return commodityRepository.findAll();
    }

    public Optional<Commodity> getCommodityById(Integer id) {
        return commodityRepository.findById(id);
    }

    public Commodity createCommodity(Commodity commodity) {
        return commodityRepository.save(commodity);
    }

    public Commodity updateCommodity(Integer id, Commodity commodityDetails) {
        return commodityRepository.findById(id)
                .map(commodity -> {
                    commodity.setName(commodityDetails.getName());
                    commodity.setUnit(commodityDetails.getUnit());
                    commodity.setCurrentPrice(commodityDetails.getCurrentPrice());
                    return commodityRepository.save(commodity);
                })
                .orElseThrow(() -> new RuntimeException("Commodity not found with ID: " + id));
    }

    public void deleteCommodity(Integer id) {
        commodityRepository.deleteById(id);
    }
}
