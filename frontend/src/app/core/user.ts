/**
 * Created by mok on 16-10-11.
 */
export class User {

    public user_id: number;
    public name: string;
    public email: string;
    public password: string;
    public access_token: string;
    public refresh_token: string;
    public userLanguage: string;
    public create_at:string;
    public update_at:string;

    constructor(
        user_id?: number,
        name?: string,
        email?: string
    ) {
        this.user_id = user_id;
        this.name    = name;
        this.email   = email;
    }

}