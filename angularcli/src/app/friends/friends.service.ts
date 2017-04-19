/**
 * Created by hlz on 17-3-1.
 */
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {ConcentricService} from '../space/concentric.service';
import {Friend} from './friend';
import {Position} from '../share/coordinates';

@Injectable()
export class FriendsService {

    public friendsList: Friend[];

    private friendsListSource = new Subject<Friend[]>();

    public friendsList$ = this.friendsListSource.asObservable();

    public friendsPositions: Position[];

    private friendsPositionsSource = new Subject<Position[]>();

    public friendsPositions$ = this.friendsPositionsSource.asObservable();

    constructor(
        private concentricService: ConcentricService
    ) {

    }


    setFriendsList(friendsList: Array<Friend>) {
        this.friendsPositions = this.concentricService.setConcentricCircles(friendsList.length, {
            a: 24,
            b: 40,
            k: 8,
            g: 10
        });
        this.friendsPositionsSource.next(this.friendsPositions);

        this.friendsList = friendsList;
        this.friendsListSource.next(this.friendsList);

    }


}
