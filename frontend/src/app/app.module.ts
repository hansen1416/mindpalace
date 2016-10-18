import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {LangModule} from './lang/lang.module';


import {AppComponent}  from './app.component';
import {HighlightDirective} from './highlight.directive';
import {UserService} from './user/user.service';
import {UserLoginComponent} from './user/user-login.component';



@NgModule({
              imports     : [
                  BrowserModule,
                  HttpModule,
                  FormsModule,
                  LangModule,
              ],
              declarations: [
                  AppComponent,
                  HighlightDirective,
                  UserLoginComponent,
              ],
              providers   : [
                  UserService,
              ],
              // exports     : [],
              bootstrap   : [
                  AppComponent
              ],
          })
export class AppModule {
}
