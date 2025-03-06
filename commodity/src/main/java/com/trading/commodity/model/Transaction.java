package com.trading.commodity.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "commodity_id", nullable = false)
    private Commodity commodity;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private String tradeType;  // "buy" or "sell"

    @Column(nullable = false)
    private double tradePrice;  // Price at which trade was made

    @Column(nullable = false)
    private LocalDateTime tradeDate = LocalDateTime.now();

    public Transaction() {}

    public Transaction(User user, Commodity commodity, int quantity, String tradeType, double tradePrice) {
        this.user = user;
        this.commodity = commodity;
        this.quantity = quantity;
        this.tradeType = tradeType;
        this.tradePrice = tradePrice;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Commodity getCommodity() { return commodity; }
    public void setCommodity(Commodity commodity) { this.commodity = commodity; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getTradeType() { return tradeType; }
    public void setTradeType(String tradeType) { this.tradeType = tradeType; }

    public double getTradePrice() { return tradePrice; }
    public void setTradePrice(double tradePrice) { this.tradePrice = tradePrice; }

    public LocalDateTime getTradeDate() { return tradeDate; }
    public void setTradeDate(LocalDateTime tradeDate) { this.tradeDate = tradeDate; }
}
