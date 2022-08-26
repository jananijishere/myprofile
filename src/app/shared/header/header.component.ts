import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormService } from "src/app/service/form.service";
import { LoginService } from "src/app/service/login-service.service";
import { environment } from "../../../environments/environment";
import { PublicService } from "../../service/public.service";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  public homeURL: string;
  public aId: string = "";
  public showSignOutButton: Boolean = false;
  public showMyProfile: Boolean = false;
  username: string;
  public initialName: string = "";
  public firstName: any;
  public lastName: any;
  constructor(
    private route: ActivatedRoute,
    public publicService: PublicService,
    public loginService: LoginService,
    public formService: FormService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.aId = params.aid || "acom";
    });
  }

  ngOnInit() {
    this.homeURL = environment.homeURL || "https://www.agilent.com";
    this.publicService.showSignOutButton.subscribe((event) => {
      this.showSignOutButton = event;
    });
    this.publicService.showMyProfile.subscribe((event) => {
      this.showMyProfile = event;
    });

    this.loginService.agsessioncheck().subscribe((res) => {
      if (res.agsessionme === "true") {
        this.loginService.sessionme().subscribe((res1) => {
          if (res1.login) {
            //   const userData = {
            //    email: res1.login
            // };
            this.formService.createUserlogin(res1.login).subscribe((res2) => {
              if (res2.success) {
                this.firstName = res2.data.firstName;
                this.lastName = res2.data.lastName;
                this.initialName =
                  res2.data.firstName[0] + res2.data.lastName[0];
              }
            });
          }
        });
        // https://dev-login.agilent.com/api/v1/sessions/me
      } else {
        this.publicService.showErrorpage();
      }
    });
  }
}
