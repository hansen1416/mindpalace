/**
 * Created by hlz on 16-10-11.
 */
export class User {

    user_id: number;
    name: string;
    email: string;
    password: string;
    access_token: string;
    refresh_token: string;
    created_at: string;
    updated_at: string;
    language: string;
    portrait: string;
    theme_id: string;

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
