/**
 * Created by hlz on 17-3-1.
 */
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {ConcentricService} from '../space/concentric.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {FriendsService} from './friends.service';
import {CssService} from '../share/css.service';
import {Friend} from './friend';

@Component({
               selector   : 'friends',
               templateUrl: './html/friends.component.html',
               styles     : [require('./scss/friends.component.scss')]
           })
export class FriendsComponent implements OnInit, OnDestroy {

    protected friendsList: Array<Friend>;


    protected positions;


    private subscription: Subscription;


    constructor(
        private concentricService: ConcentricService,
        private apiRoutesService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private friendsService: FriendsService,
        private cssService: CssService,
    ) {

        this.subscription = friendsService.friendsList$.subscribe(
            friendsList => {
                this.friendsList = friendsList;

                this.concentricService.setConcentricCircles(this.friendsList);
                this.positions = this.concentricService.getPositions;
            }
        );
    }

    ngOnInit() {
        this.concentricService.defineSize(24, 40, 8, 10);
    }


    trackByFriends(index: number, friend: Friend) {return friend.user_id}


    friendsStyles(x: number, y: number) {
        let styles = {};

        styles[this.cssService.getTransform] = 'translate3d(' + x + 'rem, ' + y + 'rem, 0rem)';

        return styles;
    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}