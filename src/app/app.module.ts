import { CustomTranslateLoader } from "./service/custom-trans.service";
import { environment } from "./../environments/environment";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { FooterComponent } from "./shared/footer/footer.component";
import { HeaderComponent } from "./shared/header/header.component";
import { NotFoundComponent } from "./components/NotFound/NotFound.component";

import {
  HttpClientModule,
  HttpClientJsonpModule,
  HttpClient,
} from "@angular/common/http";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { GoogleAnalyticsService } from "../app/service/google-analytics.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SharedModule } from "./shared/shared.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

export function createTranslateHttpLoader(http: HttpClient) {
  return new CustomTranslateLoader(http);
  // return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SharedModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateHttpLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [CookieService, GoogleAnalyticsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
