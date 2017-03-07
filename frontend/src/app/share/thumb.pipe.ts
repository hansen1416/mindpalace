/**
 * Created by hlz on 17-3-3.
 */
import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
          name: 'thumb',
          pure: false
      })
export class ThumbPipe implements PipeTransform {

    transform(src: string): string {

        console.log(src);
        if (src == '0') {
            return src.replace(/(\.\w+)$/, function(match, p1){
                return '-t' + p1;
            });
        }else{
            // console.log(src);
        }
    }

}