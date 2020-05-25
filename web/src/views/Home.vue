<template>
  <div class="align-center">
    <el-card>
        <div slot="header" style="text-align: center">蓝创云采网关管理系统</div>
        <el-input v-model="user" placeholder="Account..." prefix-icon="fas fa-user"> </el-input>
        <br/>
        <br/>
        <el-input v-model="pwd" type="password" placeholder="Password..." prefix-icon="fas fa-lock" @keyup.enter.native="onLogin"> </el-input>
        <br/>
        <br/>
        <el-button @click="onLogin" type="primary" :loading="loading" style="width:100%">Login</el-button>
    </el-card>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import UserService from "@/services/UserService"

@Component
export default class Home extends Vue {
    user = '';
    pwd = '';
    loading = false;

    onLogin() {
        this.loading = true
        UserService.Login(this.user, this.pwd).then(res => {
            this.loading = false
            this.$router.push({path: "/v/cardList"});
            // 获取用户登陆的权限，permission=1，暂时定义为超级管理员
            sessionStorage.setItem('permission', res.data.permission);
            sessionStorage.setItem('username', this.user);
            // console.log(this.permission)
        }).catch(err => {
            this.loading = false
            this.$message("登录错误:" + err)
        })
    }
}
</script>

<style scoped>
.align-center {
    position: fixed;
    left: 40%;
    top: 20%;
    margin-left: width/2;
    margin-top: height/2;
}
</style>
