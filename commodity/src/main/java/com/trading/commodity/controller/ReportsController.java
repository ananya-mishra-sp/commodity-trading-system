package com.trading.commodity.controller;

import com.trading.commodity.model.Portfolio;
import com.trading.commodity.model.RiskReport;
import com.trading.commodity.service.PortfolioService;
import com.trading.commodity.service.RiskReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private final PortfolioService portfolioService;
    private final RiskReportService riskReportService;

    public ReportsController(PortfolioService portfolioService, RiskReportService riskReportService) {
        this.portfolioService = portfolioService;
        this.riskReportService = riskReportService;
    }

    @GetMapping("/portfolio/{userId}")
    public ResponseEntity<List<Portfolio>> getUserPortfolio(@PathVariable Integer userId) {
        return ResponseEntity.ok(portfolioService.getUserPortfolio(userId));
    }

    @GetMapping("/risk/{userId}")
    public ResponseEntity<List<RiskReport>> getUserRiskReports(@PathVariable Integer userId) {
        return ResponseEntity.ok(riskReportService.getUserRiskReports(userId));
    }
}
