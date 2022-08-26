import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myaccount-navbar',
  templateUrl: './myaccount-navbar.component.html',
  styleUrls: ['./myaccount-navbar.component.scss']
})
export class MyaccountNavbarComponent implements OnInit {
  public currentUrl: any;
  public redirectURI: string;
  public subContext: string;
  public hostName: string;
  public logoutUrl: string;
  public soldToLength: number;
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    // let entitlementData: any =
    // localStorage.getItem('entitlementData') !== undefined &&
    // localStorage.getItem('entitlementData') !== null
    //   ? localStorage.getItem('entitlementData')
    //   : '';
    // if (entitlementData) {
    //   entitlementData = JSON.parse(entitlementData);
    //   this.soldToLength = entitlementData.data.entitledSoldTo.soldToId.length;
    // }
  }

  // logout() {
  //   this.commnService.logout();
  //   // this.currentUrl = this.router.url;
  //   // localStorage.setItem('current-url', this.currentUrl);

  //   // this.redirectURI = this.preLogin.appInfo.redirectURI;
  //   // this.subContext = this.preLogin.appInfo.subContext;
  //   // this.hostName = this.preLogin.appInfo.hostName;
  //   // this.logoutUrl = `${this.hostName}${this.subContext}${environment.appLogout}`;
  //   // const challenge = localStorage.getItem('challenge');
  //   // const verifier = localStorage.getItem('verifier');
  //   // const state = this.preLogin.getState();
  //   // const nonce = this.preLogin.getNonce();
  //   // sessionStorage.setItem('state', localStorage.getItem('state'));
  //   // sessionStorage.setItem('verifier', localStorage.getItem('verifier'));
  //   // sessionStorage.setItem('challenge', localStorage.getItem('challenge'));
  //   // localStorage.clear();
  //   // localStorage.setItem('challenge', challenge);
  //   // localStorage.setItem('verifier', verifier);
  //   // window.location.href = `${this.logoutUrl}?state=${encodeURIComponent(
  //   //   state
  //   // )}&challenge=${challenge}&nonce=${encodeURIComponent(nonce)}&aid=${
  //   //   environment.aid
  //   // }&redirect_uri=${this.redirectURI}&lgt=2`;
  // }
  /**
   * This method is used for redirecting back to agilent home
   */
  // redirectToAgilent() {
  //   let windowReference;
  //   windowReference = window.open('', '_self');
  // }
}
