import {Component} from '@angular/core';
import {Hero} from './hero';
@Component({
    selector: 'my-app',
    template: `<h1>{{title}}</h1>
                    <h2>My favorite hero is: {{myHero.name}}</h2>
                <p>Heroes:</p>
                <ul>
                    <li *ngFor="let hero of heroes">
                        {{ hero.id }}
                        {{ hero.name }}
                    </li>
                </ul>`
})
export class AppComponent {
    title = 'Tour of Heroes';
    heroes = [
        new Hero(1, 'Windstorm'),
        new Hero(2, 'Bomb'),
        new Hero(3, 'Magneta'),
        new Hero(4, 'Tornado')
    ];
    myHero = this.heroes[0];
}