import { Component, OnInit, Input } from '@angular/core';
import { FormService } from '../../service/form.service';
import { FormGroup, FormControl } from '@angular/forms';
import { PublicService } from '../../service/public.service';
import { LoginService } from 'src/app/service/login-service.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'not-verified',
  templateUrl: './not-verified.component.html',
  styleUrls: ['./not-verified.component.scss']
})
export class NotVerifiedComponent implements OnInit {
  @Input() eId: any;
  @Input() aId:any;
  @Input() paramObj:any;
  public formModel: FormGroup;
  public sentSuccessfully = false;
  public encryptedEmailId = '';
  public success:boolean=false;
  public requested:boolean=false;
  constructor(
    public formService:FormService,
    public publicService: PublicService,
    public loginService:LoginService,
    private titleSet: Title,
    public translate: TranslateService
  ) {
    this.formModel = new FormGroup({
      password: new FormControl(''),
      username: new FormControl(''),
    });
    this.titleSet.setTitle(this.translate.instant('LOGIN.TAB_TITLE'));
    
  }
  ngOnInit() {

  }
  resendEmail() {
    this.publicService.showLoading();
    const encryptData={
      string:[`${this.eId}`],
      base64Encoded: false
    }
    this.formService.encrypt(encryptData).subscribe((encryptRes)=>{
      if(encryptRes.success){
        this.encryptedEmailId = encryptRes.data.string[0];
        const postData = {
          encryptedEmailId: this.encryptedEmailId,
          sendEmail: true,
          aId: this.aId,
          query: {
            ...this.paramObj
          }
        };
        delete postData.query.aid;
        this.formService.encryptedEmailPost(postData).subscribe((res) => {
          res.status = 200;
          this.publicService.showLoading(res);
          if (res.success) {
            this.sentSuccessfully=true
          }
        },
        (encryptError) => {
          this.publicService.showLoading(encryptError);
        }
      );

      }
    },
    (err)=>{

    }
    )
       
   
  }
}
