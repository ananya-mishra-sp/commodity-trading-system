package com.trading.commodity.controller;

import com.trading.commodity.model.Transaction;
import com.trading.commodity.model.User;
import com.trading.commodity.service.TransactionService;
import com.trading.commodity.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<List<Transaction>> getUserTransactions(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        if (user.isPresent()) {
            List<Transaction> transactions = transactionService.getUserTransactions(user.get());
            return ResponseEntity.ok(transactions);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/buy")
    public ResponseEntity<Transaction> buyCommodity(@RequestBody Transaction transaction) {
        Transaction savedTransaction = transactionService.saveTransaction(transaction);
        return ResponseEntity.ok(savedTransaction);
    }
}
