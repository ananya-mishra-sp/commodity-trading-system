package com.trading.commodity.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "risk_reports")
public class RiskReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "commodity_id", nullable = false)
    private Commodity commodity;

    @Column(name = "portfolio_value", nullable = false)
    private BigDecimal portfolioValue;

    @Column(nullable = false)
    private BigDecimal volatility; // Price fluctuations

    @Column(name = "var_95", nullable = false)
    private BigDecimal var95; // 95% Value-at-Risk (VaR)

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    public RiskReport() {
        this.lastUpdated = LocalDateTime.now();
    }

    public RiskReport(User user, Commodity commodity, BigDecimal portfolioValue, BigDecimal volatility, BigDecimal var95) {
        this.user = user;
        this.commodity = commodity;
        this.portfolioValue = portfolioValue;
        this.volatility = volatility;
        this.var95 = var95;
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and Setters...


    public Commodity getCommodity() {
        return commodity;
    }

    public void setCommodity(Commodity commodity) {
        this.commodity = commodity;
    }

    public BigDecimal getVolatility() {
        return volatility;
    }

    public void setVolatility(BigDecimal volatility) {
        this.volatility = volatility;
    }

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

    public BigDecimal getPortfolioValue() {
        return portfolioValue;
    }

    public void setPortfolioValue(BigDecimal portfolioValue) {
        this.portfolioValue = portfolioValue;
    }

    public BigDecimal getVar95() {
        return var95;
    }

    public void setVar95(BigDecimal var95) {
        this.var95 = var95;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
