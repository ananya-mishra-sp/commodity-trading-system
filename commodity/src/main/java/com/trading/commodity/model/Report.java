package com.trading.commodity.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String commodity;
    private int totalQuantity;
    private double avgBuyPrice;
    private double currentMarketPrice;
    private double portfolioValue;
    private double profitLoss;
    private double volatility;
    private double valueAtRisk; // VaR


    public Report() {}

    public Report(User user, String commodity, int totalQuantity, double avgBuyPrice, double currentMarketPrice,
                  double portfolioValue, double profitLoss, double volatility, double valueAtRisk) {
        this.user = user;
        this.commodity = commodity;
        this.totalQuantity = totalQuantity;
        this.avgBuyPrice = avgBuyPrice;
        this.currentMarketPrice = currentMarketPrice;
        this.portfolioValue = portfolioValue;
        this.profitLoss = profitLoss;
        this.volatility = volatility;
        this.valueAtRisk = valueAtRisk;
    }


    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getCommodity() { return commodity; }
    public int getTotalQuantity() { return totalQuantity; }
    public double getAvgBuyPrice() { return avgBuyPrice; }
    public double getCurrentMarketPrice() { return currentMarketPrice; }
    public double getPortfolioValue() { return portfolioValue; }
    public double getProfitLoss() { return profitLoss; }
    public double getVolatility() { return volatility; }
    public double getValueAtRisk() { return valueAtRisk; }


    public void setUser(User user) { this.user = user; }
    public void setCommodity(String commodity) { this.commodity = commodity; }
    public void setTotalQuantity(int totalQuantity) { this.totalQuantity = totalQuantity; }
    public void setAvgBuyPrice(double avgBuyPrice) { this.avgBuyPrice = avgBuyPrice; }
    public void setCurrentMarketPrice(double currentMarketPrice) { this.currentMarketPrice = currentMarketPrice; }
    public void setPortfolioValue(double portfolioValue) { this.portfolioValue = portfolioValue; }
    public void setProfitLoss(double profitLoss) { this.profitLoss = profitLoss; }
    public void setVolatility(double volatility) { this.volatility = volatility; }
    public void setValueAtRisk(double valueAtRisk) { this.valueAtRisk = valueAtRisk; }
}
