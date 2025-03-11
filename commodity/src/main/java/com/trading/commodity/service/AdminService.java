package com.trading.commodity.service;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.model.User;
import com.trading.commodity.repository.CommodityRepository;
import com.trading.commodity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final CommodityRepository commodityRepository;
    private final UserRepository userRepository;

    @Autowired
    public AdminService(CommodityRepository commodityRepository, UserRepository userRepository) {
        this.commodityRepository = commodityRepository;
        this.userRepository = userRepository;
    }

    public Page<Commodity> getPaginatedCommodities(int page, int size, String sortBy, String order) {
        Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return commodityRepository.findAll(pageable);
    }

    public void uploadCommodities(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            List<Commodity> commodities = reader.lines()
                    .skip(1) // Skip header
                    .map(line -> {
                        String[] data = line.split(",");
                        return new Commodity(data[0].trim(), data[1].trim(), BigDecimal.valueOf(Double.parseDouble(data[2].trim())));
                    })
                    .collect(Collectors.toList());

            commodityRepository.saveAll(commodities);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload CSV file: " + e.getMessage());
        }
    }

    public void deleteCommodity(Integer id) {
        commodityRepository.deleteById(id);
    }

    public Page<User> getPaginatedUsers(int page, int size, String sortBy, String order) {
        Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return userRepository.findAll(pageable);
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }
}
