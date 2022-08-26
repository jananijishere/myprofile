import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { Config } from "protractor";
@Injectable({
  providedIn: "root",
})
export class FormService {
  //public apiBasePath = '/clc/identity/api/v1';
  //public apiBasePath = '/sso/identity/api/v1';
  public apiBasePath =
    "https://dev-register.agilent.com/account/identity/api/v1";
  //public apiBasePath = "/account/identity/api/v1";
  public daApi = "https://dev-register.agilent.com/dadmin/api/v1";
  //public daApi = "/dadmin/api/v1";
  public createUserUrl = `${this.apiBasePath}/users`;
  public countriesUrl = `${this.apiBasePath}/countries`;
  public forgotPasswordUrl = `${this.apiBasePath}/users/forgot-password`;
  public authTokenUrl = `${this.apiBasePath}/auth/token`;
  public resetPasswordUrl = `${this.apiBasePath}/users/reset-password`;
  public setPasswordUrl = `${this.apiBasePath}/users/set-password`;
  public createTokenUrl = `${this.apiBasePath}/create-token`;
  public reactivate = `${this.apiBasePath}/users/reactivate`;
  public sendemailSupport = `${this.apiBasePath}/sendemail/ise/support`;
  public encryptedEmail = `${this.apiBasePath}/users/resend/email`;
  public appInfoUrl = `${this.apiBasePath}/app/info?aId=`;
  public accessUrl = `${this.apiBasePath}/users/request/access`;
  public getHeader = `${this.apiBasePath}/req-header`;
  public getUserUrl = `${this.apiBasePath}/users/search`;
  public encryptUrl = `${this.apiBasePath}/encrypt`;
  public authcodeUrl = `${this.apiBasePath}/users/login/authcode`;
  public requestUrl = `${this.daApi}/application/request-access`;
  public setAddressUrl = `${this.apiBasePath}/users/set-address`;
  public decryptemailanduserid = `${this.apiBasePath}/decrypt`;

  constructor(private http: HttpClient) {}
  // 创建用户
  createUser(postData: object) {
    return this.http.post<any>(this.createUserUrl, postData);
  }
  // 获取conturies;
  getCountries(): Observable<HttpResponse<Config>> {
    return this.http.get<Config>(this.countriesUrl, { observe: "response" });
  }
  getAppInfo(clc: any) {
    return this.http.get<any>(`${this.appInfoUrl}${clc}`);
  }
  isUserExist(postData) {
    // return this.http.get<any>(`${this.getUserUrl}${data}`)
    return this.http.post<any>(this.getUserUrl, postData);
  }
  getConfigResponse() {
    return this.http.get<Config>(`${this.getHeader}`, { observe: "response" });
  }
  createUserlogin(postData: object) {
    return this.http.get<any>(`${this.createUserUrl}?email=${postData}`);
  }
  createToken() {
    return this.http.get<any>(this.createTokenUrl);
  }
  authToken(postData) {
    return this.http.post<any>(this.authTokenUrl, postData);
  }
  setPassword(postData: object) {
    return this.http.post<any>(this.setPasswordUrl, postData);
  }
  resetPassword(postData) {
    return this.http.post<any>(this.resetPasswordUrl, postData);
  }
  resendEmailPost(postData: object) {
    return this.http.post<any>(this.reactivate, postData);
  }
  sendemailSupportPost(postData: object) {
    return this.http.post<any>(this.sendemailSupport, postData);
  }
  encryptedEmailPost(postData: object) {
    return this.http.post<any>(this.encryptedEmail, postData);
  }
  encrypt(postData: object) {
    return this.http.post<any>(this.encryptUrl, postData);
  }
  authCode(postData) {
    return this.http.post<any>(this.authcodeUrl, postData);
  }
  accessPost(postData: object) {
    return this.http.post<any>(this.accessUrl, postData);
  }
  forgotPasswordPost(postData: object) {
    return this.http.post<any>(this.forgotPasswordUrl, postData);
  }
  requestStatusPost(postData: object) {
    return this.http.post<any>(this.requestUrl, postData);
  }
  setAddress(postData: object) {
    return this.http.post<any>(this.setAddressUrl, postData);
  }
  decryptEmailAndUserId(postData) {
    return this.http.post<any>(this.decryptemailanduserid, postData);
  }
}
