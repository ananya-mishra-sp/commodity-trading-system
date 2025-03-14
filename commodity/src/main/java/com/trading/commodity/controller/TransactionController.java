package com.trading.commodity.controller;

import com.trading.commodity.dto.TradeRequest;
import com.trading.commodity.model.Transaction;
import com.trading.commodity.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/trade")
    public ResponseEntity<Transaction> placeTrade(@RequestBody TradeRequest request) {
        Transaction transaction = transactionService.addTransaction(
                request.getUserId(),
                request.getCommodityId(),
                request.getTradeType(),
                request.getQuantity(),
                request.getTradePrice()
        );
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getUserTransactions(@PathVariable Integer userId) {
        List<Transaction> transactions = transactionService.getUserTransactions(userId);
        return ResponseEntity.ok(transactions);
    }
}
