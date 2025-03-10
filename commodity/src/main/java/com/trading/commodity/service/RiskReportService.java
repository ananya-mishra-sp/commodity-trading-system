package com.trading.commodity.service;

import com.trading.commodity.model.RiskReport;
import com.trading.commodity.repository.RiskReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class RiskReportService {

    private final RiskReportRepository riskReportRepository;

    public RiskReportService(RiskReportRepository riskReportRepository) {
        this.riskReportRepository = riskReportRepository;
    }

    @Transactional
    public RiskReport generateRiskReport(Integer userId, BigDecimal portfolioValue, BigDecimal volatility) {
        BigDecimal var95 = portfolioValue.multiply(volatility).multiply(BigDecimal.valueOf(1.645)); // 95% VaR formula
        RiskReport report = new RiskReport(null, null, portfolioValue, volatility, var95);
        return riskReportRepository.save(report);
    }

    public List<RiskReport> getUserRiskReports(Integer userId) {
        return riskReportRepository.findByUserId(userId);
    }
}
