import { Component, OnInit } from '@angular/core';
import { Vendor } from '../vendor';
import { NewVendorService } from '../newvendor.service';
@Component({
  templateUrl: 'vendor-home.component.html',
})
export class VendorHomeComponent implements OnInit {
  msg: string;
  vendor: Vendor;
  vendors: Vendor[] = [];
  hideEditForm: boolean;
  todo: string;

  constructor(public newvendorService: NewVendorService) {
    this.vendor = {
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
    this.msg = '';
    this.hideEditForm = true;
    this.todo = '';
  } // constructor

  ngOnInit(): void {
    this.getAll();
  } // ngOnInit
  select(vendor: Vendor): void {
    this.todo = 'update';
    this.vendor = vendor;
    this.msg = `${vendor.name} selected`;
    this.hideEditForm = !this.hideEditForm;
  } // select
  /**
   * cancelled - event handler for cancel button
   */
  cancel(msg?: string): void {
    msg ? (this.msg = 'Operation cancelled') : null;
    this.hideEditForm = !this.hideEditForm;
  } // cancel
  /**
   * update - send changed update to service
   */
  update(vendor: Vendor): void {
    this.newvendorService.update(vendor).subscribe({
      // Create observer object
      next: (vnd: Vendor) => (this.msg = `Vendor ${vnd.name} updated!`),
      error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } // update
  /**
   * getAll - retrieve everything
   */
  getAll(passedMsg: string = ''): void {
    this.newvendorService.getAll().subscribe({
      // Create observer object
      next: (vnd: Vendor[]) => {
        this.vendors = vnd;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get vendors - ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Vendors loaded!`),
    });
  } // getAll

  /**
   * save - determine whether we're doing and add or an update
   */
  save(vendor: Vendor): void {
    vendor.id ? this.update(vendor) : this.add(vendor);
  } // save
  /**
   * add - send vendor to service, receive new vendor back
   */
  add(vendor: Vendor): void {
    vendor.id = 0;
    this.newvendorService.create(vendor).subscribe({
      // Create observer object
      next: (vnd: Vendor) => {
        this.msg = `Vendor ${vnd.id} added!`;
      },
      error: (err: Error) => (this.msg = `Vendor not added! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } // add
  /**
   * delete - send vendor id to service for deletion
   */
  delete(vendor: Vendor): void {
    this.newvendorService.delete(vendor.id).subscribe({
      // Create observer object
      next: (numOfVendorsDeleted: number) => {
        let msg: string = '';
        numOfVendorsDeleted === 1
          ? (this.msg = `Vendor ${vendor.name} deleted!`)
          : (this.msg = `vendor ${vendor.name} not deleted`);
        this.getAll(msg);
      },
      error: (err: Error) => (this.msg = `Delete failed! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } // delete
  /**
   * newVendor - create new vendor instance
   */
  newVendor(): void {
    this.vendor = {
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
    this.hideEditForm = !this.hideEditForm;
    this.msg = 'New Vendor';
  } // newVendor
} // VendorHomeComponent
