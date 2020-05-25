import Channel from './Channel.ajax'

export default class ToolService {
    /** 查询用户列表 */
    public static CrcCheck(data: string): Promise<any> {
        return Channel.invoke("crctool", { message: data });
    }
}