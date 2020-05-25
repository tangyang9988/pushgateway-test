<template>
  <div class="tabHeader">
    <div style="margin-bottom:10px">
      <BreadCrumb></BreadCrumb>
    </div>
    <div class="proInfo">
      <div class="page-title">
        <img :src="pageTitleImg" alt="">
        <span style="font-size: 18px;">MN：{{MNStr}}</span>
      </div>
      <div class="page-title">
        <img :src="pageTitleImg" alt="">
        <span style="font-size: 18px;">所属项目：{{projectName}}</span>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="12" class="toolsHeight">
        <el-card :body-style="{ padding: '0px' }" class="cardHeight">

          <div slot="header">
            <div class="page-title">
              <img :src="pageTitleImg" alt="">
              <span>工具栏</span>
            </div>
          </div>

          <div class="tools-content">
            <div class="toolBtn-wrapper">
                <el-button type="primary" class="toolsButtonWidth" size="small" @click="onShowDynamicControl">动态管控</el-button>
                <el-button type="primary" class="toolsButtonWidth" size="small" @click="openBasicSetting">基础设置</el-button>
                <el-button type="primary" class="toolsButtonWidth" size="small" @click="openMNList">上位机设置</el-button>
                <el-button type="primary" class="toolsButtonWidth" size="small" @click="openCollecting">采集设备配置</el-button>
            </div>

            <div class="toolBtn-wrapper">
                <el-button size="small" type="primary" class="toolsButtonWidth" @click="openTiming">校时</el-button>
                <el-button size="small" type="primary" class="toolsButtonWidth" @click="onShowDlgRecriminateControl">反控设置</el-button>
                <el-button size="small" class="toolsButtonWidth" plain>屏幕截图</el-button>
                <el-button size="small" class="toolsButtonWidth" plain>重启数采仪</el-button>
            </div>

            <div class="toolBtn-wrapper">
                <el-button type="primary" size="small" class="toolsButtonWidth" @click="openComDebug">串口调试</el-button>
                <div><!-- flex布局--占个坑··· --></div>
                <div><!-- flex布局--占个坑··· --></div>
                <div><!-- flex布局--占个坑··· --></div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="toolsHeight">
        <el-card :body-style="{ padding: '0px' }" class="cardHeight">
          
          <div slot="header">
            <div class="page-title">
              <img :src="pageTitleImg" alt="">
              <span>系统执行信息</span>
            </div>
          </div>

          <el-tabs>
            <el-table
              :data="tableData"
              height="150"
              style="width: 100%"
              :show-header="showHeader"
              size="small"
            >
              <el-table-column prop="execTime" width="150" label></el-table-column>
              <el-table-column prop="commandName" label></el-table-column>
              <el-table-column prop="execResult" label></el-table-column>
            </el-table>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import RTUInfo from "./RTUInfo.vue";
import pageTitleImg from '@/assets/images/pageTitle.png'

import BreadCrumb from "@/components/BreadCrumb.vue";
@Component({
  name: "HeaderCardList",
  components: {
    RTUInfo: RTUInfo,
    // MnList: MnList,
    BreadCrumb: BreadCrumb
  }
})
export default class HeaderCardList extends Vue {
  @Prop({ type: Object, default: null }) project!: any; //从父组件获取dtu

  //如果project发生变化，即刷新了页面，就从本地获取mn，并开启websocket
  @Watch("project", { immediate: true, deep: true })
  onPersonChanged3(newVal: project, oldVal: project) {
    this.MNStr = sessionStorage.getItem("rtuMN");
    this.projectName = sessionStorage.getItem("projectName");
    this.uuid = sessionStorage.getItem("uuid");
    this.initWebSocket();
  }
  pageTitleImg :any = pageTitleImg
  projectName = ""; //项目名称
  MNStr = ""; //MN
  showHeader = false;
  mnList = false;
  ws = "";
  msg = "";

  uuid = "";

  // that: any = this;
  tableData:any = [];

  //监听MN
  @Watch("")
  //打开MN list
  openMNList() {
    this.$router.push({ path: "/v/mns" });
  }

  //打开基础设置
  openBasicSetting() {
    this.$router.push({ path: "/v/bs" });
  }

  //打开采集设备配置
  openCollecting() {
    this.$router.push({ path: "/v/co" });
  }

  //打开动态管控页面
  onShowDynamicControl() {
    this.$router.push({ path: "/v/dc" });
  }

  //打开反控面
  onShowDlgRecriminateControl() {
    this.$router.push({ path: "/v/dr" });
  }
  //打开校时页面
  openTiming() {
    this.$router.push({ path: "/v/ti" });
  }
  
  //打开串口调试
  openComDebug() {
    this.$router.push({ path: "/v/cd" });
  }

  mounted() {
    // console.log("头部组件，数据渲染阶段，project:",this.project)
    this.projectName = this.project ? this.project.projectName : "";
    this.MNStr = this.project ? this.project.rtuMn : "";

    if (this.projectName == "") {
      this.MNStr = sessionStorage.getItem("rtuMN") || "";
      this.projectName = sessionStorage.getItem("projectName") || "";     
    }
    
    // console.log("MN2:", this.MNStr, ",projectName2:", this.projectName);
    this.initWebSocket();
  }

  //websocket
  echo() {
    // if (!this.msg) return;
    // console.log("WebSocket发送消息: " + this.msg);
    // this.ws.send({rtuMN:})
  }

  initWebSocket = function(params: any) {
    // ws = new WebSocket('wss://echo.websocket.org/')
    this.ws = new WebSocket(
      "ws://172.20.0.91:9001/api/remoteControl/ws/execInfo?uuid=" + this.uuid
    );

    this.ws.onopen = function(e: any) {
      console.log("WebSocket已经打开: ");
      console.log(e);
    };

    //替换this
    let that: any = this;

    this.ws.onmessage = function(e: any) {
      console.log("WebSocket收到消息: " + e.data);
      let cleadData = JSON.parse(e.data); //解析json
      console.log("json转化",cleadData)

      console.log(sessionStorage.getItem('caArr'))
      that.tableData = eval(sessionStorage.getItem('caArr') || '[]')
      that.tableData.unshift(cleadData)
      sessionStorage.setItem('caArr', JSON.stringify(that.tableData))
      
    };
    this.ws.onclose = function(e) {
      console.log("WebSocket关闭: ");
    };
    this.ws.onerror = function(e) {
      console.log("WebSocket发生错误: ");
      console.log(e);
    };
  };

  // created() {
  //   this.initWebSocket();
  // }
}
</script>>
 

<style scoped>
/* .tools {
  width: 40%;
  margin-left: 5%;
  float: left;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
} */
.currentData {
  width: 30%;
  height: 15%;
  margin-right: 5%;
  float: right;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.tabHeader {
  height: 15%;
  width: 100%;
}

.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 650px;
}

.row-bg {
  padding: 10px 0;
}
.toolsButtonWidth {
  width: 100px;
}
.toolsHeight {
  height: 250px;
}

.cardHeight {
  height: 240px;
  /* height: 9%; */
}
.proInfo {
  display: flex;
  margin: 15px 0;
}
.page-title {
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 14px;
  margin-right: 70px;
}
.page-title img {
  margin-right: 5px;
}
.bread {
  width: 100%;
  margin-bottom: 20px;
}

/* 工具栏 */
.tools-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
}
.toolBtn-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
}
</style>