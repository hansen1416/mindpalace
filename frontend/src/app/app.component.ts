import {Component, OnInit} from '@angular/core';

// import {TranslateService} from 'ng2-translate/ng2-translate';

@Component({
               selector:    'my-app',
               templateUrl: 'app.component.html',
               styles:      [require("./app.component.scss")],
           })
export class AppComponent implements OnInit {


    constructor(
        // private translate:TranslateService,
    ) {
        // translate.setDefaultLang('zh');

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