import { Component, OnInit } from '@angular/core';

import { PublicService } from '../../service/public.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public Datetime = Date.now();
  public aId: string = '';
  public showContactSupport: boolean = false;
  public showOpenSourceSoftwareNotice: boolean = false;

  constructor(
    public publicService: PublicService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.aId = params.aid || 'acom';
    });
  }
  ngOnInit() {

  }

  getYear(Datetime) {
    return parseInt(Datetime);
  }
}
