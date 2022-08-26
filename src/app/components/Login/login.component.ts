import { Constants } from 'src/app/utils/constants';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../service/login-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicService } from '../../service/public.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { FormService } from 'src/app/service/form.service';
import { CryptoUtil } from 'src/app/utils/CryptoUtil'
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GoogleAnalyticsService } from '../../service/google-analytics.service';
import { CookieService } from 'ngx-cookie-service';
import { timeStamp } from 'console';

declare global {
  interface Window { dataLayer: any; }
}
window.dataLayer = window.dataLayer || [];
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public formModel: FormGroup;
  public loginFailed: boolean = false;
  public accountLocked: boolean = false;
  public externalUser: boolean = true;
  public loading: boolean = false;
  public lgt: string;
  public isLgt: boolean = false;
  public state: string = '';
  public challengeCode: string = '';
  public aId: string = '';
  public nonce: string = '';
  public redirectURI: string = '';
  public clientId: string = 'clientId';
  public scope: string = 'scope';
  public adfsIssuer: string = 'adfsIssuer';
  public redURIDef = 'redirectURI';
  public queryparams: string = '';
  public isMYA: boolean = false;
  public isUserName: boolean = false;
  public paramsObject: any;
  public fromURI: any;
  public isSSO: boolean = false;
  public showErrorInfo: boolean = false;
  public createAccountURL: string = this.publicService.createAccountURL;
  public registeredNotConfirmed: boolean = false;
  public encryptedEmailId;
  public showCreateAccount: boolean = true;
  public eId: string;
  public passwordShow: boolean = false;
  public showLogin: boolean = false;
  isRp: boolean;
  public emailAddr: string;
  public isExistingUser: boolean = false;
  public query: any;
  public adfsIssuersArr: any;
  public sentResendSuccessfully: boolean = false;
  public showloginLink: boolean = false;
  public usrId: string;
  public emailId: string;
  public emailIdMasked: string;
  public queryResend: any;
  public deLocale: boolean = false;
  public itLocale: boolean = false;
  public frLocale: boolean = false;
  public esLocale: boolean = false;
  public jaLocale: boolean = false;
  public ptLocale: boolean = false;
  public koLocale: boolean = false;
  public zhLocale: boolean = false;
  public rtuId: string = '';
  
   
  //public appendUrl: string;
  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    public publicService: PublicService,
    private titleSet: Title,
    public translate: TranslateService,
    private formService: FormService,
    public googleAnalyticsService: GoogleAnalyticsService,
    private cookieService: CookieService
  ) {
    this.publicService.updatedDataLoading(false);
    this.formModel = new FormGroup({
      password: new FormControl(''),
      username: new FormControl('',[Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
      rememberMe: new FormControl(''),
    });
    this.route.queryParams.subscribe((params) => {
      this.query = { ...params };
      this.queryResend = { ...params };
      let urlParams = { ...params };
      if (parseInt(urlParams.rp) === 1) {
        this.clearAllErrorMsg();
        this.isRp = true;
      }
      delete urlParams.rp;
     // if(params.accountId) {
        // let accountId = params.accountId;
        // let role = "Portal User Role";
        // let email = params.email;
        //this.appendUrl = `accountId=${accountId}&role=${role}&email=${email}`;
        if(params.emailAddress) {
          let email = params.emailAddress;
        this.formModel.get("username").setValue(email);
        this.formModel.get("username").disable();
        }
     // }
      this.paramsObject = urlParams;
      this.lgt = urlParams.lgt || null;
      this.state = urlParams.state || '';
      this.challengeCode = urlParams.challenge || urlParams.code_challenge  ||  '';
      this.aId = urlParams.aid || Constants.ACOM;
      this.redirectURI = urlParams.redirect_uri || '';
      this.nonce = urlParams.nonce || '';
      this.publicService.getAppInformation(this.aId);
      this.fromURI = urlParams.fromURI || ''
      this.rtuId=urlParams.rtulid||'';
      this.signedOut('lgt');
      this.authenticateAccess('noaccess');
      this.isMYA = urlParams.aid === Constants.MYA;
      this.queryparams = this.publicService.urlencode(urlParams) ? `?${this.publicService.urlencode(urlParams)}` : '';
    });
    // this.titleSet.setTitle(this.translate.instant('LOGIN.TAB_TITLE'));
    this.publicService.showCreateAccount.subscribe((data) => {
      this.showCreateAccount = data;
    })
    // _setExistingUser();
  }



  ngOnInit() {
    if(this.publicService.responseLocale === 'de_DE') {
      this.deLocale = true;
    }
    else if(this.publicService.responseLocale === 'it_IT') {
      this.itLocale = true;
    } else if(this.publicService.responseLocale === 'fr_FR') {
      this.frLocale = true;
    } else if(this.publicService.responseLocale === 'es_ES') {
      this.esLocale = true;
    } else if(this.publicService.responseLocale === 'ja_JP') {
      this.jaLocale = true;
    }else if(this.publicService.responseLocale === 'pt_BR') {
      this.ptLocale = true;
    }else if(this.publicService.responseLocale === 'ko_KR') {
      this.koLocale = true;
    }else if(this.publicService.responseLocale === 'zh_CN') {
      this.zhLocale = true;
    }
    else if(this.publicService.responseLocale === 'de_DE') {
      this.deLocale = true;
    }
    
    console.log('Loading login component');
    this.hideErrorInfo();
    this.loginService.agsessioncheck().subscribe(res => {
      if (res.agsessionme === 'true') {
        this.publicService.appInfoLoadComplete.subscribe((data) => {
          if (data) {
            const oktaBaseUrl = this.publicService.appInfo['oktaBaseUrl'];
            this.redirectURI = this.redirectURI ? this.redirectURI : this.publicService.appInfo[this.redURIDef];
            // let oktaresr={status:"ACTIVE"}
            this.publicService.sessionMe = `${oktaBaseUrl}${environment.sessionMe}`;
            this.http.get<any>(this.publicService.sessionMe, { withCredentials: true }).subscribe((oktares) => {
              if (oktares.status === 'ACTIVE') {
                this.showLogin = false;
                if (this.publicService.appInfo['globalSession'] && this.publicService.appInfo['globalSession']['login']) {
                    
                  this.loginService.globalSession(this.publicService.appInfo['globalSession']['url'], { "action": "checkandping" }).subscribe((gsres) => {
                    if (gsres.agsessionme === "true") {
                      this.login()
                    } else {
                      this._setExistingUser();
                      // agsessionme present
                      this.http.delete<any>(this.publicService.sessionMe, { withCredentials: true }).subscribe();
                      this.loginService.agsession({
                        'action': 'create',
                        'agsession': false
                      }).subscribe();
                    }

                  },
                    (err) => {
                      this._setExistingUser();
                      this.http.delete<any>(this.publicService.sessionMe, { withCredentials: true }).subscribe();
                      this.loginService.agsession({
                        'action': 'create',
                        'agsession': false
                      }).subscribe();
                    });
                } else {
                  this.login()
                }
              } else {
                this._setExistingUser();
                this.loginService.agsession({
                  'action': 'create',
                  'agsession': false
                }).subscribe();
              }
            },
              (err) => {
                this._setExistingUser();
                this.loginService.agsession({
                  'action': 'create',
                  'agsession': false
                }).subscribe();
              });

          }
        },
          (err) => {
            this._setExistingUser();
            this.loginService.agsession({
              'action': 'create',
              'agsession': false
            }).subscribe();
          });
      } else {

        this.publicService.appInfoLoadComplete.subscribe((data) => {
          if (data) {
            if (this.publicService.appInfo.fieldsConfig && this.publicService.appInfo.fieldsConfig.login) {
              this.isUserName = this.publicService.appInfo.fieldsConfig.login.username;
            }
            this._setExistingUser();
          }

        })
        this.loginService.agsession({
          'action': 'create',
          'agsession': false
        }).subscribe();
      }

    });
    localStorage.removeItem('kir');
    this.titleSet.setTitle(this.translate.instant('LOGIN.TAB_TITLE'));
    if(this.cookieService.get("remeberLogin")) {
      // this.formModel.get("username").setValue(decodeURIComponent(this.cookieService.get("remeberLogin")));
        this.formModel.get("username").setValue(this.cookieService.get("remeberLogin"));
        //this.formModel.get("username").setValue("teston1@non.AGILENT.com");
         this.formModel.get("rememberMe").setValue("true");
         let email =  this.formModel.get("username").value;
         if (email.toLowerCase().includes('agilent.net') || email.toLowerCase().includes('agilent.com')) {
          this.externalUser = false;
        } else {
          this.externalUser = true;
        }
    }
  }
  _isNotEmail = (username) => {
    return (username && `${username}`.indexOf('@') === -1);
  }
  _setExistingUser() {
    const appInfo = this.publicService.appInfo;
    if (appInfo && appInfo.messages && appInfo.messages.success && appInfo.messages.success.existingUser) {
      this.clearAllErrorMsg();
      this.isExistingUser = (this.cookieService.get("autoreg") === 'true');
    }
    this.cookieService.delete('autoreg', '/', '.agilent.com');
    this.cookieService.delete('autoreg', '/account', '.agilent.com.cn');
    this.cookieService.delete('autoreg', '/account', '.agilent.com');

    if(this.publicService.appInfo['adfsInternal']){
      if(this.adfsIssuer == 'adfsIssuer'){
        this.adfsIssuer = this.publicService.appInfo[this.adfsIssuer];
      }
      localStorage.setItem("state", this.state);
      if (this.publicService.appInfo.nonPKCE) {        
        window.location.href = `${this.adfsIssuer}
        ?fromURI=${encodeURIComponent(`${this.publicService.appInfo['hostName']}${this.publicService.internalLogin}` + '?state=' + this.state + '&nonce=' + this.nonce + '&aid=' + this.aId + '&redirect_uri=' + this.redirectURI)}`;
        return;
      } else {
        window.location.href = `${this.adfsIssuer}
        ?fromURI=${encodeURIComponent(`${this.publicService.appInfo['hostName']}${this.publicService.internalLogin}` + '?state=' + this.state + '&challenge=' + this.challengeCode + '&nonce=' + this.nonce + '&aid=' + this.aId + '&redirect_uri=' + this.redirectURI)}`;
        return;
      }
    }else{
      this.showLogin = true;
    }
  }

  login() {
    if (this.publicService.authProto === 'saml' && this.publicService.samlURL !== '') {
      if (this.publicService.appInfo.relayState) {
         if(this.rtuId!=''){        
          let rtuIdValueEncoded= `${encodeURIComponent(`&RTUID=${this.rtuId}`)}`        
         window.location.href = `${this.publicService.samlURL}?RelayState=${this.publicService.appInfo.relayState}${rtuIdValueEncoded}`;
        }else{
         window.location.href = `${this.publicService.samlURL}?RelayState=${this.publicService.appInfo.relayState}`;
        }

      } else if(this.fromURI!=''){
        let fromURIArr=this.fromURI.split("&")
        window.location.href = `${this.publicService.samlURL}?${fromURIArr[1]}`;
       } else {
        window.location.href = `${this.publicService.samlURL}`;
      }

    } else if (this.publicService.authProto === 'oidc') {
      if (this.publicService.appInfo.nonPKCE) {
        window.location.href = `${this.publicService.oktaAuthorizeURL}?client_id=${this.publicService.appInfo[this.clientId]}&response_type=code&scope=${encodeURIComponent(`${this.publicService.appInfo[this.scope]}`)}&redirect_uri=${encodeURIComponent(this.redirectURI)}&state=${this.state}&nonce=${this.nonce}`;
        return
      } else {
        window.location.href = `${this.publicService.oktaAuthorizeURL}?client_id=${this.publicService.appInfo[this.clientId]}&response_type=code&scope=${encodeURIComponent(`${this.publicService.appInfo[this.scope]}`)}&redirect_uri=${encodeURIComponent(this.redirectURI)}&state=${this.state}&nonce=${this.nonce}&code_challenge_method=S256&code_challenge=${this.challengeCode}`;
        return;
      }
    }
  }
  async authenticateUserDetails() {
    //this.googleAnalyticsService.eventEmitter('loginButtonClick', 'login', 'LOG IN', 0);
    this.googleAnalyticsService.addDatalayer('loginButtonClick', 'login', 'LOG IN', 0);
    this.isLgt = false;
    this.loginFailed = false;
    this.registeredNotConfirmed = false;
    this.accountLocked = false;
    this.sentResendSuccessfully = false;
    this.isExistingUser = false;
    //let username = this.formModel.value.username
    let username = this.formModel.get('username').value

    var deviceToken = '';
    var tokenLength = 30;

    // const cookieContextPath = this.loginService.appInfo['cookieContext'] || environment.cookieContext;
    const cookieContextPath = environment.cookieContext;
    const cookieDomain = environment.cookieDomain;
    const cookieCrossSite = environment.cookieCrossSite;

    if (this.cookieService.get("deviceToken").length == tokenLength) {
      deviceToken = this.cookieService.get('deviceToken');
    } else {
      deviceToken = CryptoUtil.randomString(tokenLength);
      //this.cookieService.set('deviceToken',deviceToken,new Date(9999,9,9));   //for local testing 
      this.cookieService.set('deviceToken', deviceToken, new Date(9999,9,9), '/account', '.agilent.com', true, 'None');
      //this.cookieService.set('deviceToken',deviceToken,0,);
    }

    const postData = {
      username: username,
      password: this.formModel.value.password,
      options: {
        multiOptionalFactorEnroll: true,
        warnBeforePasswordExpired: true
      },
      context: { "deviceToken": deviceToken }
    };


    localStorage.setItem("ki", CryptoUtil.getAES(JSON.stringify(postData)));

    this.redirectURI = this.redirectURI ? this.redirectURI : this.publicService.appInfo[this.redURIDef];
    if (!this.externalUser) {
      if(this.adfsIssuer == 'adfsIssuer'){
        this.adfsIssuer = this.publicService.appInfo[this.adfsIssuer];
      }
      localStorage.setItem("state", this.state);
      if (this.publicService.appInfo.nonPKCE) {        
        window.location.href = `${this.adfsIssuer}
        ?fromURI=${encodeURIComponent(`${this.publicService.appInfo['hostName']}${this.publicService.internalLogin}` + '?state=' + this.state + '&nonce=' + this.nonce + '&aid=' + this.aId + '&redirect_uri=' + this.redirectURI)}`;
        return;
      } else {
        window.location.href = `${this.adfsIssuer}
        ?fromURI=${encodeURIComponent(`${this.publicService.appInfo['hostName']}${this.publicService.internalLogin}` + '?state=' + this.state + '&challenge=' + this.challengeCode + '&nonce=' + this.nonce + '&aid=' + this.aId + '&redirect_uri=' + this.redirectURI)}`;
        return;
      }
    }

    if (this.formModel.valid) {
      this.publicService.showLoading();
      const userData = {
        adLoginName: username
      };
      //added for username support
      if (this._isNotEmail(username)) {
        // postData.username = await this.formService.getUserEmail(username);
        let userNameValid = await this.formService.isUserExist(userData).toPromise();
        if (userNameValid && userNameValid.success) {
          postData.username = userNameValid.data.login;
          username = postData.username;
          this.emailAddr = postData.username;
          // if(userNameValid.data.status === "PROVISIONED") {
          //   if(this.queryResend.aid) {
          //     delete this.queryResend.aid;
          //   }
          //   this.showloginLink = true;
          //   this.usrId = userNameValid.data.userId;
          //   this.emailId = userNameValid.data.login;
          //   this.loginFailed = true;
          //   this.publicService.showLoading({ status: 200 });
          // }
        } 
         this.googleAnalyticsService.addDatalayer('nextButtonClick', 'login', 'NEXT', 0);
      }

      this.loginService.login(postData)
        .subscribe((res) => {
          switch (res.status) {
            case 'SUCCESS':
              //this.googleAnalyticsService.eventEmitter('loginSuccess', 'login', 'success', 0);
              this.googleAnalyticsService.addDatalayer('loginSuccess', 'login', 'success', 0);

              this.loginService.agsession({
                'action': 'create',
                'agsession': true
              }).subscribe(cookieResponse => {
                if (cookieResponse.created === 'true') {
                  let oktaId=res._embedded.user.id;
                  this.cookieService.set('OKTUID',oktaId, 0, '/', '.agilent.com', true, 'None');
                  if (this.publicService.authProto === 'saml' && this.publicService.samlURL !== '') {
                    if (this.publicService.appInfo.relayState) {                     
                     if(this.rtuId!=''){        
                       let rtuIdValueEncoded= `${encodeURIComponent(`&RTUID=${this.rtuId}`)}`        
                      window.location.href = `${this.publicService.samlURL}?RelayState=${this.publicService.appInfo.relayState}${rtuIdValueEncoded}&sessionToken=${res.sessionToken}`;
                     }else{
                      window.location.href = `${this.publicService.samlURL}?RelayState=${this.publicService.appInfo.relayState}&sessionToken=${res.sessionToken}`;
                     }
                     
                    } else if(this.fromURI!=''){
                     let fromURIArr=this.fromURI.split("&")
                     window.location.href = `${this.publicService.samlURL}?${fromURIArr[1]}&sessionToken=${res.sessionToken}`;
                    }else{
                      window.location.href = `${this.publicService.samlURL}?sessionToken=${res.sessionToken}`;
                    }
                  } else if (this.publicService.authProto === 'oidc') {
                    if (this.publicService.appInfo.nonPKCE) {
                      window.location.href = `${this.publicService.oktaAuthorizeURL}?client_id=${this.publicService.appInfo[this.clientId]}&sessionToken=${res.sessionToken}&response_type=code&scope=${encodeURIComponent(`${this.publicService.appInfo[this.scope]}`)}&redirect_uri=${encodeURIComponent(this.redirectURI)}&state=${this.state}&nonce=${this.nonce}`;
                    } else {
                      window.location.href = `${this.publicService.oktaAuthorizeURL}?client_id=${this.publicService.appInfo[this.clientId]}&sessionToken=${res.sessionToken}&response_type=code&scope=${encodeURIComponent(`${this.publicService.appInfo[this.scope]}`)}&redirect_uri=${encodeURIComponent(this.redirectURI)}&state=${this.state}&nonce=${this.nonce}&code_challenge_method=S256&code_challenge=${this.challengeCode}`;
                    }
                  }
                }
              })

              break;
            case 'LOCKED_OUT':
              //this.googleAnalyticsService.eventEmitter('loginError', 'login', 'errMsg', 0);
              this.googleAnalyticsService.addDatalayer('loginError', 'login', 'errMsg', 0);
              this.publicService.showLoading(res);
              this.clearAllErrorMsg();
              this.accountLocked = true;
            //  let username = this.formModel.get('username').value
              let data = {
                email: username,
                locale: this.publicService.responseLocale,
                aId: this.aId
              }
              this.loginService.lockNotify(data)
              .subscribe((res) => {
                console.log("show email");
              }, (error) => {
                console.log(error);
              });
              break;
            case 'MFA_REQUIRED':
              // this.publicService.showLoading(res);
              //this.showLogin = false;
              let factorId = res._embedded.factors[0].id
              let stateToken = res.stateToken
              this.cookieService.set('stateToken', stateToken, 0, '/account', '.agilent.com', true, 'None');
              // this.cookieService.set('stateToken', stateToken, 0, '/', 'localhost', false, 'None');
              let postData = {
                stateToken: stateToken
              }
              this.loginService.auth(postData, factorId).subscribe((res) => {
                let flagObj = { isPass: true };
                localStorage.setItem('kir', JSON.stringify(flagObj));

                //encrypting eid and storing in session storage
                // let email = btoa(username);
                // sessionStorage.setItem("eid", email);
                this.publicService.eid = username;
                this.router.navigate(['auth'], {
                  queryParams: {
                    factorId: factorId,
                    state: this.state,
                    challengeCode: this.challengeCode,
                    aid: this.aId,
                    redirectURI: this.redirectURI,
                    nonce: this.nonce,
                    fromURI:this.fromURI,
                    RTUID:this.rtuId
                  }
                });
              })
              break;
            case 'PASSWORD_EXPIRED':
              this.publicService.email = res._embedded.user.profile.login;
              this.publicService.locale = res._embedded.user.profile.locale;
              this.publicService.userId = res._embedded.user.id;
              this.publicService.ep = true;
              this.router.navigate(['reset-password/' + res.stateToken], {
                queryParams: {
                  // eid: encodeURIComponent(res._embedded.user.profile.login),
                  // aid: this.aId,
                  //ep: 1
                  ...this.query
                }
              });
              this.publicService.showLoading({ status: 200 });
              break;
            default:
              this.publicService.showLoader = false;
              this.publicService.showErrorpage();
              break;
          }
        }, (error) => {
          const authError = error.status;
          const userData = {
            adLoginName: postData.username
          };
          this.formService.isUserExist(userData).subscribe(res => {
            if (res.success) {
              if (res.data.status === "ACTIVE") {
                switch (authError) {
                  case 401:
                    this.clearAllErrorMsg();
                    this.loginFailed = true;
                    this.publicService.showLoading({ status: 200 });
                    break;
                  case 504:
                    this.clearAllErrorMsg();
                    this.loginFailed = true;
                    this.publicService.showLoading({ status: 200 });
                    break;
                  default:
                    this.publicService.showLoading(error);
                    break;
                }
              } else if(res.data.status === "PROVISIONED") {
                if(this.queryResend.aid) {
                  delete this.queryResend.aid;
                }
                
                this.showloginLink = true;
                this.usrId = res.data.userId;
                this.emailId = res.data.login;
                this.emailIdMasked = this.textSub(`${this.emailId}`);
                this.loginFailed = true;
                this.resendEmail();
                console.log("provisioned "+this.showloginLink);
                this.publicService.showLoading({ status: 200 });
                }
              else { // Added else as part of code to stop Not verified page flow
                this.clearAllErrorMsg();
                this.loginFailed = true;
                this.publicService.showLoading({ status: 200 });
              }
              // Commented to stop Not verified page flow
              // }
            } else {
              this.clearAllErrorMsg();
              this.loginFailed = true;
              this.publicService.showLoading({ status: 200 });
            }
          }, (error) => {
            this.showloginLink = false;
            console.log("hi1234 "+this.showloginLink);
            const err = error.status;
            switch (err) {
              case 401:
                this.clearAllErrorMsg();
                this.loginFailed = true;
                this.publicService.showLoading({ status: 200 });
                break;
              case 504:
                this.clearAllErrorMsg();
                this.loginFailed = true;
                this.publicService.showLoading({ status: 200 });
                break;
              default:
                this.publicService.showLoading(error);
                break;
            }
          }
          )
        });
    } else {
      //this.googleAnalyticsService.eventEmitter('formError', 'login', 'Required field', 0);
      this.googleAnalyticsService.addDatalayer('formError', 'login', 'Required field', 0);
      this.showErrorInfo = true;
      this.publicService.validateAllFormFields(this.formModel);
    }
  }
  hideErrorInfo() {
    this.formModel.valueChanges.subscribe(() => {
      this.loginFailed = false;
      this.accountLocked = false;
      this.showErrorInfo = false;
      this.isExistingUser = false;
      this.showloginLink = false;
      console.log("hellos "+this.showloginLink);
    });
  }

  clearAllErrorMsg() {
    this.loginFailed = false;
    this.accountLocked = false;
    this.isLgt = false;
    this.isRp = false;
    this.isExistingUser = false;
  }
  signedOut(lgt: string) {
    this.paramsObject[lgt] === '1' ? (this.clearAllErrorMsg(), this.isLgt = true) : null;
  }
  authenticateAccess(noaccess: string) {
    const _query = { ...this.paramsObject };
    this.paramsObject[noaccess] === 'true' ? (
      delete _query[noaccess],
      this.router.navigate(['/noaccess'], { queryParams: { ..._query } })
    ) : null;
  }
  fieldData(field: string) {
    return this.formModel.get(field);
  }
  validateUser() {
    const email = this.formModel.value.username;
    let hasAdfs = false;
    if(`${email}`.indexOf('@') !== -1){
      const domain = email.split('@')[1].toLowerCase();
      if (this.publicService.appInfo.adfsIssuers) {
        this.adfsIssuersArr = this.publicService.appInfo.adfsIssuers;
        if(this.adfsIssuersArr && this.adfsIssuersArr[domain]){
          this.adfsIssuer = this.adfsIssuersArr[domain];
          hasAdfs = true;
        }
      }
      if (this.publicService.appInfo.internalDomains) {
        if(this.publicService.appInfo.internalDomains.includes(domain) && hasAdfs){
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
    }else{
      if (email.toLowerCase().includes('agilent.net') || email.toLowerCase().includes('agilent.com')) {
        this.externalUser = false;
      } else {
        this.externalUser = true;
      }
    }
    
    
  }
  showPassword() {
    this.passwordShow = !this.passwordShow;
    const doc = document.getElementById('password');
    if (this.passwordShow) {
      doc.setAttribute('type', 'text');
    } else {
      doc.setAttribute('type', 'password');
    }
  }
  createAccount() {
    //this.googleAnalyticsService.eventEmitter('createNewAccountLinkClick', 'login', 'Create New Account', 0);
    this.googleAnalyticsService.addDatalayer('createNewAccountLinkClick', 'login', 'Create New Account', 0);
  }
  resendEmail(){
    this.publicService.showLoading();  
    let postData; 
    if(this.aId !== 'fp'){
      postData = {
        aId: this.aId,
        userId: this.usrId,
        localeId: this.publicService.responseLocale,
        profile: {
          email: this.emailId,
          query: {
            ...this.queryResend
          }
        },
      };
    }
    else{
      postData = {
        aId: this.aId,
        userId: this.usrId,
        localeId: this.publicService.responseLocale,
        emailUI: true,
        profile: {
          email: this.emailId,
          query: {
            ...this.queryResend
          }
        }
      };
    }
    
    this.formService.resendEmailPost(postData)
      .subscribe(
        (res) => {
          res.status = 200;
          this.googleAnalyticsService.addDatalayer('Resend Account confirmation Email Success', 'Account confirmation', 'Button Click', 0);
          this.publicService.showLoading(res);
          this.showloginLink = true;
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
  rememberMeOption(e) {
    let username = this.formModel.get('username').value
    // username = encodeURIComponent(username)
    if(e) {
      console.log("hellos")
     // this.cookieService.set('remeberLogin',username);
      this.cookieService.set('remeberLogin', username, new Date(9999,9,9), '/', '.agilent.com', true, 'None'); 
      console.log("hellos676767")
    }
    else {
      this.cookieService.delete('remeberLogin', '/', '.agilent.com');
    }
  }
  removeRememberMe() {
    let showChecked = false;
    this.formModel.get("rememberMe").setValue(showChecked);
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
