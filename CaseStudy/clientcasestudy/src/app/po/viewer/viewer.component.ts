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
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  //styles: [],
})
export class ViewerComponent implements OnInit, OnDestroy {
  // form
  viewerForm: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  poid: FormControl;
  //qty: FormControl;
  // data
  formSubscription?: Subscription;
  products: Product[] = []; // everybody's products
  vendors: Vendor[] = []; // all vendors
  //vendorproducts: Product[] = []; // all products for a particular vendor
  vendorPo: Po[] = [];
  items: PoItem[] = []; // product items that will be in po
  selectedproducts: Product[] = []; // products that being displayed currently in app
  purchaseorders?: Po[]; //purchase order for selected vendor
  reportPO?: Po[];
  //selectedProduct: Product; // the current selected product
  selectedPO: Po;
  selectedVendor: Vendor; // the current selected vendor
  //selectedQty: string;
  // misc
  pickedProduct: boolean;
  pickedVendor: boolean;
  //pickedQty: boolean;
  pickedPO: boolean;
  hasPOs: boolean;
  generated: boolean;
  hasProducts: boolean;
  msg: string;
  total: number;
  pono: number = 0; //Report Number
  //qtyItems: any[];
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
    this.pickedPO = false;
    this.hasPOs = false;
    //this.pickedQty = false;
    this.generated = false;
    this.msg = '';
    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.poid = new FormControl('');
    //this.qty = new FormControl('');
    this.viewerForm = this.builder.group({
      productid: this.productid,
      vendorid: this.vendorid,
      poid: this.poid,
      //qty: this.qty,
    });
    this.selectedPO = {
      id: 0,
      vendorid: 0,
      items: [],
      amount: 0,
      podate: '',
    };
    /*this.selectedProduct = {
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
    };*/
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
    this.msg = '';
    this.vendorid = new FormControl('');
    this.poid = new FormControl('');
    this.viewerForm = this.builder.group({
      vendorid: this.vendorid,
      poid: this.poid,
    });
    this.onPickVendor(); // sets up subscription for dropdown click
    this.onPickPO(); // sets up subscription for dropdown click
    //this.onPickEOQ(); //drop down for the EOQ
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
  loadVendorPO(): void {
    this.vendorPo = [];
    this.poService.getSome(this.selectedVendor.id).subscribe({
      // observer object
      next: (po: Po[]) => {
        this.vendorPo = po;
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
    this.formSubscription = this.viewerForm
      .get('vendorid')
      ?.valueChanges.subscribe((val) => {
        this.selectedPO = {
          id: 0,
          vendorid: 0,
          items: [],
          amount: 0,
          podate: '',
        };
        this.selectedVendor = val;
        this.loadVendorPO();
        this.pickedProduct = false;
        this.pickedPO = false;
        this.hasProducts = false;
        this.hasPOs = false;
        this.msg = `${this.selectedPO.id} Po's for ${this.selectedVendor.name}`;
        this.pickedVendor = true;
        this.generated = false;
        this.items = []; // array for the report
        //this.selectedproducts = []; // array for the details in app html
      });
  } // onPickVendor

  /**
   * onPickedPO - subscribe to the select change event then
   * update array containing items.
   */
  onPickPO(): void {
    const xSubscr = this.viewerForm
      .get('poid')
      ?.valueChanges.subscribe((val) => {
        this.total = 0;
        this.selectedPO = val;
        // retrieve just the expenses in the report
        if (this.purchaseorders !== undefined) {
          this.reportPO = this.purchaseorders.filter((po) =>
            this.selectedPO?.items.some((item) => item.id === po.id)
          );
        }

        this.selectedPO.items.forEach(
          (sub) => (this.sub += sub.qty * sub.price)
        );
        this.selectedPO.items.forEach(
          (tax) => (this.tax += tax.qty * tax.price * 0.13)
        );
        this.selectedPO.items.forEach(
          (total) => (this.total += total.qty * total.price * 1.13)
        );
        this.hasPOs = true;
      });
    this.formSubscription?.add(xSubscr); // add it as a child, so all can be destroyed together
  } // onPickedPO

  viewPdf(): void {
    window.open(`${PDFURL}${this.pono}`, '');
  } // viewPdf
}
