/**
 * Created by hlz on 17-3-1.
 */
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {FriendsService} from './friends.service';
import {CssService} from '../share/css.service';
import {Friend} from './friend';
import {Position} from '../space/position';

@Component({
               selector   : 'friends',
               templateUrl: './html/friends.component.html',
               styles     : [require('./scss/friends.component.scss')]
           })
export class FriendsComponent implements OnInit, OnDestroy {

    protected friendsList: Friend[];


    protected positions: Position[];


    private subscriptionFriends: Subscription;


    private subscriptionPositions: Subscription;


    constructor(
        private apiRoutesService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private friendsService: FriendsService,
        private cssService: CssService,
    ) {

        this.subscriptionFriends = friendsService.friendsList$.subscribe(
            friendsList => {
                this.friendsList = friendsList;
            }
        );

        this.subscriptionPositions = friendsService.friendsPositions$.subscribe(
            positions => {
                this.positions = positions;
            }
        )
    }

    ngOnInit() {
        this.friendsList = this.friendsService.friendsList;
        this.positions   = this.friendsService.friendsPositions;
    }


    trackByFriends(index: number, friend: Friend) {return friend.user_id}


    friendsStyles(x: number, y: number) {
        let styles = {};

        styles[this.cssService.getTransform] = 'translate3d(' + x + 'rem, ' + y + 'rem, 0rem)';

        return styles;
    }


    addFriend(friend_id: number) {
        let data = new FormData();
        data.append('friend_id', friend_id);

        this.apiHttpService.post(this.apiRoutesService.createFriend, data).subscribe(
            response => {
                console.log(response);
            }
        )
    }


    ngOnDestroy() {
        this.subscriptionFriends.unsubscribe();
        this.subscriptionPositions.unsubscribe();
    }

}