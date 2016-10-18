import {Component, OnInit} from '@angular/core';

// import {User} from './user/user';
// import {UserService} from './user/user.service';
// import {LangService} from './lang/lang.service';

@Component({
               selector:    'my-app',
               templateUrl: 'app.component.html',
               styles:      [require("./app.component.scss")],
               // providers:   [
               //     {provide: LANG, useValue: local},
               // ]
           })
export class AppComponent implements OnInit {


    constructor(
        // private langService: LangService
        // private userService: UserService,
        // private user: User
    ) {


    }

    ngOnInit() {
        // console.log(this.langService.getLang(''));

    // console.log(this.langService.getLang(''));
        // this.userService.authenticate().subscribe(
        //     (response) => {
        //         this.user = response;
        //         console.log(this.user);
        //
        //         this.userService.ctg(this.user).subscribe(
        //             (response) => {
        //                 console.log(response);
        //             }
        //         );
        //
        //     }
        // );

    }
}