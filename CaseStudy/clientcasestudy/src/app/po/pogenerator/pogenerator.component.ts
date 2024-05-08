import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { Po } from '@app/po/po';
import { PoItem } from '@app/po/po-item';
import { PoService } from '@app/po/po.service';
import { Vendor } from '@app/vendor/vendor';
import { NewVendorService } from '@app/vendor/newvendor.service';
import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { PDFURL } from '@app/constants';
@Component({
  selector: 'app-pogenerator',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  templateUrl: './pogenerator.component.html',
  styles: [],
})
export class PogeneratorComponent implements OnInit, OnDestroy {
  // form
  generatorForm: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  qty: FormControl;
  // data
  formSubscription?: Subscription;
  products: Product[] = []; // everybody's products
  vendors: Vendor[] = []; // all vendors
  vendorproducts: Product[] = []; // all products for a particular vendor
  items: PoItem[] = []; // product items that will be in po
  selectedproducts: Product[] = []; // products that being displayed currently in app
  selectedProduct: Product; // the current selected product
  selectedVendor: Vendor; // the current selected vendor
  //selectedQty: string;
  // misc
  pickedProduct: boolean;
  pickedVendor: boolean;
  pickedQty: boolean;
  generated: boolean;
  hasProducts: boolean;
  msg: string;
  total: number;
  pono: number = 0; //Report Number
  qtyItems: any[];
  podate: string;
  sub: number;
  tax: number;

  constructor(
    private builder: FormBuilder,
    private vendorService: NewVendorService,
    private productService: ProductService,
    private poService: PoService
  ) {
    this.pickedVendor = false;
    this.pickedProduct = false;
    this.pickedQty = false;
    this.generated = false;
    this.msg = '';
    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.qty = new FormControl('');
    this.generatorForm = this.builder.group({
      productid: this.productid,
      vendorid: this.vendorid,
      qty: this.qty,
    });
    this.qtyItems = [];
    this.qtyItems.push('EOQ');
    for (let i = 0; i <= 50; i++) {
      const obj = new Object(i);
      this.qtyItems.push(obj);
    }
    this.selectedProduct = {
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
    this.selectedVendor = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      address1: '',
      city: '',
      province: '',
      postalcode: '',
      type: '',
    };
    this.hasProducts = false;
    this.total = 0.0;
    this.podate = '';
    this.sub = 0;
    this.tax = 0;
  } //end constructor

  ngOnInit(): void {
    this.onPickVendor(); // sets up subscription for dropdown click
    this.onPickProduct(); // sets up subscription for dropdown click
    this.onPickEOQ(); //drop down for the EOQ
    this.msg = 'loading vendors from server...';
    this.getAllVendors();
  } // ngOnInit
  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  } // ngOnDestroy
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
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Vendors loaded!`),
    });
  } // getAllVendors
  /**
   * loadVendorProducts - retrieve a particular vendor's products
   */
  loadVendorProducts(): void {
    this.vendorproducts = [];
    this.productService.getSome(this.selectedVendor.id).subscribe({
      // observer object
      next: (products: Product[]) => {
        this.vendorproducts = products;
      },
      error: (err: Error) =>
        (this.msg = `product fetch failed! - ${err.message}`),
      complete: () => {},
    });
  } // loadVendorProducts
  /**
   * onPickVendor - Another way to use Observables, subscribe to the select change event
   * then load specific vendor products for subsequent selection
   */
  onPickVendor(): void {
    this.formSubscription = this.generatorForm
      .get('vendorid')
      ?.valueChanges.subscribe((val) => {
        this.selectedProduct = {
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
        this.selectedVendor = val;
        this.loadVendorProducts();
        this.pickedProduct = false;
        this.pickedQty = false;
        this.hasProducts = false;
        this.msg = 'choose product for vendor';
        this.pickedVendor = true;
        this.generated = false;
        this.items = []; // array for the report
        this.selectedproducts = []; // array for the details in app html
      });
  } // onPickVendor
  /**
   * onPickProduct - subscribe to the select change event then
   * update array containing items.
   */
  onPickProduct(): void {
    const productSubscription = this.generatorForm
      .get('productid')
      ?.valueChanges.subscribe((val) => {
        if (this.selectedProduct !== null) {
          this.pickedProduct = true;
          if (this.selectedProduct.name !== val) {
            this.qty.setValue(' ');
            this.selectedProduct = val;
          } else {
            this.selectedProduct = val;
            this.pickedProduct = true;
            this.msg = 'Choose qty for product';
            this.generated = false;
          }
        } else {
          this.selectedProduct = val;
          this.pickedProduct = true;
          this.msg = 'Choose qty for product';
          this.generated = false;
        }
      });
    this.formSubscription?.add(productSubscription); // add it as a child, so all can be destroyed together
  } // onPickProduct
  /**
   * onPickEOQ
   */
  onPickEOQ(): void {
    const eoqSubscription = this.generatorForm
      .get('qty')
      ?.valueChanges.subscribe((val) => {
        if (val.toString() === '0') {
          for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].productid === this.selectedProduct.id) {
              this.items.splice(i, 1);
            }
          }
          for (let i = 0; i < this.selectedproducts.length; i++) {
            if (this.selectedproducts[i].id === this.selectedProduct.id) {
              this.selectedproducts.splice(i, 1);
            }
          }
          if (this.selectedproducts.length === 0) {
            this.hasProducts = false;
            this.total = 0.0;
            this.msg = 'No Items';
          } else {
            this.msg = 'All ' + this.selectedProduct.name + ' Removed';
            this.total = 0.0;
            this.selectedproducts.forEach(
              (pro) => (this.total += pro.eoq * pro.costprice)
            );
          }
        } else if (val !== ' ') {
          if (val === this.selectedProduct.eoq || val === 'EOQ') {
            const item: PoItem = {
              id: 0,
              po: 0,
              productid: this.selectedProduct.id,
              price: this.selectedProduct.costprice,
              qty: this.selectedProduct.eoq,
            };
            const product: Product = {
              id: this.selectedProduct.id,
              vendorid: this.selectedProduct.vendorid,
              name: this.selectedProduct.name,
              costprice: this.selectedProduct.costprice,
              msrp: this.selectedProduct.msrp,
              rop: this.selectedProduct.rop,
              eoq: this.selectedProduct.eoq,
              qoh: this.selectedProduct.qoh,
              qoo: this.selectedProduct.eoq,
              qrcode: this.selectedProduct.qrcode,
              qrcodetxt: this.selectedProduct.qrcodetxt,
            };
            if (
              this.items.find((it) => it.productid === this.selectedProduct.id)
            ) {
              // ignore entry
              for (let i = 0; i < this.selectedproducts.length; i++) {
                if (this.selectedproducts[i].id === product.id) {
                  this.items[i] = item;
                  this.selectedproducts[i] = product;
                }
              }
            } else {
              // add entry
              this.items.push(item);
              this.selectedproducts.push(product);
            }
            if (this.items.length > 0) {
              this.hasProducts = true;
            }
            this.total = 0.0;
            this.selectedproducts.forEach(
              (pro) => (this.total += pro.eoq * pro.costprice)
            );
            this.msg =
              this.selectedProduct.eoq +
              ' ' +
              this.selectedProduct.name +
              '(s) Added';
          } else {
            if (val.toString() !== ' ') {
              const item: PoItem = {
                id: 0,
                po: 0,
                productid: this.selectedProduct.id,
                price: this.selectedProduct.costprice,
                qty: val,
              };
              const product: Product = {
                id: this.selectedProduct.id,
                vendorid: this.selectedProduct.vendorid,
                name: this.selectedProduct.name,
                costprice: this.selectedProduct.costprice,
                msrp: this.selectedProduct.msrp,
                rop: this.selectedProduct.rop,
                eoq: this.selectedProduct.eoq,
                qoh: this.selectedProduct.qoh,
                qoo: val,
                qrcode: this.selectedProduct.qrcode,
                qrcodetxt: this.selectedProduct.qrcodetxt,
              };
              if (
                this.items.find(
                  (it) => it.productid === this.selectedProduct.id
                )
              ) {
                // ignore entry
                for (let i = 0; i < this.selectedproducts.length; i++) {
                  if (this.selectedproducts[i].id === product.id) {
                    this.items[i] = item;
                    this.selectedproducts[i] = product;
                  }
                }
              } else {
                // add entry
                this.items.push(item);
                this.selectedproducts.push(product);
              }
              if (this.items.length > 0) {
                this.hasProducts = true;
              }
              this.total = 0.0;
              this.selectedproducts.forEach(
                (pro) => (this.total += pro.eoq * pro.costprice)
              );
              this.msg = val + ' ' + this.selectedProduct.name + '(s) Added';
            }
          }
        }
      });
    this.formSubscription?.add(eoqSubscription); // add it as a child, so all can be destroyed together
  } //onPickEOQ

  /**
   * createReport - create the client side po
   */
  createPo(): void {
    this.generated = false;
    const po: Po = {
      id: 0,
      items: this.items,
      vendorid: this.selectedVendor.id,
      amount: this.total,
      podate: this.podate,
    };
    const reportPo = this.poService.create(po).subscribe({
      // observer object
      next: (po: Po) => {
        // server should be returning report with new id
        po.id > 0
          ? (this.msg = `PO ${po.id} added!`)
          : (this.msg = 'PO not added! - server error');
        this.pono = po.id;
      },
      error: (err: Error) => (this.msg = `PO not added! - ${err.message}`),
      complete: () => {
        this.hasProducts = false;
        this.pickedVendor = false;
        this.pickedProduct = false;
        this.pickedQty = false;
        this.generated = true;
      },
    });
    this.formSubscription?.add(reportPo);
  } // createReport
  viewPdf(): void {
    window.open(`${PDFURL}${this.pono}`, '');
  } // viewPdf
} //PoGeneratorComponent
