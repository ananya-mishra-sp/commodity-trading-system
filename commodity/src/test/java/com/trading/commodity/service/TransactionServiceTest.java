package com.trading.commodity.service;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.model.Transaction;
import com.trading.commodity.model.User;
import com.trading.commodity.repository.CommodityRepository;
import com.trading.commodity.repository.TransactionRepository;
import com.trading.commodity.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private PortfolioService portfolioService;

    @Mock
    private RiskReportService riskReportService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CommodityRepository commodityRepository;

    @InjectMocks
    private TransactionService transactionService;

    private User user;
    private Commodity commodity;
    private Transaction transaction;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1);
        user.setUsername("testUser");

        commodity = new Commodity();
        commodity.setId(1);
        commodity.setName("Gold");
        commodity.setCurrentPrice(new BigDecimal("2000"));

        transaction = new Transaction();
        transaction.setUser(user);
        transaction.setCommodity(commodity);
        transaction.setTradeType("Buy");
        transaction.setQuantity(new BigDecimal("2"));
        transaction.setTradePrice(new BigDecimal("1900"));
    }

    @Test
    void testAddTransaction_Buy() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(commodityRepository.findById(1)).thenReturn(Optional.of(commodity));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        Transaction result = transactionService.addTransaction(1, 1, "Buy", new BigDecimal("2"), new BigDecimal("1900"));

        assertNotNull(result);
        assertEquals("Buy", result.getTradeType());
        assertEquals(new BigDecimal("2"), result.getQuantity());
        assertEquals(new BigDecimal("4000"), result.getTotalValue()); // 2 * 2000 (Current Price)

        verify(transactionRepository, times(1)).save(any(Transaction.class));
        verify(portfolioService, times(1)).updatePortfolio(1, 1);
        verify(riskReportService, times(1)).updateRiskReport(1, 1);
    }

    @Test
    void testAddTransaction_Sell_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(commodityRepository.findById(1)).thenReturn(Optional.of(commodity));
        when(portfolioService.getTotalQuantity(1, 1)).thenReturn(Optional.of(new BigDecimal("5"))); // User owns 5 units
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        Transaction result = transactionService.addTransaction(1, 1, "Sell", new BigDecimal("2"), new BigDecimal("1950"));

        assertNotNull(result);
        assertEquals("Sell", result.getTradeType());
        assertEquals(new BigDecimal("2"), result.getQuantity());

        verify(transactionRepository, times(1)).save(any(Transaction.class));
        verify(portfolioService, times(1)).updatePortfolio(1, 1);
        verify(riskReportService, times(1)).updateRiskReport(1, 1);
    }

    @Test
    void testAddTransaction_Sell_Failure_NotEnoughQuantity() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(commodityRepository.findById(1)).thenReturn(Optional.of(commodity));
        when(portfolioService.getTotalQuantity(1, 1)).thenReturn(Optional.of(new BigDecimal("1"))); // User owns only 1 unit

        Exception exception = assertThrows(RuntimeException.class, () ->
                transactionService.addTransaction(1, 1, "Sell", new BigDecimal("2"), new BigDecimal("1950"))
        );

        assertEquals("Quantity not sufficient for sale. You own: 1", exception.getMessage());
        verify(transactionRepository, never()).save(any(Transaction.class));
    }

    @Test
    void testGetUserTransactions() {
        when(transactionRepository.findByUserId(1)).thenReturn(List.of(transaction));

        List<Transaction> transactions = transactionService.getUserTransactions(1);

        assertEquals(1, transactions.size());
        assertEquals(transaction, transactions.get(0));
    }
}
