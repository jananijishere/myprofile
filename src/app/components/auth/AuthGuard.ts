import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  CanLoad,
  CanDeactivate,
  Resolve,
  ActivatedRoute,
  NavigationExtras
} from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { Observable } from 'rxjs';
import { CryptoUtil } from 'src/app/utils/CryptoUtil';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad, CanDeactivate<any>, Resolve<any> {
  constructor(private router: Router, private routerRecieve: ActivatedRoute, private routerNavigator: Router,
    ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return true;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    const aid = route.queryParams.aid || 'acom';
    const redirect_uri = route.queryParams.redirectURI || '';
    const stateCode = route.queryParams.state || '';
    const challengeCode = route.queryParams.challengeCode || route.queryParams.challenge ||'';
    const nonceCode = route.queryParams.nonce || '';
    
    return new Observable((observer) => {
      var kir = localStorage.getItem("kir");
      var kirObj;
      if(kir){
        // var deCryptStr = CryptoUtil.getDAes(kir);
        kirObj = JSON.parse(kir);
        if(kirObj && kirObj.isPass){
          observer.next(true);
          observer.complete();
        }else{
          observer.next(false);
          if(aid && redirect_uri && stateCode && challengeCode && nonceCode){
            this.router.navigate(['login'], { queryParams: {aid: aid, redirectURI: redirect_uri, state: stateCode, challenge: challengeCode, nonce: nonceCode} });
          }else{
            this.router.navigate(['login']);
          }
        }
      }else{
        observer.next(false);
        if(aid && redirect_uri && stateCode && challengeCode && nonceCode){
          this.router.navigate(['login'], { queryParams: {aid: aid, redirectURI: redirect_uri, state: stateCode, challenge: challengeCode, nonce: nonceCode} });
        }else{
          this.router.navigate(['login']);
        }
      }
      
     
    });
  }

  canDeactivate(
    component: null,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot) {

    return true;
  }

  canActivateChild() {

    return true;
  }

  canLoad(route: Route) {
    return true;
  }
}
