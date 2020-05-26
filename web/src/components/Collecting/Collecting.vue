<template>
  <div>
    <header-card-list></header-card-list>
    <el-card>
      <div class="page-title">
        <img src="@/assets/images/pageTitle.png" alt="">
        <span>采集设备配置</span>
      </div>
      
      <div style="margin:15px 0;">
        <el-button type="primary" @click="showCollectingView" size="small">新增</el-button>
        <el-button type="primary" @click="flash" size="small">刷新</el-button>
      </div>
      <el-table
        ref="rtuDevices"
        :data="rtuDevices"
        v-loading="loading"
        border
        stripe
        highlight-current-row
        readonly
        size="small"
        style="width: 100%"
        max-height="450"
      >
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="access_type" label="接入类型" align="center"></el-table-column>
        <el-table-column prop="com" label="串口位置" align="center"></el-table-column>
        <el-table-column prop="st" label="ST" align="center"></el-table-column>
        <el-table-column prop="device_address" label="地址位" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="onEdit(scope.row,scope.$index)">编辑</el-button>
            <el-button type="danger" size="mini" @click="onDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <br />
      <el-button type="plain" @click="exportJSON" size="small">导出到文件</el-button>

      <el-button type="plain" @click="importJSON" size="small">从文件导入</el-button>
      <input id="file" type="file" accept=".json" size="small" style="width:180px" />

      <el-button type="primary" @click="saveAllCollect" size="small">保存到数采仪</el-button>

      <el-dialog title="新增采集设备" :visible.sync="collectingAddVisable" width="80%">
        <Collecting-Dev-View
          :dtu="curDEV"
          v-bind:isEdit="isEditClick"
          v-bind:visible="collectingAddVisable"
          @newCollectingData="NewCollectingData"
        ></Collecting-Dev-View>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderCardList from "../RTU/HeaderCardList.vue";
import CollectingDevView from "./CollectingDevView.vue";
import CollectService from "@/services/CollectService";
var FileSaver = require('file-saver');
 

@Component({
  components: {
    HeaderCardList: HeaderCardList,
    CollectingDevView: CollectingDevView,
    // FileSaver: FileSaver
  }
})
export default class Collecting extends Vue {
 
  collectingAddVisable = false;
  loading = false;
  rtuDevices:any = [];
  rtuMN = "";
  st = "";
  cp = "";
  cn = "";
  qn = "";
  uuid =""
  permission = false;
  curDEV: any = null; //当前选择的设备
  isEditClick = false;

  /** 加载采集设备列表 **/
  loadRtuDevice() {
    this.loading = true;
    this.uuid = <any>sessionStorage.getItem("uuid")
    this.rtuMN = String(sessionStorage.getItem("rtuMN"));
    CollectService.Query(this.rtuMN, this.st, this.cp, this.cn, this.qn,this.uuid)
      .then(res => {
        this.$set(this, "rtuDevices", res.data);
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.$message.error("加载数采仪列表失败:" + err);
      });
  }

  /** 新增采集设备 **/
  showCollectingView() {
    (<any>this.$refs.rtuDevices).setCurrentRow(); //清除当前选择的行
    this.collectingAddVisable = true;
    this.isEditClick = false;

    this.curDEV = {
      access_type: "",
      data_bit: "",
      communication_protocol: "",
      st: "",
      com: "",
      stop_bit: "",
      device_address: "",
      interval_collect: "",
      baudRate: "",
      check_bit: "",
      params: "",
      fail_time: "",
      factors: []
    };

    console.log("新增", this.rtuDevices);
  }
  /** 修改采集设备 **/
  onEdit(row: any, index: any) {
    this.isEditClick = !this.isEditClick;
    this.curDEV = row;
    this.isEditClick = true;
    this.collectingAddVisable = true;
    console.log("编辑", this.rtuDevices);
  }
  // /** 行选中*/
  // onCurrentChanged(curRow: any, oldRow: any) {
  //   if (!this.isEditClick) {
  //     this.curDEV = {
  //       access_type: "",
  //       data_bit: "",
  //       communication_protocol: "",
  //       st: "",
  //       com: "",
  //       stop_bit: "",
  //       device_address: "",
  //       interval_collect: "",
  //       baudRate: "",
  //       check_bit: "",
  //       params: "",
  //       fail_time: "",
  //       factors: []
  //     };
  //   } else {
  //     this.curDEV = curRow;
  //   }
  // }
  openDetails(curRow: any, oldRow: any) {
    this.curDEV = curRow;
  }

  /** 删除采集设备 **/
  onDelete(index: any) {
    this.$confirm("确认删除选择的数采仪吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.rtuDevices.splice(index, 1);
      })
      .catch(err => {
        this.$message.error("删除数采仪失败:" + err);
      });
  }
  //子组件-->父组件  传值
  NewCollectingData(data: any, ismnmodifyData: any, rowIndexData: any) {
    this.collectingAddVisable = false;
    if (this.isEditClick) {
      let _rtuDevices: any = this.rtuDevices.map(
        (item: object, index: number) => {
          return index == rowIndexData ? data : item;
        }
      );
      this.rtuDevices = _rtuDevices;
    } else {
      this.rtuDevices.push(data);
    }
  }
  /** 保存至数采仪 */
  saveAllCollect() {
    this.$confirm("确认要保存采集设备至数采仪吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    })
      .then(() => {
        CollectService.SaveDeviceList(this.rtuMN, <any>this.rtuDevices)
          .then(res => {
            if (res.code == 200) {
              this.$message.success("保存至数采仪到成功!");
            } else {
              this.$message.error("保存至数采仪失败!");
            }
          })
          .catch(err => {
            if (err.code == undefined) {
              this.$message.success("保存至数采仪到成功!");
            } else {
              this.$message.error("保存至数采仪失败!");
            }
          });
      })
      .catch(err => {});
  }
  /** 导出 */
  exportJSON() {
    // 将json转换成字符串
    const data = JSON.stringify(this.rtuDevices);
    console.log(data);
    const blob = new Blob([data], { type: "" });
    FileSaver.saveAs(blob, "rtuDevice.json");
  }
  /** 导入 */
  importJSON() {
    let fileDom = document.getElementById("file")
    let file = (fileDom as any).files[0]
    const reader = new FileReader();
    reader.readAsText(file);
    const _this = this;
    reader.onload = function() {
      // this.result为读取到的json字符串，需转成json对象
      _this.rtuDevices = JSON.parse((this as any).result);
      // 检测是否导入成功
      console.log(_this.rtuDevices);
    };
  }
  /** 刷新采集设备表格**/
  flash() {
    this.loadRtuDevice();
  }
  mounted() {
    this.loadRtuDevice();
  }
}
</script>

<style scoped>

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


