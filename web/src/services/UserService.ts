import Channel from './Channel.ajax'

export default class UserService {
    /** 查询用户列表 */
    public static Query(pageSize: number, pageIndex: number): Promise<any> {
        return Channel.invoke("user/query", { pageSize: pageSize, page: pageIndex });
    }

    /** 保存新建的用户 */
    public static Add(user: any): Promise<any> {
        return Channel.invoke("user/add", user);
    }

    /** 保存修改的用户 */
    public static Modify(user: any): Promise<any> {
        return Channel.invoke("user/modify", user);
    }

    /** 删除用户 */
    public static Delete(id: number): Promise<any> {
        return Channel.invoke("user/del", { id: id });
    }

    /** 重置用户密码 */
    public static ResetPwd(id: number, password: string): Promise<any> {
        return Channel.invoke("user/pwd/reset", { id: id, password: password })
    }

    /** 用户登录 */
    public static Login(user: string, pwd: string): Promise<any> {
        return Channel.invoke("login", { userName: user, password: pwd });
    }

}