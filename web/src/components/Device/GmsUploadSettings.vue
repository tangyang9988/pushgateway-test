<template>
    <div style="margin:10px">
        <settings-card v-for="item in settings" :settings="item"></settings-card>
        <br/>
        <div class="footer">
            <el-button type="primary">新建</el-button>
            <el-button @click="save" type="primary">递交</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import UploadSettingsCard from "./UploadSettingsCard.vue";

@Component({
    components: { SettingsCard: UploadSettingsCard }
})
export default class GmsUploadSettings extends Vue {
    /** 当前设备 */
    @Prop({ type: Object, default: null }) dtu!: any
    /** 是否显示 */
    @Prop({ type: Boolean, default: false }) visible!: boolean

    /** 配置列表 */
    settings = [{}]

    @Watch('visible')
    onVisibleChanged(val: Boolean) {
        if (val) { this.load() }
    }

    /** 加载配置 */
    load() {
        // if (this.dtu) {
        //     let gateway = this.dtu.Gateway ? this.dtu.Gateway.Address : ''
        //     env.Services.GatewayService.GetSettings(gateway, this.dtu.MN, 2).then(res => {
        //         this.settings = JSON.parse(res)
        //     }).catch(err => {
        //         this.$message.error('加载配置错误: ' + err)
        //     })
        // }
    }
    /** 保存配置 */
    save() {
        // if (this.dtu && this.dtu.Gateway) {
        //     env.Services.GatewayService.SetSettings(this.dtu.Gateway.Address, this.dtu.MN, 2, 
        //         JSON.stringify(this.settings)).then(res => {
        //             this.$message.success('上传配置成功!')
        //         }).catch(err => {
        //             this.$message.error('上传配置失败: ' + err)
        //         })
        // }
    }

    mounted() {
        this.load()
    }
}
</script>

<style scoped>
.footer {
    text-align: center;
}
</style>