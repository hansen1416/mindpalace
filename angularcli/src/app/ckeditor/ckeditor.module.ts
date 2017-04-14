import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CKEditorComponent} from './ckeditor.component';
import {CKButtonDirective} from './ckbutton.directive';
import {CKGroupDirective} from './ckgroup.directive';
import {CKEditorService} from './ckeditor.service';

@NgModule({
              imports     : [
                  CommonModule
              ],
              declarations: [
                  CKEditorComponent,
                  CKButtonDirective,
                  CKGroupDirective
              ],
              exports     : [
                  CKEditorComponent,
                  CKButtonDirective,
                  CKGroupDirective
              ],
              providers   : [
                  CKEditorService
              ]
          })
export class CKEditorModule {
}