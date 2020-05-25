import Channel from './Channel.ajax'

export default class DtuService {

    /** 查询所有数采仪 */
    public static Query(pageSize: number, pageIndex: number, projectId: number, rtuMN: string, rtuName: string): Promise<any> {
        return Channel.invoke("rtu/query", { pageSize: pageSize, page: pageIndex, projectId: projectId, rtuMN: rtuMN, rtuName: rtuName });
    }
    /** 根据项目筛选数采仪列表 */
    public static QueryListByProjectId(pageSize: number, pageIndex: number, projectId: number): Promise<any> {
        return Channel.invoke("rtu/query", { pageSize: pageSize, page: pageIndex, ProjectId: projectId });
    }

    /** 保存新建的数采仪 */
    public static Add(dtu: any): Promise<any> {
        return Channel.invoke("rtu/add", dtu);
    }

    /** 保存修改的数采仪 */
    public static Modify(dtu: any): Promise<any> {
        return Channel.invoke("rtu/modify", dtu);
    }

    /** 删除数采仪 */
    public static Delete(dtu: any): Promise<any> {
        return Channel.invoke("rtu/del", { id: dtu.Id, mn: dtu.RtuMn });
    }
    /** 查询在线 离线数 */
    public static onlineCounts(): Promise<any> {
        return Channel.invoke("rtu/online");
    }

    /** 查询指定设备的历史消息 */
    public static GetMessages(mn: string, startTime: Date, endTime: Date,
        pageSize: number, page: number): Promise<any> {
        return Channel.invoke("message/query", {
            MN: mn,
            StartTime: Channel.formatDate(startTime),
            EndTime: Channel.formatDate(endTime),
            PageSize: pageSize,
            Page: page
        });
    }
    /** 动态管控 - 查询实时工作参数 */
    public static GetDynamic(rtuMN: string): Promise<any> {
        return Channel.invoke("dynamicControl/slopeIntercept", {
            rtuMN: rtuMN,
        });
    }

    /** 打开动态管控 */
    public static OpenDynamic(rtuMN: string, st: string, cp: string, cn: string): Promise<any> {
        return Channel.invoke("remoteControl/general", {
            rtuMN: rtuMN,
            st: st,
            cp: cp,
            cn: cn
        });
    }
    /** 关闭动态管控 */
    public static CloseDynamic(rtuMN: string, st: string, cp: string, cn: string): Promise<any> {
        return Channel.invoke("remoteControl/general", {
            rtuMN: rtuMN,
            st: st,
            cp: cp,
            cn: cn
        });
    }
    /** 查询当前用户的项目列表 */
    public static currentList(): Promise<any> {
        return Channel.invoke("user/projectByUserId");
    }

    /** 查询一段时间的动态管控参数 */
    public static GetDynamicMessages(mn: string, startTime: Date, endTime: Date): Promise<any> {
        // pageSize: number, page: number
        return Channel.invoke("dynamicControl/slopeIntercept/query", {
            rtuMN: mn,
            startTime: Channel.formatDate(startTime),
            endTime: Channel.formatDate(endTime),
            //PageSize: pageSize,
            //Page: page
        });
    }
    //**向数采仪发送反控指令 */
    public static SendReControl(mn: string, systemTime: string, st: string, cn: string, polId: string): Promise<any> {
        return Channel.invoke("remoteControl/general", {
            rtuMN: mn,
            cp: "PolId=" + polId + ";" + "SystemTime=" + systemTime,
            cn: cn,
            st: st
        });
    }
    //**1000-反控指令 */
    public static SendReControlC(mn: string, cp: string, cn: string, uuid: string, commandName: string): Promise<any> {
        return Channel.invoke("remoteControl/general", {
            rtuMN: mn,
            cp: cp,
            cn: cn,
            uuid: uuid,
            commandName: commandName,
        });
    }


    //**获取数采仪实时数据 */
    public static GetRTUCurrentData(rtuMN: string): Promise<any> {
        return Channel.invoke("/remoteControl/rtu/realtimeData", {
            rtuMN: rtuMN
        });
    }
    //**获取数采仪TCP log实时数据 */
    public static GetRTUTCPlog(rtuMN: string): Promise<any> {
        return Channel.invoke("/remoteControl/rtu/log/tcp", {
            rtuMN: rtuMN
        });
    }
    //**获取数采仪运行实时数据 */
    public static GetRTURunlog(rtuMN: string): Promise<any> {
        return Channel.invoke("/remoteControl/rtu/log/run", {
            rtuMN: rtuMN
        });
    }
    //**获取数采仪实时统计数据 */
    public static GetRTUstatisticslog(rtuMN: string): Promise<any> {
        return Channel.invoke("/remoteControl/rtu/log/statistics", {
            RtuMn: rtuMN
        });
    }
    //**基础设置新增 */
    public static RtuNewBasicStting(rtuMN: string, interval_store: number, interval_minute: number, data_save: number): Promise<any> {
        return Channel.invoke("/remoteControl/rtu/basic/newInfo", {
            RtuMN: rtuMN,
            interval_store: interval_store,   //存储间隔 转成秒数
            interval_minute: interval_minute, //分钟数据上传间隔 转成分钟
            data_save: data_save,     //存储有效期 转成月数
        });
    }
}