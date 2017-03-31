/**
 * Created by hlz on 16-10-19.
 */
export class ApiRoutesService {

    private api_url = 'http://api.mindpalaces.com/api/';

    get register(): string {
        return this.api_url + 'register';
    }

    get login(): string {
        return this.api_url + 'login';
    }

    get gitLogin(): string {
        return this.api_url + 'login/github';
    }

    get home(): string {
        return this.api_url + 'home';
    }

    get user(): string {
        return this.api_url + 'user';
    }

    get createSpace(): string {
        return this.api_url + 'space/create';
    }


    get searchSpace(): string {
        return this.api_url + 'space/search';
    }


    ctgList(space_id: number, ctg_id?: number): string {
        return ctg_id
            ? this.api_url + 'space/' + space_id + '/ctg/' + ctg_id
            : this.api_url + 'space/' + space_id + '/ctg';
    }


    ctgMove(space_id: number, ctg_id: number, pid: number): string {
        return this.api_url + 'ctg/move/space/' + space_id + '/ctg/' + ctg_id + '/pid/' + pid;
    }


    ctgContent(ctg_id: number): string {
        return this.api_url + 'ctg/content/' + ctg_id;
    }

    //delete ctg
    ctgDelete(ctg_id: number) {
        return this.api_url + 'ctg/delete/' + ctg_id;
    }


    get saveCtgContent(): string {
        return this.api_url + 'ctg/saveCtgContent';
    }


    get createCtg(): string {
        return this.api_url + 'ctg/createCtg';
    }


    get logout(): string {
        return this.api_url + 'user/logout';
    }

    get updateProfile(): string {
        return this.api_url + 'profile/update';
    }

    get searchUser(): string {
        return this.api_url + 'user/search';
    }

    get createFriend(): string {
        return this.api_url + 'friends/create';
    }

    get friendsList(): string {
        return this.api_url + 'friends/lists';
    }

}
