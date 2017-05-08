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
        handling: string,
        save: string,
        home: string,
        yes: string,
        no: string,
        move_to: string,
        move_to_title: string,
        link_to: string,
        link_to_title: string,
        copy_to: string,
        copy_to_title: string,
    },
    message: {
        ctg_content_updated: string,
        confirm_delete_ctg: string,
        delete_ctg: string,
        link_ctg_to_space: string,
        user_profile_updated: string,
        ctg_already_exist: string,
        new_friend: string,
        delete_friend: string,
    },

}