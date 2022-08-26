import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PublicService } from './service/public.service';
import { FormService } from './service/form.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from './service/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public defaultLang = 'en_US';
  public Edgescape: string;
  public aId: string;
  public showApp: boolean = false;

  // Add language here for every additional language file
  public langList = ['en_US'];

  constructor(
    private translate: TranslateService,
    private formService: FormService,
    public publicService: PublicService,
    public cookieServ: CookieService,
    public route: ActivatedRoute,
    public router: Router,
    private titleSet: Title,
    public googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // console.log("inside events");
      //  console.log("helllllooooooosdsadasdsdgrgrgrr");
        this.googleAnalyticsService.addPageView(true);
      }
    });
    
    this.route.queryParams.pipe(debounceTime(1500)).subscribe((params) => {
      console.log('Params---'+params);
      this.aId = params.aid || 'acom';
      // this.publicService.getAppInformation(params.aid);
      if(this.publicService.localizedApp !== this.aId) {
        this.publicService.localizedApp = this.aId;
        this.publicService.responseLocale = cookieServ.get('agilent_locale') || this.defaultLang;
        this.translate.use(this.publicService.responseLocale + '&aid=' + this.aId.toUpperCase()).subscribe((data) => {
          // this.titleSet.setTitle(this.translate.instant('LOGIN.TAB_TITLE'));
          this.showApp = true;
        });
      }      
    });
    
    // this.translate.setDefaultLang(this.defaultLang);
    this.initData().then(data => {
      const keys = data.headers.keys();
      keys.map(key => {
        key === 'x-akamai-edgescape' ? this.Edgescape = data.headers.get(key) : '';
      });
      if (this.Edgescape === '') {
        this.Edgescape = data.body['x-akamai-edgescape'];
      }
      /* this.publicService.responseLocale = this.publicService.responseToJson(this.Edgescape) || this.defaultLang;
      if (this.publicService.responseLocale.indexOf('US') !== -1 || this.publicService.responseLocale === '') {
        this.publicService.responseLocale = this.defaultLang;
      }
      const getAkamaiLang = this.langList.includes(this.publicService.responseLocale) ? this.publicService.responseLocale : this.defaultLang; */
    });
  }

  
  async initData() {
    const data = await this.formService.getConfigResponse().toPromise();
    return data;
  }
  googleAnalytics(aId) {

    const gtmScript = document.createElement('script');
    const gtmNoScript = document.createElement('noscript');
    const comment = document.createComment('Google Tag Manager');
    const commentEnd = document.createComment('<End Google Tag Manager');
    const noComment = document.createComment('Google Tag Manager (noscript)');
    const noCommentEnd = document.createComment('End Google Tag Manager (noscript)');

    if (aId === 'acom') {
      gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-WJVXSD9');`;
      gtmNoScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WJVXSD9"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    }



    document.head.appendChild(comment);
    document.head.appendChild(gtmScript);
    document.head.appendChild(commentEnd);
    document.body.appendChild(noComment);
    document.body.appendChild(gtmNoScript);
    document.body.appendChild(noCommentEnd);
  }
}
