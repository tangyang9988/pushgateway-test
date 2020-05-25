<!-- 设备表 -->
<template>
    <el-form :model="dtu" label-width="80px">
        <el-form-item label="机器编号">
            <el-input v-model="dtu.RtuMn"></el-input>
        </el-form-item>
        <el-form-item label="序列号">
            <el-input v-model="dtu.RtuSn"></el-input>
        </el-form-item>
        <el-form-item label="设备类型">
            <el-input v-model="dtu.DeviceType"></el-input>
        </el-form-item>
        <el-form-item label="设备品牌">
            <el-input v-model="dtu.DeviceBrand"></el-input>
        </el-form-item>
        <el-form-item label="所属项目">
            <el-select v-model="dtu.ProjectId" placeholder="请选择项目" style="width:100%">
                <el-option v-for="item in projects" :key="item.Id"
                    :label="item.ProjectName" :value="item.Id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button @click="save" type="primary" icon="fas fa-save fa-fw" style="width:100%">保存</el-button>
        </el-form-item>
    </el-form>
</template>


<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import ProjectService from "@/services/ProjectService"
import DtuService from "@/services/DtuService"

@Component
export default class DeviceView extends Vue {

    detailVisible = true; //设备详情  对话框是否打开
    @Prop({ type: Object, default: null }) dtu!: any

    projects = [] // 项目列表

    loadProjects() {
        ProjectService.List().then(res => {
            this.$set(this, 'projects', res.data)
        }).catch(err => {
            this.$message.error("加载项目列表错误:" + err)
        })
    }

    save() {
        if (this.dtu.Id) {
            DtuService.Modify(this.dtu).then(res => {
                this.$message.success("修改数采仪成功")
            }).catch(err => {
                this.$message.error("保存数采仪失败:" + err)
            })
        } else {
            DtuService.Add(this.dtu).then(res => {
                this.$message.success("新建数采仪成功")
            }).catch(err => {
                this.$message.error("新建数采仪失败:" + err)
            })
        }
        this.detailVisible = false;
        sessionStorage.setItem('detail', <any>this.detailVisible);
        // console.log(detail)
        
    }

    mounted() {
        this.loadProjects()
    }
}
</script>