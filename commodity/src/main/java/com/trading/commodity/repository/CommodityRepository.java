package com.trading.commodity.repository;

import com.trading.commodity.model.Commodity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommodityRepository extends JpaRepository<Commodity, Integer> {
    Optional<Commodity> findByName(String name);
}
