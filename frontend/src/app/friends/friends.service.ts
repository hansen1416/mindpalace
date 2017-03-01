/**
 * Created by hlz on 17-3-1.
 */
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {Friend} from './friend';

@Injectable()
export class FriendsService {
    private friendsList: Array<Friend>;

    private friendsListSource = new Subject<Array<Friend>>();

    public friendsList$ = this.friendsListSource.asObservable();


    setFriendsList(friendsList: Array<Friend>) {
        this.friendsList = friendsList;
        this.friendsListSource.next(this.friendsList);
    }


}
