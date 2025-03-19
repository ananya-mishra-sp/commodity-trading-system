package com.trading.commodity.service;

import com.trading.commodity.model.*;
import com.trading.commodity.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.math.MathContext;
import java.math.RoundingMode;

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
        List<Transaction> transactions = transactionRepository.findByUserIdAndCommodityId(userId, commodityId);

        if (transactions.size() < 2) {
            return; // Need at least 2 transactions for volatility calculation
        }

        // Fetch User and Commodity
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Commodity commodity = commodityRepository.findById(commodityId)
                .orElseThrow(() -> new RuntimeException("Commodity not found"));

        // Compute log returns (ln(P2 / P1)) instead of raw price differences
        BigDecimal sumLogReturns = BigDecimal.ZERO;
        BigDecimal squaredSum = BigDecimal.ZERO;

        for (int i = 1; i < transactions.size(); i++) {
            BigDecimal prevPrice = transactions.get(i - 1).getTradePrice();
            BigDecimal currPrice = transactions.get(i).getTradePrice();

            if (prevPrice.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal logReturn = BigDecimal.valueOf(Math.log(currPrice.divide(prevPrice, MathContext.DECIMAL64).doubleValue()));
                sumLogReturns = sumLogReturns.add(logReturn);
                squaredSum = squaredSum.add(logReturn.pow(2));
            }
        }

        int n = transactions.size() - 1;
        if (n < 1) return; // Avoid division by zero

        // Calculate mean of log returns
        BigDecimal meanLogReturn = sumLogReturns.divide(BigDecimal.valueOf(n), RoundingMode.HALF_UP);

        // Calculate variance
        BigDecimal variance = squaredSum.divide(BigDecimal.valueOf(n), RoundingMode.HALF_UP)
                .subtract(meanLogReturn.pow(2));

        // Volatility is the standard deviation
        BigDecimal volatility = BigDecimal.valueOf(Math.sqrt(variance.doubleValue()));

        // Get Portfolio Value
        Optional<Portfolio> portfolioOpt = portfolioRepository.findByUserIdAndCommodityId(userId, commodityId);
        if (portfolioOpt.isEmpty()) return;

        BigDecimal portfolioValue = portfolioOpt.get().getPortfolioValue();

        // Calculate VaR at 95% confidence level
        BigDecimal var95 = portfolioValue.multiply(volatility).multiply(BigDecimal.valueOf(1.645));

        // Save or Update the Risk Report
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
