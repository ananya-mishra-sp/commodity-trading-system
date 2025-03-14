package com.trading.commodity.repository;

import com.trading.commodity.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByUserIdAndCommodityId(Integer userId, Integer commodityId);
    List<Transaction> findByUserId(Integer userId);
}
