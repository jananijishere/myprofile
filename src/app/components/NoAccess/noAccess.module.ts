import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoAccesstRoutingModule } from './noAccess-routing.module';
import {NoAccessComponent} from './noAccess.component';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [NoAccessComponent],
  imports: [
    CommonModule,
    NoAccesstRoutingModule,
    SharedModule
  ]
})
export class NoAccessModule { }
