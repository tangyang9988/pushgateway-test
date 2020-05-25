<template>
    <div>
        <el-button icon="fas fa-arrow-left" type="text" @click="goback"> 返回列表</el-button>
        网关地址:
        <el-input v-model="node" size="small" style="width:130px"></el-input>
        时间范围:
        <el-date-picker size="small" v-model="times" @change="onTimesChange" type="datetimerange"
                        :picker-options="timesOptions" :clearable="false">
        </el-date-picker>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
    // components: {
    //     CpuUsages: env.Views.CpuUsages,
    //     MemUsages: env.Views.MemUsages,
    //     NetMsgs: env.Views.TransmitMsgs,
    //     NetBytes: env.Views.TransmitBytes
    // }
})
export default class GmsMetrics extends Vue {
    @Prop({ default: '10.211.55.2:5000' }) node!: string

    times = [new Date(2019, 1, 1), new Date(2019, 1, 2)]
    timesOptions = {
        shortcuts: [
            {
                text: 'Last 1 hours',
                onClick(picker: any) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000)
                    picker.$emit('pick', [start, end])
                }
            },
            {
                text: 'Last 8 hours',
                onClick(picker: any) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 8)
                    picker.$emit('pick', [start, end])
                }
            }
        ]
    }

    onTimesChange() {
        // this.$refs.cpu.refresh()
        // this.$refs.mem.refresh()
        // this.$refs.net_msgs.refresh()
        // this.$refs.net_bytes.refresh()
    }

    // goback() {
    //     this.$router.go(-1)
    // }

    created() {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000)
        this.$set(this.times, 0, start)
        this.$set(this.times, 1, end)
    }
}
</script>