/**
 * Created by hlz on 17-3-3.
 */
import {Pipe, PipeTransform} from '@angular/core';

/**
 * show the thumb image
 */
@Pipe({
          name: 'thumb',
          pure: false
      })
export class ThumbPipe implements PipeTransform {

    transform(src: string): string {

        if (src !== '0') {
            return src.replace(/(\.\w+)$/, function (match, p1) {
                return '-t' + p1;
            });
        } else {
            let hostname = location.hostname;

            return 'http://' + hostname.replace('www', 'api') + '/portrait/0.jpg';
        }
    }

}