import Channel from './Channel.ajax'

export default class LogService {

    /** 查询日志记录 */
    public static Query(pageSize: number, pageIndex: number, logLevel: string, startTime: any, endTime: any): Promise<any> {
        return Channel.invoke("log/query", {
            logLevel: logLevel, pageSize: pageSize, page: pageIndex, startTime: startTime, endTime: endTime
        });
    }
    /** 查询报警记录 */
    public static QueryAlarm(pageSize: number, pageIndex: number, alarmType: string,startTime: any, endTime: any): Promise<any> {
        return Channel.invoke("/log/alarm/query", {
            pageSize: pageSize, page: pageIndex,alarmType: alarmType, startTime: startTime, endTime: endTime
        });
    }

}