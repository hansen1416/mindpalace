import {Component} from '@angular/core';

@Component({
               moduleId: module.id,
               selector: 'my-app',
               template: `
                        <h1>{{title}}</h1>
                        <nav>
                            <a>Dashboard</a>
                            <a>Heroes</a>
                        </nav>
                    `
           })
export class AppComponent {
    title: string = 'Tour of Heroes';

    constructor() {
    }
}