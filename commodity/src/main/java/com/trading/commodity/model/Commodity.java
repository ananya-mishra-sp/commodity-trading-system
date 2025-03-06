package com.trading.commodity.model;

import jakarta.persistence.*;

@Entity
@Table(name = "commodities")
public class Commodity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String code;  // Unique Code (e.g., "GOLD", "OIL")

    @Column(nullable = false)
    private double price;  // Current Market Price

    public Commodity() {}

    public Commodity(String name, String code, double price) {
        this.name = name;
        this.code = code;
        this.price = price;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
