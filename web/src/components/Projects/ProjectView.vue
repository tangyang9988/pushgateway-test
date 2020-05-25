<template>
    <el-form :model="project" label-width="80px">
        <el-form-item label="项目名称">
            <el-input v-model="project.ProjectName"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
            <el-input v-model="project.LeaderName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
            <el-input v-model="project.LeaderMobile"></el-input>
        </el-form-item>
        <el-form-item label="MQ Tag">
            <el-input v-model="project.TopicName"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="save" type="primary" icon="fas fa-save fa-fw" style="width:100%">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import ProjectService from "@/services/ProjectService";

@Component
export default class ProjectView extends Vue {
    @Prop({ type: Object, default: null }) project!: any

    save() {
        if (this.project.Id) {
            ProjectService.Modify(this.project).then(res => {
                this.$message.success("保存项目成功")
            }).catch(err => {
                this.$message.error("保存项目失败:" + err)
            })
        } else {
            ProjectService.Add(this.project).then(res => {
                this.$message.success("新建项目成功")
            }).catch(err => {
                this.$message.error("新建项目失败:" + err)
            })
        }
    }
}
</script>