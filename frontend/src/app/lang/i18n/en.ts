/**
 * Created by hlz on 16-10-17.
 */
import {LangInterface} from '../lang.interface';

export const EN: LangInterface = {
    user  : {
        email_placeholder           : 'Enter your email please',
        email_required              : 'Enter your email please',
        email_validation            : 'Invalid email address',
        password_placeholder        : 'Enter your password please',
        password_required           : 'Enter a at least 6 character password please',
        confirm_password_placeholder: 'Confirm your password please',
        confirm_password_required   : 'Enter a at least 6 character password confirm password please',
        confirm_password_invalid    : 'The two password entered is not the same',
        name_placeholder            : 'Enter your nickname please',
        name_required               : 'Enter your nickname please',
        login                       : 'Login',
        register                    : 'Register',
        login_failed                : 'Email and password does not match',
        web_link                    : 'provide a link from web',
        choose_file                 : 'choose a local image',
        logout                      : 'logout',
        search_friends_placeholder  : 'Search a friend by name',
    },
    space : {
        show_all    : 'Show all',
        search_space: 'Search by space name',
        fetch_url   : 'Create a space from a web page',
    },
    action: {
        save: 'Save',
        home: 'Home',
    }
};