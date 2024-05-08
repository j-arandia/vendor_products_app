package com.info5059.casestudy.purchaseorder;
import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;
import com.info5059.casestudy.product.QRCodeGenerator;
import com.info5059.casestudy.vendor.Vendor;
import com.info5059.casestudy.vendor.VendorRepository;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

import org.hibernate.generator.Generator;
import org.springframework.web.servlet.view.document.AbstractPdfView;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.net.URL;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

public abstract class POPDFGenerator extends AbstractPdfView {

public static ByteArrayInputStream generateReport(String poid, ProductRepository productRepository, VendorRepository vendorRepository, PurchaseOrderDAO pDao) throws IOException{

    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    Locale locale = Locale.of("en", "US");
NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
    //Create the byte array by calling the generateQRCode method

    URL imageUrl = POPDFGenerator.class.getResource("/static/images/uriko.png");
ByteArrayOutputStream baos = new ByteArrayOutputStream();
PdfWriter writer = new PdfWriter(baos);
// Initialize PDF document to be written to a stream not a file
PdfDocument pdf = new PdfDocument(writer);
// Document is the main object
Document document = new Document(pdf);
PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
// add the image to the document
PageSize pg = PageSize.A4;

PurchaseOrder pOrder = new PurchaseOrder();
Vendor vendor = new Vendor();
//Image qrcode = new Image(ImageDataFactory.create(qrcode)).scaleAbsolute(100, 100).setFixedPosition(460,60);


Image img = new Image(ImageDataFactory.create(imageUrl)).scaleAbsolute(120, 120)
.setFixedPosition(pg.getWidth() / 2 - 60, 750);
document.add(img);
// now let's add a big heading
document.add(new Paragraph("\n\n"));


 



try{
   pOrder = pDao.findOne(Long.parseLong(poid));
    document.add(new Paragraph(String.format("Purchase Order")).setFont(font).setFontSize(24)
                    .setMarginRight(45).setTextAlignment(TextAlignment.RIGHT).setBold());
    document.add(new Paragraph("#:" + poid).setFont(font).setFontSize(16).setBold().setMarginRight(90)
                    .setMarginTop(-10).setTextAlignment(TextAlignment.RIGHT));
    document.add(new Paragraph("\n\n"));

    Optional<Vendor> vendorOption = vendorRepository.findById(pOrder.getVendorid());


     if (vendorOption.isPresent()) {
        vendor = vendorOption.get();
        Table table = new Table(3);
        table.setWidth(new UnitValue(UnitValue.PERCENT, 45));
        Cell cell = new Cell(5, 2)
                        .add(new Paragraph("Vendor:").setFont(font).setFontSize(12).setBold())
                        .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER)
                        .setBackgroundColor(ColorConstants.WHITE);
        table.addCell(cell);
        cell = new Cell()
                        .add(new Paragraph(vendor.getName()).setFont(font).setFontSize(12)
                                        .setBold())
                        .setTextAlignment(TextAlignment.LEFT).setBorder(Border.NO_BORDER)
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY);
        table.addCell(cell);
        cell = new Cell()
                        .add(new Paragraph(vendor.getAddress1()).setFont(font).setFontSize(12)
                                        .setBold())
                        .setTextAlignment(TextAlignment.LEFT).setBorder(Border.NO_BORDER)
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY);
        table.addCell(cell);
        cell = new Cell()
                        .add(new Paragraph(vendor.getCity()).setFont(font).setFontSize(12)
                                        .setBold())
                        .setTextAlignment(TextAlignment.LEFT).setBorder(Border.NO_BORDER)
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY);
        table.addCell(cell);
        cell = new Cell()
                        .add(new Paragraph(vendor.getProvince()).setFont(font).setFontSize(12)
                                        .setBold())
                        .setTextAlignment(TextAlignment.LEFT).setBorder(Border.NO_BORDER)
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY);
        table.addCell(cell);
        cell = new Cell()
                        .add(new Paragraph(vendor.getEmail()).setFont(font).setFontSize(12)
                                        .setBold())
                        .setTextAlignment(TextAlignment.LEFT).setBorder(Border.NO_BORDER)
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY);
        table.addCell(cell);
        document.add(table);

        document.add(new Paragraph("\n\n"));

        Table productOrderTable = new Table(5);
        productOrderTable.setWidth(new UnitValue(UnitValue.PERCENT, 100));

        cell = new Cell().add(
                        new Paragraph("Product Code").setFont(font).setFontSize(12).setBold())
                        .setTextAlignment(TextAlignment.CENTER);
        productOrderTable.addCell(cell);
        cell = new Cell().add(
                        new Paragraph("Description").setFont(font).setFontSize(12).setBold())
                        .setTextAlignment(TextAlignment.CENTER);
        productOrderTable.addCell(cell);
        cell = new Cell().add(new Paragraph("Qty Sold").setFont(font).setFontSize(12).setBold())
                        .setTextAlignment(TextAlignment.CENTER);
        productOrderTable.addCell(cell);
        cell = new Cell().add(new Paragraph("Price").setFont(font).setFontSize(12).setBold())
                        .setTextAlignment(TextAlignment.CENTER);
        productOrderTable.addCell(cell);
        cell = new Cell().add(
                        new Paragraph("Ext. Price").setFont(font).setFontSize(12).setBold())
                        .setTextAlignment(TextAlignment.CENTER);
        productOrderTable.addCell(cell);

        BigDecimal ext = new BigDecimal(0.0);
        BigDecimal normalprice = new BigDecimal(0.0);
        BigDecimal sub = new BigDecimal(0.0);
        BigDecimal tax = new BigDecimal(0.0);
        BigDecimal tot = new BigDecimal(0.0);

        for (PurchaseOrderLineItem line : pOrder.getItems()) {
                Optional<Product> prodOpt = productRepository.findById(line.getProductid());
                if (prodOpt.isPresent()) {
                    Product product = prodOpt.get();
                    cell = new Cell()
                        .add(new Paragraph(product.getId()).setFont(font)
                                        .setFontSize(12))
                        .setTextAlignment(TextAlignment.CENTER);
                    productOrderTable.addCell(cell);
                    cell = new Cell()
                        .add(new Paragraph(product.getName()).setFont(font)
                                        .setFontSize(12))
                        .setTextAlignment(TextAlignment.CENTER);
                    productOrderTable.addCell(cell);
                    cell = new Cell()
                        .add(new Paragraph(String.valueOf(line.getQty()))
                                        .setFont(font).setFontSize(12))
                        .setTextAlignment(TextAlignment.RIGHT);
                    productOrderTable.addCell(cell);
                    normalprice = line.getPrice();
                    cell = new Cell()
                        .add(new Paragraph(formatter.format(normalprice))
                                        .setFont(font).setFontSize(12))
                        .setTextAlignment(TextAlignment.RIGHT);
                    productOrderTable.addCell(cell);
                    ext = line.getPrice().multiply(BigDecimal.valueOf(line.getQty()),
                                    new MathContext(8, RoundingMode.UP));
                    cell = new Cell()
                        .add(new Paragraph(formatter.format(ext)).setFont(font)
                                        .setFontSize(12))
                        .setTextAlignment(TextAlignment.RIGHT);
                    productOrderTable.addCell(cell);
                        sub = sub.add(ext, new MathContext(8, RoundingMode.UP));
                }
        }

        cell = new Cell(1, 4).add(new Paragraph("Sub Total:")).setBorder(Border.NO_BORDER)
                        .setTextAlignment(TextAlignment.RIGHT);
        productOrderTable.addCell(cell);
        cell = new Cell().add(new Paragraph(formatter.format(sub)))
                        .setTextAlignment(TextAlignment.RIGHT);
        productOrderTable.addCell(cell);
        cell = new Cell(1, 4).add(new Paragraph("Tax:")).setBorder(Border.NO_BORDER)
                        .setTextAlignment(TextAlignment.RIGHT);
        productOrderTable.addCell(cell);
        tax = sub.multiply(BigDecimal.valueOf(0.13), new MathContext(8, RoundingMode.UP));
        cell = new Cell().add(new Paragraph(formatter.format(tax)))
                        .setTextAlignment(TextAlignment.RIGHT);
        productOrderTable.addCell(cell);
        cell = new Cell(1, 4).add(new Paragraph("PO Total:")).setBorder(Border.NO_BORDER)
                        .setTextAlignment(TextAlignment.RIGHT);
        productOrderTable.addCell(cell);
        tot = sub.add(tax, new MathContext(8, RoundingMode.UP));
        cell = new Cell().add(new Paragraph(formatter.format(tot)))
                        .setTextAlignment(TextAlignment.RIGHT)
                        .setBackgroundColor(ColorConstants.YELLOW);
        productOrderTable.addCell(cell);
        document.add(productOrderTable);
}


document.add(new Paragraph("\n\n"));

document.add(new Paragraph(dateFormatter.format(LocalDateTime.now()))
.setTextAlignment(TextAlignment.CENTER));
document.add(new Paragraph("\n\n"));
Image qrcode = addSummaryQRCode(vendorOption.get(), pOrder);
document.add(qrcode);
document.close();


}catch (Exception ex) {
    Logger.getLogger(Generator.class.getName()).log(Level.SEVERE, null, ex);
    }

    // finally send stream back to the controller
    return new ByteArrayInputStream(baos.toByteArray());

    }
    public static Image addSummaryQRCode(Vendor ven, PurchaseOrder po) throws IOException {
QRCodeGenerator qrcodeGenerator = new QRCodeGenerator();
    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    Locale locale = Locale.of("en", "US");
NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
String summary = "Summary for Purchase Order:" + po.getId() + "\nDate:"
+ dateFormatter.format(po.getPodate()) + "\nVendor:"
+ ven.getName()
+ "\nTotal:" + formatter.format(po.getAmount());
byte[] qrcodebin = qrcodeGenerator.generateQRCode(summary);
Image qrcode = new Image(ImageDataFactory.create(qrcodebin)).scaleAbsolute(100, 100).setFixedPosition(460,60);
return qrcode;

}

}
