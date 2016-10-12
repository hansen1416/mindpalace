/**
 * Created by mok on 16-10-11.
 */
export class User {

    constructor(
        public user_id: number,
        public username: string,
        public email: string,
        private password: string,
        public access_token?: string,
        public refresh_token?: string,
    ) {}

}