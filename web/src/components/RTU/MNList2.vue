<template>
  <div>
    <div>
      <header-card-list></header-card-list>
    </div>
    <br />
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>上传设置</span>
      </div>

      <div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-button size="small" type="primary" @click="onShowMNAdd">新增</el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-button type="primary" size="small" style="float:right;" @click="load">刷新</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="currentTableData"
        style="width: 100%"
        max-height="450"
        border
        size="small"
        class="mnListTable"
        v-loading="loading"

      >
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="mn" label="MN" width="200" align="center"></el-table-column>
        <el-table-column prop="ip_addr" label="上位机地址" width="300" align="center"></el-table-column>
        <el-table-column prop="hj_version" label="上传协议" width="300" align="center"></el-table-column>
        <el-table-column prop="interval_upload" label="上传间隔" width="200" align="center"></el-table-column>
        <el-table-column prop="interval_heartbeat" label="心跳间隔" width="200" align="center"></el-table-column>
        <!-- <el-table-column prop="isTiming" label="允许校时" width="120"></el-table-column> -->
        <el-table-column prop="name" label min-width="240">
          <template slot-scope="scope">
            <div style="display:flex;justify-content:center;">
              <el-button type="primary" size="mini" @click="openModify(scope.row,scope.$index)">编辑</el-button>
              <el-button type="danger" size="mini" @click="delMn(scope.$index)">删除</el-button>
              <el-button type="primary" size="mini" @click="onShowResendData">补发数据</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="export-wrapper">
        <el-button type="plain" @click="exportJSON" size="small">导出到文件</el-button>

        <el-button type="plain" @click="importJSON" size="small">从文件导入</el-button>

        <input id="file" type="file" accept=".json" size="small" style="width:180px" />

        <!-- <el-button type="primary" @click="saveAllCollect" size="small">保存到数采仪</el-button> -->
        <el-button type="primary" class="btuSave" @click="saveAllMn" size="small">保存到数采仪</el-button>
      </div>

      <!-- <el-tag v-if="scope.row.Online" type="success">在线</el-tag>
      <el-tag v-else type="info">离线</el-tag>-->

      <el-dialog
        v-if="!ismnmodify"
        title="新增上位机配置"
        :visible.sync="mnaddvisable"
        width="70%"
        class="mnAdd"
      >
        <mn-add
          :dtu="rtumn"
          v-bind:mnobj="mnobj"
          v-bind:isMnmodify="ismnmodify"
          v-bind:visible="mnaddvisable"
          @newMNFactor="NewMNFactorData"
        ></mn-add>
      </el-dialog>
      <el-dialog v-else title="修改上位机配置" :visible.sync="mnaddvisable" width="70%" class="mnAdd">
        <mn-add
          :dtu="rtumn"
          v-bind:mnobj="mnobj"
          v-bind:isMnmodify="ismnmodify"
          v-bind:visible="mnaddvisable"
          @newMNFactor="NewMNFactorData"
        ></mn-add>
      </el-dialog>

      <el-dialog title="数据补发" :visible.sync="resendData" width="70%">
        <resend-data :dtu="rtumn" :visible="resendData"></resend-data>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MnAdd from "./MnAdd.vue";
import ResendData1 from "./ResendData.vue";
import HeaderCardList from "./HeaderCardList.vue";
import RtuService from "@/services/RtuService";
import FileSaver from "file-saver";

@Component({
  name: "mnlist",
  components: {
    HeaderCardList: HeaderCardList,
    ResendData: ResendData1,
    MnAdd: MnAdd
  }
})
export default class mnlist extends Vue {
  mnaddvisable = false;
  resendData = false;
  mnmodifyVisable = false;
  ismnmodify = false; //判断是否修改页
  rtumn = "ABC001";
  curDTU: any = null;
  loading = true;
  mnFactor = []; //mn修改页的因子表格
  mnobj = {}; //mn修改页的mn信息
  currentTableData = [];
  mnAddTitle = "新增上位机配置";
  uuid =""

  load() {
    console.log("load");
    this.loading = true;
    this.rtumnlist();
  }

  /** 新增上位机配置 **/
  onShowMNAdd() {
    this.mnaddvisable = true;
    this.ismnmodify = false;
    console.log(
      "即将向 mn add 发送数据：",
      "is mn modify:",
      this.ismnmodify,
      "visable:",
      this.mnaddvisable
    );
  }

  /** 导出 */
  exportJSON() {
    // 将json转换成字符串
    const data = JSON.stringify(this.currentTableData);
    console.log(data);
    const blob = new Blob([data], { type: "" });
    FileSaver.saveAs(blob, "RtuMn.json");
  }
  /** 导入 */
  importJSON() {
    const file = document.getElementById("file").files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    const _this = this;
    reader.onload = function() {
      // this.result为读取到的json字符串，需转成json对象
      _this.currentTableData = JSON.parse(this.result);
      // 检测是否导入成功
      console.log(_this.currentTableData);
    };
  }

  //打开上位机修改页
  openModify(row: any, index: any) {
    //this.mnmodifyVisable=true;

    this.mnobj = row;
    this.mnobj.rowIndex = index;
    this.ismnmodify = true;
    this.mnaddvisable = true;
    console.log(
      "即将向 mn modify 发送数据：",
      row,
      "行索引：",
      index,
      "is mn modify:",
      this.ismnmodify
    );
  }
  //删除上位机
  delMn(rowIndex: any) {
    let massagelog = "";
    if (this.currentTableData[rowIndex].ip_addr.split(":")[0] == "172.20.0.91") {
      massagelog = "删除此上位机后需要运维人员现场去启动和调试, 是否删除?";
    } else {
      massagelog = "确定删除上位机, 是否继续?";
    }
    this.$confirm(massagelog, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.currentTableData.splice(rowIndex, 1);
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }

  //补发数据
  onShowResendData() {
    console.log("rtumn :", this.rtumn);
    this.resendData = true;
  }
  mounted() {
    //this.rtumnlist();
    console.log("mn list  mounted!");
    this.load();
  }
  //上位机列表
  //Todo
  rtumnlist() {
    this.uuid = <any>sessionStorage.getItem("uuid")
    RtuService.GetRtuMnList(this.rtumn,this.uuid)
      .then(res => {
        this.$set(this, "currentTableData", res.data);
        this.loading = false;
        //将因子信息放入因子数组
        //  this.factorArr=res.data.uploadCodes
        //  console.log("因子列表信息放入数组：",res.data.uploadCodes)
      })
      .catch(err => {
        this.$message.error("加载上位机列表消息错误:" + err);
        this.loading = false;
      });
  }
  //从子组件MNadd中获取MN数据
  NewMNFactorData(data: any, ismnmodifyData: any, rowIndexData: any) {
    console.log(
      "从子组件获取数据,mn：",
      data,
      "ismnmodify:",
      ismnmodifyData,
      "row index:",
      rowIndexData
    );
    this.mnaddvisable = false;

    if (this.ismnmodify == true) {
      let _currentTableData: any = this.currentTableData.map(
        (item: object, index: number) => {
          return index == rowIndexData ? data : item;
        }
      );
      this.currentTableData = _currentTableData;
    } else {
      this.currentTableData.push(data);
    }
    //this.ismnmodify = false; //无论是添加还是修改，接收子组件数据后都将修改状态置为false
    //this.currentTableData.push(data);
  }
  //修改或添加上位机信息
  saveAllMn() {
    RtuService.AddRtuMnList(this.rtumn, this.currentTableData).then(res => {
      // this.rtumnlist();
      if (res.code == 200) {
        this.$message.success("保存至数采仪到成功!");
      } else {
        this.$message.error("保存至数采仪失败!");
      }
    });
  }
}
</script>

<style>
.mnAdd .el-dialog {
  min-width: 1080px;
  margin-top: 6vh !important;
}
</style>

<style scoped>
/* 覆盖卡片样式 */
.box-card {
  width: 100%;
}
.butAddRow {
  margin-bottom: 10px;
}
.mnListTable {
  margin-top: 10px;
}

.export-wrapper {
  margin-top: 20px;
}
</style>


