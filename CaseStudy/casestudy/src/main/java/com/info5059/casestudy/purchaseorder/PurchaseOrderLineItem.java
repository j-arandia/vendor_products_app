package com.info5059.casestudy.purchaseorder;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.RequiredArgsConstructor;
@Entity
@Data
@RequiredArgsConstructor
public class PurchaseOrderLineItem {
    // PurchaseOrderLineitem private members
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
private Long poid;
private String productid;
private int qty;
private BigDecimal price;
}
