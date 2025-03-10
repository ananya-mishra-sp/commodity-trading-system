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
import java.util.*;
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

    // 📌 Fetch commodities with sorting & pagination
    public Page<Commodity> getPaginatedCommodities(int page, int size, String sortBy, String order) {
        Sort.Direction direction = "desc".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return commodityRepository.findAll(pageable);
    }

    // 📌 Upload commodities from CSV
    public void uploadCommodities(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            List<Commodity> commodities = reader.lines()
                    .skip(1) // Skip header
                    .map(line -> {
                        String[] data = line.split(",");
                        Commodity commodity = new Commodity();
                        commodity.setName(data[0].trim());
                        commodity.setUnit(data[1].trim());
                        commodity.setCurrentPrice(BigDecimal.valueOf(Double.parseDouble(data[2].trim())));
                        return commodity;
                    })
                    .collect(Collectors.toList());

            commodityRepository.saveAll(commodities);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload CSV file: " + e.getMessage());
        }
    }

    // 📌 Delete commodity
    public void deleteCommodity(Integer id, String name) {
        commodityRepository.deleteById(id);
    }

    // 📌 Fetch paginated users excluding password
    public Page<User> getPaginatedUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("username").ascending());
        return userRepository.findAll(pageable);
    }

    // 📌 Delete user
    public void deleteUser(Integer id, String username) {
        userRepository.deleteById(id);
    }
}
