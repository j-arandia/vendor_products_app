package com.info5059.casestudy.purchaseorder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
@Component
public class PurchaseOrderDAO {
    @PersistenceContext
    private EntityManager entityManager;
    @Autowired
    private ProductRepository prodRepo;
    @Transactional
    public PurchaseOrder create(PurchaseOrder clientrep) {
    PurchaseOrder realPurchaseOrder = new PurchaseOrder();
    realPurchaseOrder.setVendorid(clientrep.getVendorid());
    realPurchaseOrder.setAmount(clientrep.getAmount());
    realPurchaseOrder.setPodate(LocalDateTime.now());
    entityManager.persist(realPurchaseOrder);  

    for (PurchaseOrderLineItem item : clientrep.getItems()) {
    PurchaseOrderLineItem realLineItem = new PurchaseOrderLineItem();
    realLineItem.setPoid(realPurchaseOrder.getId());
    realLineItem.setProductid(item.getProductid());
    realLineItem.setQty(item.getQty());
    realLineItem.setPrice(item.getPrice());
    entityManager.persist(realLineItem);
    
    // we also need to update the QOO on the product table
    Product prod = prodRepo.getReferenceById(item.getProductid());
    prod.setQoo(prod.getQoo() + item.getQty());
    prodRepo.saveAndFlush(prod);
    entityManager.persist(prod);
    }

    entityManager.flush();
    entityManager.refresh(realPurchaseOrder);
    return realPurchaseOrder;
    }

    public PurchaseOrder findOne(Long id){
        PurchaseOrder purchaseOrder = entityManager.find(PurchaseOrder.class, id);
        if(purchaseOrder == null){
            throw new EntityNotFoundException("Can't find order id" + id);
        }
        return purchaseOrder;
    }

    /*public Iterable<PurchaseOrder> findByVendor(Long vendorId) {
        return entityManager.createQuery("select r from PurchaseOrder r where r.vendorid = :id")
                .setParameter("id", vendorId)
                .getResultList();
    }*/
}
 