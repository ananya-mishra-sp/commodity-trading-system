package com.trading.commodity.service;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.repository.CommodityRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional  // Ensures test data is rolled back after each test
public class CommodityServiceTest {

    @Autowired
    private CommodityService commodityService;

    @Autowired
    private CommodityRepository commodityRepository;

    private Commodity testCommodity;

    @Before
    public void setUp() {
        commodityRepository.deleteAll(); // Clean database before tests

        // Insert test data
        testCommodity = new Commodity();
        testCommodity.setName("Gold");
        testCommodity.setUnit("kg");
        testCommodity.setCurrentPrice(new BigDecimal("1800.50"));
        commodityRepository.save(testCommodity);
    }

    @After
    public void tearDown() {
        commodityRepository.deleteAll(); // Clean database after tests
    }

    @Test
    public void testGetAllCommodities() {
        List<Commodity> commodities = commodityService.getAllCommodities("name", "asc");
        assertFalse(commodities.isEmpty());
        assertEquals("Gold", commodities.get(0).getName());
    }

    @Test
    public void testGetCommodityById() {
        Optional<Commodity> foundCommodity = commodityService.getCommodityById(testCommodity.getId());
        assertTrue(foundCommodity.isPresent());
        assertEquals("Gold", foundCommodity.get().getName());
    }

    @Test
    public void testCreateCommodity() {
        Commodity silver = new Commodity();
        silver.setName("Silver");
        silver.setUnit("kg");
        silver.setCurrentPrice(new BigDecimal("25.30"));

        Commodity savedCommodity = commodityService.createCommodity(silver);

        assertNotNull(savedCommodity);
        assertEquals("Silver", savedCommodity.getName());
    }

    @Test
    public void testUpdateCommodity() {
        Commodity updateDetails = new Commodity();
        updateDetails.setName("Gold");
        updateDetails.setUnit("gram");
        updateDetails.setCurrentPrice(new BigDecimal("60.00"));

        Commodity updatedCommodity = commodityService.updateCommodity(testCommodity.getId(), updateDetails);

        assertEquals("gram", updatedCommodity.getUnit());
        assertEquals(new BigDecimal("60.00"), updatedCommodity.getCurrentPrice());
    }

    @Test
    public void testDeleteCommodity() {
        commodityService.deleteCommodity(testCommodity.getId());
        Optional<Commodity> deletedCommodity = commodityRepository.findById(testCommodity.getId());
        assertFalse(deletedCommodity.isPresent());
    }
}
