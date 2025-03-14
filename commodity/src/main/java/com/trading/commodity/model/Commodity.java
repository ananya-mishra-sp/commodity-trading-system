package com.trading.commodity.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "commodities")
public class Commodity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 20)
    private String unit; // Example: "oz", "barrels", "tons"

    @Column(name = "current_price", nullable = false)
    private BigDecimal currentPrice;

    // Constructor
    public Commodity(Integer commodityId) {
    }

    public Commodity(String name, String unit, BigDecimal currentPrice) {
        this.name = name;
        this.unit = unit;
        this.currentPrice = currentPrice;
    }

    public Commodity() {
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }
}
