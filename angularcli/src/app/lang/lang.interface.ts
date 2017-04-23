/**
 * Created by hlz on 16-10-17.
 */
export interface LangInterface {
    user: {
        email_placeholder: string,
        email_required: string,
        email_validation: string,
        password_placeholder: string,
        password_required: string,
        confirm_password_placeholder: string,
        confirm_password_required: string,
        confirm_password_invalid: string,
        name_placeholder: string,
        name_required: string,
        login: string,
        register: string,
        login_failed: string,
        web_link: string,
        choose_file: string,
        logout: string,
        search_friends_placeholder: string,
    },
    space: {
        show_all: string,
        search_space: string,
        fetch_url: string,
        new_space_placeholder: string,
    },
    ctg: {
        title_placeholder: string,
    },
    action: {
        save: string,
        home: string,
        yes: string,
        no: string,
        link: string,
        share: string,
    },
    message: {
        ctg_content_updated: string,
        confirm_delete_ctg: string,
        delete_ctg: string,
        link_ctg_to_space: string,
        user_profile_updated: string,
    },

}