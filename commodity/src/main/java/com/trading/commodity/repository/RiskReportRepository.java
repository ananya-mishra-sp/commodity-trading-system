package com.trading.commodity.repository;

import com.trading.commodity.model.RiskReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RiskReportRepository extends JpaRepository<RiskReport, Integer> {
    Optional<RiskReport> findByUserIdAndCommodityId(Integer userId, Integer commodityId);

    List<RiskReport> findByUserId(Integer userId);
}
