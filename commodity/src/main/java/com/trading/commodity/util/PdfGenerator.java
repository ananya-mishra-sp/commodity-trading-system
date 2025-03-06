package com.trading.commodity.util;

import com.trading.commodity.model.Report;
import com.trading.commodity.model.User;
import com.trading.commodity.service.ReportService;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfGenerator {

    @Autowired
    private ReportService reportService;

    public byte[] generateReportPdf(User user) {
        try {
            List<Report> reports = reportService.getUserReports(user);

            Document document = new Document();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, outputStream);
            document.open();

            document.add(new Paragraph("User Report for: " + user.getUsername(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));

            for (Report report : reports) {
                document.add(new Paragraph("Commodity: " + report.getCommodity()));
                document.add(new Paragraph("Total Quantity: " + report.getTotalQuantity()));
                document.add(new Paragraph("Portfolio Value: $" + report.getPortfolioValue()));
                document.add(new Paragraph("Profit/Loss: $" + report.getProfitLoss()));
                document.add(new Paragraph("----------------------------------------------------"));
            }

            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
