import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { Vendor } from '@app/vendor/vendor';
import { VendorModule } from '@app/vendor/vendor.module';
import { NewVendorService } from '@app/vendor/newvendor.service';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [
    CommonModule,
    MatComponentsModule,
    VendorModule,
    ProductDetailComponent,
  ],
  templateUrl: './product-home.component.html',
  styles: [],
})
export class ProductHomeComponent implements OnInit {
  products: Product[] = [];
  product: Product;
  displayedColumns: string[] = ['id', 'name', 'vendorid'];
  msg: string;
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  vendors: Vendor[] = [];
  hideEditForm: boolean = true;

  constructor(
    public productService: ProductService,
    public vendorService: NewVendorService
  ) {
    this.msg = '';
    this.product = {
      id: '',
      vendorid: 0,
      name: '',
      costprice: 0.0,
      msrp: 0.0,
      rop: 0,
      eoq: 0,
      qoh: 0,
      qoo: 0,
      qrcode: '',
      qrcodetxt: '',
    };
  }
  ngOnInit(): void {
    this.getAllProducts();
    this.getAllVendors();
  } // ngOnInit
  /**
   * getAllProducts - retrieve everything
   */
  getAllProducts(passedMsg: string = ''): void {
    this.productService.getAll().subscribe({
      // Create observer object
      next: (products: Product[]) => {
        this.products = products;
        this.dataSource.data = this.products;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get products - ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Products loaded!`),
    });
  } // getAllProducts

  /**
   * getAllVendors - retrieve everything
   */
  getAllVendors(passedMsg: string = ''): void {
    this.vendorService.getAll().subscribe({
      // Create observer object
      next: (vendors: Vendor[]) => {
        this.vendors = vendors;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get vendors - ${err.message}`),
      complete: () => (passedMsg ? (this.msg = passedMsg) : null),
    });
  } // getAllVendors
  select(selectedProduct: Product): void {
    this.product = selectedProduct;
    //this.product.exists = true;
    this.msg = `Product ${selectedProduct.id} selected`;
    this.hideEditForm = !this.hideEditForm;
  } // select
  /**
   * cancelled - event handler for cancel button
   */
  cancel(msg?: string): void {
    this.hideEditForm = !this.hideEditForm;
    this.msg = 'operation cancelled';
  } // cancel
  /**
   * update - send changed update to service update local array
   */
  update(selectedProduct: Product): void {
    this.productService.update(selectedProduct).subscribe({
      // observer object
      next: (prd: Product) => {
        let msg = `Product ${prd.id} updated!`;
        this.getAllProducts(msg);
      },
      error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
      complete: () => {
        this.hideEditForm = !this.hideEditForm;
      },
    });
  } // update
  /**
   * save - determine whether we're doing and add or an update
   */
  save(product: Product): void {
    product.id ? this.update(product) : this.add(product);
  } // save
  /**
   * add - send product to service, receive newid back
   */
  add(newProduct: Product): void {
    this.msg = 'Adding product...';
    this.productService.create(newProduct).subscribe({
      // observer object
      next: (exp: Product) => {
        let msg = '';
        exp.id == ''
          ? (msg = `Product ${exp.id} added!`)
          : (msg = `Product ${exp.id} not added!`);
        this.getAllProducts(msg);
      },
      error: (err: Error) => (this.msg = `Product not added! - ${err.message}`),
      complete: () => {
        this.hideEditForm = !this.hideEditForm;
      },
    });
  } // add
  /**
   * delete - send product id to service for deletion
   */
  delete(selectedProduct: Product): void {
    this.productService.deleteProd(selectedProduct.id).subscribe({
      // observer object
      next: (numOfProductsDeleted: string) => {
        let msg = '';
        numOfProductsDeleted === ''
          ? (msg = `Product ${selectedProduct.id} deleted!`)
          : (msg = `Product ${selectedProduct.id} deleted!`);
        this.getAllProducts(msg);
      },
      error: (err: Error) => (this.msg = `Delete failed! - ${err.message}`),
      complete: () => {
        this.hideEditForm = !this.hideEditForm;
      },
    });
  } // delete
  /**
   * newProduct - create new product instance
   */
  newProduct(): void {
    this.product = {
      id: '',
      vendorid: 0,
      name: '',
      costprice: 0.0,
      msrp: 0.0,
      rop: 0,
      eoq: 0,
      qoh: 0,
      qoo: 0,
      qrcode: '',
      qrcodetxt: '',
    };
    this.msg = 'New product';
    this.hideEditForm = !this.hideEditForm;
  } // newProduct

  sortProductsWithObjectLiterals(sort: Sort): void {
    const literals = {
      // sort on id
      id: () =>
        (this.dataSource.data = this.dataSource.data.sort(
          (a: Product, b: Product) =>
            sort.direction === 'asc'
              ? a.id < b.id
                ? -1
                : 1
              : b.id < a.id
              ? -1
              : 1 // descending
        )),
      // sort on vendorid
      vendorid: () =>
        (this.dataSource.data = this.dataSource.data.sort(
          (a: Product, b: Product) =>
            sort.direction === 'asc'
              ? a.vendorid - b.vendorid
              : b.vendorid - a.vendorid // descending
        )),
      // sort on name
      name: () =>
        (this.dataSource.data = this.dataSource.data.sort(
          (a: Product, b: Product) =>
            sort.direction === 'asc'
              ? a.name < b.name
                ? -1
                : 1
              : b.name < a.name
              ? -1
              : 1 // descending
        )),
    };
    literals[sort.active as keyof typeof literals]();
  } // sortProductsWithObjectLiterals
  // MatPaginator
  pageSize = 5;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this.dataSource.paginator = paginator;
  }
} // ProductHomeComponent
