import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";


@Injectable()
export class CustomTranslateLoader implements TranslateLoader  {
  public showApp = false;
  public aId = 'acom';
  // public apiBasePath = 'https://dev-register.agilent.com/account/identity/api/v1';
  public apiBasePath = '/account/identity/api/v1';
  
  constructor(private http: HttpClient) {};
  getTranslation(lang: string): Observable<any>{
    console.log('Custom translate loader--' + this.showApp);
    const curAid = '&'+lang.split('&')[1];
    return Observable.create(observer => {
      this.http.get(`${this.apiBasePath}/locale/info?localId=${lang}`).subscribe((res: Response) => {
        this.showApp = true;
        observer.next(res);
        observer.complete();
        console.log(res + '---' + this.showApp);
      },
      () => {
        //  failed to retrieve current locale from api, switch to deault
        this.http.get(`${this.apiBasePath}/locale/info?localId=en_US${curAid}`).subscribe((res: Response) => {
          this.showApp = true;
          observer.next(res);
          observer.complete();
          console.log(res + '---' + this.showApp);
        },
        () => {
          //  failed to retrieve from api, switch to local
          this.http.get("./assets/locale/en_US.json").subscribe((res: Response) => {
            this.showApp = true;
              observer.next(res);
              observer.complete();
          })
        });
      });
    }); 
  }
}