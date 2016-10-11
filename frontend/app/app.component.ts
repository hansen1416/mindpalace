import {Component, OnInit} from '@angular/core';
import {UserService} from './user/user.service';
import {User} from './user/user';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    title: string = 'Mind Palace';

    constructor(private userService: UserService,
                private user: User) {
    }

    ngOnInit() {
        this.userService.authenticate().subscribe(
            (response) => {
                this.user = response;
                console.log(this.user);
            }
        );


        this.userService.ctg().subscribe(
            (response) => {
                console.log(response);
            }
        );
    }
}