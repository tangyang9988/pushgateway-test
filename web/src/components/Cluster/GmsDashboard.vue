<template>
    <div style="padding:10px;height:100%">
        <el-row :gutter="8">
            <el-col :span="8">
                <gauge-card :title="gagues.Nodes" units="网关"></gauge-card>
            </el-col>
            <el-col :span="8">
                <gauge-card :title="gagues.Devices" icon="fas fa-microchip" units="设备" background="#5DB85B"></gauge-card>
            </el-col>
            <el-col :span="8">
                <gauge-card :title="gagues.Sessions" icon="fas fa-user-friends" units="会话" background="#EFAD4D"></gauge-card>
            </el-col>
        </el-row>
        <br />
        <!--列表-->
        <div style="background:#F5F7FA">
            <el-button @click="loadNodes" type="text" icon="el-icon-refresh">刷新</el-button>
        </div>
        <el-table :data="nodes" border highlight-current-row readonly>
            <el-table-column prop="Id" label="编号" width="50"></el-table-column>
            <el-table-column prop="Address" label="地址"></el-table-column>
            <el-table-column label="状态" width="68">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.State" type="success">在线</el-tag>
                    <el-tag v-else="scope.row.State" type="info">离线</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="Devices" label="在线设备"></el-table-column>
            <el-table-column prop="LastOnlineTime" label="最近上线时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="138">
                <template slot-scope="scope">
                    <el-button @click="gotoNode(scope.row.IPAddress)" type="text" size="small">设备管理</el-button>
                    <el-button @click="setAsMeta(scope.row)" type="text" size="small">性能监控</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GaugeCard from '@/components/GaugeCard.vue'

@Component({
    components: { GaugeCard: GaugeCard }
})
export default class GmsDashboard extends Vue {
    gagues = { Nodes: 0, Devices: 0, Sessions: 0 }
    nodes = [] //节点列表

    loadNodes() {
        // env.Services.GatewayService.GetAll().then(res => {
        //     this.nodes = res
        //     this.gagues.Nodes = this.nodes.length
        //     this.getStates()
        //     this.$forceUpdate()
        // }).catch(err => {
        //     this.$message("加载网关节点失败: " + err)
        // })
    }

    getStates() {
        // this.nodes.forEach(node => {
        //     env.Services.GatewayService.GetState(node.Address).then(res => {
        //         this.$set(node, "State", true)
        //         this.$set(node, "Devices", res)
        //     }).catch(err => {
        //         this.$set(node, "State", false)
        //     })
        // })
    }

    mounted() {
        this.loadNodes()
    }
}
</script>