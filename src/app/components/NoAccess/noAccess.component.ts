import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PublicService } from '../../service/public.service';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../service/form.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/service/login-service.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-noaccess',
  templateUrl: './noAccess.component.html',
  styleUrls: ['./noAccess.component.scss']
})
export class NoAccessComponent implements OnInit {
  public requested: boolean = false;
  public formModel: FormGroup;
  public queryparams: string = '';
  public aid: string;
  public customerSupportNumber: string;
  public customerSupportEmail: string;
  public contactSupportURL: string;
  user: Observable<any>;
  public lang: string;
  public jpLocale: boolean = false;
  public esLocale: boolean = false;
  public deLocale: boolean = false;
  public frLocale: boolean = false;
  public ptLocale: boolean = false;
  public accessPending: boolean = false;
  public clpAccess: boolean = false;
  public clcRedirect: boolean = false;
  
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private formService: FormService,
    public publicService: PublicService,
    public loginService:LoginService,
    private titleSet: Title,
    public translate: TranslateService
    //private formBuilder: FormBuilder
  ) {
    this.publicService.toggleSignOutButton(true);
    this.formModel = new FormGroup({
      email: new FormControl('')
    });
    this.route.queryParams.subscribe((params) => {
      this.aid = params.aid || 'acom';
      this.lang = params.lang || 'en_US';
      this.queryparams = this.publicService.urlencode(params) ? `?${this.publicService.urlencode(params)}` : '';
    });
    this.titleSet.setTitle(this.translate.instant('LOGIN.TAB_TITLE'));
  }

  ngOnInit() {
    if(this.aid === 'sr' || (this.aid.indexOf("clc")>-1)) {
      this.clpAccess = true;
      this.publicService.showLoading();
  
    }
    if(this.publicService.responseLocale === 'ja_JP') {
      this.jpLocale = true;
    }
    if(this.publicService.responseLocale === 'es_ES' && this.aid === 'sr' ) {
      this.esLocale = true;
    }
    if(this.publicService.responseLocale === 'de_DE' && this.aid === 'sr' ) {
      this.deLocale = true;
    }
    if(this.publicService.responseLocale === 'fr_FR' && this.aid === 'sr' ) {
      this.frLocale = true;
    }
    if(this.publicService.responseLocale === 'pt_BR' && this.aid === 'sr' ) {
      this.ptLocale = true;
    }
    this.formService.getAppInfo(this.aid).subscribe(
     (res)=>{
      this.publicService.appInfo = {
        ...res.data,
      };
      if(this.aid.indexOf("clc")>-1) {
        if(this.publicService.appInfo['clcAids']) {
          this.publicService.appInfo['clcAids'].forEach((element) => {
         if(element === this.aid) {
           this.clcRedirect = true;
         } 
       })
      }
     }
      const oktaBaseUrl = this.publicService.appInfo['oktaBaseUrl'];
      this.publicService.sessionMe = `${oktaBaseUrl}${environment.sessionMe}`;
      this.customerSupportNumber = this.publicService.appInfo['customerSupportNumber'];
      this.customerSupportEmail = this.publicService.appInfo['customerSupportEmail'];
      this.contactSupportURL= this.publicService.appInfo['contactSupportURL'];
        this.http.get<any>(this.publicService.sessionMe, { withCredentials: true }).subscribe(
          (res) => {
              this.formModel.patchValue({
              email: res.login
            });
            this.user = res;
            // if(this.aid === 'sr' || this.aid === 'clc') {
            if(this.aid === 'sr' || this.clcRedirect) {
              const postData = {
              email: res.login,
              //email: "qaclpuser07@mailinator.com",
              aId: this.aid
            }; 
            this.formService.requestStatusPost(postData)
              .subscribe(res => {
                res.status = 200;
                this.clpAccess = false;
                this.publicService.showLoading(res);
                if (res.data.flag) {
                  this.accessPending = true;
                }
                else {
                  this.accessPending = false;
                }
              }, (error) => {
               // this.clpAccess = false;
               //if (error.data.flag == false) {
              res.status = 200;
               this.clpAccess = false;
               this.accessPending = false;
               this.publicService.showLoading(res);
              //  }
              //   else {
              //     this.publicService.showLoading(error);
              //   } 
              });
            }
          }, (err) => {
          });
      }
    );
  }
  accessRequest() {
    const postData = {
      ...this.formModel.value,
      aId: this.aid
    };

    if (this.formModel.valid) {

      this.publicService.showLoading();
      this.formService.accessPost(postData)
        .subscribe(res => {

          res.status = 200;
          this.publicService.showLoading(res);
          if (res.messageId) {
            this.requested = true;
          }
        }, (error) => {
          this.publicService.showLoading(error);
        });
    } else {
      this.publicService.validateAllFormFields(this.formModel);
    }
  }
  fieldData(field: string) {
    return this.formModel.get(field);
  }
}
