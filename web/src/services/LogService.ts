import Channel from './Channel.ajax'

export default class LogService {

    /** 查询日志记录 */
    public static Query(pageSize: number, pageIndex: number, logLevel: string, startTime: any, endTime: any): Promise<any> {
        return Channel.invoke("log/query", {
            logLevel: logLevel, pageSize: pageSize, page: pageIndex, startTime: startTime, endTime: endTime
        });
    }

}