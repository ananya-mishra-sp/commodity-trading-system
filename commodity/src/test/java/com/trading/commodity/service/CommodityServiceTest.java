package com.trading.commodity.service;

import com.trading.commodity.model.Commodity;
import com.trading.commodity.repository.CommodityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Example;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommodityServiceTest {

    @Mock
    private CommodityRepository commodityRepository;

    @InjectMocks
    private CommodityService commodityService;

    private Commodity commodity;

    @BeforeEach
    void setUp() {
        commodity = new Commodity();
        commodity.setId(1);
        commodity.setName("Gold");
        commodity.setUnit("kg");
        commodity.setCurrentPrice(new BigDecimal("1800.50"));
    }

    @Test
    void testGetAllCommodities() {
        when(commodityRepository.findAll((Example<Commodity>) Mockito.any())).thenReturn(Arrays.asList(commodity));
        List<Commodity> commodities = commodityService.getAllCommodities("name", "asc");
        assertFalse(commodities.isEmpty());
        assertEquals(1, commodities.size());
        assertEquals("Gold", commodities.get(0).getName());
    }

    @Test
    void testGetCommodityById() {
        when(commodityRepository.findById(1)).thenReturn(Optional.of(commodity));
        Optional<Commodity> foundCommodity = commodityService.getCommodityById(1);
        assertTrue(foundCommodity.isPresent());
        assertEquals("Gold", foundCommodity.get().getName());
    }

    @Test
    void testCreateCommodity() {
        when(commodityRepository.save(commodity)).thenReturn(commodity);
        Commodity createdCommodity = commodityService.createCommodity(commodity);
        assertNotNull(createdCommodity);
        assertEquals("Gold", createdCommodity.getName());
    }

    @Test
    void testDeleteCommodity() {
        doNothing().when(commodityRepository).deleteById(1);
        commodityService.deleteCommodity(1);
        verify(commodityRepository, times(1)).deleteById(1);
    }

    @Test
    void testProcessCSV() {
        MultipartFile file = mock(MultipartFile.class);
        when(commodityRepository.findByName("Gold")).thenReturn(Optional.of(commodity));
        doNothing().when(commodityRepository).saveAll(any());
        assertDoesNotThrow(() -> commodityService.processCSV(file));
    }
}
