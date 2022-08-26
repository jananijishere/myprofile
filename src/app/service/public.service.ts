import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormService } from './form.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PublicService {
  public appInfo: any;
  public showLoader = false;
  public timeOut: any;
  public responseLocale: string = '';
  public regExp = new RegExp('-', 'g');
  public oktaAuthN: string;
  public sessionMe: string;
  public oktaAuthorizeURL: string;
  public products: string;
  public internalLogin: string;
  public createAccountURL: string;
  public authProto: string;
  public relayState: string;
  public samlURL: string;
  public loginURL:string;
  public openSourceSoftwareNotice: string;
  public showCreateAccount=new BehaviorSubject<boolean>(false);
  public appInfoLoadComplete =new BehaviorSubject(false);
  public googleAnalyticsId: string;
  public samlSignout: boolean;
  public localizedApp: string;
  public eid: string;
  public email: string;
  public locale: string;
  public userId: string;
  public ep: boolean = false;
  public customerSupportNumber: string;
  public customerSupportEmail: string;
  public signOutButton: boolean = false;
  public myProfile: boolean = false;
  public clcAids: any;
  public showSignOutButton: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public showMyProfile: BehaviorSubject<boolean> = new BehaviorSubject(false);
 constructor(
    private formService: FormService,
    private translate: TranslateService,
    private router: Router
  ) { }
  getAppInformation(aid = 'acom') {
    if(!this.appInfo){
      this.formService.getAppInfo(aid).subscribe((res) => {
        this.setAppInformation(res);
      }, (error) => {
        this.showLoading(error);
      });
    }else{
      const oktaBaseUrl = this.appInfo['oktaBaseUrl'];
      const subContext = this.appInfo['subContext'];
      this.loginURL=`${oktaBaseUrl}/login`
      this.oktaAuthN = `${oktaBaseUrl}${environment.oktaAuthN}`;
      this.sessionMe = `${oktaBaseUrl}${environment.sessionMe}`;
      this.products = `${subContext}${environment.products}`;
      this.createAccountURL = `${subContext}${environment.createAccountURL}`;
      this.internalLogin = `${subContext}${environment.internalLogin}`;
      this.oktaAuthorizeURL = `${oktaBaseUrl}${environment.oktaAuthorizeURL}`;
      this.authProto =this.appInfo['authProto'] || 'oidc';
      this.relayState=this.appInfo['relayState'] || '';
      this.samlURL=this.appInfo['samlURL'] || '';
      this.openSourceSoftwareNotice = this.appInfo['openSourceSoftwareNotice'] || '';
      this.googleAnalyticsId = this.appInfo['googleAnalyticsId'];
      this.samlSignout=this.appInfo['samlSignout'];
      this.customerSupportNumber = this.appInfo["customerSupportNumber"];
      this.customerSupportEmail = this.appInfo['customerSupportEmail'];
      this.clcAids = this.appInfo['clcAids'];
      this.updatedDataLoading(true);
      if(this.appInfo.createAccountURL && this.appInfo.createAccountURL != '#'){
        this.setShowCreateAccount(true);
      }
    }
  }
  setAppInformation(res) {
    this.appInfo = {
      ...res.data,
      customerSupportTel: res.data.customerSupportNumber.replace(this.regExp, '')
    };
    const oktaBaseUrl = this.appInfo['oktaBaseUrl'];
    const subContext = this.appInfo['subContext'];
    this.loginURL=`${oktaBaseUrl}/login`
    this.oktaAuthN = `${oktaBaseUrl}${environment.oktaAuthN}`;
    this.sessionMe = `${oktaBaseUrl}${environment.sessionMe}`;
    this.products = `${subContext}${environment.products}`;
    this.createAccountURL = `${subContext}${environment.createAccountURL}`;
    this.internalLogin = `${subContext}${environment.internalLogin}`;
    this.oktaAuthorizeURL = `${oktaBaseUrl}${environment.oktaAuthorizeURL}`;
    this.authProto =this.appInfo['authProto'] || 'oidc';
    this.relayState=this.appInfo['relayState'] || '';
    this.samlURL=this.appInfo['samlURL'] || '';
    this.openSourceSoftwareNotice = this.appInfo['openSourceSoftwareNotice'] || '';
    this.googleAnalyticsId = this.appInfo['googleAnalyticsId'];
    this.samlSignout=this.appInfo['samlSignout'];
    this.customerSupportNumber = this.appInfo["customerSupportNumber"];
    this.customerSupportEmail = this.appInfo['customerSupportEmail'];
    this.updatedDataLoading(true);
    if(this.appInfo.createAccountURL && this.appInfo.createAccountURL != '#'){
      this.setShowCreateAccount(true);
    }
  }
  updatedDataLoading(data: boolean){
    this.appInfoLoadComplete.next(data);
  }
  setShowCreateAccount(value){
      this.showCreateAccount.next(value);
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  showLoading(state: any = 0) {
    const status = state.status || 0;
    switch (status) {
      case 0:
        this.showTimeOut();
        break;
      case 200:
        this.showLoader = false;
        clearTimeout(this.timeOut);
        state.success === !1 && this.isNotServerError(state.error.code) ? this.showErrorpage() : '';
        break;
      default:
        this.showLoader = false;
        clearTimeout(this.timeOut);
        this.isNotServerError(status) ? this.showErrorpage() : '';
        break;
    }
  }
  isNotServerError(status) {
    const firstNumber = status.toString().substring(0, 1);
    return (firstNumber === '5' || firstNumber === '4');
  }
  showTimeOut() {
    this.timeOut = setTimeout(() => { this.showLoader = true; }, 1000);
  }
  showErrorpage() {
    this.router.navigate(['/errorpage']);
  }
  urlencode(parmas: object) {
    return Object.keys(parmas).map(key => `${key}=${encodeURIComponent(parmas[key])}`).join('&');
  }
  responseToJson(str: string) {
    let res = '';
    if (!str) { return res; }
    const resStr = str.split(',');
    resStr.forEach((i) => {
      const arr = i.split('=');
      if (arr[0] === 'country_code') {
        res = arr[1];
      }
    });
    return res;
  }
  setLang(lang) {
    if (lang) {
      this.translate.use(lang).subscribe((res) => {
      }, (err) => {
        this.translate.use('en_US');
      });
    } else {
      this.translate.use(this.responseLocale);
    }
  }
  toggleSignOutButton(value) {
    this.signOutButton = value;
    this.showSignOutButton.next(this.signOutButton);
  }
  showMyProfileIcon(value) {
    this.myProfile = value;
    this.showMyProfile.next(this.myProfile);
  }
}
