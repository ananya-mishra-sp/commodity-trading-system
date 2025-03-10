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
    private final UserRepository userRepository;
    private final CommodityRepository commodityRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository, CommodityRepository commodityRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.commodityRepository = commodityRepository;
    }

    @Transactional
    public Transaction placeTrade(Integer userId, Integer commodityId, String tradeType, BigDecimal quantity) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Commodity> commodityOpt = commodityRepository.findById(commodityId);

        if (userOpt.isEmpty() || commodityOpt.isEmpty()) {
            throw new IllegalArgumentException("User or Commodity not found");
        }

        User user = userOpt.get();
        Commodity commodity = commodityOpt.get();

        BigDecimal tradePrice = commodity.getCurrentPrice();
        Transaction transaction = new Transaction(user, commodity, tradeType, quantity, tradePrice);

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getUserTransactions(Integer userId) {
        return transactionRepository.findByUserId(userId);
    }
}
