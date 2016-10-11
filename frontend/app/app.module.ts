import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
              imports:      [ BrowserModule ],
              providers:    [ Logger ],
              declarations: [ AppComponent ],
              exports:      [ AppComponent ],
              bootstrap:    [ AppComponent ]
          })
export class AppModule { }
