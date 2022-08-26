
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { PublicService } from '../../service/public.service';
import { FormService } from '../../service/form.service';
import { environment } from '../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public formModel: FormGroup;
  public aId: string = '';
  public tokenId: string;
  public tokenData: object;
  public login: string;
  public locale: string;
  public customToken: string;
  public tokenExpired: boolean = false;
  public confirmPasswordError: boolean = true;
  public eId: string = '';
  public showForm: boolean = true;
  public showLoader: boolean = false;
  public queryparams: string = '';
  public query: any;
  public encryptedEmailId: string;
  public sentSuccessfully: boolean = false;
  public password: boolean = false;
  public confirmPassword: boolean = false;
  public email: string;
  public localeInfo: string;
  public fromEP: boolean = false;
  public postData: object;
  public userId: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    public publicService: PublicService,
    private titleSet: Title,
    public translate: TranslateService
  ) {
    this.formModel = new FormGroup({
      password: new FormControl('', [
        Validators.required, Validators.minLength(8), Validators.maxLength(50)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required, Validators.minLength(8),
        Validators.maxLength(50)])
    }, { validators: this.revealedError });
  }
  ngOnInit() {
    this.tokenId = this.route.snapshot.params.token;
    this.route.queryParams.subscribe(params => {
      this.eId = params.eId;
      this.aId = params.aid || 'acom';
      this.query = { ...params };
      this.publicService.getAppInformation(this.aId);
      delete this.query.eId;
      //if(params.ep) {
      // if(this.publicService.ep) 
      //   this.fromEP = true;
      //   this.email = this.publicService.email;
      //   this.localeInfo = this.publicService.locale;
      //   this.userId = this.publicService.userId;
      //    delete this.publicService.email;
      //    delete this.publicService.locale;
      //    delete this.publicService.userId;
      // }
      //delete this.query.ep;
       this.queryparams = this.publicService.urlencode(this.query) ? `?${this.publicService.urlencode(this.query)}` : '';
    });
    if(this.publicService.ep) {
    this.fromEP = true;
    this.email = this.publicService.email;
    this.localeInfo = this.publicService.locale;
    this.userId = this.publicService.userId;
     delete this.publicService.email;
     delete this.publicService.locale;
     delete this.publicService.userId;
  }
  this.publicService.ep = false;
    this.titleSet.setTitle(this.translate.instant('LOGIN.TAB_TITLE'));
    this.validateToken();
  }
  validateToken() {

    this.tokenData = {
      token: this.tokenId,
      supplemental: true,
      passwordExpired: this.fromEP
    };
    
    this.formService.authToken(this.tokenData).subscribe(
      (response) => {
        const results: any = response;
        if (results && results.success) {
          const data = results.data;
          if(!this.fromEP) {
            if(data._embedded.user) {
            const user = data._embedded.user;
            this.login = user.profile.login;
          this.locale = user.profile.locale;
          }
        } else {
          this.login = this.email;
          this.locale = this.localeInfo;
        }
         this.customToken = data.customToken;
         this.showForm = false;
         this.showLoader = true;
        } else {
          this.tokenExpired = true;
        }
      },
      (error) => {
        this.tokenExpired = true;
      }
    );
  }
  fieldData(field: string) {
    return this.formModel.get(field);
  }
  revealedError: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value === confirmPassword.value) {
      this.confirmPasswordError = false;
    } else {
      this.confirmPasswordError = true;
    }
    return password && confirmPassword && password.value === confirmPassword.value ? null : { different: true };
  }
  onSubmit() {
    if (this.formModel.valid) {
      this.publicService.showLoading();
      if(this.fromEP) {
     this.postData = {
        profile: {
          ForgotPassword: true,
          locale: this.locale,
          sendEmailFlag: false
         },
        uId: this.userId,
        customToken: this.customToken,
        credentials: {
          password: {
            value: this.formModel.value.password
          }
        }
      };
    } else {
      this.postData = {
        profile: {
          ForgotPassword: true,
          locale: this.locale,
          sendEmailFlag: false,
          encryptFlag: true
        },
        userName: this.eId,
        customToken: this.customToken,
        credentials: {
          password: {
            value: this.formModel.value.password
          }
        }
      };
    }
      this.formService.resetPassword(this.postData).subscribe((res) => {
        res.status = 200;
        this.publicService.showLoading(res);
        if (res.success) {
          if (this.publicService.appInfo.redirect && this.publicService.appInfo.redirect === "true") {
            window.location.href = `${this.publicService.appInfo.redirectURI}`;
          } else {
            if (this.publicService.appInfo.messages && this.publicService.appInfo.messages.success && this.publicService.appInfo.messages.success.resetPassword) {
              this.query.rp = 1;
            }
            this.router.navigate(['/'], { queryParams: { ...this.query } });
          }
        }
      }, (error) => {
        this.publicService.showLoading(error);
      });
    } else {
      this.publicService.validateAllFormFields(this.formModel);
    }
  }
  resendEmail() {
    this.encryptedEmailId = this.eId !== '' ? decodeURIComponent(this.eId) : '';
    const postData = {
      encryptedEmailId: this.encryptedEmailId,
      sendEmail: true,
      aId: this.aId,
      query: { ...this.query },
      localeId: this.publicService.responseLocale
    };
    this.showLoader = true;
    delete postData.query.aid;
    this.publicService.showLoading();
    this.formService.forgotPasswordPost(postData)
      .subscribe(
        (res) => {
          res.status = 200;
          this.publicService.showLoading(res);
          if (res.success) {
            this.sentSuccessfully = true;
          }
        },
        (error) => {
          this.publicService.showLoading(error);
        }
      );
  }
  /**
   * USe to hide/show password based on thee key passed
   * @param pwdShow 
   */
  showPassword(pwdShow) {
    this[pwdShow] = !this[pwdShow];
    const doc = document.getElementById(pwdShow);
    if (this[pwdShow]) {
      doc.setAttribute('type', 'text');
    } else {
      doc.setAttribute('type', 'password');
    }
  }
}
