/**
 * Created by mok on 16-10-18.
 */
import {NgModule}            from '@angular/core';
import {CommonModule}        from '@angular/common';
import {FormsModule}         from '@angular/forms';

import {HighlightDirective}  from './highlight.directive';

@NgModule({
              imports     : [CommonModule],
              declarations: [
                  HighlightDirective
              ],
              exports     : [
                  HighlightDirective,
                  CommonModule,
                  FormsModule,
              ]
          })
export class SharedModule {
}