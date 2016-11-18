import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

/* Feature Modules */
import {AppRoutingModule} from './app-routing.module';
import {LangModule} from './lang/lang.module';
import {CoreModule} from './core/core.module';
import {SpaceModule} from './space/space.module';
import {CtgModule} from './ctg/ctg.module';

/* App root */
import {AppComponent}  from './app.component';


@NgModule({
              imports     : [
                  BrowserModule,
                  HttpModule,
                  FormsModule,
                  AppRoutingModule,
                  LangModule,
                  CoreModule,
                  SpaceModule,
                  CtgModule,
              ],
              declarations: [
                  AppComponent,
              ],
              bootstrap   : [
                  AppComponent
              ],
          })
export class AppModule {
}
