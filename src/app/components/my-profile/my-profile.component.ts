import { StringMapWithRename } from "@angular/compiler/src/compiler_facade_interface";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormService } from "src/app/service/form.service";
import { LoginService } from "src/app/service/login-service.service";
import { PublicService } from "src/app/service/public.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class MyProfileComponent implements OnInit {
  public showProfileDefaultPage: boolean = true;
  public profileSubmitBtnText: string;
  showProfile: boolean = false;
  public profileDetail: any = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    country: "",
    company: "",
    accountCreationDate: "",
  };
  public addprofileDetailsForm: FormGroup;
  public postData: any;
  public setfromURI: string;
  public progEmail: string;
  public encryptedValue: any;
  public translateArray: Array<string>;
  profileTranslate: any;
  constructor(
    public publicService: PublicService,
    public loginService: LoginService,
    public formService: FormService,
    public router: Router,
    private translate: TranslateService
  ) {
    this.translateArray = ["LOGIN"];
    this.translate.get(this.translateArray).subscribe((res) => {
      console.log(res);
      this.profileTranslate = {
        firstName: res.LOGIN.FIRSTNAME,
        lastName: res.LOGIN.LASTNAME,
        email: res.LOGIN.EMAIL,
        phoneNumber: res.LOGIN.PHONENUMBER,
        country: res.LOGIN.COUNTRY,
        company: res.LOGIN.COMPANY,
        accountCreationDate: res.LOGIN.ACCOUNTCREATIONDATE,
        emailHint: res.LOGIN.EMAILHELPTEXT,
        companyHint: res.LOGIN.COMPANYHELPTEXT,
        countryHint: res.LOGIN.COUNTRYHELPTEXT,
        accountCreationDateHint: res.LOGIN.ACCOUNTCREATIONDATEHELPTEXT,
        // emailHint: res.myprofile.contactAgilent,
        // successProfile: res.myprofile.successProfile,
        // companyNameHint: res.myprofile.changecompName,
        // saveChanges: res.common.saveChanges,
        // savingChanges: res.common.savingChanges,
        // firstNameReq: res.validators.firstNameReq,
        // lastNameReq: res.validators.lastNameReq
      };
      console.log(res.LOGIN.FIRSTNAME);
    });
    this.publicService.showMyProfileIcon(true);
    this.addprofileDetailsForm = new FormGroup({
      firstName: new FormControl(""),
      lastName: new FormControl(""),
      phoneNumber: new FormControl(""),
      email: new FormControl(""),
      country: new FormControl(""),
      company: new FormControl(""),
      accountCreationDate: new FormControl(""),
    });
  }

  ngOnInit() {
    this.loginService.agsessioncheck().subscribe((res) => {
      if (res.agsessionme === "true") {
        this.showProfile = true;
        this.loginService.sessionme().subscribe((res1) => {
          if (res1.login) {
            //   const userData = {
            //email: res1.login
            // };
            const encryptEmail = {
              string: [res1.login],
              base64Decode: false,
            };
            this.formService.encrypt(encryptEmail).subscribe((response) => {
              const results: any = response;
              if (results.success) {
                if (results.data.string[0] !== null) {
                  this.encryptedValue = results.data.string[0];
                  let email = this.encryptedValue
                    ? decodeURIComponent(this.encryptedValue)
                    : "";
                  if (email && email.indexOf(" ") > -1) {
                    email = email.replace(/ /g, "+");
                  }

                  // const postData = {
                  //   string: [this.encryptedValue],
                  //   base64Decode: false,
                  // };
                  // this.formService
                  //   .decryptEmailAndUserId(postData)
                  //   .subscribe((response) => {
                  //     const results: any = response;
                  //     {
                  //       console.log(response);
                  //       if (results.success) {
                  //         if (results.data.string[0] !== null) {
                  //           this.progEmail = results.data.string[0];
                  //         }
                  //       }
                  //     }
                  //   });
                }
              }
            });

            this.formService.createUserlogin(res1.login).subscribe((res2) => {
              if (res2.success) {
                this.profileDetail = {
                  firstName: res2.data.firstName,
                  lastName: res2.data.lastName,
                  phoneNumber: res2.data.mobilePhone,
                  email: res2.data.login,
                  country: res2.data.country,
                  company: res2.data.company,
                  accountCreationDate: res2.data.created,
                };
              }
            });
          }
        });
        // https://dev-login.agilent.com/api/v1/sessions/me
      } else {
        this.showProfile = false;
        console.log("show hellllllo page");
        this.publicService.showErrorpage();
      }
    });
  }
  showDefaultProfile() {
    this.showProfileDefaultPage = !this.showProfileDefaultPage;
  }
  editBtnClicked() {
    this.showProfileDefaultPage = !this.showProfileDefaultPage;
    this.addprofileDetailsForm
      .get("firstName")
      .setValue(this.profileDetail.firstName);
    this.addprofileDetailsForm
      .get("lastName")
      .setValue(this.profileDetail.lastName);
    this.addprofileDetailsForm
      .get("phoneNumber")
      .setValue(this.profileDetail.phoneNumber);
    this.addprofileDetailsForm.get("email").setValue(this.profileDetail.email);
    this.addprofileDetailsForm
      .get("company")
      .setValue(this.profileDetail.company);
    this.addprofileDetailsForm
      .get("country")
      .setValue(this.profileDetail.country);
    this.addprofileDetailsForm
      .get("accountCreationDate")
      .setValue(this.profileDetail.accountCreationDate);
  }
  saveChanges() {
    this.postData = {
      userName: this.encryptedValue,
      profile: {
        firstName: this.addprofileDetailsForm.get("firstName").value,
        lastName: this.addprofileDetailsForm.get("lastName").value,
        phoneNumber: this.addprofileDetailsForm.get("phoneNumber").value,
      },
    };
    this.profileDetail.firstName =
      this.addprofileDetailsForm.get("firstName").value;
    this.profileDetail.lastName =
      this.addprofileDetailsForm.get("lastName").value;
    this.profileDetail.phoneNumber =
      this.addprofileDetailsForm.get("phoneNumber").value;

    this.formService.setAddress(this.postData).subscribe(
      (res) => {
        this.publicService.showLoading(res);
        if (res.success) {
        }
      },
      (error) => {}
    );
    this.showProfileDefaultPage = !this.showProfileDefaultPage;
  }
}
