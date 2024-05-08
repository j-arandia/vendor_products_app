package com.info5059.casestudy.purchaseorder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.RequiredArgsConstructor;
@Entity
@Data
@RequiredArgsConstructor
public class PurchaseOrder {
    // PurchaseOrder private members
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
private Long vendorid;
private BigDecimal amount;
@JsonFormat(pattern = "yyyy-MM-dd@HH:mm:ss")
private LocalDateTime podate;
@OneToMany(targetEntity = PurchaseOrderLineItem.class, fetch = FetchType.EAGER, orphanRemoval = true)
@JoinColumn(name = "poid", referencedColumnName = "id")
private List<PurchaseOrderLineItem> items = new ArrayList<PurchaseOrderLineItem>();
}
