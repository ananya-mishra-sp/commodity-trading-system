package com.trading.commodity.service;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.repository.CommodityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommodityService {

    private final CommodityRepository commodityRepository;

    @Autowired
    public CommodityService(CommodityRepository commodityRepository) {
        this.commodityRepository = commodityRepository;
    }

    public List<Commodity> getAllCommodities(String sortBy, String order) {
        Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        return commodityRepository.findAll(Sort.by(direction, sortBy));
    }

    public Optional<Commodity> getCommodityById(Integer id) {
        return commodityRepository.findById(id);
    }

    public Commodity createCommodity(Commodity commodity) {
        return commodityRepository.save(commodity);
    }

    public void deleteCommodity(Integer id) {
        commodityRepository.deleteById(id);
    }

    //Update or Create new commodity or else no changes
    public void processCSV(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            List<Commodity> commodities = reader.lines()
                    .skip(1) // Skip header
                    .map(line -> {
                        String[] data = line.split(",");

                        if (data.length < 4) {
                            throw new IllegalArgumentException("Invalid CSV format");
                        }

                        String name = data[1].trim();
                        String unit = data[2].trim();
                        BigDecimal currentPrice = new BigDecimal(data[3].trim());

                        // Check if commodity exists by name
                        Optional<Commodity> existingCommodity = commodityRepository.findByName(name);

                        if (existingCommodity.isPresent()) {
                            // Update existing commodity
                            Commodity commodity = existingCommodity.get();
                            commodity.setUnit(unit);
                            commodity.setCurrentPrice(currentPrice);
                            return commodity;
                        } else {
                            // Create a new commodity
                            Commodity newCommodity = new Commodity();
                            newCommodity.setName(name);
                            newCommodity.setUnit(unit);
                            newCommodity.setCurrentPrice(currentPrice);
                            return newCommodity;
                        }
                    })
                    .collect(Collectors.toList());

            // Save all (new and updated)
            commodityRepository.saveAll(commodities);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process CSV file: " + e.getMessage());
        }
    }

}
