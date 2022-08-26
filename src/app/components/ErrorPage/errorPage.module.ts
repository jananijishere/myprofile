import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorPageRoutingModule } from './errorPage-routing.module';
import { ErrorPageComponent } from './errorPage.component';

import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [ErrorPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    ErrorPageRoutingModule
  ]
})
export class ErrorPageModule { }
