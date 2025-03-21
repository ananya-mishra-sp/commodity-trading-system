package com.trading.commodity.repository;

import com.trading.commodity.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Integer> {
    Optional<Portfolio> findByUserIdAndCommodityId(Integer userId, Integer commodityId);

    List<Portfolio> findByUserId(Integer userId);
}
