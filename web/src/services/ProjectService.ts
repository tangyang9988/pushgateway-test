import Channel from './Channel.ajax'

export default class ProjectService {

    /** 查询项目列表 */
    public static Query(pageSize: number, pageIndex: number): Promise<any> {
        // return Channel.invoke("project/query", { pageSize: pageSize, page: pageIndex });
        return Channel.invoke("project/query", { pageSize: pageSize, page: pageIndex });
    }

    /** 查询所有项目，用于绑定 */
    public static List(): Promise<any> {
        return Channel.invoke("project/list");
    }

    /** 保存新建的项目 */
    public static Add(prj: any): Promise<any> {
        return Channel.invoke("project/add", prj);
    }

    /** 保存修改的项目 */
    public static Modify(prj: any): Promise<any> {
        return Channel.invoke("project/modify", prj);
    }

    /** 删除项目 */
    public static Delete(id: number): Promise<any> {
        return Channel.invoke("project/del", { id: id });
    }

}