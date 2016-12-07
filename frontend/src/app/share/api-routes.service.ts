/**
 * Created by mok on 16-10-19.
 */
export class ApiRoutesService {

    private api_url = 'http://api.mindpalaces.com/api/';

    get login(): string {
        return this.api_url + 'login';
    }

    get home(): string {
        return this.api_url + 'home';
    }

    get user(): string {
        return this.api_url + 'user';
    }

    space(space_id: number): string {
        return this.api_url + 'space/' + space_id;
    }

    get createSpace(): string {
        return this.api_url + 'space/create';
    }


    get searchSpace(): string {
        return this.api_url + 'space/search';
    }

}
