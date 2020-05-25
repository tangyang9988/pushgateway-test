import Channel from './Channel.ajax'

export default class CollectService {

    /** 查询所有采集设备 */
    public static Query(rtuMN: string, st: string, cp: string, cn: string, qn: string,uuid: string ): Promise<any> {
        return Channel.invoke("remoteControl/rtu/device/list", { rtuMN: rtuMN, st: st, cp: cp, cn: cn, qn: qn ,uuid: uuid});
    }
    /** 查询通讯协议 */
    public static QueryProtocol(rtuMN: string): Promise<any> {
        return Channel.invoke("remoteControl/rtu/parameter", { rtuMN: rtuMN });
    }

    /** 保存设备到数采仪 */
    public static SaveDeviceList(rtuMN: string, rtuNewDeviceList: []): Promise<any> {
        return Channel.invoke("/remoteControl/rtu/device/newList", {rtuMN: rtuMN,rtuNewDeviceList: rtuNewDeviceList});
    }
}