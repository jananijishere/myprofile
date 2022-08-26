import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicService } from '../../service/public.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-errorpage',
  templateUrl: './errorPage.component.html',
  styleUrls: ['./errorPage.component.scss']
})
export class ErrorPageComponent implements OnInit {
  public aId: string;
  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService,
    private titleSet: Title,
    public translate: TranslateService
    ) { }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.aId = params.aid || 'acom';
      this.publicService.getAppInformation(this.aId);
    });
    this.titleSet.setTitle(this.translate.instant('LOGIN.TAB_TITLE'));
  }
}
