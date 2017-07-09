/**
 * Created by hlz on 17-3-1.
 */
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {FriendsService} from './friends.service';
import {CssService} from '../share/css.service';
import {MessageService} from '../message/message.service';
import {Friend} from './friend';
import {Position} from '../share/coordinates';

@Component({
               selector:    'friends',
               templateUrl: './html/friends.component.html',
               styleUrls:   ['./scss/friends.component.scss']
           })
export class FriendsComponent implements OnInit, OnDestroy {

    public friendsList: Friend[];

    protected positions: Position[];

    private subscriptionFriends: Subscription;

    private subscriptionPositions: Subscription;


    constructor(
        private apiRoutesService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private friendsService: FriendsService,
        private cssService: CssService,
        private messageService: MessageService
    ) {

        this.subscriptionFriends = friendsService.friendsList$.subscribe(
            friendsList => this.friendsList = friendsList
        );

        this.subscriptionPositions = friendsService.friendsPositions$.subscribe(
            positions => this.positions = positions
        )
    }

    ngOnInit() {

        if (this.friendsService.friendsList && this.friendsService.friendsPositions) {
            this.friendsList = this.friendsService.friendsList;
            this.positions   = this.friendsService.friendsPositions;
        } else {

            this.apiHttpService.get(this.apiRoutesService.friendsList).subscribe(
                (response: Friend[]) => this.friendsService.setFriendsList(response)
            );
        }

    }


    ngOnDestroy() {
        this.subscriptionFriends.unsubscribe();
        this.subscriptionPositions.unsubscribe();
    }


    trackByFriends(index: number, friend: Friend) {
        return friend.user_id
    }

    /**
     * friend item position style
     * @param x
     * @param y
     * @returns {{}}
     */
    friendsStyles(x: number, y: number) {
        let styles = {};

        styles[this.cssService.getTransform] = 'translate3d(' + x + 'rem, ' + y + 'rem, 0rem)';

        return styles;
    }

    /**
     * add a new friend
     * @param friend
     */
    addFriend(friend: Friend) {
        let data = new FormData();
        data.append('friend_id', friend.user_id);

        this.apiHttpService.post(this.apiRoutesService.createFriend, data).subscribe(
            response => this.messageService.handleResponse(response, () => {
                friend.is_friend = 1;
                this.messageService.showFlashMessage('message.new_friend-' + friend.name);
            })
        );
    }

    /**
     * delete a friend
     * @param friend
     */
    deleteFriend(friend: Friend) {
        let data = new FormData();
        data.append('friend_id', friend.user_id);

        this.apiHttpService.post(this.apiRoutesService.deleteFriend, data).subscribe(
            response => this.messageService.handleResponse(response, () => {
                friend.is_friend = 0;
                this.messageService.showFlashMessage('message.delete_friend-' + friend.name);
            })
        );
    }

}