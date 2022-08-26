import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NotVerifiedComponent } from '../not-verified/not-verified.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    LoginComponent,
    NotVerifiedComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    SharedModule,
    FontAwesomeModule
  ],
  exports: []
})
export class LoginModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faCheck);
    library.addIcons(faEyeSlash);
    library.addIcons(faEye);
  }

 }
