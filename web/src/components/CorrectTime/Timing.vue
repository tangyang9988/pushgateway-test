<template>
  <div style="height:100%;">
    <header-card-list></header-card-list>
    <el-card class="card">
      <div class="page-title">
        <img src="@/assets/images/pageTitle.png" alt />
        <span>校时</span>
      </div>

      <div class="dlgRecriminateControl-form">
        <div style="display:flex">
          <span>获取数采仪时间：{{currentTime}}</span>
        </div>
        <div style="display:flex;margin-top:10px;margin-left:15px">
          <span>获取网络时间：{{netTime}}</span>
        </div>
        <div style="display:flex;margin-top:20px">
          <el-button type="primary" @click="flash" size="small" style="float:">刷新</el-button>
          <el-button type="primary" @click="correctTimeControl" size="small">校时</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import HeaderCardList from "../RTU/HeaderCardList.vue";
import CollectService from "@/services/CollectService";
import DtuService from "@/services/DtuService";

@Component({
  components: {
    HeaderCardList: HeaderCardList
  }
})
export default class Timing extends Vue {
  /** 当前设备 */
  @Prop({ default: null }) dtu!: any;

  currentTime:any = "";
  netTime:any = "";
  cp = "";
  cn = "1012";
  uuid = "";
  commandName = "校时";
  rtuMN = "";
  parameters = [];

  /**刷新 */
  flash() {
    this.loadTime();
    this.loadNetTime();
  }

  /** 实时获取时间 */
  loadTime() {
    this.rtuMN = <any>sessionStorage.getItem("rtuMN");
    CollectService.QueryProtocol(this.rtuMN)
      .then(res => {
        this.$set(this, "parameters", res.data);
        //TODO
        this.currentTime = (this as any).parameters.systemTime;
      })
      .catch(err => {
        this.$message.error("加载实时时间失败:" + err);
      });
  }

  /** 获取网络时间 */
  loadNetTime() {
    CollectService.QueryNetTime()
      .then(res => {
        this.$set(this, "netTime", res.data);
      })
      .catch(err => {
        this.$message.error("加载网络时间失败:" + err);
      });
  }

  //发送校时指令
  correctTimeControl() {
    this.rtuMN = String(sessionStorage.getItem("rtuMN"));
    this.uuid = String(sessionStorage.getItem("uuid"));
    this.cp = String("PolId=" + "" + ";" + "SystemTime=" + this.currentTime);
    DtuService.SendReControlC(
      this.rtuMN,
      this.cp,
      this.cn,
      this.uuid,
      this.commandName
    )
      .then(res => {
        this.$set(this, "messages", res.data);
      })
      .catch(err => {
        this.$message.error("发送指令错误:" + err);
      });
  }

  mounted() {
    this.loadTime();
    this.loadNetTime();
  }
}
</script>
<style scoped>
.dlgRecriminateControl-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3%;
}
.card {
  height: 40%;
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
