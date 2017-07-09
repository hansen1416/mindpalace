import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CKEditorComponent} from './ckeditor.component';
import {CKEditorService} from './ckeditor.service';

@NgModule({
              imports     : [
                  CommonModule
              ],
              declarations: [
                  CKEditorComponent,
              ],
              exports     : [
                  CKEditorComponent,
              ],
              providers   : [
                  CKEditorService
              ]
          })
export class CKEditorModule {
}