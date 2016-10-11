import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {Hero} from './hero';

@Injectable()
export class HeroService {

    private heroesUrl: string = 'http://api.mindpalaces.com/api/home';

    private headers = new Headers();

    private handleError(error: any): Promise<any> {
        console.error('error occurred', error);
        return Promise.reject(error.message || error);
    }

    constructor(private http: Http) {}

    getHeroes(): Promise<Hero[]> {

        // this.headers.append('X-CSRF-TOKEN', '1oKzQKqk980SMCsKCViKJxIgYJhvHbUwUFBIRbdK');
        // this.headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.heroesUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => {
                       console.log(response);
                       return [{id: 1, name: '2'}];
                   })
                   .catch(this.handleError);

    }

    // getHeroesSlowly(): Promise<Hero[]> {
    //     return new Promise<Hero[]>(resolve =>
    //         setTimeout(resolve, 2000)) // delay 2 seconds
    //         .then(() => this.getHeroes());
    // }

    getHero(id: number): Promise<Hero> {
        return this.getHeroes().then(heroes => heroes.find(hero=>hero.id === id));
    }
}