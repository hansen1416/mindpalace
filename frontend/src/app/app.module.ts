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
import {ProfileModule} from './profile/profile.module';
import {FriendsModule} from './friends/friends.module';

import {MessageComponent} from './share/message.component';

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
                  ProfileModule,
                  FriendsModule,
              ],
              declarations: [
                  AppComponent,
                  MessageComponent,
              ],
              bootstrap   : [
                  AppComponent
              ],
          })
export class AppModule {
}
