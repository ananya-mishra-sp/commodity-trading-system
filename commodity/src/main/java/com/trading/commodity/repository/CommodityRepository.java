package com.trading.commodity.repository;

import com.trading.commodity.model.Commodity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommodityRepository extends JpaRepository<Commodity, Integer> {
    List<Commodity> findAll(Sort sort);
}
