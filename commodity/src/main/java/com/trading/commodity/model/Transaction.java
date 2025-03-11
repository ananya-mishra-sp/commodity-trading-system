package com.trading.commodity.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "commodity_id", nullable = false)
    private Commodity commodity;

    @Column(name = "trade_type", nullable = false)
    private String tradeType; // "Buy" or "Sell"

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity;

    @Column(name = "trade_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal tradePrice; // Price per unit at the time of trade

    @Column(name = "total_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalValue;

    @Column(name = "trade_date", nullable = false)
    private LocalDateTime tradeDate;

    // Constructor
    public Transaction() {
        this.tradeDate = LocalDateTime.now();
    }

    public Transaction(User user, Commodity commodity, String tradeType, BigDecimal quantity, BigDecimal tradePrice, BigDecimal totalValue) {
        this.user = user;
        this.commodity = commodity;
        this.tradeType = tradeType;
        this.quantity = quantity;
        this.tradePrice = tradePrice;
        this.totalValue = tradePrice.multiply(quantity);
        this.tradeDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Commodity getCommodity() {
        return commodity;
    }

    public void setCommodity(Commodity commodity) {
        this.commodity = commodity;
    }

    public String getTradeType() {
        return tradeType;
    }

    public void setTradeType(String tradeType) {
        this.tradeType = tradeType;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getTradePrice() {
        return tradePrice;
    }

    public void setTradePrice(BigDecimal tradePrice) {
        this.tradePrice = tradePrice;
    }

    public BigDecimal getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(BigDecimal totalValue) {
        this.totalValue = totalValue;
    }

    public LocalDateTime getTradeDate() {
        return tradeDate;
    }

    public void setTradeDate(LocalDateTime tradeDate) {
        this.tradeDate = tradeDate;
    }
}
