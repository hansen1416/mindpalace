/**
 * Created by hlz on 16-10-19.
 */
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class ApiRoutesService {

    //注册
    get register(): string {
        return environment.api + 'register';
    }

    // 登录
    get login(): string {
        return environment.api + 'login';
    }

    // 通过git登陆暂时为开放
    get gitLogin(): string {
        return environment.api + 'login/github';
    }

    // 首页
    get home(): string {
        return environment.api + 'home';
    }

    // 获取用户信息
    get user(): string {
        return environment.api + 'user';
    }

    // 创建空间
    get createSpace(): string {
        return environment.api + 'space/create';
    }

    // 搜索空间
    get searchSpace(): string {
        return environment.api + 'space/search';
    }

    // 获取空间信息
    space(space_id): string {
        return environment.api + 'space/' + space_id
    }

    // 获取分类列表
    ctgList(space_id: number, ctg_id?: number): string {
        return ctg_id
            ? environment.api + 'space/' + space_id + '/ctg/' + ctg_id
            : environment.api + 'space/' + space_id + '/ctg';
    }

    // 移动分类
    ctgMove(space_id: number, ctg_id: number, pid: number): string {
        return environment.api + 'ctg/move/space/' + space_id + '/ctg/' + ctg_id + '/pid/' + pid;
    }

    // 分类内容
    ctgContent(ctg_id: number): string {
        return environment.api + 'ctg/content/' + ctg_id;
    }

    //delete ctg
    ctgDelete(space_id: number, ctg_id: number) {
        return environment.api + 'ctg/delete/space/' + space_id + '/ctg/' + ctg_id;
    }

    //保存分类的内容
    get saveCtgContent(): string {
        return environment.api + 'ctg/saveCtgContent';
    }

    // 创建新分类
    get createCtg(): string {
        return environment.api + 'ctg/createCtg';
    }

    // 登出
    get logout(): string {
        return environment.api + 'user/logout';
    }

    // 用户信息
    get updateProfile(): string {
        return environment.api + 'profile/update';
    }

    // 搜索用户
    get searchUser(): string {
        return environment.api + 'user/search';
    }

    // 创建好友
    get createFriend(): string {
        return environment.api + 'friends/create';
    }

    // 好友列表
    get friendsList(): string {
        return environment.api + 'friends/lists';
    }

    // 链接分类到其他空间
    get linkCtg(): string {
        return environment.api + 'ctg/link';
    }

}
