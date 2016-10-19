/**
 * Created by mok on 16-10-18.
 */
import {NgModule}            from '@angular/core';
import {CommonModule}        from '@angular/common';
import {FormsModule}         from '@angular/forms';

import {LangModule}         from '../lang/lang.module';

import {HighlightDirective}  from './highlight.directive';
import {ApiRoutesService} from './api-routes.service';


@NgModule({
              imports     : [CommonModule],
              declarations: [
                  HighlightDirective
              ],
              providers   : [
                  ApiRoutesService,
              ],
              exports     : [
                  HighlightDirective,
                  CommonModule,
                  FormsModule,
                  LangModule,
              ]
          })
export class SharedModule {
}