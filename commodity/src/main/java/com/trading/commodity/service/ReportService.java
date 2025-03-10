//package com.trading.commodity.service;
//
//import com.itextpdf.kernel.pdf.*;
//import com.itextpdf.kernel.font.PdfFont;
//import com.itextpdf.kernel.font.PdfFontFactory;
//import com.itextpdf.io.font.constants.StandardFonts;
//import com.itextpdf.layout.Document;
//import com.itextpdf.layout.element.Paragraph;
//import com.trading.commodity.model.Portfolio;
//import com.trading.commodity.model.RiskReport;
//import com.trading.commodity.repository.PortfolioRepository;
//import com.trading.commodity.repository.RiskReportRepository;
//import org.springframework.stereotype.Service;
//
//import java.io.ByteArrayOutputStream;
//import java.util.List;
//
//@Service
//public class ReportService {
//
//    private final PortfolioRepository portfolioRepository;
//    private final RiskReportRepository riskReportRepository;
//
//    public ReportService(PortfolioRepository portfolioRepository, RiskReportRepository riskReportRepository) {
//        this.portfolioRepository = portfolioRepository;
//        this.riskReportRepository = riskReportRepository;
//    }
//
//    public byte[] generateUserReport(Integer userId) {
//        List<Portfolio> portfolioList = portfolioRepository.findByUserId(userId);
//        List<RiskReport> riskReportList = riskReportRepository.findByUserId(userId);
//
//        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
//            PdfWriter writer = new PdfWriter(outputStream);
//            PdfDocument pdfDoc = new PdfDocument(writer);
//            Document document = new Document(pdfDoc);
//
//            // Create bold font
//            PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
//
//            document.add(new Paragraph("User Report").setFont(boldFont).setFontSize(18));
//            document.add(new Paragraph("\nPortfolio Summary:").setFont(boldFont));
//            for (Portfolio p : portfolioList) {
//                document.add(new Paragraph(p.getCommodity().getName() + ": " + p.getTotalQuantity() + " units"));
//            }
//
//            document.add(new Paragraph("\nRisk Analysis:").setFont(boldFont));
//            for (RiskReport r : riskReportList) {
//                document.add(new Paragraph("Commodity: " + r.getCommodity().getName() + " | Volatility: " + r.getVolatility() + " | VaR: " + r.getVar95()));
//            }
//
//            document.close();
//            return outputStream.toByteArray();
//        } catch (Exception e) {
//            throw new RuntimeException("Error generating PDF", e);
//        }
//    }
//}
