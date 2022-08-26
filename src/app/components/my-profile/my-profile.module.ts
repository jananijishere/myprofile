import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { MyProfileRoutingModule } from "./my-profile.routing.module";
import { MyProfileComponent } from "./my-profile.component";
//import { MyaccountNavbarComponent } from "../myaccount-navbar/myaccount-navbar.component";
@NgModule({
  declarations: [MyProfileComponent],
  imports: [CommonModule, SharedModule, MyProfileRoutingModule],
})
export class MyProfileModule {}
