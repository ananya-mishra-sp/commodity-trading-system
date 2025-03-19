package com.trading.commodity.service;

import com.trading.commodity.model.*;
import com.trading.commodity.repository.CommodityRepository;
import com.trading.commodity.repository.PortfolioRepository;
import com.trading.commodity.repository.TransactionRepository;
import com.trading.commodity.repository.UserRepository;
import com.trading.commodity.service.PortfolioService;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PortfolioServiceTest {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommodityRepository commodityRepository;

    private PortfolioService portfolioService;
    private User testUser;
    private Commodity testCommodity;

    @Before
    public void setUp() {
        portfolioService = new PortfolioService(portfolioRepository, transactionRepository, userRepository, commodityRepository);

        // Create and save a test user
        testUser = new User();
        testUser.setName("Test User");
        testUser.setUsername("testuser");
        testUser.setEmail("testuser@example.com");
        testUser.setPassword("password");
        testUser.setRole(Role.valueOf("User"));
        userRepository.save(testUser);

        // Create and save a test commodity
        testCommodity = new Commodity();
        testCommodity.setName("Gold");
        testCommodity.setCurrentPrice(BigDecimal.valueOf(2000));
        commodityRepository.save(testCommodity);
    }

    @After
    public void tearDown() {
        transactionRepository.deleteAll();
        portfolioRepository.deleteAll();
        commodityRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    public void testUpdatePortfolio_BuyTransaction() {
        // Create a Buy transaction
        Transaction transaction = new Transaction();
        transaction.setUser(testUser);
        transaction.setCommodity(testCommodity);
        transaction.setTradeType("Buy");
        transaction.setQuantity(BigDecimal.valueOf(5));
        transaction.setTradePrice(BigDecimal.valueOf(1900));
        transaction.setTradeDate(LocalDateTime.now());
        transactionRepository.save(transaction);

        // Update portfolio
        portfolioService.updatePortfolio(testUser.getId(), testCommodity.getId());

        // Fetch and validate portfolio
        List<Portfolio> portfolios = portfolioRepository.findByUserId(testUser.getId());
        assertFalse(portfolios.isEmpty());
        Portfolio portfolio = portfolios.get(0);
        assertEquals(BigDecimal.valueOf(5), portfolio.getTotalQuantity());
        assertEquals(BigDecimal.valueOf(1900), portfolio.getAvgBuyPrice());
    }

    @Test
    public void testUpdatePortfolio_SellTransaction() {
        // Create a Buy transaction first
        Transaction buyTransaction = new Transaction();
        buyTransaction.setUser(testUser);
        buyTransaction.setCommodity(testCommodity);
        buyTransaction.setTradeType("Buy");
        buyTransaction.setQuantity(BigDecimal.valueOf(10));
        buyTransaction.setTradePrice(BigDecimal.valueOf(1800));
        buyTransaction.setTradeDate(LocalDateTime.now());
        transactionRepository.save(buyTransaction);

        // Update portfolio after buying
        portfolioService.updatePortfolio(testUser.getId(), testCommodity.getId());

        // Create a Sell transaction
        Transaction sellTransaction = new Transaction();
        sellTransaction.setUser(testUser);
        sellTransaction.setCommodity(testCommodity);
        sellTransaction.setTradeType("Sell");
        sellTransaction.setQuantity(BigDecimal.valueOf(5));
        sellTransaction.setTradePrice(BigDecimal.valueOf(2000));
        sellTransaction.setTradeDate(LocalDateTime.now());
        transactionRepository.save(sellTransaction);

        // Update portfolio after selling
        portfolioService.updatePortfolio(testUser.getId(), testCommodity.getId());

        // Fetch and validate portfolio
        List<Portfolio> portfolios = portfolioRepository.findByUserId(testUser.getId());
        assertFalse(portfolios.isEmpty());
        Portfolio portfolio = portfolios.get(0);
        assertEquals(BigDecimal.valueOf(5), portfolio.getTotalQuantity()); // Remaining quantity
        assertEquals(BigDecimal.valueOf(1800), portfolio.getAvgBuyPrice()); // Avg Buy Price remains
        assertTrue(portfolio.getProfitLoss().compareTo(BigDecimal.ZERO) > 0); // Profit should be positive
    }

    @Test
    public void testUpdatePortfolio_EmptyPortfolioAfterFullSell() {
        // Create a Buy transaction
        Transaction buyTransaction = new Transaction();
        buyTransaction.setUser(testUser);
        buyTransaction.setCommodity(testCommodity);
        buyTransaction.setTradeType("Buy");
        buyTransaction.setQuantity(BigDecimal.valueOf(5));
        buyTransaction.setTradePrice(BigDecimal.valueOf(1900));
        buyTransaction.setTradeDate(LocalDateTime.now());
        transactionRepository.save(buyTransaction);

        // Update portfolio after buying
        portfolioService.updatePortfolio(testUser.getId(), testCommodity.getId());

        // Create a Sell transaction for the full quantity
        Transaction sellTransaction = new Transaction();
        sellTransaction.setUser(testUser);
        sellTransaction.setCommodity(testCommodity);
        sellTransaction.setTradeType("Sell");
        sellTransaction.setQuantity(BigDecimal.valueOf(5));
        sellTransaction.setTradePrice(BigDecimal.valueOf(2000));
        sellTransaction.setTradeDate(LocalDateTime.now());
        transactionRepository.save(sellTransaction);

        // Update portfolio after selling everything
        portfolioService.updatePortfolio(testUser.getId(), testCommodity.getId());

        // Fetch and validate portfolio
        List<Portfolio> portfolios = portfolioRepository.findByUserId(testUser.getId());
        assertTrue(portfolios.isEmpty()); // Portfolio should be empty after full sell
    }
}
