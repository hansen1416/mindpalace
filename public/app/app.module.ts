import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent}   from './app.component';
import {ClickMeComponent}   from './click-me.component';
import {KeyUpComponent_v1}   from './key-up.component';
@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent, ClickMeComponent, KeyUpComponent_v1],
    bootstrap: [AppComponent, ClickMeComponent, KeyUpComponent_v1]
})
export class AppModule {
}