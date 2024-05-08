import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { MatComponentsModule } from '../mat-components/mat-components.module';
import { VendorHomeComponent } from './vendor-home/vendor-home.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';

@NgModule({
  declarations: [
    VendorListComponent,
    VendorHomeComponent,
    VendorDetailsComponent,
  ],
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
})
export class VendorModule {}
