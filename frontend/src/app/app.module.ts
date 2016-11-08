import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
/* App root */
import {AppComponent}  from './app.component';
/* Feature Modules */
import {LangModule} from './lang/lang.module';
import {CoreModule} from './core/core.module';
import {SpaceModule} from './space/space.module';


@NgModule({
              imports     : [
                  BrowserModule,
                  HttpModule,
                  FormsModule,
                  LangModule,
                  CoreModule,
                  SpaceModule,
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
