package com.trading.commodity.repository;

import com.trading.commodity.model.RiskReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RiskReportRepository extends JpaRepository<RiskReport, Integer> {
    List<RiskReport> findByUserId(Integer userId);
}
