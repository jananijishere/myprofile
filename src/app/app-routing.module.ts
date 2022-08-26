import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../app/components/Login/login.component';
import { TranslateModule } from '@ngx-translate/core';
import { NotFoundComponent } from './components/NotFound/NotFound.component';
import { AuthComponent } from './components/auth/auth.component';


const routes: Routes = [
  { path: '', loadChildren: '../app/components/Login/login.module#LoginModule' },
  { path: 'auth', loadChildren: '../app/components/auth/auth.module#AuthModule'},
  { path: 'login', loadChildren: '../app/components/Login/login.module#LoginModule'  },
  { path: 'sso/signout', loadChildren: '../app/components/Signout/signout.module#SignoutModule' },
  { path: 'signout', loadChildren: '../app/components/Signout/signout.module#SignoutModule' },
  { path: 'noaccess', loadChildren: '../app/components/NoAccess/noAccess.module#NoAccessModule' },
  { path: 'errorpage', loadChildren: '../app/components/ErrorPage/errorPage.module#ErrorPageModule' },
  { path: 'internal-login', loadChildren: '../app/components/internal-login/internal-login.module#InternalLoginModule' },
  { path: 'forgot-password', loadChildren: '../app/components/forgot-password/forgot-password.module#ForgotPasswordModule' },
  { path: 'reset-password/:token', loadChildren: '../app/components/reset-password/reset-password.module#ResetPasswordModule' },
  { path: 'myprofile', loadChildren: '../app/components/my-profile/my-profile.module#MyProfileModule' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
