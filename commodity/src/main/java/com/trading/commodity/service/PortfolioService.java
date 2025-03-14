package com.trading.commodity.service;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.model.Portfolio;
import com.trading.commodity.model.Transaction;
import com.trading.commodity.model.User;
import com.trading.commodity.repository.CommodityRepository;
import com.trading.commodity.repository.PortfolioRepository;
import com.trading.commodity.repository.TransactionRepository;
import com.trading.commodity.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PortfolioService {
    private final PortfolioRepository portfolioRepository;
    private final TransactionRepository transactionRepository;
    private  final UserRepository userRepository;
    private final CommodityRepository commodityRepository;

    public PortfolioService(PortfolioRepository portfolioRepository, TransactionRepository transactionRepository, UserRepository userRepository, CommodityRepository commodityRepository) {
        this.portfolioRepository = portfolioRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.commodityRepository = commodityRepository;
    }

    @Transactional
    public void updatePortfolio(Integer userId, Integer commodityId) {
        // Fetch all transactions for the user-commodity pair
        List<Transaction> transactions = transactionRepository.findByUserIdAndCommodityId(userId, commodityId);

        BigDecimal totalQuantity = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO; // Sum of (quantity * trade price)

        for (Transaction tx : transactions) {
            if ("Buy".equalsIgnoreCase(tx.getTradeType())) {
                totalQuantity = totalQuantity.add(tx.getQuantity());
                totalCost = totalCost.add(tx.getQuantity().multiply(tx.getTradePrice()));
            } else if ("Sell".equalsIgnoreCase(tx.getTradeType())) {
                totalQuantity = totalQuantity.subtract(tx.getQuantity());
            }
        }

        // If total quantity is zero, remove portfolio entry
        if (totalQuantity.compareTo(BigDecimal.ZERO) <= 0) {
            portfolioRepository.deleteByUserIdAndCommodityId(userId, commodityId);
            return;
        }

        BigDecimal avgBuyPrice = totalQuantity.compareTo(BigDecimal.ZERO) > 0 ?
                totalCost.divide(totalQuantity, BigDecimal.ROUND_HALF_UP) : BigDecimal.ZERO;

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch the latest market price
        Commodity commodity = commodityRepository.findById(commodityId)
                .orElseThrow(() -> new RuntimeException("Commodity not found"));
        BigDecimal currentMarketPrice = commodity.getCurrentPrice();
        BigDecimal portfolioValue = totalQuantity.multiply(currentMarketPrice);
        BigDecimal profitLoss = portfolioValue.subtract(totalCost);

        // Save/update the portfolio
        Portfolio portfolio = portfolioRepository.findByUserIdAndCommodityId(userId, commodityId)
                .orElse(new Portfolio());

        portfolio.setUser(user);
        portfolio.setCommodity(commodity);
        portfolio.setTotalQuantity(totalQuantity);
        portfolio.setAvgBuyPrice(avgBuyPrice);
        portfolio.setCurrentMarketPrice(currentMarketPrice);
        portfolio.setPortfolioValue(portfolioValue);
        portfolio.setProfitLoss(profitLoss);
        portfolio.setLastUpdated(LocalDateTime.now());

        portfolioRepository.save(portfolio);
    }

    public List<Portfolio> getUserPortfolio(Integer userId) {
        return portfolioRepository.findByUserId(userId);
    }

    public void deleteByUserIdAndCommodityId(Integer userId, Integer commodityId) {
        portfolioRepository.deleteByUserIdAndCommodityId(userId, commodityId);
    }
}
