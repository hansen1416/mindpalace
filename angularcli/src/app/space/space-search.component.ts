/**
 * Created by hlz on 16-12-7.
 */
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {SpaceService} from './space.service';
import {UserService} from '../core/user.service';
import {MessageService} from '../message/message.service';
import {Space} from './space';
import {User} from '../core/user';

@Component({
               selector   : 'space-search',
               templateUrl: './html/space-search.component.html',
               styleUrls  : ['./scss/space-search.component.scss']
           })
export class SpaceSearchComponent implements OnInit, OnDestroy {

    public spaceName: string = '';

    private searchInProgress: boolean = false;

    public searched: boolean = false;

    private subscriptionUser: Subscription;

    public user: User = this.userService.getUserModel();

    constructor(
        private spaceService: SpaceService,
        private userService: UserService,
        private messageService: MessageService,
    ) {
    }


    ngOnInit() {
        this.subscriptionUser = this.userService.userModel$.subscribe(
            userModel => this.user = userModel
        )
    }


    ngOnDestroy() {
        this.subscriptionUser.unsubscribe();
    }

    /**
     * search spaces by space name
     */
    searchSpace() {

        if (!this.spaceName) {
            return;
        }

        if (this.searchInProgress) {
            return;
        }

        this.searchInProgress = true;

        this.spaceService.getSearchSpaceList(this.spaceName).subscribe(
            (response: Space[]) => {
                this.spaceService.setSpaces(response);

                this.searched         = true;
                this.searchInProgress = false;
            }
        );
    }

    /**
     * show all user available spaces after search conducted
     */
    showAll() {
        if (this.searchInProgress) {
            return;
        }

        this.searchInProgress = true;

        this.spaceService.getHomeSpaceList().subscribe(
            (response: Space[]) => {
                this.spaceService.setSpaces(response);

                this.searched         = false;
                this.searchInProgress = false;
            }
        );
    }


    fetchUrl(url: string) {

        this.messageService.webSocket.send4Direct(
            JSON.stringify({
                               url: url
                           })
        );


        // this.worker = new Worker('worker.js');
        // //post message to worker.js
        // this.worker.postMessage({
        //                             url : url,
        //                             lang: this.userService.getUserProperty('language')
        //                         });
        //
        // //receive the message from worker.js
        // this.worker.addEventListener('message', this.workerMessageListener);
    }

}