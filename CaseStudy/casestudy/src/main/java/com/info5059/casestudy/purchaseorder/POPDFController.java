package com.info5059.casestudy.purchaseorder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.info5059.casestudy.product.ProductRepository;
import com.info5059.casestudy.vendor.VendorRepository;

import jakarta.servlet.http.HttpServletRequest;

import java.io.ByteArrayInputStream;
import java.io.IOException;
//@CrossOrigin
@RestController
public class POPDFController {
    @Autowired
    private PurchaseOrderDAO poDAO;
    @Autowired
    private VendorRepository vendorRepository;
    @Autowired
    private ProductRepository productRepository;

    @GetMapping(value = "/PoPDF", produces = MediaType.APPLICATION_PDF_VALUE)
public ResponseEntity<InputStreamResource> streamPDF(HttpServletRequest request) throws IOException {
    //Create the byte array by calling the generateQRCode method
    //byte[] qrcode = qrcodeGenerator.generateQRCode("");
    String repid = request.getParameter("poid");
// get formatted pdf as a stream
ByteArrayInputStream bis = POPDFGenerator.generateReport(repid, productRepository, vendorRepository, poDAO);
HttpHeaders headers = new HttpHeaders();
headers.add("Content-Disposition", "inline; filename=examplereport.pdf");
// dump stream to browser
return ResponseEntity
.ok()
.headers(headers)
.contentType(MediaType.APPLICATION_PDF)
.body(new InputStreamResource(bis));
}

    
}
