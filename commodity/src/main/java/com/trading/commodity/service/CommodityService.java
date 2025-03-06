package com.trading.commodity.service;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.repository.CommodityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommodityService {
    @Autowired
    private CommodityRepository commodityRepository;

    public List<Commodity> getAllCommodities() {
        return commodityRepository.findAll();
    }

    public Commodity getCommodityByCode(String code) {
        return commodityRepository.findByCode(code);
    }
}
