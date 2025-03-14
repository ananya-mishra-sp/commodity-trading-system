package com.trading.commodity.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "commodity_id", nullable = false)
    private Commodity commodity;

    @Column(name = "total_quantity", nullable = false)
    private BigDecimal totalQuantity;

    @Column(name = "avg_buy_price", nullable = false)
    private BigDecimal avgBuyPrice;

    @Column(name = "current_market_price", nullable = false)
    private BigDecimal currentMarketPrice;

    @Column(name = "portfolio_value", nullable = false)
    private BigDecimal portfolioValue;

    @Column(name = "profit_loss", nullable = false)
    private BigDecimal profitLoss;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    public Portfolio() {
        this.lastUpdated = LocalDateTime.now();
    }

    public Portfolio(User user, Commodity commodity, BigDecimal totalQuantity, BigDecimal avgBuyPrice, BigDecimal currentMarketPrice) {
        this.user = user;
        this.commodity = commodity;
        this.totalQuantity = totalQuantity;
        this.avgBuyPrice = avgBuyPrice;
        this.currentMarketPrice = currentMarketPrice;
        this.portfolioValue = totalQuantity.multiply(currentMarketPrice);
        this.profitLoss = portfolioValue.subtract(totalQuantity.multiply(avgBuyPrice));
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and Setters...

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

    public BigDecimal getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(BigDecimal totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public BigDecimal getAvgBuyPrice() {
        return avgBuyPrice;
    }

    public void setAvgBuyPrice(BigDecimal avgBuyPrice) {
        this.avgBuyPrice = avgBuyPrice;
    }

    public BigDecimal getCurrentMarketPrice() {
        return currentMarketPrice;
    }

    public void setCurrentMarketPrice(BigDecimal currentMarketPrice) {
        this.currentMarketPrice = currentMarketPrice;
    }

    public BigDecimal getPortfolioValue() {
        return portfolioValue;
    }

    public void setPortfolioValue(BigDecimal portfolioValue) {
        this.portfolioValue = portfolioValue;
    }

    public BigDecimal getProfitLoss() {
        return profitLoss;
    }

    public void setProfitLoss(BigDecimal profitLoss) {
        this.profitLoss = profitLoss;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

}
