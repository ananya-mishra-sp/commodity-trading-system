package com.trading.commodity.service;

import com.trading.commodity.model.*;
import com.trading.commodity.repository.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Mockito;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Arrays;
import static org.mockito.Mockito.*;
import static org.junit.Assert.*;
import java.time.LocalDateTime;

public class RiskReportServiceTest {

    @Mock
    private RiskReportRepository riskReportRepository;

    @Mock
    private PortfolioRepository portfolioRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CommodityRepository commodityRepository;

    @InjectMocks
    private RiskReportService riskReportService;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this); // JUnit 4 way of initializing mocks
    }

    @Test
    public void testUpdateRiskReport_WithSufficientTransactions() {
        Integer userId = 1;
        Integer commodityId = 100;
        User user = new User();
        user.setId(userId);
        user.setUsername("testUser");

        Commodity commodity = new Commodity();
        commodity.setId(commodityId);
        commodity.setName("Gold");

        Transaction transaction1 = new Transaction();
        transaction1.setTradePrice(new BigDecimal("1800"));

        Transaction transaction2 = new Transaction();
        transaction2.setTradePrice(new BigDecimal("1850"));

        List<Transaction> transactions = Arrays.asList(transaction1, transaction2);
        Portfolio portfolio = new Portfolio();
        portfolio.setPortfolioValue(new BigDecimal("10000"));

        when(transactionRepository.findByUserIdAndCommodityId(userId, commodityId)).thenReturn(transactions);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(commodityRepository.findById(commodityId)).thenReturn(Optional.of(commodity));
        when(portfolioRepository.findByUserIdAndCommodityId(userId, commodityId)).thenReturn(Optional.of(portfolio));

        riskReportService.updateRiskReport(userId, commodityId);

        verify(riskReportRepository, times(1)).save(any(RiskReport.class));
    }

    @Test
    public void testUpdateRiskReport_WithInsufficientTransactions() {
        Integer userId = 1;
        Integer commodityId = 100;
        when(transactionRepository.findByUserIdAndCommodityId(userId, commodityId)).thenReturn(Arrays.asList()); // Empty transactions
        riskReportService.updateRiskReport(userId, commodityId);
        verify(riskReportRepository, never()).save(any(RiskReport.class)); // Should not save
    }

    @Test
    public void testGetUserRiskReports() {
        Integer userId = 1;
        RiskReport report = new RiskReport();
        report.setUser(new User());
        report.setCommodity(new Commodity());
        report.setVolatility(new BigDecimal("0.05"));
        report.setVar95(new BigDecimal("500"));
        report.setLastUpdated(LocalDateTime.now());

        when(riskReportRepository.findByUserId(userId)).thenReturn(Arrays.asList(report));

        List<RiskReport> reports = riskReportService.getUserRiskReports(userId);
        assertFalse(reports.isEmpty());
        assertEquals(1, reports.size());
        assertEquals(new BigDecimal("0.05"), reports.get(0).getVolatility());
    }
}
