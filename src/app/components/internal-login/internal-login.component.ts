import { Component, OnInit } from '@angular/core';
import { FormGroup, } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PublicService } from '../../service/public.service';
import { environment } from '../../../environments/environment';
import { FormService } from 'src/app/service/form.service';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../../service/login-service.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-internal-login',
  templateUrl: './internalLogin.component.html',
  styleUrls: ['./internalLogin.component.scss']
})
export class InternalLoginComponent implements OnInit {
  public formModel: FormGroup;
  public sesexp: string;
  public state: string = '';
  public challengeCode: string = '';
  public aId: string = '';
  public nonce: string = '';
  public redirectURI: string = '';
  public clientId: string = 'clientId';
  public scope: string = 'scope';
  public queryparams: string = '';
  public fromURI: any;
  public authProto: string
  public samlURL: string;
  public relayState: string;

  constructor(
    private route: ActivatedRoute,
    public publicService: PublicService,
    public formService: FormService,
    public cookieService: CookieService,
    public loginService: LoginService,
    private titleSet: Title,
    public translate: TranslateService
  ) {
    console.log('In Internal-login con');
    this.route.queryParams.subscribe((params) => {
      this.sesexp = params.sesexp || null;
      this.state = params.state || '';
      this.challengeCode = params.challenge || '';
      this.aId = params.aid || 'acom';
      this.redirectURI = params.redirect_uri || '';
      this.nonce = params.nonce || '';
      this.queryparams = this.urlencode(params) ? `?${this.urlencode(params)}` : '';
    });
    this.titleSet.setTitle(this.translate.instant('LOGIN.TAB_TITLE'));
  }

  ngOnInit() {
    this.loginService.agsession({
      action: 'create',
      agsession: true
    }).subscribe();
    this.formService.getAppInfo(this.aId).subscribe((res) => {
      this.publicService.appInfo = {
        ...res.data,
      };
      const oktaBaseUrl = this.publicService.appInfo['oktaBaseUrl'];
      this.publicService.oktaAuthorizeURL = `${oktaBaseUrl}${environment.oktaAuthorizeURL}`;
      this.authProto = this.publicService.appInfo['authProto'] || 'oidc';
      this.samlURL = this.publicService.appInfo['samlURL'] || '';
      this.publicService.appInfo.relayState = this.publicService.appInfo['relayState'] || '';
      if (this.authProto === 'saml' && this.samlURL !== '') {
        if (this.publicService.appInfo.relayState && this.publicService.appInfo.relayState!='') {
          window.location.href = `${this.samlURL}?RelayState=${this.publicService.appInfo.relayState}`
        }
        else {
          window.location.href = `${this.samlURL}`
        }
      } else if (this.authProto === 'oidc') {
        this.state = localStorage.getItem("state");
        localStorage.clear;
        if (this.publicService.appInfo.nonPKCE) {
          window.location.href = `${this.publicService.oktaAuthorizeURL}?client_id=${encodeURIComponent(this.publicService.appInfo[this.clientId])}&response_type=${encodeURIComponent('code')}&scope=${encodeURIComponent(`${this.publicService.appInfo[this.scope]}`)}&redirect_uri=${encodeURIComponent(this.redirectURI)}&state=${this.state}&nonce=${this.nonce}`;
        }
        else         
          window.location.href = `${this.publicService.oktaAuthorizeURL}?client_id=${encodeURIComponent(this.publicService.appInfo[this.clientId])}&response_type=${encodeURIComponent('code')}&scope=${encodeURIComponent(`${this.publicService.appInfo[this.scope]}`)}&redirect_uri=${encodeURIComponent(this.redirectURI)}&state=${this.state}&nonce=${this.nonce}&code_challenge_method=${encodeURIComponent('S256')}&code_challenge=${encodeURIComponent(this.challengeCode)}`;
      }
    });
  }
  urlencode(parmas: object) {
    return Object.keys(parmas).map(key => key + '=' + parmas[key]).join('&');
  }
}
