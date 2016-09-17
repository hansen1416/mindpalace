import {Component} from '@angular/core';
@Component({
    selector: 'key-up',
    template: `
        <input #box 
        (keyup.enter)="values = box.value"
        (blur)="values=box.value">
        
        <p>{{values}}</p>
      `
})
export class KeyUpComponent_v1 {
    values = '';

    // without strong typing
    // onKey(value: string) {
    // this.values += value + ' | ';
    // }
}
