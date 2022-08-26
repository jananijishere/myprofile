import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalLoginRoutingModule } from './internal-login-routing.module';
import {InternalLoginComponent} from './internal-login.component';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [InternalLoginComponent],
  imports: [
    CommonModule,
    InternalLoginRoutingModule,
    SharedModule
  ]
})
export class InternalLoginModule { }
