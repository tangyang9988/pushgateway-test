<template>
  <div class="mrle10">
    <div>
      <!-- <header-card-list :project="$route.query.project"></header-card-list> -->
      <header-card-list :project="$route.query"></header-card-list>
    </div>

    <br />

    <!-- 数采仪发送的消息 -->
    <el-row :gutter="40">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div class="card-header-content">
              <div class="page-title">
                <img src="@/assets/images/pageTitle.png" alt="">
                <span>数采仪历史信息</span>
              </div>

              <el-button
                type="primary"
                size="small"
                style="float:right;"
                @click="getHistoryMessage"
              >刷新</el-button>
            </div>
          </div>
          <!-- type="card" -->
          <el-tabs v-model="activeName" @tab-click="handleClick" size="small">
            <el-tab-pane label="5分钟消息" name="5">
              <el-table :data="messages" style="width: 100%" max-height="300">
                <el-table-column prop="InsertTime" label="日期" width="150"></el-table-column>
                <el-table-column prop="Msg" label="结果"></el-table-column>
              </el-table>
              <!-- 分页 -->
              <el-pagination
                layout="prev, pager, next, total"
                :page-size="pageSize"
                :current-page.sync="page"
                :total="total"
                @current-change="getHistoryMessage"
              ></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="1小时消息" name="60">
              <!-- <el-button plain>刷新</el-button> -->
              <el-table :data="messages" style="width: 100%" max-height="300">
                <el-table-column prop="InsertTime" label="日期" width="150"></el-table-column>
                <el-table-column prop="Msg" label="结果"></el-table-column>
              </el-table>
              <el-pagination
                layout="prev, pager, next, total"
                :page-size="pageSize"
                :current-page.sync="page"
                :total="total"
                @current-change="getHistoryMessage"
              ></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="30天消息" name="43200">
              <!-- <el-button plain>刷新</el-button> -->
              <el-table :data="messages" style="width: 100%" max-height="300">
                <el-table-column prop="InsertTime" label="日期" width="150"></el-table-column>
                <el-table-column prop="Msg" label="结果"></el-table-column>
              </el-table>
              <el-pagination
                layout="prev, pager, next, total"
                :page-size="pageSize"
                :current-page.sync="page"
                :total="total"
                @current-change="getHistoryMessage"
              ></el-pagination>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="box-card">
          
          <div slot="header" class="clearfix">
            <div class="card-header-content">
              <div class="page-title">
                <img src="@/assets/images/pageTitle.png" alt="">
                <span>数采仪实时数据</span>
              </div>

              <el-button
                type="primary"
                size="small"
                style="float:right;"
                @click="changeCurrentData"
              >刷新</el-button>
            </div>
          </div>
          <el-tabs v-model="currentActiveName" @tab-click="changeCurrentData">
            <el-tab-pane label="实时消息" name="currentMessage">
              <el-table :data="currentTableData" style="width: 100%" max-height="450">
                <el-table-column prop="date" label="日期"></el-table-column>
                <el-table-column prop="code" label="操作"></el-table-column>
                <el-table-column prop="flag" label="结果">
                  <!-- <div v-if="flag =='T'">成功</div>
                  <div v-else>失败</div>-->
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="TCP通道日志" name="tcpLog">
              <el-table :data="tcpLog" style="width: 100%" max-height="450">
                <el-table-column prop="insert_time" label="日期">
                  <!-- {{"2000-01-10T02:09:43Z" | formatDate}}  {{InsertTime}}-->
                  <!-- <div>{{tcpLog.InsertTime}} </div> -->
                </el-table-column>
                <el-table-column prop="content" label="操作"></el-table-column>
                <!-- <el-table-column prop="flag" label="结果">
                  <div v-if="flag =='T'">成功</div>
                <div v-else>失败</div>-->
                <!-- </el-table-column> -->
              </el-table>
            </el-tab-pane>
            <!-- <el-tab-pane label="运行日志" name="runLog">
              <el-table :data="runLog" style="width: 100%" max-height="450">
                <el-table-column prop="InsertTime" label="日期"></el-table-column>
            <el-table-column prop="Content" label="操作"></el-table-column>-->
            <!-- <el-table-column prop="flag" label="结果">
                  <div v-if="flag =='T'">成功</div>
            <div v-else>失败</div>-->
            <!-- </el-table-column> -->
            <!-- </el-table>
            </el-tab-pane>-->
            <el-tab-pane label="统计日志" name="statisticsLog">
              <el-table :data="staLog" style="width: 100%" max-height="450">
                <el-table-column prop="insert_time" label="日期"></el-table-column>
                <el-table-column prop="content" label="操作"></el-table-column>
                <!-- <el-table-column prop="flag" label="结果">
                  <div v-if="flag =='T'">成功</div>
                  <div v-else>失败</div>
                </el-table-column>-->
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import HeaderCardList from "./HeaderCardList.vue";
import MNModify from "./MNModify.vue";
import DtuService from "@/services/DtuService";
 

@Component({
  components: {
    HeaderCardList: HeaderCardList
  }
})
export default class rtu extends Vue {
 
  currentProject:any = {};

  activeName = "5";
  currentActiveName = "currentMessage";

  messages = []; //历史消息

  currentTableData = []; //实时数据
  tcpLog = [];
  runLog = [];
  staLog = [];

  @Watch("range")
  onRangeChanged(val: number) {
    this.page = 1;
    this.load();
  }

  range = 5; //时间范围
  loading = false;
  pageSize = 10;
  page = 1;
  total = 0;

  /** 分页功能 **/
  searchDTUs() {}

  //从url中获取rtumn并保存到sessionStorage
  mounted() {
    console.log("rtu info ,mounted,set sessionStorage rtuMN,projectName.",this.$route.query.rtuMn,this.$route.query.projectName)
    this.currentProject.rtuMn = this.$route.query.rtuMn;
    sessionStorage.setItem("rtuMN", String(this.$route.query.rtuMn));
   sessionStorage.setItem("projectName", String(this.$route.query.projectName))
   console.log("将rtu mn 和项目名称存入sessionStorage:",sessionStorage.getItem("rtuMN"),sessionStorage.getItem("projectName"))
    this.load();
  }

  //历史消息
  load() {
    this.getHistoryMessage();
    this.changeCurrentData();
  }
  //历史消息切换更换数据源
  handleClick(tab: any, event: any) {
    console.log("激活的tab:", this.activeName);
    this.getHistoryMessage();
  }
  //实时消息切换数据源

  //获取历史消息
  getHistoryMessage() {
    //根据选项计算时间范围
    let end = new Date();
    let start = new Date();
    //计算开始时间
    let hisRange = parseInt(this.activeName);
    console.log("时间范围：", hisRange);
    start.setTime(start.getTime() - hisRange * 60 * 1000);
    // console.log(this.dtu.RtuMn)

    this.loading = true;
    DtuService.GetMessages(
      this.currentProject.rtuMn,
      start,
      end,
      this.pageSize,
      this.page
    )
      .then(res => {
        this.total = res.total;
        this.$set(this, "messages", res.data);
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.$message.error("加载历史消息错误:" + err);
      });
  }

  //获取实时数据
  getCurrentData() {
    DtuService.GetRTUCurrentData(this.currentProject.rtuMn)
      .then(res => {
        this.total = res.total;
        this.$set(this, "currentTableData", res.data);
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.$set(this, "currentTableData", []);
        this.$message.error("加载实时消息错误:" + err);
      });
  }
  //TCP通道日志
  getTcpLog() {
    DtuService.GetRTUTCPlog(this.currentProject.rtuMn)
      .then(res => {
        this.total = res.total;
        this.$set(this, "tcpLog", res.data);
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.$set(this, "tcpLog", []);
        this.$message.error("加载tcp日志消息错误:" + err);
      });
  }
  //运行日志
  getRunLog() {
    DtuService.GetRTURunlog(this.currentProject.rtuMn)
      .then(res => {
        this.total = res.total;
        this.$set(this, "runlog", res.data);
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.$set(this, "runlog", []);
        this.$message.error("加载实时运行日志消息错误:" + err);
      });
  }

  //统计日志
  getStatistics() {
    DtuService.GetRTUstatisticslog(this.currentProject.rtuMn)
      .then(res => {
        this.total = res.total;
        this.$set(this, "staLog", res.data);
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.$set(this, "staLog", []);
        this.$message.error("加载实时统计消息错误:" + err);
      });
  }
  changeCurrentData() {
    switch (this.currentActiveName) {
      case "currentMessage":
        this.getCurrentData();
        break;
      case "tcpLog":
        this.getTcpLog();
        break;
        // case "runLog":
        //   this.getRunLog();
        break;
      case "statisticsLog":
        this.getStatistics();
        break;
    }
  }

  //日期字符串格式化2000-01-10T02:09:43Z 2020-05-11 13:27:59
  dateStrForm(dateStr: string) {
    let dateStrArr = dateStr.split("T"); //去掉T

    dateStrArr[1] = dateStrArr[1].substring(0, 8); //去掉Z
    let resDate = dateStrArr[0] + " " + dateStrArr[1];

    return resDate;
  }
}
</script>

<style scoped>
.mrle10 {
  margin-left: 10px;
}

/* 覆盖卡片样式 */
.box-card {
  height: 480px;
  width: 100%;
}

.card-header-content {
  display: flex;
  justify-content: space-between;
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
</style>




