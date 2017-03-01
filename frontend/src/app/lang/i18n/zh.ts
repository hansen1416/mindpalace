/**
 * Created by hlz on 16-10-17.
 */
import {LangInterface} from '../lang.interface';

export const ZH: LangInterface = {
    user  : {
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
    },
    space : {
        show_all    : '显示全部',
        search_space: '搜索',
        fetch_url   : '通过网页创建空间',
    },
    action: {
        save: '保存',
        home: '首页'
    }
};