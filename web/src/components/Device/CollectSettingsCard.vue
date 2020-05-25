<template>
    <el-card>
        <div slot="header">
            <span>采集配置1</span>
            <el-button style="font-size:17px; float: right; padding: 3px 0" icon="fas fa-trash fa-fw" type="text">
            </el-button>
            <el-button style="font-size:18px; float: right; padding: 3px 0" icon="fas fa-save fa-fw" type="text">
            </el-button>
        </div>
        <div>
            <div class="title">串口配置</div>
            <el-row :gutter="10" class="row">
                <el-col :span="3" class="property">COM口:</el-col>
                <el-col :span="5">
                    <el-select v-model="settings.CO" class="cell" size="small">
                        <el-option v-for="item in coms" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3" class="property">波特率:</el-col>
                <el-col :span="5">
                    <el-input v-model="settings.BR" size="small"></el-input>
                </el-col>
                <el-col :span="3" class="property">数据位:</el-col>
                <el-col :span="5">
                    <el-input-number v-model="settings.DB" class="cell" :min="1" :max="8" size="small">
                    </el-input-number>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="row">
                <el-col :span="3" class="property">校验位:</el-col>
                <el-col :span="5">
                    <el-input-number v-model="settings.PB" class="cell" :min="0" :max="7" size="small">
                    </el-input-number>
                </el-col>
                <el-col :span="3" class="property">停止位:</el-col>
                <el-col :span="5">
                    <el-input-number v-model="settings.SB" class="cell" :min="0" :max="7" size="small">
                    </el-input-number>
                </el-col>
            </el-row>
            <el-divider></el-divider>

            <div class="title">参数配置</div>
            <el-row :gutter="10" class="row">
                <el-col :span="3" class="property">设备地址:</el-col>
                <el-col :span="5">
                    <el-input v-model="settings.AR" size="small"></el-input>
                </el-col>
                <el-col :span="3" class="property">通信协议:</el-col>
                <el-col :span="5">
                    <el-select v-model="settings.PC" class="cell" size="small">
                        <el-option v-for="item in protocols" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3" class="property">监控类型:</el-col>
                <el-col :span="5">
                    <el-select v-model="settings.TP" class="cell" size="small">
                        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-divider></el-divider>

            <div class="title">因子配置</div>
            <el-row v-for="item in settings.FS" :key="item.ID" :gutter="3" class="row">
                <el-col :span="1" class="property">名称:</el-col>
                <el-col :span="3">
                    <el-input v-model="item.NM" size="small"></el-input>
                </el-col>
                <el-col :span="1" class="property">ID:</el-col>
                <el-col :span="3">
                    <el-input v-model="item.ID" size="small"></el-input>
                </el-col>
                <el-col :span="1" class="property">系数:</el-col>
                <el-col :span="3">
                    <el-input v-model="item.CI" size="small"></el-input>
                </el-col>
                <el-col :span="1" class="property">单位:</el-col>
                <el-col :span="3">
                    <el-input v-model="item.UN" size="small"></el-input>
                </el-col>
                <el-col :span="1" class="property">量程:</el-col>
                <el-col :span="6">
                    <el-input v-model="item.RL" size="small" style="width:60px"></el-input>
                    <span> - </span>
                    <el-input v-model="item.RH" size="small" style="width:60px"></el-input>
                </el-col>
                <el-col :span="1">
                    <el-button @click="deleteElement(item)" style="font-size:17px; float: right; padding: 3px 0" icon="fas fa-trash fa-fw" type="text">
                    </el-button>
                </el-col>
            </el-row>
            <div style="text-align:center">
                <el-button icon="fas fa-plus fa-fw" size="small" style="width:200px">新增因子</el-button>
            </div>
        </div>
    </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class CollectSettingsCard extends Vue {
    @Prop({ 
        type: Object, 
        default: { 
                CO: 1, BR: 9600, DB: 8, PB: 0, SB: 0, AR: "101", PC: "Modbus", TP: "油烟",
                FS: [{ NM: "烟气", ID: "w01001", CI: 1, UN: "m3", RL: 1, RH: 10 }]
            }
        }) 
    settings!: ICollectSettings

    coms = [
        { label: "COM1", value: 1 },
        { label: "COM2", value: 2 },
        { label: "COM3", value: 3 }
    ]
    protocols = [
        { label: "Modbus", value: 1 },
    ]
    types = [
        { label: "Modbus", value: 1 },
    ]

    deleteElement(element: IFactor) {
        let index = this.settings.FS.findIndex(t => t.ID === element.ID)
        if (index >= 0) {
            this.settings.FS.splice(index, 1)
        }
    }
}

/* 因子设置接口 */
interface IFactor {
    /** 因子名称 */
    NM: String;
    /** 因子ID */
    ID: String;
    /** 因子系数 */
    CI: Number;
    /** 因子单位 */
    UN: String;
    /** 量程下限 */
    RL: Number;
    /** 量程上限 */
    RH: Number;
}

/* 串口设置接口 */
interface ICollectSettings {
    /** COM */
    CO: Number;
    /** 波特率 */
    BR: Number;
    /** 数据位 */
    DB: Number;
    /** 校验位 */
    PB: Number;
    /** 停止位 */
    SB: Number;
    /** 设备地址 */
    AR: Number;
    /** 通信协议 */
    PC: String;
    /** 监控类型 */
    TP: String;
    /** 因子配置 */
    FS: IFactor[];
}
</script>


<style scoped>
.row {
    margin-bottom: 10px;
}

.title {
    color: #409EFF;
    margin-top: 10px;
    margin-bottom: 10px;
}

.cell {
    width: 100%;
}

.property {
    text-align: right;
    margin-top: 4px;
}
</style>