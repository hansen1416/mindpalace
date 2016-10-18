import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
// import {TranslateModule} from 'ng2-translate/ng2-translate';

import {AppComponent}  from './app.component';
import {UserService} from './user/user.service';
import {UserLoginComponent} from './user/user-login.component';


@NgModule({
              imports     : [
                  BrowserModule,
                  HttpModule,
                  FormsModule,
                  // TranslateModule.forRoot()
              ],
              declarations: [
                  AppComponent,
                  UserLoginComponent
              ],
              bootstrap   : [
                  AppComponent
              ],
              providers   : [
                  // User,
                  UserService,
                  // LangService,
              ]
              // exports     : [],
          })
export class AppModule {
}
