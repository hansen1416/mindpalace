/**
 * Created by hlz on 17-3-1.
 */
import {Component} from '@angular/core';

import {ApiHttpService} from '../share/api-http.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {FriendsService} from './friends.service';

@Component({
               selector   : 'friends-search',
               templateUrl: './html/friends-search.component.html',
               styles     : [require('./scss/friends-search.component.scss')]
           })
export class FriendsSearchComponent {


    constructor(
        private apiHttpService: ApiHttpService,
        private apiRoutesService: ApiRoutesService,
        private friendsService: FriendsService
    ) {

    }


    searchUser(searchName: string) {

        if (searchName === '') {
            return;
        }

        let data = new FormData();

        data.append('name', searchName);

        this.apiHttpService.post(this.apiRoutesService.searchUser, data).subscribe(
            userList => {
                this.friendsService.setFriendsList(userList);
            }
        );
    }

}