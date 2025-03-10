//package com.trading.commodity.controller;
//
//import com.trading.commodity.service.ReportService;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/reports")
//public class ReportController {
//
//    private final ReportService reportService;
//
//    public ReportController(ReportService reportService) {
//        this.reportService = reportService;
//    }
//
//    @GetMapping("/download/{userId}")
//    public ResponseEntity<byte[]> downloadUserReport(@PathVariable Integer userId) {
//        byte[] pdfBytes = reportService.generateUserReport(userId);
//        HttpHeaders headers = new HttpHeaders();
//        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=UserReport.pdf");
//
//        return ResponseEntity.ok()
//                .headers(headers)
//                .body(pdfBytes);
//    }
//}
