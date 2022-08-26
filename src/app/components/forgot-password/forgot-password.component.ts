import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PublicService } from '../../service/public.service';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../service/form.service';
import {GoogleAnalyticsService} from '../../service/google-analytics.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {
  public successReq: boolean = false;
  public registeredEmail: boolean = false;
  public sentSuccessfully: boolean = false;
  public formModel: FormGroup;
  public queryparams: string = '';
  public aId: string = '';
  public query: object;
  public sentResendSuccessfully: boolean = false;
  public showText: boolean = false;
  public usrId: string;
  public emailId: string;
  public emailIdMasked: string;
  public queryFP: any;
  public deLocale: boolean = false;
  public itLocale: boolean = false;
  public frLocale: boolean = false;
  public esLocale: boolean = false;
  public ptLocale: boolean = false;
  public cnLocale: boolean = false;
  public jpLocale: boolean = false;
  public krLocale: boolean = false;
  public externalUser: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private formService: FormService,
    public publicService: PublicService,
    public googleAnalyticsService: GoogleAnalyticsService,
    private titleSet: Title,
    public translate: TranslateService
  ) {
    this.formModel = new FormGroup({
      email: new FormControl('')
    });
    this.route.queryParams.subscribe((params) => {
      this.aId = params.aid || 'acom';
      this.query = params;
      this.queryFP = { ...params };
      // this.publicService.getAppInformation(params.aid);
      this.formService.getAppInfo(this.aId).subscribe((res) => {
        this.publicService.setAppInformation(res);
        this.googleAnalyticsService.addDatalayer('forgotPasswordLinkClick', 'login', 'Forgot Password?', 0);
      }, (error) => {
        this.publicService.showLoading(error);
      });
    });
    this.titleSet.setTitle(this.translate.instant('LOGIN.TAB_TITLE'));
  }
  ngOnInit() {  if(this.publicService.responseLocale === 'de_DE') {
    this.deLocale = true;
  } else if(this.publicService.responseLocale === 'it_IT') {
    this.itLocale = true;
  }else if(this.publicService.responseLocale === 'fr_FR') {
    this.frLocale = true;
  } else if(this.publicService.responseLocale === 'es_ES') {
    this.esLocale = true;
  }else if(this.publicService.responseLocale === 'pt_BR') {
    this.ptLocale = true;
  } else if(this.publicService.responseLocale === 'zh_CN') {
    this.cnLocale = true;
  } else if(this.publicService.responseLocale === 'ja_JP') {
    this.jpLocale = true;
  } else if(this.publicService.responseLocale === 'ko_KR') {
    this.krLocale = true;
  }
    //this.googleAnalyticsService.eventEmitter('forgotPasswordLinkClick', 'login', 'Forgot Password?', 0);
    //this.googleAnalyticsService.addDatalayer('forgotPasswordLinkClick', 'login', 'Forgot Password?', 0);
    this.hideErrorInfo();
   }
   hideErrorInfo() {
    this.formModel.valueChanges.subscribe(() => {
     // this.successReq = true;
      this.showText = false;
      this.sentResendSuccessfully = false;
    });
  }

  forgotPassword(flag) {
    let email = this.formModel.get('email').value;
    const domain = email.split('@')[1].toLowerCase();
    if (this.publicService.appInfo.internalDomains) {
      if(this.publicService.appInfo.internalDomains.includes(domain)){
        this.externalUser = false;
      } else {
        this.externalUser = true;
      }
    }else{
    if (email.toLowerCase().includes('agilent.net') || email.toLowerCase().includes('agilent.com')) {
      this.externalUser = false;
    } else {
      this.externalUser = true;
    }
  }
    if(flag == true) {
      //this.googleAnalyticsService.eventEmitter('resendEmailLinkClick', 'login', 'resend the verification email', 0);
      this.googleAnalyticsService.addDatalayer('resendEmailLinkClick', 'login', 'resend the verification email', 0);
    }
    const postData = {
      ...this.formModel.value,
      aId: this.aId,
      query: {
        ...this.query
      },
      localeId: this.publicService.responseLocale
    };
    delete postData.query.aid;
    if (this.formModel.valid) {
      this.publicService.showLoading();
      this.formService.forgotPasswordPost(postData).subscribe(res => {
       // res.status = 200;
        this.successReq ? this.sentSuccessfully = true : null;
        if (res.success === !1 && (res.error.code === 404 ||  res.error.code === 403)) {
          this.successReq = true;
          if(res.status === "PROVISIONED") {
            if(this.queryFP.aid) {
              delete this.queryFP.aid;
            }
            this.showText = true;
            this.emailId = this.formModel.get("email").value
            this.emailIdMasked = this.textSub(`${this.emailId}`);
            this.usrId = res.userId;
            this.successReq = false;
            this.resendEmail();
           }
           res.status = 200;
          this.publicService.showLoading({ status: 200 });
        } else {
          this.publicService.showLoading(res);
          this.successReq = true;
        }
      }, (error) => {
        this.publicService.showLoading(error);
      });
    } else {
      this.googleAnalyticsService.addDatalayer('formError', 'login', 'Required field', 0);
      this.publicService.validateAllFormFields(this.formModel);
    }
  }
  fieldData(field: string) {
    return this.formModel.get(field);
  }
  
  resendEmail(){
    this.publicService.showLoading();
    let postData;
     if(this.aId !== 'fp') {
      postData = {
      aId: this.aId,
      userId: this.usrId,
      localeId: this.publicService.responseLocale,
      profile: {
      email: this.formModel.get("email").value,
      query: {
      ...this.queryFP
      }
      }
      };
      }
      else {
      postData = {
      aId: this.aId,
      userId: this.usrId,
      emailUI: true,
      localeId: this.publicService.responseLocale,
      profile: {
      email: this.formModel.get("email").value,
      query: {
      ...this.queryFP
      }
      }
      };
      }

    this.formService.resendEmailPost(postData)
      .subscribe(
        (res) => {
          res.status = 200;
          this.showText = true;
          this.googleAnalyticsService.addDatalayer('Resend Account confirmation Email Success', 'Account confirmation', 'Button Click', 0);
          this.publicService.showLoading(res);
          // if (res.messageId) {
          //   this.sentResendSuccessfully = true;
          // }
        },
        (error) => {
          this.publicService.showLoading(error);
          this.googleAnalyticsService.addDatalayer('Resend Account confirmation Email Error', 'Account confirmation', 'Button Click', 0);
        }
      );
      // delete this.publicService.showlink;
      // delete this.publicService.usrId;
      // delete this.publicService.emailId;
  }
  textSub(result) {
    let index = result.lastIndexOf("@");
    var subBefore = result.substring(1, index);
    var subTitle = result.substring(0, 1);
    var subBack = result.substring(index, result.length);
    var subStr = subTitle + '...' + subBack;
    return subStr;
  }
}
