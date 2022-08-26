import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignoutRoutingModule } from './signout-routing.module';
import { SignoutComponent } from './signout.component';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [SignoutComponent],
  imports: [
    CommonModule,
    SignoutRoutingModule,
    SharedModule
  ]
})
export class SignoutModule { }
