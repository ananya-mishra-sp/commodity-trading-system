package com.trading.commodity.service;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.model.Portfolio;
import com.trading.commodity.model.User;
import com.trading.commodity.repository.PortfolioRepository;
import com.trading.commodity.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    public PortfolioService(PortfolioRepository portfolioRepository, UserRepository userRepository) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Portfolio updatePortfolio(Integer userId, Commodity commodity, BigDecimal quantity, BigDecimal buyPrice) {
        Optional<Portfolio> existingPortfolio = portfolioRepository.findByUserId(userId)
                .stream()
                .filter(p -> p.getCommodity().equals(commodity))
                .findFirst();

        Portfolio portfolio;
        if (existingPortfolio.isPresent()) {
            portfolio = existingPortfolio.get();
            BigDecimal totalQuantity = portfolio.getTotalQuantity().add(quantity);
            BigDecimal avgBuyPrice = (portfolio.getAvgBuyPrice().multiply(portfolio.getTotalQuantity())
                    .add(buyPrice.multiply(quantity)))
                    .divide(totalQuantity, BigDecimal.ROUND_HALF_UP);
            portfolio.setTotalQuantity(totalQuantity);
            portfolio.setAvgBuyPrice(avgBuyPrice);
        } else {
            portfolio = new Portfolio(userRepository.findById(userId).orElseThrow(),
                    commodity, quantity, buyPrice, commodity.getCurrentPrice());
        }

        portfolio.setPortfolioValue(portfolio.getTotalQuantity().multiply(portfolio.getCurrentMarketPrice()));
        portfolio.setProfitLoss(portfolio.getPortfolioValue().subtract(portfolio.getTotalQuantity().multiply(portfolio.getAvgBuyPrice())));
        return portfolioRepository.save(portfolio);
    }

    public List<Portfolio> getUserPortfolio(Integer userId) {
        return portfolioRepository.findByUserId(userId);
    }
}
