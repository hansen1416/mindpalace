/**
 * Created by hlz on 17-5-8.
 */
import {Pipe, PipeTransform} from '@angular/core';

import {Space} from '../space/space';

@Pipe({
          name: 'searchSpace',
          pure: false
      })
export class SearchSpacePipe implements PipeTransform {

    constructor() {}

    /**
     * filter space list with space name, used in ctg-content, move link and copy action
     * @param spaces
     * @param name
     * @returns {Space[]}
     */
    transform(spaces: Space[], name: string): Space[] {
        if (!spaces || !name) {
            return spaces;
        }
        return spaces.filter(space => space.name.toLowerCase().includes(name.toLowerCase()));
    }
}