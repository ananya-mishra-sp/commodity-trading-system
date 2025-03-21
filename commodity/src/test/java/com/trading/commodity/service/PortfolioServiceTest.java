package com.trading.commodity.service;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.model.Portfolio;
import com.trading.commodity.model.Transaction;
import com.trading.commodity.model.User;
import com.trading.commodity.repository.CommodityRepository;
import com.trading.commodity.repository.PortfolioRepository;
import com.trading.commodity.repository.TransactionRepository;
import com.trading.commodity.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PortfolioServiceTest {

    @Mock
    private PortfolioRepository portfolioRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CommodityRepository commodityRepository;

    @InjectMocks
    private PortfolioService portfolioService;

    private User user;
    private Commodity commodity;
    private Portfolio portfolio;
    private Transaction buyTransaction;
    private Transaction sellTransaction;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1);
        user.setUsername("testUser");

        commodity = new Commodity();
        commodity.setId(1);
        commodity.setName("Gold");
        commodity.setCurrentPrice(new BigDecimal("2000"));

        buyTransaction = new Transaction();
        buyTransaction.setUser(user);
        buyTransaction.setCommodity(commodity);
        buyTransaction.setTradeType("Buy");
        buyTransaction.setQuantity(new BigDecimal("2"));
        buyTransaction.setTradePrice(new BigDecimal("1900"));

        sellTransaction = new Transaction();
        sellTransaction.setUser(user);
        sellTransaction.setCommodity(commodity);
        sellTransaction.setTradeType("Sell");
        sellTransaction.setQuantity(new BigDecimal("1"));
        sellTransaction.setTradePrice(new BigDecimal("1950"));
    }

    @Test
    void testUpdatePortfolio_BuyTransaction() {
        when(transactionRepository.findByUserIdAndCommodityId(1, 1)).thenReturn(List.of(buyTransaction));
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(commodityRepository.findById(1)).thenReturn(Optional.of(commodity));
        when(portfolioRepository.findByUserIdAndCommodityId(1, 1)).thenReturn(Optional.empty());

        portfolioService.updatePortfolio(1, 1);

        verify(portfolioRepository, times(1)).save(any(Portfolio.class));
    }

    @Test
    void testUpdatePortfolio_SellTransaction() {
        when(transactionRepository.findByUserIdAndCommodityId(1, 1)).thenReturn(List.of(buyTransaction, sellTransaction));
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(commodityRepository.findById(1)).thenReturn(Optional.of(commodity));
        when(portfolioRepository.findByUserIdAndCommodityId(1, 1)).thenReturn(Optional.of(new Portfolio()));

        portfolioService.updatePortfolio(1, 1);

        verify(portfolioRepository, times(1)).save(any(Portfolio.class));
    }

    @Test
    void testGetUserPortfolio() {
        when(portfolioRepository.findByUserId(1)).thenReturn(List.of(new Portfolio()));
        List<Portfolio> result = portfolioService.getUserPortfolio(1);
        assertEquals(1, result.size());
    }
}
