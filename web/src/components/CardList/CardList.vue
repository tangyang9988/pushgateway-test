<template>
  <!-- <el-scrollbar wrapClass="scrollbar-wrap" :style="{height: scrollHeight}" ref="scrollbarContainer"> -->
  <div id="page-content">

    <div style="display:flex;flex-direction:row-reverse;">
      <!-- 离线 -->
      <div style="display:flex;margin:0 5px;">
        <el-button style="padding: 3px;" icon="el-icon-s-opportunity" type="info" size="large"></el-button>
        <div style="white-space:nowrap;">离线：{{offlineNum}}台</div> 
      </div>
      <!-- 在线 -->
      <div style="display:flex;margin:0 5px;">
        <el-button style="padding: 3px;" icon="el-icon-s-opportunity" type="success" size="large"></el-button>
        <div style="white-space:nowrap;">在线：{{onlineNum}}台</div> 
      </div>
      <!-- 总数 -->
      <!-- <div style="display:flex;margin:0 5px;">
        <el-button style="padding: 3px;" icon="el-icon-s-opportunity" type="primary" size="large"></el-button>
        <div style="white-space:nowrap;">总数：{{onlineNum + offlineNum}}台</div> 
      </div> -->
    </div>

    <!-- 顶部button -->
    <div class="headerBtn">
      <div class="headerBtn-left">
          <span>项目名称：</span>
          <el-select v-model="proId" placeholder="请选择" @change="currentSel">
            <el-option
              v-for="(item, i) in projects"
              :key="i"
              :label="item.ProjectName"
              :value="item.Id"
            ></el-option>
          </el-select>
          <span style="margin-left:10px;">设备名称：</span>
          <el-input v-model="RtuName" placeholder="请输入"></el-input>
          <span style="margin-left:10px;">MN：</span>
          <el-input v-model="RtuMn" placeholder="请输入"></el-input>
          <el-button @click="loadDTUs" type="primary" icon="el-icon-search" style="margin-left:10px;">查询</el-button>
          <el-button @click="flash" type="primary" icon="fas fa-sync-alt fa-fw">刷新</el-button>
      </div>

      <div class="headerBtn-right">
        <el-tag @click="onEdit" type="danger">编辑设备</el-tag>
        <el-tag @click="onDelete" type="danger" style="margin-left:10px;">删除设备</el-tag>
        <el-tag @click="onCreate" type="success" style="margin-left:10px;">新增设备</el-tag>
        <el-button @click="loadDTUs" type="primary" style="margin-left:10px;">上传设备列表</el-button>
      </div>
    </div>
    
    <!-- 卡片列表 -->
    <div id="cards-box">
      <div v-infinite-scroll="load" class="cards-wrapper">
        <el-col 
          :span="4"
          v-for="(card, cardIndex) in cardList"
          :key="cardIndex"
          style="display:flex;justify-content:center;"
        >
          <el-card
            :class="activeCard == card ? 'card-cell card-active':'card-cell'"
            @click.native="selectCard(card)"
          >
            <div slot="header" class="card-header">
              <div>
                <img :class="card.Online?'light-green':'light-grey'" src="@/assets/images/light.png" alt="状态灯">
                <!-- <el-button class="card-header-light" icon="el-icon-s-opportunity" :type="card.Online?'success':'info'" size="large"></el-button> -->
                <span class="card-header-rtuName" @click="openRTUInfo(card)">{{card.RtuName}}</span>
              </div>
              <div>
                <el-button class="card-header-historyInfo" type="text" @click="historicalNews(card)">历史消息</el-button>
              </div>
            </div>

            <div class="card-content">
              <div>
                <span class="card-content-label">所属项目</span>{{card.TProject.ProjectName}}
              </div>
              <div style="margin-top:10px;">
                <span class="card-content-label">MN</span>{{card.RtuMn}}
              </div>
            </div>
          </el-card>
        </el-col>
      </div>
    </div>
    <el-dialog title="历史消息" :visible.sync="dlgMessageVisible" width="80%">
      <gms-messages :dtu="curCard" :visible="dlgMessageVisible"></gms-messages>
    </el-dialog>
    <el-dialog title="新增设备" :visible.sync="addDeviceVisable" width="600px" height="700px">
      <Card-View :dtu="curCard" :visible="addDeviceVisable" :isAdd="isAddVisable" :isClear="isClear"></Card-View>
    </el-dialog>
  </div>
  <!-- </el-scrollbar> -->
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GaugeCard from "@/components/GaugeCard.vue";
import DtuService from "@/services/DtuService";
import GmsMessages from "../Device/GmsMessages.vue";
import CardView from "./CardView.vue";

@Component({
  components: {
    GaugeCard: GaugeCard,
    GmsMessages: GmsMessages,
    CardView: CardView
  }
})
export default class CardList extends Vue {

  gagues = { Nodes: 0, Devices: 0, Sessions: 0 };
  loading = false;
  devices:any = []; //设备列表
  pageSize = 99999999;
  page = 1;
  RtuName = null;
  RtuMn = null;
  proId = null;
  activeCard = null;
  curCard: any = null;
  isSelect:boolean = false  // 是否已经选中卡片
  dlgMessageVisible = false; //历史消息  对话框是否打开
  addDeviceVisable = false; //新增设备
  isAddVisable = false; //是否新增
  projects = []; // 项目列表
  isClear = false // 重置表单验证--子组件
  index:number = 0  // 懒加载页数
  cardList:any[] = [] // 懒加载展示数据
  finished:boolean = false  // true-可以加载 false-到底了（不能加载)
  uuid = ""; // websocket唯一标识
  onlineNum:number = 0  // 在线数量
  offlineNum:number = 0 // 离线数量

  /**
   * 懒加载
   */
  load() {
    if(this.devices.length > 0) {
      if(this.finished) {
        this.$message.success('到底啦')
      }else {
        if(this.devices.length < 42+this.index*12) {
          this.cardList = this.devices.slice(0, this.devices.length)
          this.finished = true
        }else {
          this.cardList = this.devices.slice(0,42+this.index*12)
        }
        this.index++
      }
    }
  }

  // 获取所选项目proId
  currentSel(row: any) {
    this.proId = row;
  }

  /** 加载数采仪列表 **/
  loadDTUs() {
    this.loading = true;
    // alert(this.proId)
    DtuService.Query(
      this.pageSize,
      this.page,
      <any>this.proId,
      <any>this.RtuMn,
      <any>this.RtuName
    ).then(res => {
      this.$set(this, "devices", res.data);
      this.loading = false
      if (this.devices == undefined || this.devices.length <= 0) {
        this.$message.warning("暂无数据");
      }else {
        this.cardList = []
        this.load() 
      }
    }).catch(err => {
      this.loading = false;
      this.$message.error("加载数采仪列表失败:" + err);
    })
    this.loadProjects()
  }

  /**
   * 加载设备数量
   */
  loadOnline() {
    DtuService.onlineCounts().then(res => {

    }).catch(err => {
      this.$message.error("设备数量接口错误:" + err)
    })
  }

  // 项目列表
  loadProjects() {
    DtuService.currentList().then(res => {
      this.$set(this, "projects", res.data)
    }).catch(err => {
      this.$message.error("加载项目列表错误:" + err)
    })
  }

  //打开RTUInfo
  openRTUInfo(e: any) {
    this.uuid = this.getUuid();
    sessionStorage.setItem("uuid", this.uuid);
    //判断是否重置【系统执行信息】
    sessionStorage.setItem("caArr", "");
    this.$router.push({
      path: "/v/rtu",
      query: {
        rtuMn: e.RtuMn,
        projectName: e.TProject.ProjectName
      }
    });
  }
  // 国际法则自动生成uuid
  getUuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = ""; //"" 引号里面可以加任意字符，代表拼接的意思，如果不加就是 纯32位支付

    var id = s.join("");
    return id;
  }

  // 刷新
  flash() {
    this.isSelect = false
    this.RtuName = null;
    this.RtuMn = null;
    this.proId = null;
    this.activeCard = null;
    this.curCard = null;
    // 重置懒加载
    this.finished = false 
    this.index = 0
    // 重置滚动条
    let cardsDom = document.getElementById('cards-box')
    if(cardsDom) cardsDom.scrollTop = 0

    this.loadDTUs()
    this.loadOnline()
  }

  //历史消息
  historicalNews(e: any) {
    // this.curCard=e
    this.dlgMessageVisible = true;
  }

  //新增设备
  onCreate() {
    this.isClear = !this.isClear
    // 点击新增后取消卡片选中状态
    this.activeCard = null
    this.isSelect = false

    this.curCard = {}
    this.isAddVisable = true;
    this.addDeviceVisable = true;
  }
  //修改设备
  onEdit() {
    if (this.isSelect) {
      this.isClear = !this.isClear
      this.isAddVisable = false;
      this.addDeviceVisable = true;
    } else {
      this.$message.warning("请先选择卡片");
    }
  }
  // 删除设备
  onDelete() {
    if (!this.curCard) {
      this.$message.warning("请选择待删除的数采仪");
      return;
    }
    this.$confirm("确认删除选择的数采仪吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        DtuService.Delete(this.curCard)
          .then(res => {
            this.$message.success("删除数采仪成功");
            this.loadDTUs(); //暂简单直接刷新
          })
          .catch(err => {
            this.$message.error("删除数采仪失败:" + err);
          });
      })
      .catch(() => {});
  }
  // 选中卡片高亮状态
  selectCard(e: any) {
    this.isSelect = true
    this.curCard = e;
    this.activeCard = e;
  }

  mounted() {
    this.loadDTUs()
    this.loadOnline()
    
    // 设置卡片容器高度
    let cardBoxHeight = window.innerHeight - 210
    let cardBox = document.getElementById('cards-box')
    cardBox ? cardBox.style.height = cardBoxHeight + 'px' : '0px'

    // 卡片容器高度自适应
    window.onresize =()  =>{
      let cardBoxHeight = window.innerHeight - 210
      let cardBox = document.getElementById('cards-box')
      cardBox ? cardBox.style.height = cardBoxHeight + 'px' : '0px'
    }
  }
}
</script>
<style>
#page-content {
  height: 100%;
  min-width: 1665px;
}
/* 设备数量 */
.count {
  font-size: 15px;
}
/* 头部 */
.headerBtn {
  display:flex;
  justify-content:space-between;
  margin-top: 15px;
}
.headerBtn .el-input {
  width: auto;
}
.headerBtn-right .el-tag {
  cursor: pointer;
}
/* 卡片列表 */
#cards-box {
  min-width: 1685px;
  margin-top: 15px;
  overflow: auto;
}
.cards-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
.el-card__header {
  padding: 15px;
}
.light-green {
  background: #67C23A;
  padding: 3px 5px;
  border-radius: 50%;
  vertical-align: middle;
}
.light-grey {
  background: #909399;
  padding: 3px 5px;
  border-radius: 50%;
  vertical-align: middle;
}
.card-header-light {
  padding: 3px;
}
.card-header-rtuName {
  margin-left: 5px;
  font-size: 15px;
  cursor: pointer;
}
.card-header-historyInfo {
  padding: 3px;
}
.el-card__body {
  padding: 15px;
}
.card-content {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  padding-left: 10px;
}
.card-content-label {
  color: #9b9b9b;
  display: inline-block;
  margin-right: 15px;
}
.card-cell {
  width: 270px;
  min-width: 270px;
  margin: 6px 3px;
}
.card-active {
  background: rgb(233, 233, 233);
}
.card-active .card-header-rtuName {
  color: dodgerblue;
}
</style>

