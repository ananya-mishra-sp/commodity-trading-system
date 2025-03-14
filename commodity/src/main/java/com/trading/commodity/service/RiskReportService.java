package com.trading.commodity.service;

import com.trading.commodity.model.*;
import com.trading.commodity.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RiskReportService {
    private final RiskReportRepository riskReportRepository;
    private final PortfolioRepository portfolioRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CommodityRepository commodityRepository;

    public RiskReportService(RiskReportRepository riskReportRepository, PortfolioRepository portfolioRepository, TransactionRepository transactionRepository, UserRepository userRepository, CommodityRepository commodityRepository) {
        this.riskReportRepository = riskReportRepository;
        this.portfolioRepository = portfolioRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.commodityRepository = commodityRepository;
    }

    @Transactional
    public void updateRiskReport(Integer userId, Integer commodityId) {
        // Fetch all past transactions for the user-commodity pair
        List<Transaction> transactions = transactionRepository.findByUserIdAndCommodityId(userId, commodityId);

        if (transactions.size() < 2) {
            return; // Need at least 2 transactions to calculate volatility
        }

        // Fetch User and Commodity from database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Commodity commodity = commodityRepository.findById(commodityId)
                .orElseThrow(() -> new RuntimeException("Commodity not found"));

        // Calculate mean trade price
        BigDecimal mean = transactions.stream()
                .map(Transaction::getTradePrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(transactions.size()), BigDecimal.ROUND_HALF_UP);

        // Calculate variance
        BigDecimal variance = transactions.stream()
                .map(t -> t.getTradePrice().subtract(mean).pow(2))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(transactions.size() - 1), BigDecimal.ROUND_HALF_UP);

        BigDecimal volatility = BigDecimal.valueOf(Math.sqrt(variance.doubleValue()));

        // Get current portfolio value
        Optional<Portfolio> portfolioOpt = portfolioRepository.findByUserIdAndCommodityId(userId, commodityId);
        if (portfolioOpt.isEmpty()) {
            return;
        }
        BigDecimal portfolioValue = portfolioOpt.get().getPortfolioValue();

        // Calculate VaR (95% confidence level)
        BigDecimal var95 = portfolioValue.multiply(volatility).multiply(BigDecimal.valueOf(1.645));

        // Save or update the risk report
        RiskReport riskReport = riskReportRepository.findByUserIdAndCommodityId(userId, commodityId)
                .orElse(new RiskReport());

        riskReport.setUser(user);
        riskReport.setCommodity(commodity);
        riskReport.setPortfolioValue(portfolioValue);
        riskReport.setVolatility(volatility);
        riskReport.setVar95(var95);
        riskReport.setLastUpdated(LocalDateTime.now());

        riskReportRepository.save(riskReport);
    }

    public List<RiskReport> getUserRiskReports(Integer userId) {
        return riskReportRepository.findByUserId(userId);
    }
}
