import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PublicService } from '../../service/public.service';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/service/login-service.service';
import { FormService } from 'src/app/service/form.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss']
})
export class SignoutComponent implements OnInit {
  public paramsObject: object;
  public aId: string = '';
  public lgt: string;
  public showSignout: boolean = false;
  public state: string = '';
  public challengeCode: string = '';
  public nonce: string = '';
  public redirectURI: string = '';
  public appDashboardURL:string='';
  public redURIDef = 'redirectURI';
  public RelayState: string = '';
  public lg: string;
  constructor(
    private route: ActivatedRoute,
    public publicService: PublicService,
    private router: Router,
    private titleSet: Title,
    public loginService: LoginService,
    public formservice: FormService,
    private http: HttpClient,
    public translate: TranslateService
    
  ) {
    this.route.queryParams.subscribe((params) => {
      this.paramsObject = params;
      this.lgt = params.lgt || null;
      this.state = params.state || '';
      this.challengeCode = params.challenge || '';
      this.aId = params.aid || 'acom';
      this.redirectURI = params.redirect_uri || '';
      this.nonce = params.nonce || '';
      this.RelayState = params.RelayState || '';
      this.lg = params.lg || '';      

    });
    this.titleSet.setTitle(this.translate.instant('SIGN_OUT.CARD_TITLE'));
    this.publicService.toggleSignOutButton(false);
  }

  ngOnInit() {
    const _query = { ...this.paramsObject };
    if (this.lgt === '1') {
      console.log("session time out");
      this.showSignout = false;
      this.sessionTimeOut(this.aId, _query);
      //this.router.navigate([''], { queryParams: { ..._query } });
    } else if (this.lg === '1') {
      this.formservice.getAppInfo(this.aId).subscribe((res) => {
        this.publicService.appInfo = {
          ...res.data,
        };
        this.RelayState != '' ? this.redirectURI = this.RelayState : this.redirectURI = this.redirectURI ? this.redirectURI : this.publicService.appInfo[this.redURIDef];
        //added for application redirection in case of oidc without challenge and code 
        this.appDashboardURL=this.publicService.appInfo['appDashboardURL'] || this.publicService.appInfo[this.redURIDef];
        this.publicService.authProto = this.publicService.appInfo['authProto'] || 'oidc';
        this.publicService.samlSignout = this.publicService.appInfo["samlSignout"] || false;

        //this.redirectURI = this.redirectURI ? this.redirectURI : this.publicService.appInfo[this.redURIDef];
        this.signoutFlow(this.state, this.challengeCode, this.redirectURI, this.paramsObject);
      });


    } else {
      delete _query['lgt'];
      console.log('Signout');

      this.formservice.getAppInfo(this.aId).subscribe((res) => {
        this.publicService.appInfo = {
          ...res.data,
        };
        const oktaBaseUrl = this.publicService.appInfo['oktaBaseUrl'];
        this.publicService.sessionMe = `${oktaBaseUrl}${environment.sessionMe}`;
        this.publicService.authProto = this.publicService.appInfo['authProto'] || 'oidc';
        this.publicService.samlSignout = this.publicService.appInfo["samlSignout"] || false;
        this.RelayState != '' ? this.redirectURI = this.RelayState : this.redirectURI = this.redirectURI ? this.redirectURI : this.publicService.appInfo[this.redURIDef]
        this.appDashboardURL=this.publicService.appInfo['appDashboardURL'] || this.publicService.appInfo[this.redURIDef];


        //this.redirectURI = this.redirectURI ? this.redirectURI : this.publicService.appInfo[this.redURIDef];
        // checking agsession
        this.loginService.agsessioncheck().subscribe(res => {
          // agsessionme not present
          if (res.agsessionme === 'false') {
            console.log('login service singleLogOut agsessiome false');
            this.signoutFlow(this.state, this.challengeCode, this.redirectURI, this.paramsObject)
          } else {
            console.log('login service singleLogOut agsessiome true');
            this.loginService.clearAgsession({
              action: 'delete',
            }).subscribe(res => {
              res => {
                console.log('deleted agsession');
              };
              error => {
                this.signoutFlow(this.state, this.challengeCode, this.redirectURI, this.paramsObject)
              };
            });
            //delete global session 
            if (this.publicService.appInfo['globalSession'] && this.publicService.appInfo['globalSession']['logout']) {
              this.loginService.globalSession(this.publicService.appInfo['globalSession']['url'], {"action":"end"}).subscribe((gsres) => {}
              // ,(err) => {
              //   this.showLogin = true;
              //   console.log("wapas gs"+JSON.stringify(err))
              //   this._setExistingUser();
              //   this.loginService.agsession({
              //     'action': 'create',
              //     'agsession': false
              //   }).subscribe();
              // }
              );
            }
            //delete clc token cookies
            /* if (this.publicService.appInfo.clcCookieApi) {
              this.loginService.clearClcCookies(this.publicService.appInfo.clcCookieApi).subscribe(res => {
                console.log("deleted clc cookies")
              }, error => {
                //this.router.navigate([''], { queryParams: { ..._query } });
              })
            } */
            //delete api call to delete cookies
            if (this.publicService.appInfo.clearCookieApis) {
              // let clearCookierArr = this.publicService.appInfo.clearCookieApis;
              this.publicService.appInfo.clearCookieApis.forEach( (clearCookieApiUrl) => {
                console.log('clearCookieUrl---',clearCookieApiUrl);
                this.loginService.clearClcCookies(clearCookieApiUrl).subscribe(res => {
                  console.log("deleted clc cookies")
                }, error => {
                  //this.router.navigate([''], { queryParams: { ..._query } });
                })
              });
            }
            // agsessionme present
            this.http.delete<any>(this.publicService.sessionMe, { withCredentials: true }).subscribe(
              (response) => {
                console.log('deleted session/me');
                this.signoutFlow(this.state, this.challengeCode, this.redirectURI, this.paramsObject)
              },
              (error) => {
                console.log('Not able to call Session me');
                this.signoutFlow(this.state, this.challengeCode, this.redirectURI, this.paramsObject)
              }
            );

          }
        },
          err => {
            this.signoutFlow(this.state, this.challengeCode, this.redirectURI, this.paramsObject)
          }
        );
      });
    }
  }
  sessionTimeOut(aId, _query) {
    this.formservice.getAppInfo(aId).subscribe((res) => {
      this.publicService.appInfo = {
        ...res.data,
      };
      const oktaBaseUrl = this.publicService.appInfo['oktaBaseUrl'];
      this.publicService.sessionMe = `${oktaBaseUrl}${environment.sessionMe}`;
      // checking agsession
      this.loginService.agsessioncheck().subscribe(res => {
        // agsessionme not present
        if (res.agsessionme === 'false') {
          console.log('login service singleLogOut agsessiome false');
          this.router.navigate([''], { queryParams: { ..._query } });
        } else {
          console.log('login service singleLogOut agsessiome true');
          this.loginService.clearAgsession({ action: 'delete' }).subscribe(res => {
            res => {
              console.log('deleted agsession');
              // agsessionme present
            };
            error => {
              this.router.navigate([''], { queryParams: { ..._query } });
            };
          });
          //delete clc token cookies
          if (this.publicService.appInfo.clcCookieApi) {
            this.loginService.clearClcCookies(this.publicService.appInfo.clcCookieApi).subscribe(res => {
              console.log("deleted clc cookies")
            }, error => {
              //this.router.navigate([''], { queryParams: { ..._query } });
            })
          }
          this.http.delete<any>(this.publicService.sessionMe, { withCredentials: true }).subscribe((response) => {
            console.log('deleted session/me');
            this.router.navigate([''], { queryParams: { ..._query } });
          },
            (error) => {
              console.log('Not able to call Session me');
              this.router.navigate([''], { queryParams: { ..._query } });
            }
          );
        }
      },
        error => {
          this.router.navigate([''], { queryParams: { ..._query } });
        }
      );
    },
      err => {
        this.router.navigate([''], { queryParams: { ..._query } });
      });
  }
  signoutFlow(state, challengeCode, redirectURI, paramsObject) {
    if (this.publicService.authProto == 'oidc') {
      if (state !== '' && challengeCode !== '') {

        console.log('state and challenge present, redirecting to sign out');
        const _query = {
          ...paramsObject,
          redirect_uri: redirectURI,
          lg: 1

        };
        this.router.navigate(['/signout'], { queryParams: { ..._query } });
        this.showSignout = true
      } else {
        if (this.publicService.appInfo.noAg) {
          this.http.delete<any>(this.publicService.sessionMe, { withCredentials: true }).subscribe((response) => {
            console.log('deleted session/me');
            window.location.href = `${redirectURI}`
            
          },
            (error) => {
              console.log('Not able to call Session me' + error);
              window.location.href = `${redirectURI}`
            });
        } else {
          if(this.publicService.appInfo['adfsInternal']){
            console.log('internal application, redirecting to sign out');
            const _query = {
              ...paramsObject,
              redirect_uri: redirectURI,
              lg: 1
            };
            this.router.navigate(['/signout'], { queryParams: { ..._query } });
            this.showSignout = true
          }else{
            window.location.href = `${this.appDashboardURL}`
          }
        }
      }
    } else
      this.redirection(paramsObject, redirectURI);

  }
  redirection(paramsObject, redirectURI) {
    if (this.publicService.samlSignout) {
      const _query = {
        ...paramsObject,
        redirect_uri: redirectURI,
        lg: 1
      };
      this.router.navigate(['/signout'], { queryParams: { ..._query } });
      this.showSignout = true
    } else {
      console.log("apse");
      window.location.href = `${redirectURI}`
    }
  }
}
