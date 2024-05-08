import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VendorHomeComponent } from './vendor/vendor-home/vendor-home.component';
import { ProductHomeComponent } from './product/product-home/product-home.component';
import { PogeneratorComponent } from '@app/po/pogenerator/pogenerator.component';
import { PoViewerComponent } from './po/po-viewer/po-viewer.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'CaseStudy - Home' },
  {
    path: 'vendors',
    component: VendorHomeComponent,
    title: 'CaseStudy - Vendors',
  },
  {
    path: 'products',
    component: ProductHomeComponent,
    title: 'CaseStudy - Products',
  },
  { path: '', component: HomeComponent, title: 'CaseStudy - Home' },
  { path: 'generator', component: PogeneratorComponent },
  { path: 'po-viewer', component: PoViewerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
