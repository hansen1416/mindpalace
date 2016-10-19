/**
 * Created by mok on 16-10-19.
 */
import {Pipe, PipeTransform} from '@angular/core';

import {LangService} from './lang.service';

@Pipe({
          name: 'translate',
          pure: false
      })
export class LangPipe implements PipeTransform {


    constructor(private langService: LangService) {

    }


    transform(text: string): string {
        return this.langService.translate(text);
    }

}