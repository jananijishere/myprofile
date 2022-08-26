import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, RoutesRecognized, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { LoginService } from '../../service/login-service.service';
import { PublicService } from '../../service/public.service';
import { filter, pairwise, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import CryptoJS from 'crypto-js'
import { environment } from 'src/environments/environment';
import { CryptoUtil } from 'src/app/utils/CryptoUtil';
import { Constants } from 'src/app/utils/constants';
import { GoogleAnalyticsService } from 'src/app/service/google-analytics.service';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public sendFlag: boolean = false;
  public agreeFlag: boolean = false;
  public code: number = 3;
  public authCode: string = '';
  public email: string = '';
  public factorId: string = '';
  public stateToken: string = '';
  public state: string = '';
  public fromURI: any;
  public challengeCode: string = '';
  public aId: string = '';
  public nonce: string = '';
  public redirectURI: string = '';
  public clientId: string = 'clientId';
  public scope: string = 'scope';
  public adfsIssuer: string = 'adfsIssuer';
  public errorFlag: boolean = false;
  public errorMessage: string;
  public mfaSupportMailId: string;

  public reasonPageFlag: string = 'auth';
  public loadingFlag: boolean = false;
  public pageFrom: string = '';
  public times: number = 5;

  public errorMoreAttempts1: string;
  public errorMoreAttempts2: string;
  public errorMoreAttempts3: string;
  public errorMoreAttempts: boolean = false;
  public resendSuccess: boolean = false;
  public query: any;
  public rtuId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private publicService: PublicService,
    private titleSet: Title,
    public translate: TranslateService,
    public googleAnalyticsService: GoogleAnalyticsService,
    private cookieService:CookieService
  ) {
    this.publicService.showLoading({ status: 200 });
    this.router.events.pipe(
      filter((evt: any) => evt instanceof RoutesRecognized),
      pairwise()
    ).subscribe((events: RoutesRecognized[]) => {
      console.log('previous url', events[0].urlAfterRedirects);
      console.log('current url', events[1].urlAfterRedirects);
    }, (error) => {
      console.log(error);
    });
    this.titleSet.setTitle(this.translate.instant('LOGIN.TAB_TITLE'));
  }

  randomString(len) {
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz1234567890';
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      // console.log('redirect with parameter', params);
      this.query = { ...params };
      this.factorId = params.factorId;
      this.state = params.state,
        this.challengeCode = params.challengeCode,
        this.aId = params.challengeCode,
        this.redirectURI = params.redirectURI,
        this.nonce = params.nonce,
        this.fromURI=params.fromURI,
        this.rtuId=params.RTUID||'';
    });
    this.email = this.textSub(`${this.publicService.eid}`);
    this.stateToken = this.cookieService.get("stateToken");
    
    if (this.publicService.oktaAuthN === undefined) {
      //call the app info
      this.publicService.getAppInformation("clc");
    }
    this.mfaSupportMailId = environment.mfaSupporMailId;
    localStorage.removeItem("kir");

  }
  reasonPage() {
    //goto mfa main page
    this.reasonPageFlag = 'reason';
  }
  back() {
    this.reasonPageFlag = 'auth';
  }

  refreshTokenPost;

  sendCode() {
    // console.log('resend passcode');
    this.sendFlag = true;
   // this.resendSuccess = true;
    let factorId = this.factorId;
    let postData = {
      stateToken: this.stateToken
    };

    this.loginService.reSend(postData, factorId).pipe(
      catchError(err => {
        if (err.error.errorCode == 'E0000011') {
          this.reasonPageFlag = 'auth';
          // this.errorFlag = true;
          // this.errorMoreAttempts = false;
          this.loadingFlag = false;
          this.times = this.times - 1;
          // this.errorMessage = this.translate.instant('AUTH.ERR_MSG_EXPIRED');

          this.refreshTokenPost = null;
          var postFromJson = JSON.parse(CryptoUtil.getDAes(localStorage.getItem("ki")));
          this.loginService.login(postFromJson).subscribe(res1 => {
            this.refreshTokenPost = { stateToken: res1.stateToken };
            this.loginService.auth(this.refreshTokenPost, this.factorId).subscribe(res2 => {
              console.log("hello res2 "+res2);
              this.resendSuccess = true;
            });
          });
        }

        return this.handleError(err);
      })
    ).subscribe(res => {
      this.resendSuccess = true;
      console.log(res);
    });

  }

  handleError(error: HttpErrorResponse) {
    // alert("handling");
    // alert("error code ..." + error.error.errorCode);
    // console.log(error.error.errorCode);
    return throwError(error);
  }

  tipshow() {
    this.code = 1;
    // console.log(this.code === 1);
    // console.log('tipshow', this.code);
  }
  handleAgreeClick() {
    // console.log('yes');
    this.agreeFlag = !this.agreeFlag;
  }
  textSub(result) {
    let index = result.lastIndexOf("@");
    var subBefore = result.substring(1, index);
    var subTitle = result.substring(0, 1);
    var subBack = result.substring(index, result.length);
    var subStr = subTitle + '...' + subBack;
    return subStr;
  }
  subCode() {
    this.resendSuccess = false;
    if (this.authCode !== '' && this.authCode.length === Constants.AUTH_CODE_LENGTH) {
      this.loadingFlag = true;
      this.errorFlag = false;
      let factorId = this.factorId;
      let postData = {
        stateToken: this.stateToken,
        passCode: this.authCode
      };
      if (this.refreshTokenPost) {
        postData.stateToken = this.refreshTokenPost.stateToken;
      }
      this.loginService.auth(postData, factorId).subscribe((res) => {
        // window.location.href = "https://dev-login.agilent.com/login/sessionCookieRedirect?checkAccountSetupComplete=true&token=" + res.sessionToken + "&redirectUrl=https%3A%2F%2Fdev-login.agilent.com%2Fapp%2FUserHome";
       // this.googleAnalyticsService.eventEmitter('loginSuccess', 'login', 'success', 0);
       this.googleAnalyticsService.addDatalayer('loginSuccess', 'login', 'success', 0);
        //remove eid stored in sessionStorage
        // sessionStorage.removeItem('eid');
        switch (res.status) {
          case 'SUCCESS':
        this.cookieService.delete('stateToken', '/account', '.agilent.com');
        localStorage.removeItem("kir");
        localStorage.removeItem("ki");
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
                 }else {
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
          });
        
        
        break;
        case 'PASSWORD_EXPIRED':
          this.publicService.email = res._embedded.user.profile.login;
          this.publicService.locale = res._embedded.user.profile.locale;
          this.publicService.userId = res._embedded.user.id;
          this.publicService.ep = true;
          this.router.navigate(['reset-password/'+res.stateToken], {
            queryParams: {
              // eid: encodeURIComponent(res._embedded.user.profile.login),
              // aid: this.aId,
              //ep: 1
              ...this.query
          }
          });
        break;
        default:
          this.publicService.showLoader = false;
          this.publicService.showErrorpage();
          break;
        }
      }, (error) => {
        this.loadingFlag = false;
        //Invalid token provided//expired
        if (error.error.errorCode == 'E0000011') {
          // invalied token provide //after locked
          // console.log("passcode not valid");
          this.reasonPageFlag = 'auth';
          this.errorFlag = true;
          this.errorMoreAttempts = false;
          this.times = this.times - 1;
          // 
          this.errorMessage = this.translate.instant('AUTH.ERR_MSG_EXPIRED');
        } else if (error.error.errorCode == 'E0000068') {
          // not mach
          // console.log("passcode not match");
          this.reasonPageFlag = 'auth';
          this.errorFlag = true;
          this.errorMoreAttempts = true;
          this.times = this.times - 1;
          this.errorMoreAttempts1 = this.translate.instant('AUTH.ERR_MSG_INVALIED_1');
          this.errorMoreAttempts2 = this.translate.instant('AUTH.ERR_MSG_INVALIED_2');
          this.errorMoreAttempts3 = this.translate.instant('AUTH.ERR_MSG_INVALIED_3');
          // this.errorMessage = this.translate.instant('AUTH.ERR_MSG_INVALIED');
        } else if (error.error.errorCode == 'E0000069') {
          // account lock
          // console.log("account locked");
          this.reasonPageFlag = 'lock';
        }
        // const err = error.status;
        // console.log('error', error)
        // switch (err) {
        //   //输错了
        //   case 403:
        //     console.log('error.error.errorSummary', error.error.errorSummary)
        //     if (error.error.errorSummary == 'User Locked') {
        //       this.reasonPageFlag = 'lock'
        //     } else {
        //       this.errorFlag = true
        //       this.loadingFlag = false
        //       this.times = this.times - 1
        //     }
        //     break;
        //   default:
        //     this.publicService.showLoading(error);
        //     break;
        // }
      });
    }
  }


}
