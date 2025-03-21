package com.trading.commodity.service;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.model.Transaction;
import com.trading.commodity.model.User;
import com.trading.commodity.repository.CommodityRepository;
import com.trading.commodity.repository.TransactionRepository;
import com.trading.commodity.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final PortfolioService portfolioService;
    private final RiskReportService riskReportService;
    private final UserRepository userRepository; // Add this
    private final CommodityRepository commodityRepository; // Add this

    public TransactionService(
            TransactionRepository transactionRepository,
            PortfolioService portfolioService,
            RiskReportService riskReportService,
            UserRepository userRepository, // Inject this
            CommodityRepository commodityRepository // Inject this
    ) {
        this.transactionRepository = transactionRepository;
        this.portfolioService = portfolioService;
        this.riskReportService = riskReportService;
        this.userRepository = userRepository;
        this.commodityRepository = commodityRepository;
    }

    @Transactional
    public Transaction addTransaction(Integer userId, Integer commodityId, String tradeType, BigDecimal quantity, BigDecimal tradePrice) {
        // Fetch User and Commodity from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Commodity commodity = commodityRepository.findById(commodityId)
                .orElseThrow(() -> new RuntimeException("Commodity not found"));

        // Check portfolio balance for SELL transactions
        if (tradeType.equalsIgnoreCase("Sell")) {
            Optional<BigDecimal> totalOwnedQuantityOpt = portfolioService.getTotalQuantity(userId, commodityId);
            BigDecimal totalOwnedQuantity = totalOwnedQuantityOpt.orElse(BigDecimal.ZERO);

            // Ensure user is not selling more than they own
            if (quantity.compareTo(totalOwnedQuantity) > 0) {
                throw new RuntimeException("Quantity not sufficient for sale. You own: " + totalOwnedQuantity);
            }
        }

        // Create a new Transaction
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setCommodity(commodity);
        transaction.setTradeType(tradeType);
        transaction.setQuantity(quantity);
        transaction.setTradePrice(tradePrice);

        // Calculate total value
        transaction.setTotalValue(commodity.getCurrentPrice().multiply(quantity));

        // Save the transaction in the database
        transactionRepository.save(transaction);

        // Update Portfolio and Risk Report
        portfolioService.updatePortfolio(userId, commodityId);
        riskReportService.updateRiskReport(userId, commodityId);

        return transaction; // Return the saved transaction
    }

    public List<Transaction> getUserTransactions(Integer userId) {

        return transactionRepository.findByUserId(userId);
    }

}
