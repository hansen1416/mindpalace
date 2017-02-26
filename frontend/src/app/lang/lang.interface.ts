/**
 * Created by hlz on 16-10-17.
 */
export interface LangInterface {
    user: {
        email_placeholder: string,
        email_required: string,
        email_validation: string,
        password_placeholder: string,
        confirm_password_placeholder:string,
        password_required: string,
        login: string,
        register: string,
        login_failed: string,
        web_link: string,
        choose_file: string,
        logout: string,
    },
    space: {
        show_all: string,
        search_space: string,
        fetch_url: string
    },
    action: {
        save: string,
    }

}