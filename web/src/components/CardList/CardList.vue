<template>
  <!-- <el-scrollbar wrapClass="scrollbar-wrap" :style="{height: scrollHeight}" ref="scrollbarContainer"> -->
  <div id="page-content">

    <div style="display:flex;flex-direction:row-reverse;">
      <!-- 离线 -->
      <div style="display:flex;margin:0 5px;" @click="filterDtu(0)">
        <el-button style="padding: 3px;" icon="el-icon-s-opportunity" type="info" size="large"></el-button>
        <div style="white-space:nowrap;" :class="countActive==0?'countActive':'count'">离线：{{offLineList.length}}台</div>
      </div>
      <!-- 在线 -->
      <div style="display:flex;margin:0 5px;" @click="filterDtu(1)">
        <el-button style="padding: 3px;" icon="el-icon-s-opportunity" type="success" size="large"></el-button>
        <div style="white-space:nowrap;" :class="countActive==1?'countActive':'count'">在线：{{onLineList.length}}台</div>
      </div>
      <!-- 总数 -->
      <div style="display:flex;margin:0 5px;" @click="filterDtu(2)">
        <el-button style="padding: 3px;" icon="el-icon-s-opportunity" type="primary" size="large"></el-button>
        <div style="white-space:nowrap;" :class="countActive==2?'countActive':'count'">总数：{{onLineList.length+offLineList.length}}台</div>
      </div>
    </div>

    <!-- 顶部button -->
    <div class="headerBtn">
      <div class="headerBtn-left">
        <span style>项目名称：</span>
        <el-select v-model="proId" placeholder="请选择" @change="currentSel">
          <el-option
            v-for="(item, index) in projects"
            :key="index"
            :label="item.ProjectName"
            :value="item.Id"
          ></el-option>
        </el-select>
        <span style="margin-left:20px;">是否在线：</span>
        <el-select v-model="online" placeholder="请选择" @change="currentOnline">
          <el-option
            v-for="item in isOnlineOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <span style="margin-left:10px;">设备名称：</span>
        <el-input v-model="RtuName" placeholder="请输入"></el-input>
        <span style="margin-left:10px;">MN：</span>
        <el-input v-model="RtuMn" placeholder="请输入"></el-input>
        <el-button
          @click="searchDevices"
          type="primary"
          icon="el-icon-search"
          style="margin-left:10px;"
        >查询</el-button>
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
          v-for="(card, index) in cardList"
          :key="index"
          style="display:flex;justify-content:center;"
        >
          <el-card
            :class="activeCard == card ? 'card-cell card-active':'card-cell'"
            @click.native="selectCard(card)"
          >
            <div slot="header" class="card-header">
              <div>
                <img :class="card.Online?'light-green':'light-grey'" :src="LightImg" alt="状态灯" />
                <!-- <el-button class="card-header-light" icon="el-icon-s-opportunity" :type="card.Online?'success':'info'" size="large"></el-button> -->
                <span class="card-header-rtuName" @click="openRTUInfo(card)">{{card.RtuName}}</span>
              </div>
              <div>
                <el-button
                  class="card-header-historyInfo"
                  type="text"
                  @click="historicalNews(card)"
                >历史消息</el-button>
              </div>
            </div>

            <div class="card-content">
              <div>
                <span class="card-content-label">所属项目</span>
                {{card.TProject.ProjectName}}
              </div>
              <div style="margin-top:10px;">
                <span class="card-content-label">MN</span>
                {{card.RtuMn}}
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
import LightImg from "@/assets/images/light.png";

@Component({
  components: {
    GaugeCard: GaugeCard,
    GmsMessages: GmsMessages,
    CardView: CardView
  }
})
export default class CardList extends Vue {

  LightImg:any = LightImg;
  gagues = { Nodes: 0, Devices: 0, Sessions: 0 };
  loading = false;
  devices:any = []; //设备列表
  pageSize = 99999999;
  page = 1;
  RtuName = null;
  RtuMn = null;
  proId = null;
  online ="全部";
  activeCard = null;
  curCard: any = null;
  isSelect: boolean = false; // 是否已经选中卡片
  dlgMessageVisible = false; //历史消息  对话框是否打开
  addDeviceVisable = false; //新增设备
  isAddVisable = false; //是否新增
  projects = []; // 项目列表
  isClear = false; // 重置表单验证
  onLineList: any[] = []; // 在线设备列表
  offLineList: any[] = []; // 离线设备列表
  index: number = 0; // 懒加载页数
  cardList: any[] = []; // 懒加载展示数据
  finished: boolean = false; // true-可以加载 false-到底了（不能加载)
  filterList: any[] = [];
  countActive: number = 2;
  uuid = ""; // websocket唯一标识

  // 是否在线
  isOnlineOptions = [
    {
      value: "1",
      label: "在线"
    },
    {
      value: "0",
      label: "离线"
    },
    {
      value: "3",
      label: "全部"
    }
  ];
  /**
   * 筛选方法
   * @type {number} 筛选类型 0-离线 1-在线 2-全部 默认2-全部
   */
  filterDtu(type: number = 2) {
    this.countActive = type;
    // 筛选列表
    this.filterList = [];
    this.cardList = [];
    this.devices.forEach((item: any, index: number) => {
      if (type == 2) {
        this.filterList.push(item);
      } else if (item.Online == type) {
        this.filterList.push(item);
      }
    });
    // 重置滚动条
    let cardsDom = document.getElementById("cards-box");
    if (cardsDom) cardsDom.scrollTop = 0;
    // 重置懒加载
    this.index = 0;
    this.finished = false;
    this.load();
  }

  /**
   * 懒加载
   */
  load() {
    if (this.filterList.length > 0) {
      if (this.finished) {
        this.$message.success("到底啦");
      } else {
        if (this.filterList.length < 42 + this.index * 12) {
          this.cardList = this.filterList.slice(0, this.filterList.length);
          this.finished = true;
        } else {
          this.cardList = this.filterList.slice(0, 42 + this.index * 12);
        }
        this.index++;
      }
    }
  }

  // 获取所选项目proId
  currentSel(row: any) {
    this.proId = row;
  }
  // 获取所选项目online
  currentOnline(row: any) {
    this.online = row;
  }

  /** 加载数采仪列表 **/
  loadDTUs() {
    this.loading = true;
    // alert(this.proId)
    DtuService.Query(
      this.pageSize,
      this.page,
      <any>this.proId,
      Number(this.online),
      <any>this.RtuMn,
      <any>this.RtuName
    )
      .then(res => {
        this.$set(this, "devices", res.data);
        this.loading = false;
        if (this.devices == undefined || this.devices.length <= 0) {
          this.$message.warning("暂无数据");
        } else {
          this.devices.forEach((item: any, index: number) => {
            item.Online
              ? this.onLineList.push(item)
              : this.offLineList.push(item);
          });
          this.filterList = this.devices;
          this.load();
        }
      })
      .catch(err => {
        this.loading = false;
        this.$message.error("加载数采仪列表失败:" + err);
      });
    this.loadProjects();
    // this.loadOnline();
  }

  //在线
  // loadOnline() {
  //   DtuService.onlineCounts()
  //     .then(res => {
  //       const onlineCounts = new Map;
  //       console.log(onlineCounts)
  //       this.$set(this, "onlineCounts", res.data);
  //     })
  //     .catch(err => {
  //       this.$message.error("加载在线离线数错误:" + err);
  //     });
  // }
  // 项目列表
  loadProjects() {
    DtuService.currentList()
      .then(res => {
        this.$set(this, "projects", res.data);
      })
      .catch(err => {
        this.$message.error("加载项目列表错误:" + err);
      });
  }

  //打开RTUInfo
  openRTUInfo(e: any) {
    //console.log("卡片信息：",e)\
    // console.log("页面跳转传值，rtumn:",e.RtuMn,"project name:",e.TProject.ProjectName)
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
    this.isSelect = false;
    this.RtuName = null;
    this.RtuMn = null;
    this.proId = null;
    this.online = null;
    this.activeCard = null;
    this.curCard = null;
    this.finished = false; // 重置懒加载
    // 重置滚动条
    let cardsDom = document.getElementById("cards-box");
    if (cardsDom) cardsDom.scrollTop = 0;

    this.loadDTUs();
  }
  //查询设备
  searchDevices() {
    this.loadDTUs();
  }

  //历史消息
  historicalNews(e: any) {
    // this.curCard=e
    this.dlgMessageVisible = true;
  }

  //新增设备
  onCreate() {
    this.isClear = !this.isClear;
    // 点击新增后取消卡片选中状态
    this.activeCard = null;
    this.isSelect = false;

    this.curCard = {};
    this.isAddVisable = true;
    this.addDeviceVisable = true;
  }
  //修改设备
  onEdit() {
    if (this.isSelect) {
      this.isClear = !this.isClear;
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
    this.isSelect = true;
    this.curCard = e;
    this.activeCard = e;
  }

  // 获取滚动条当前的位置
  getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  }
  // 获取当前可视范围的高度
  getClientHeight() {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight = Math.min(
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
    } else {
      clientHeight = Math.max(
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
    }
    return clientHeight;
  }

  // 获取文档完整的高度
  getScrollHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  }
  // 滚动事件触发下拉加载
  // onScroll() {
  //   if (this.getScrollHeight() - this.getClientHeight() - this.getScrollTop() <= 0) {
  //     if (this.status === 1) {
  //       this.status = 0;
  //       // 页码，分页用，默认第一页
  //       this.deliverParams.page += 1;
  //       // 调用请求函数
  //       alert("触发！！！");
  //     }
  //   }
  // }
  mounted() {
    this.loadDTUs();

    // 设置卡片容器高度
    let cardBoxHeight = window.innerHeight - 210;
    let cardBox = document.getElementById("cards-box");
    cardBox ? (cardBox.style.height = cardBoxHeight + "px") : "0px";

    // 卡片容器高度自适应
    window.onresize = () => {
      let cardBoxHeight = window.innerHeight - 210;
      let cardBox = document.getElementById("cards-box");
      cardBox ? (cardBox.style.height = cardBoxHeight + "px") : "0px";
    };
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
  cursor: pointer;
  font-size: 15px;
}
.countActive {
  cursor: pointer;
  font-size: 15px;
  color: rgb(64, 158, 255);
}
/* 头部 */
.headerBtn {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.headerBtn .el-input {
  width: 190px;
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
  background: #67c23a;
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

