/**
 * Created by mok on 16-10-18.
 */
import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';

import {LangService} from './lang.service';
import {LangPipe} from "./lang.pipe";

@NgModule({
              imports     : [CommonModule],
              declarations: [LangPipe],
              providers   : [LangService],
              exports     : [LangPipe],
          })
export class LangModule {

}