/**
 * Created by mok on 16-10-18.
 */
import {NgModule}            from '@angular/core';
import {CommonModule}        from '@angular/common';
import {FormsModule}         from '@angular/forms';

import {LangModule}         from '../lang/lang.module';

import {ErrorDirective}  from './error.directive';
import {ApiRoutesService} from './api-routes.service';
import {ApiHttpService} from './api-http.service';
import {CssService} from './css.service';
import {ThreeService} from './three.service';

@NgModule({
              imports     : [CommonModule],
              declarations: [
                  ErrorDirective
              ],
              exports     : [
                  ErrorDirective,
                  CommonModule,
                  FormsModule,
                  LangModule,
              ],
              providers   : [
                  ApiRoutesService,
                  ApiHttpService,
                  CssService,
                  ThreeService,
              ],
          })
export class SharedModule {
}