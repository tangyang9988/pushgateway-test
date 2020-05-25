import Channel from './Channel.ajax'

export default class ComDebugService {

    //**串口调试--发送接口 */
    public static ComDebugSubmit(rtuMN:string, serial:string, baudrate:string, dataBit:string, checkBit:string, stopBit:string, checkType:string, message: string): Promise<any> {
        return Channel.invoke("/remoteControl/rtu/serialPortDebug", {
            rtuMN: rtuMN,
            serial: serial,
            baudrate: baudrate,
            data_bit: dataBit,
            check_bit: checkBit,
            stop_bit: stopBit,
            verify_type: checkType,
            message: message,
        });
    }
}