package com.trading.commodity.service;

import com.trading.commodity.model.Report;
import com.trading.commodity.model.User;
import com.trading.commodity.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    public List<Report> getUserReports(User user) {
        return reportRepository.findByUser(user);
    }

    public Report saveReport(Report report) {
        return reportRepository.save(report);
    }
}
