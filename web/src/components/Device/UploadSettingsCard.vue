<template>
    <el-card>
        <div slot="header">
            <span>上传配置1</span>
            <el-button style="font-size:17px; float: right; padding: 3px 0" icon="fas fa-trash fa-fw" type="text">
            </el-button>
        </div>
        <div>
            <el-row :gutter="10" class="row">
                <el-col :span="3" class="property">上传地址:</el-col>
                <el-col :span="5">
                    <el-input v-model="settings.Address" size="small"></el-input>
                </el-col>
                <el-col :span="3" class="property">端口号:</el-col>
                <el-col :span="5">
                    <el-input v-model="settings.Port" size="small"></el-input>
                </el-col>
                <el-col :span="3" class="property">设备MN号:</el-col>
                <el-col :span="5">
                    <el-input v-model="settings.MN" size="small"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="row">
                <el-col :span="3" class="property">上传协议:</el-col>
                <el-col :span="5">
                    <el-select v-model="settings.Protocol" class="cell" size="small">
                        <el-option v-for="item in protocols" :key="item" :value="item">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3" class="property">上传时间:</el-col>
                <el-col :span="5">
                    <el-input-number v-model="settings.Interval" class="cell" :min="5" :max="120" size="small">
                    </el-input-number>
                </el-col>
                <el-col :span="3" class="property">心跳标识:</el-col>
                <el-col :span="1">
                    <el-checkbox v-model="settings.HBEnable"></el-checkbox>
                </el-col>
                <el-col :span="4">
                    <el-input-number v-model="settings.HBInterval" :disabled="!settings.HBEnable" class="cell" :min="1"
                        :max="60" size="small">
                    </el-input-number>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class UploadSettingsCard extends Vue {
    @Prop({ 
        type: Object, 
        default: { 
                Address: "10.211.55.2", 
                Port: 8000,
                MN: "000000000000000000000001",
                Protocol: "HJ212-2017",
                Interval: 60,
                HBEnable: false,
                HBInterval: 15
            }
        }) 
    settings!: IUploadSettings

    protocols = ["HJ212-2017"]
    
}

interface IUploadSettings {
   Address: String;
   Port: Number;
   MN: String;
   Protocol: String;
   Interval: Number;
   HBEnable: Boolean;
   HBInterval: Number;
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