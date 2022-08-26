import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "./material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TogglePasswordFieldDirective } from "../directive/toggle-password-field.directive";
import { TranslateModule } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { CheckBoxComponent } from "./check-box/check-box.component";
import {
  FontAwesomeModule,
  FaIconLibrary,
} from "@fortawesome/angular-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { MyaccountNavbarComponent } from "../components/myaccount-navbar/myaccount-navbar.component";
import { RouterModule } from "@angular/router";
import { TextboxControlComponent } from "../components/textbox-control/textbox-control.component";

@NgModule({
  declarations: [
    TogglePasswordFieldDirective,
    CheckBoxComponent,
    MyaccountNavbarComponent,
    TextboxControlComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FontAwesomeModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TogglePasswordFieldDirective,
    CheckBoxComponent,
    MaterialModule,
    MyaccountNavbarComponent,
    TextboxControlComponent,
  ],
  providers: [CookieService],
})
export class SharedModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faCheck);
  }
}
