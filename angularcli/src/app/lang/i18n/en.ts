/**
 * Created by hlz on 16-10-17.
 */
import {LangInterface} from '../lang.interface';

export const EN: LangInterface = {
    user   : {
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
    space  : {
        show_all             : 'Show all',
        search_space         : 'Search by space name',
        fetch_url            : 'Create a space from a web page',
        new_space_placeholder: 'New space name',
    },
    ctg    : {
        title_placeholder: 'Need a title here',
    },
    action : {
        handling     : 'Please wait while handling',
        save         : 'Save',
        home         : 'Home',
        yes          : 'yes',
        no           : 'no',
        move_to      : 'Move to',
        move_to_title: 'Move this category to your another space, and the category will no longer exists in this space.',
        link_to      : 'Link to',
        link_to_title: 'Link this category to your another space, and the category still exists in this space, it will be updated in all linked spaces when edit the title and the content of this category in any linked space',
        copy_to      : 'Copy to',
        copy_to_title: 'Copy this category to your another space, it\'s like create new categories in another space, other spaces will not be affected when edit them',
    },
    message: {
        ctg_content_updated : 'Content has been updated',
        confirm_delete_ctg  : 'Please confirm to delete selected item and all its descendants',
        delete_ctg          : 'deleted %1% items',
        link_ctg_to_space   : 'linked %1% to %2%',
        move_ctg_to_space   : 'moved %1% to %2%',
        user_profile_updated: 'use profile updated',
        ctg_already_exist   : 'The selected category already exists in targeted space',
        new_friend          : '%1% is your friend now',
        delete_friend       : '%1% is no longer you friend',
    },
};