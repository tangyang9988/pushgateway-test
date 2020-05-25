<template>
    <div>
        <!-- 选项 -->
        <el-radio v-model="range" :label="5">5分钟</el-radio>
        <el-radio v-model="range" :label="30">30分钟</el-radio>
        <el-radio v-model="range" :label="60">1小时</el-radio>
        <el-radio v-model="range" :label="43200">30天</el-radio>
        <el-button @click="load" size="mini" icon="fas fa-sync-alt fa-fw">刷新</el-button>
        <br/>
        <br/>
        <!-- 列表 -->
        <el-table :data="messages" v-loading="loading" 
            border stripe highlight-current-row readonly size="small">
            <el-table-column prop="InsertTime" label="时间" width="180"></el-table-column>
            <el-table-column prop="Msg" label="消息"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination layout="prev, pager, next, total"
            :page-size="pageSize" :current-page.sync="page" :total="total"
            @current-change="load"></el-pagination>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import DtuService from "@/services/DtuService";

@Component
export default class GmsMessages extends Vue {
    /** 当前设备 */
    @Prop({ default: null }) dtu!: any
    
    /** 是否显示 */
    @Prop({ default: false }) visible!: boolean

    @Watch('visible')
    onVisibleChanged(val: boolean) {
        if (val) { this.load() }
    }

    @Watch('range')
    onRangeChanged(val: number) {
        this.page = 1
        this.load()
    }

    range = 5; //时间范围
    loading = false
    messages = []
    pageSize = 10
    page = 1
    total = 0

    load() {
        //根据选项计算时间范围
        let end = new Date()
        let start = new Date()
        start.setTime(start.getTime() - this.range * 60 * 1000)
        this.loading = true
        DtuService.GetMessages(this.dtu.RtuMn, start, end, this.pageSize, this.page).then(res => {
            this.total = res.total
            this.$set(this, 'messages', res.data)
            this.loading = false
        }).catch(err => {
            this.loading = false
            this.$message.error("加载历史消息错误:" + err)
        })
    }

    mounted() {
        this.load()
    }
}
</script>