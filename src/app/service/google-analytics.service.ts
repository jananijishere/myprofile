import { Injectable, Renderer2, Inject, RendererFactory2 } from '@angular/core';
import { PublicService } from './public.service';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common'

declare let gtag:Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  public gaIdurl: string;
  public gaUrl = environment.gaUrl || '//www.googletagmanager.com/gtag/js?id=';
  private renderer: Renderer2
  constructor(
    private publicService: PublicService,
    rendererFactory: RendererFactory2,
   @Inject(DOCUMENT) private _document: Document
  ) { this.renderer = rendererFactory.createRenderer(null, null);
   }
  public eventEmitter( 
    eventAction: string, 
    eventCategory: string, 
    eventLabel: string = null,  
    eventValue: number = null ){ 
      // gtag("config", "GTM-KQNCLV4"); 
      //    gtag('event', eventAction, { 
      //            eventCategory: eventCategory, 
      //            eventLabel: eventLabel, 
      //            eventValue: eventValue
      //          })
     }
 public addDatalayer (var1, var2, var3, var4) {
  if(this.publicService.googleAnalyticsId)  {
    const d = document.getElementById("testGA");
    if(d) {
   //   d.remove();
   d.parentNode.removeChild(d);
    }
    this.gaIdurl= `${this.gaUrl}${this.publicService.googleAnalyticsId}`;
    const s = this.renderer.createElement('script');
    s.type = `text/javascript`;
    s.id = 'testGA';
    s.src = this.gaIdurl;
    this.renderer.appendChild(this._document.body, s);
    window.dataLayer.push({
                'event': 'eventTracker', 
                'eventCat': var2, 
                'eventAct': var1, 
                'eventLbl': var3, 
                'eventVal': var4
            });
          }
        }

        public addPageView(isCalled) {
          this.publicService.appInfoLoadComplete.subscribe((data) => {
          if(this.publicService.googleAnalyticsId && isCalled)  {
            const d = document.getElementById("testGA");
            if(d) {
           //   d.remove();
           d.parentNode.removeChild(d);
            }
            isCalled = false;
            this.gaIdurl= `${this.gaUrl}${this.publicService.googleAnalyticsId}`;
            const s = this.renderer.createElement('script');
            s.id = 'testGA';
            s.type = `text/javascript`;
            s.src = this.gaIdurl;
            // s.async=true;
            this.renderer.appendChild(this._document.body, s);
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            //var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';         
                // s.async=true;
               // j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;
               // f.parentNode.insertBefore(j,f);
            }
        )(window, document,'script','dataLayer',`${this.publicService.googleAnalyticsId}`);
        }
      })
    }
}
