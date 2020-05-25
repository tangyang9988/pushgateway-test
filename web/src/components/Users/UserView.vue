<template>
    <el-form :model="user" label-width="80px">
        <el-form-item label="姓名">
            <el-input v-model="user.RealName"></el-input>
        </el-form-item>
        <el-form-item label="账户">
            <el-input v-model="user.Username"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="!user.Id">
            <el-input v-model="user.Password" show-password></el-input>
        </el-form-item>
        <el-form-item label="角色">
            <el-select v-model="user.Role" style="width:100%">
                <el-option v-for="item in roles" 
                :key="item.Value" :label="item.Name" :value="item.Value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="项目">
            <el-select v-model="user.ProjectIds" multiple placeholder="请选择" style="width:100%">
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
import UserService from "@/services/UserService"

@Component
export default class UserView extends Vue {
    @Prop({ default: [] }) projects!: any //项目列表
    @Prop({ default: null }) user!: any //当前用户

    roles = [
        { Name: "运维人员", Value: 2 },
        { Name: "访问人员", Value: 3 }
    ]

    save() {
        if (this.user.Id) {
            UserService.Modify(this.user).then(res => {
                this.$message.success("保存用户成功")
            }).catch(err => {
                this.$message.error("保存用户失败:" + err)
            })
        } else {
            UserService.Add(this.user).then(res => {
                this.$message.success("新建用户成功")
            }).catch(err => {
                this.$message.error("新建用户失败:" + err)
            })
        }
    }
}
</script>