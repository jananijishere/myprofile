import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { PublicService } from './public.service';
import { FormService } from './form.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  //public apiBasePath = '/clc/identity/api/v1';
  //public apiBasePath = '/sso/identity/api/v1';
 public apiBasePath = 'https://dev-register.agilent.com/account/identity/api/v1';
 //public apiBasePath = '/account/identity/api/v1';
 public agsessionApiBasePath = 'https://dev-register.agilent.com/account/agsso/api/v1';
 //public agsessionApiBasePath = '/account/agsso/api/v1';
  public loginUrl = `${this.apiBasePath}/users/login`;
  public agsessionUrl = `${this.agsessionApiBasePath}/agsessionme`;
  public sessionUrl = 'https://dev-login.agilent.com/api/v1/sessions/me'
 public sessionmeUrl = `${this.agsessionApiBasePath}/agsessionme`;
  constructor(private http: HttpClient, private publicService: PublicService, private router: Router, private formservice: FormService) { }


  login(postData) {
    const headers = {'Authorization': 'SSWS 00HR25IV76Qfl9k9NjZ-Mc4H1lZmFvrMpCK0yANnaq'};    
    return this.http.post<any>(this.publicService.oktaAuthN, postData, {
      headers
    });
  }
  sessionme() {
    return this.http.get<any>(this.sessionUrl, { withCredentials: true });
  }
  lockNotify(postData) {
    const url = `${this.apiBasePath}/email/locker-notify`;
    return this.http.post<any>(url, postData);
  }
  auth(postData, factorId) {
    const authUrl = `${this.publicService.oktaAuthN}/factors/${factorId}/verify?rememberDevice=true`;
    return this.http.post<any>(authUrl, postData);
  }
  reSend(postData, factorId) {
    const authUrl = `${this.publicService.oktaAuthN}/factors/${factorId}/verify/resend`;
    return this.http.post<any>(authUrl, postData);
  }
  agsession(postdata) {
    return this.http.post<any>(`${this.agsessionUrl}`, postdata);
  }
  clearAgsession(postData) {
    console.log(`delete: agsession url : ${this.agsessionUrl}`);
    return this.http.post<any>(this.agsessionUrl, postData);
  }
  agsessioncheck() {
    console.log('Checking agsessionme');
    return this.http.get<any>(this.agsessionUrl, { withCredentials: true });
  }
  clearClcCookies(url) {
    let httpOptions = {
      headers: new HttpHeaders({
        'withCredentials': 'true'
      })
    };
    if(this.publicService.appInfo.fnoLogOffUrl && this.publicService.appInfo.fnoLogOffHostName){
      if(this.publicService.appInfo.fnoLogOffUrl.includes(url)){
        httpOptions = {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin': this.publicService.appInfo.fnoLogOffHostName,
            'Access-Control-Allow-Methods': 'GET, POST',
            'withCredentials': 'true'
          })
        };
      }
    }
    return this.http.get<any>(url, httpOptions);
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


  // singlesignout
  async singleLogOut(state = '', challengeCode = '', redirectURI = '', paramsObject, aId) {

    console.log('login service singleLogOut');
    const redURIDef = 'redirectURI';
    this.formservice.getAppInfo(aId).subscribe((res) => {
      this.publicService.appInfo = {
        ...res.data,
      };
      const oktaBaseUrl = this.publicService.appInfo['oktaBaseUrl'];
      this.publicService.sessionMe = `${oktaBaseUrl}${environment.sessionMe}`;
      redirectURI = redirectURI ? redirectURI : this.publicService.appInfo[redURIDef];
      // checking agsession
      this.agsessioncheck().subscribe(
        res => {
          // agsessionme not present
          if (res.agsessionme === 'false') {
            console.log('login service singleLogOut agsessiome false');
            this.signoutFlow(state, challengeCode, redirectURI, paramsObject);
          } else {
            console.log('login service singleLogOut agsessiome true');
            this.clearAgsession({
              action: 'delete',
            }).subscribe(() => {
              () => {
                console.log('deleted agsession');
              };
              () => {
                this.signoutFlow(state, challengeCode, redirectURI, paramsObject);
              };
            });
            // agsessionme present
            this.http.delete<any>(this.publicService.sessionMe, { withCredentials: true }).subscribe(
              () => {
                console.log('deleted session/me');
                this.signoutFlow(state, challengeCode, redirectURI, paramsObject);
              },
              () => {
                console.log('Not able to call Session me');
                this.signoutFlow(state, challengeCode, redirectURI, paramsObject);
              }
            );

          }
        }
      );
    });


  }
  sessionTimeOut(aId) {
    this.formservice.getAppInfo(aId).subscribe((res) => {
      this.publicService.appInfo = {
        ...res.data,
      };
      const oktaBaseUrl = this.publicService.appInfo['oktaBaseUrl'];
      this.publicService.sessionMe = `${oktaBaseUrl}${environment.sessionMe}`;
      // checking agsession
      this.agsessioncheck().subscribe(
        res => {
          // agsessionme not present
          if (res.agsessionme === 'false') {
            console.log('login service singleLogOut agsessiome false');
          } else {
            console.log('login service singleLogOut agsessiome true');
            this.clearAgsession({ action: 'delete' }).subscribe(() => {
              () => { console.log('deleted agsession'); };
              () => { };
            });
            // agsessionme present
            this.http.delete<any>(this.publicService.sessionMe, { withCredentials: true }).subscribe(
              () => { console.log('deleted session/me'); },
              () => { console.log('Not able to call Session me'); }
            );
          }
        }
      );
    });
  }
  signoutFlow(state, challengeCode, redirectURI, paramsObject) {

    if (state !== '' && challengeCode !== '') {
      console.log('state and challenge present, redirecting to sign out');
      const _query = {
        ...paramsObject,
        redirect_uri: redirectURI,
      };
      this.router.navigate(['/signout'], { queryParams: { ..._query } });

    } else {
      console.log('Else call ');
      window.location.href = `${redirectURI}`;
    }
  }
  globalSession(url, postData: object) {
    if (Object.keys(postData).length)
      return this.http.post<any>(url, postData, { withCredentials: true });
    else
      return this.http.get<any>(url, { withCredentials: true })
  }

}
