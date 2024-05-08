package com.info5059.casestudy.purchaseorder;
//import java.util.List;

//import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.transaction.annotation.Transactional;

@RepositoryRestResource(collectionResourceRel = "pos", path = "pos")
public interface PurchaseOrderRepository extends CrudRepository<PurchaseOrder, Long>{
    @Modifying
@Transactional
@Query("delete from Product where id = ?1") 
Integer deleteOne(Long id);
//List<PurchaseOrder> findByid(Long id);
}
