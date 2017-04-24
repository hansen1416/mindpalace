/**
 * Created by hlz on 16-10-17.
 */
import {LangInterface} from '../lang.interface';

export const ZH: LangInterface = {
    user   : {
        email_placeholder           : '请输入您的邮箱',
        email_required              : '请输入您的邮箱',
        email_validation            : '邮箱格式不正确',
        password_placeholder        : '请输入您的密码',
        password_required           : '请输入最少为6位密码',
        confirm_password_placeholder: '请再次输入密码',
        confirm_password_required   : '请输入最少为6位的确认密码',
        confirm_password_invalid    : '两次输入的密码不一致',
        name_placeholder            : '请输入您的昵称',
        name_required               : '请输入您的昵称',
        login                       : '登录',
        register                    : '注册',
        login_failed                : '登录验证失败',
        web_link                    : '提供一个图片链接',
        choose_file                 : '选择一个本地文件',
        logout                      : '退出',
        search_friends_placeholder  : '通过名字查找朋友',
    },
    space  : {
        show_all             : '显示全部',
        search_space         : '搜索',
        fetch_url            : '通过网页创建空间',
        new_space_placeholder: '新空间名称',
    },
    ctg    : {
        title_placeholder: '请填入名称',
    },
    action : {
        save : '保存',
        home : '首页',
        yes  : '是',
        no   : '否',
        link : '链接',
        share: '分享',
    },
    message: {
        ctg_content_updated : '内容更新成功',
        confirm_delete_ctg  : '确定删除选中的分类和他的所有子分类么',
        delete_ctg          : '删除了 %1% 个分类',
        link_ctg_to_space   : '链接 %1% 到 %2%',
        user_profile_updated: '用户信息已更新',
        ctg_already_exist   : '分类已经存在于空间',
        new_friend          : '%1% 已经添加为您的好友',
        delete_friend       : '您和 %1% 已经不是好友',
    },
};