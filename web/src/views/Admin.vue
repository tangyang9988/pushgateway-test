<template>
  <el-container style="height:100%;">
    <!-- Header -->
    <el-header class="ops-header">
      <el-row>
        <el-col :span="1">
          <img style="height:40px" src="../assets/logo.png" />
        </el-col>
        <el-col :span="22">
          <span style="font-size:28px">蓝创云采网关管理系统</span>
        </el-col>
        <el-col :span="1">
          <el-dropdown @command="onUserCommand">
            <el-avatar icon="fas fa-user"></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="signout" icon="fas fa-sign-out-alt">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container  style="height: calc(100% - 60px);">
      <!-- Menu -->
      <el-aside width="150px">
        <el-menu
          router
          :default-active="$route.path"
          style="height:100%"
          background-color="#464b5b"
          text-color="#fff"
          active-text-color="#fff"
        >
          <el-menu-item
            v-for="(sub,i) in menus"
            :index="sub.index"
            v-if="permission == '1'"
            :key="i"
          >
            <template slot="title">
              <i v-if="sub.icon" :class="sub.icon"></i>
              {{sub.title}}
            </template>
          </el-menu-item>

          <el-menu-item
            v-for="(sub,index) in commonMenus"
            :index="sub.index"
            :key="index"
            v-if="permission != '1'"
          >
            <template slot="title">
              <i v-if="sub.icon" :class="sub.icon"></i>
              {{sub.title}}
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- Main -->
      <el-main style="overflow:auto;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Admin extends Vue {
  menus = [
    { title: "首页", icon: "fas fa-server fa-fw", index: "/v/cardList" },
    // { title: "网关管理", icon: "fas fa-server fa-fw", index: "/v/cluster" },
    { title: "设备管理", icon: "fas fa-microchip fa-fw", index: "/v/devices" },
    // { title: '网关监控', icon: 'fas fa-tachometer-alt fa-fw', index: '/v/metrics' },
    // { title: '告警管理', icon: 'fas fa-exclamation-circle fa-fw', index: '/v/alerts' },
    { title: "日志消息", icon: "fas fa-hdd fa-fw", index: "/v/logs" },
    { title: "系统工具", icon: "fas fa-tools fa-fw", index: "/v/tools" },
    // { title: '安全管理', icon: 'fas fa-user-secret fa-fw', index: '/v/secret' },
    { title: "项目管理", icon: "fas fa-industry fa-fw", index: "/v/prjs" },
    { title: "用户管理", icon: "fas fa-users fa-fw", index: "/v/users" }
  ];
  commonMenus = [
    { title: "首页", icon: "fas fa-server fa-fw", index: "/v/cardList" },
    // { title: "网关管理", icon: "fas fa-server fa-fw", index: "/v/cluster" },
    { title: "设备管理", icon: "fas fa-microchip fa-fw", index: "/v/devices" },
    // { title: '网关监控', icon: 'fas fa-tachometer-alt fa-fw', index: '/v/metrics' },
    // { title: '告警管理', icon: 'fas fa-exclamation-circle fa-fw', index: '/v/alerts' },
    { title: "日志消息", icon: "fas fa-hdd fa-fw", index: "/v/logs" },
    { title: "系统工具", icon: "fas fa-tools fa-fw", index: "/v/tools" },
    // { title: '安全管理', icon: 'fas fa-user-secret fa-fw', index: '/v/secret' },
    { title: "项目管理", icon: "fas fa-industry fa-fw", index: "/v/prjs" },
    { title: '用户管理', icon: 'fas fa-users fa-fw', index: '/v/users' }
  ];
  permission = "";
    heiGht =  window.innerHeight+'px'
    
  /** 当前登录用户菜单的相关命令处理 */
  onUserCommand(command: string) {
    if (command === "signout") {
      //TODO:调用服务退出逻辑
      this.$router.push({ path: "/" });
    }
  }
  mounted() {
    this.permission = <any>window.sessionStorage.getItem("permission");
  }
}
</script>

<style scoped>
.ops-header {
  background: #464b5b;
  color: white;
  padding-top: 10px;
}
</style>