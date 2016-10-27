/**
 * Created by mok on 16-10-19.
 */
export class ApiRoutesService {

    private api_url = 'http://api.mindpalaces.com/api/';

    get login():string {
        return this.api_url + 'login';
    }

    get ctg():string {
        return this.api_url + 'ctg';
    }

    get user():string {
        return this.api_url + 'user';
    }

}
