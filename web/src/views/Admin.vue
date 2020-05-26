<template>
  <el-container style="height:100%;">
    <!-- Header -->
    <el-header class="ops-header">
      <div class="header-content">
        <div class="header-logo-wrapper">
          <img class="header-logo-img" src="@/assets/images/lcLogo.png" />
          <div class="header-logo-title">蓝创云采网关管理系统</div>
        </div>

        <div>
          <el-dropdown @command="onUserCommand">
            <div style="display:flex;">
              <el-avatar src="@/assets/images/user.png" size="small"></el-avatar>
              <div style="line-height:28px;margin-left:10px;">{{username}}<i class="el-icon-arrow-down el-icon--right"></i></div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="signout" icon="fas fa-sign-out-alt">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-container  style="height: calc(100% - 60px);">
      <!-- Menu -->
      <el-aside width="150px">
        <el-menu
          router
          :default-active="$route.path"
          style="height:100%;"
          text-color="#fff"
          active-text-color="#fff"
        >
          <div v-if="permission == '1'">
            <el-menu-item
              v-for="(sub,i) in menus"
              :index="sub.index"
              :key="i"
            >
              <template slot="title">
                <i v-if="sub.icon" :class="sub.icon"></i>
                {{sub.title}}
              </template>
            </el-menu-item>
          </div>
          <div v-else>
            <el-menu-item
              v-for="(sub,index) in commonMenus"
              :index="sub.index"
              :key="index"
              
            >
              <template slot="title">
                <i v-if="sub.icon" :class="sub.icon"></i>
                {{sub.title}}
              </template>
            </el-menu-item>
          </div>
        </el-menu>
      </el-aside>
      <!-- Main -->
      <el-main style="overflow:auto;background:rgb(248,248,248)">
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
    { title: "报警消息", icon: "fas fa-exclamation-circle fa-fw", index: "/v/alarm" },
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
    { title: "报警消息", icon: "fas fa-exclamation-circle fa-fw", index: "/v/alarm" },
    { title: "系统工具", icon: "fas fa-tools fa-fw", index: "/v/tools" },
    // { title: '安全管理', icon: 'fas fa-user-secret fa-fw', index: '/v/secret' },
    { title: "项目管理", icon: "fas fa-industry fa-fw", index: "/v/prjs" },
    { title: '用户管理', icon: 'fas fa-users fa-fw', index: '/v/users' }
  ];
  permission = "";
  heiGht =  window.innerHeight+'px'
  username: string = '用户'
    
  /** 当前登录用户菜单的相关命令处理 */
  onUserCommand(command: string) {
    if (command === "signout") {
      //TODO:调用服务退出逻辑
      this.$router.push({ path: "/" });
    }
  }
  mounted() {
    this.permission = <any>window.sessionStorage.getItem("permission");
    this.username = sessionStorage.getItem('username') || '用户'
  }
}
</script>

<style scoped>
.ops-header {
  color: white;
  padding-top: 15px;
  box-shadow: 0px 0px 5px rgb(209, 209, 209);
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-logo-wrapper {
  display: flex;
}
.header-logo-img {
  height: 30px;
  margin-right: 10px;
}
.header-logo-title {
  font-weight: 700;
  font-size: 20px;
  color:dodgerblue;
  line-height: 30px;
}
.el-avatar {
  background: #fff;
  border: 1px solid rgb(240, 240, 240);
}
.el-menu {
  background: url('../assets/images/left.png');
}
.el-menu-item:hover {
  background: rgba(255, 255, 255, 0.2);
}
.el-menu .is-active {
  background: rgba(255, 255, 255, 0.2);
}
</style>