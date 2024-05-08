-- initial vendor data
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email)
VALUES ('123 Maple St','London','On', 'N1N-1N1','(555)555-5555','Trusted','ABC Supply Co.','abc@supply.com');
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email) 
VALUES ('543 Sycamore Ave','Toronto','On', 'N1P-1N1','(999)555-5555','Trusted','Big Bills Depot','bb@depot.com');
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email) 
VALUES ('922 Oak St','London','On', 'N1N-1N1','(555)555-5599','Untrusted','Shady Sams','ss@underthetable.com');
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email) 
VALUES ('701 Viscount St','London','On', 'S2V-2T2','(555)555-5513','Untrusted','Jassika Arandia','ja@discount.com');
-- Product Entity data
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98701',1,'Kimono',589.99,639.99,3,5,4,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98702',2,'Chopsticks',5.49,9.99,100,200,90,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98703',3,'Slippers',10.12,14.89,20,30,10,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98704',4,'Socks',7.49,9.99,50,150,100,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98705',2,'Hair Pin',10.89,15.99,30,50,10,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98706',1,'Waist Tie',29.99,35.79,5,10,6,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98707',4,'Tatami',489.79,549.99,6,12,8,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98708',4,'Futon',208.89,239.99,10,14,8,0);
-- New Products data
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98709',4,'Origami Paper Set',11.55,22.50,3,5,4,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98710',4,'Samue',55.50,69.99,100,200,90,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98711',3,'Tea Pot',60.70,74.89,20,30,10,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98712',1,'Green Tea Leaves',11.29,19.99,50,150,100,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98713',2,'Ceremonial Green Tea',23.50,35.99,30,50,10,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98714',1,'Jasmine Tea Leaves',11.29,25.79,5,10,6,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98715',3,'Tea cup',16.10,26.79,6,12,8,0);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo) 
VALUES ('AD98716',2,'Imabari Towel Set',32.05,42.50,10,14,8,0);