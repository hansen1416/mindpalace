/**
 * Created by mok on 16-10-18.
 */
import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';

import {LangService} from './lang.service';

@NgModule({
              imports  : [CommonModule],
              providers: [LangService]
          })
export class LangModule {

}