package com.trading.commodity.controller;

import com.trading.commodity.model.Report;
import com.trading.commodity.model.User;
import com.trading.commodity.service.ReportService;
import com.trading.commodity.service.UserService;
import com.trading.commodity.util.PdfGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserService userService;

    @Autowired
    private PdfGenerator pdfGenerator;

    @GetMapping("/{username}")
    public ResponseEntity<List<Report>> getUserReports(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        if (user.isPresent()) {
            List<Report> reports = reportService.getUserReports(user.get());
            return ResponseEntity.ok(reports);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/download/{username}")
    public ResponseEntity<byte[]> downloadUserReport(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        if (user.isPresent()) {
            byte[] pdfBytes = pdfGenerator.generateReportPdf(user.get());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=user_report.pdf")
                    .body(pdfBytes);
        }
        return ResponseEntity.notFound().build();
    }
}
