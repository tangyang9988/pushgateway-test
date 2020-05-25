import Channel from './Channel.ajax'

export default class RtuService {
 /** 查询所有上位机 */
 public static GetRtuMnList(rtuMN: string,uuid :string): Promise<any> {
    return Channel.invoke("/remoteControl/rtu/mn/list", {
        RtuMn: rtuMN,
        uuid: uuid
    });
}
 /** 新增上位机 */
 public static AddRtuMnList(rtuMN: string,mnConfig:[]): Promise<any> {
    return Channel.invoke("/remoteControl/rtu/mn/newList", {
        rtuMN: rtuMN,
        mnConfig:mnConfig
    });
}
 /** 查询所有系统编码列表和对应因子 */
 public static GetSTList(rtuMN: string): Promise<any> {
    return Channel.invoke("/remoteControl/rtu/mn/configuredFactors", {
        RtuMn: rtuMN
    });
}
//**上位机补发数据 */
public static RTUResendData(rtuMN: string,startTime:string,endTime:string,dataType:number): Promise<any> {
    return Channel.invoke("/remoteControl/rtu/mn/resend", {
        RtuMn: rtuMN,
        startTime:startTime,
        endTime:endTime,
        dataType:dataType
    });
}
}