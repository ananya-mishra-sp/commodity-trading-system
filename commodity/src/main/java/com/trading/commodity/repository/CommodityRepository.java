package com.trading.commodity.repository;

import com.trading.commodity.model.Commodity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommodityRepository extends JpaRepository<Commodity, Long> {
    Commodity findByCode(String code);
}
