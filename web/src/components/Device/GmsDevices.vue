<!-- 设备管理 分页面 -->

<template>
  <div>
    <el-card>
      <div slot="header">
        <div class="page-title">
          <img src="@/assets/images/pageTitle.png" alt="">
          <span>设备管理</span>
        </div>
      </div>
      
      <div>
        <!-- 顶部button -->
        <div>
          <!-- <el-button-group> -->
          <el-button @click="onCreate" type="primary" icon="fas fa-plus-circle fa-fw">添加</el-button>
          <el-button @click="onEdit" type="primary" icon="fas fa-edit fa-fw">编辑</el-button>
          <el-button @click="onDelete" type="primary" icon="fas fa-minus-circle fa-fw">删除</el-button>
          <el-button @click="loadDTUs" type="primary" icon="fas fa-sync-alt fa-fw">刷新</el-button>

          <!-- 查询项目表 -->
          <div style="margin-top:-39px;margin-left:390px;">
            <el-select v-model="proId" placeholder="请选择项目" @change="currentSel">
              <el-option
                v-for="item in projects"
                :key="item.Id"
                :label="item.ProjectName"
                :value="item.Id"
              ></el-option>
            </el-select>
            <el-button @click="searchDTUs(proId)" type="primary">项目搜索</el-button>
          </div>

          <el-button @click="openRTUInfo" type="primary" icon="fas fa-sync-alt fa-fw">新版数采仪</el-button>
          <!-- </el-col> -->
          <!-- </el-button-group> -->
        </div>
        <!--设备表 -->
        <br />
        <el-table
          ref="table"
          :data="devices"
          v-loading="loading"
          @current-change="onCurrentChanged"
          border
          stripe
          highlight-current-row
          readonly
          size="small"
        >
          <el-table-column type="index" :index="getRowIndex"></el-table-column>
          <el-table-column prop="RtuMn" label="机器编号" width="210"></el-table-column>
          <el-table-column prop="RtuSn" label="序列号" width="210"></el-table-column>
          <el-table-column prop="TProject.ProjectName" label="项目名称"></el-table-column>
          <el-table-column prop="DeviceType" label="设备类型" width="100"></el-table-column>
          <el-table-column prop="DeviceBrand" label="设备品牌" width="180"></el-table-column>
          <el-table-column label="状态" width="68">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.Online" type="success">在线</el-tag>
              <el-tag v-else type="info">离线</el-tag>
            </template>
          </el-table-column>/** 操作列 **/
          <el-table-column label="操作" width="400" align="center">
            <template slot-scope="scope">
              <!-- 动态管控 -->
              <el-button
                v-if="scope.row.Online"
                @click="onShowXX(scope.row)"
                type="primary"
                size="small"
              >动态管控</el-button>
              <el-button v-else disabled @click="onShowXX(scope.row)" type="primary" size="small">动态管控</el-button>
              <!-- 反控 -->
              <el-button
                v-if="scope.row.Online"
                @click="onShowRecriminateControl(scope.row)"
                type="primary"
                size="small"
              >反控</el-button>
              <el-button
                v-else
                disabled
                @click="onShowRecriminateControl(scope.row)"
                type="primary"
                size="small"
              >反控</el-button>
              <!-- 历史消息 -->
              <el-button
                v-if="scope.row.Online"
                @click="dlgMessageVisible = true"
                type="primary"
                size="small"
              >历史消息</el-button>
              <el-button
                v-else
                disabled
                @click="dlgMessageVisible = true"
                type="primary"
                size="small"
              >历史消息</el-button>

              <!-- 旧下拉菜单 -->
              <!-- <el-dropdown @command="onDtuCommand">
                                    <el-dropdown-item :command="{cmd: 'reccon', row: scope.row}" icon="fas fa-download fa-fw">反控1</el-dropdown-item>
                                    <el-dropdown-item :command="{cmd: 'dc', row: scope.row}" icon="fas fa-download fa-fw">动态管控</el-dropdown-item>
                                    <el-dropdown-item :command="{cmd: 'msgs', row: scope.row}" icon="fas fa-history fa-fw">历史消息</el-dropdown-item>
              </el-dropdown>-->
            </template>
          </el-table-column>
        </el-table>

        <br />
        <!-- 分页组件 -->
        <el-pagination
          layout="prev, pager, next, total"
          :page-size="pageSize"
          :current-page.sync="page"
          :total="total"
          @current-change="searchDTUs"
        ></el-pagination>

        <!-- 对话框 -->
        <el-dialog title="数据采集配置" :visible.sync="dlgCollectSettingsVisible" width="90%">
          <collect-settings :dtu="curDTU" :visible="dlgCollectSettingsVisible"></collect-settings>
        </el-dialog>
        <el-dialog title="上传配置" :visible.sync="dlgUploadSettingsVisible" width="80%">
          <upload-settings :dtu="curDTU" :visible="dlgUploadSettingsVisible"></upload-settings>
        </el-dialog>
        <el-dialog title="历史消息" :visible.sync="dlgMessageVisible" width="80%">
          <gms-messages :dtu="curDTU" :visible="dlgMessageVisible"></gms-messages>
        </el-dialog>
        <el-dialog title="设备详情" :visible.sync="dlgDetailVisible" width="450px">
          <device-view :dtu="curDTU" :visible="dlgDetailVisible"></device-view>
        </el-dialog>
        <el-dialog title="监测设备反控" :visible.sync="dlgRecriminateControl" width="90%">
          <Dlg-Recriminate-Control :dtu="curDTU" :visible="dlgRecriminateControl"></Dlg-Recriminate-Control>
        </el-dialog>
        <el-dialog title="动态管控" :visible.sync="dlgDynamicControlVisible" width="70%">
          <Dynamic-Control-Card :dtu="curDTU" :visible="dlgDynamicControlVisible"></Dynamic-Control-Card>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>



<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DeviceView from "./DeviceView.vue";
import GmsCollectSettings from "./GmsCollectSettings.vue";
import GmsUploadSettings from "./GmsUploadSettings.vue";
import GmsMessages from "./GmsMessages.vue";

import DtuService from "@/services/DtuService";

import DlgRecriminateControl from "./DlgRecriminateControl.vue";
import DynamicControlCard from "./DynamicControlCard.vue";

import RTUInfo from "../RTU/RTUInfo.vue";
 

@Component({
  components: {
    DeviceView: DeviceView,
    CollectSettings: GmsCollectSettings,
    UploadSettings: GmsUploadSettings,
    GmsMessages: GmsMessages,
    DlgRecriminateControl: DlgRecriminateControl,
    DynamicControlCard: DynamicControlCard,
    RTUInfo:RTUInfo
  }
})
export default class GmsDevices extends Vue {
 
  loading = false
  devices = []  //设备列表
  pageSize = 10
  page = 1
  total = 0
  proId:any = ""

  curDTU: any = null; //当前选择的设备
  dlgCollectSettingsVisible = false; //采集配置  对话框是否打开
  dlgUploadSettingsVisible = false; //上传配置  对话框是否打开
  dlgMessageVisible = false; //历史消息  对话框是否打开
  dlgDetailVisible = false; //设备详情  对话框是否打开
  dlgRecriminateControl = false; //反控对话  框是否打开
  dlgDynamicControlVisible = false; //动态管控  对话框是否打开

  projects = []; // 项目列表

  loadProjects() {
    DtuService.currentList()
      .then(res => {
        this.$set(this, "projects", res.data);
        console.log(this.projects);
      })
      .catch(err => {
        this.$message.error("加载项目列表错误:" + err);
      });
  }

  getRowIndex(index: number): number {
    return index + 1 + (this.page - 1) * this.pageSize;
  }

  /** 加载数采仪列表 **/
  loadDTUs() {
    this.loading = true;
    DtuService.Query(
      
      this.pageSize, 
      this.page, 
      this.proId, 
      3,
      '', 
      '',
    ).then((res:any) => {
      this.total = res.total; // 总设备数？
      console.log(this.devices);
      this.$set(this, "devices", res.data);
      // this.getStates();
      this.loading = false;
    }).catch((err:any) => {
      this.loading = false;
      this.$message.error("加载数采仪列表失败:" + err);
    });
    this.loadProjects();
  }
  /** 根据项目筛选数采仪列表 **/
  searchDTUs() {
    this.loading = true;
    DtuService.QueryListByProjectId(this.pageSize, this.page, <any>this.proId)
      .then(res => {
        this.total = res.total; // 总设备数？
        this.$set(this, "devices", res.data);
        // this.getStates();
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.$message.error("加载数采仪列表失败:" + err);
      });
    this.loadProjects();
  }

  // async getStates() {
  //     var nodes = await env.Services.GatewayService.GetAll();
  //     nodes.forEach(node => {
  //         env.Services.GatewayService.GetOnlineDTUs(node.Address).then(res => {
  //             var onlines = JSON.parse(res)
  //             onlines.forEach(mn => {
  //                 var exists = this.devices.find(d => d.MN === mn)
  //                 if (exists) {
  //                     this.$set(exists, "State", true)
  //                     this.$set(exists, "Gateway", node)
  //                 }
  //             })
  //         }).catch(err => {/*do nothing*/ })
  //     })
  // }

  /** 改变当前选择的设备 */
  onCurrentChanged(curRow: any, oldRow: any) {
    this.curDTU = curRow;
  }

  /** 新增设备 **/
  onCreate() {
    (<any>this.$refs.table).setCurrentRow(); //清除当前选择的行
    this.curDTU = {
      RtuSn: "",
      RtuMn: "",
      DeviceType: "",
      DeviceBrand: "",
      ProjectId: 1
    };
    this.dlgDetailVisible = true;
  }

  /** 修改设备 **/
  onEdit() {
    if (this.curDTU) {
      this.dlgDetailVisible = true;
    } else {
      this.$message.warning("请先选择设备");
    }
  }

  /** 删除设备 **/
  onDelete() {
    if (!this.curDTU) {
      this.$message.warning("请选择待删除的数采仪");
      return;
    }
    this.$confirm("确认删除选择的数采仪吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        DtuService.Delete(this.curDTU)
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

  /** 动态管控 **/
  onShowXX(row: any) {
    this.curDTU = row;
    (<any>this.$refs.table).setCurrentRow(row);
    this.dlgDynamicControlVisible = true;
  }
  // 获取所选项目proId
  currentSel(row: any) {
    this.proId = row;
  }

  //打开反控弹窗
  onShowRecriminateControl(row: any) {
    this.curDTU = row;
    (<any>this.$refs.table).setCurrentRow(row);
    this.dlgRecriminateControl = true;
  }
  // 查询项目
  searchProgect(row: any) {
    this.proId = row;
    (<any>this.$refs.table).setCurrentRow(row);
    this.dlgRecriminateControl = true;
  }

  /** 数采仪相关命令 */
  //   onDtuCommand(cmd: any) {
  //     if (!cmd) return;
  //     (<any>this.$refs.table).setCurrentRow(cmd.row);
  //     this.curDTU = cmd.row;
  //     switch (cmd.cmd) {
  //       case "msgs":
  //         this.dlgMessageVisible = true;
  //         break;
  //       case "cs":
  //         this.dlgCollectSettingsVisible = true;
  //         break;
  //       case "us":
  //         this.dlgUploadSettingsVisible = true;
  //         break;
  //       case "reccon":
  //         this.dlgRecriminateControl = true;
  //         break; //反控子页
  //       case "dc":
  //         this.dlgDynamicControlVisible = true;
  //         break;
  //       default:
  //         break;
  //     }
  //   }

  mounted() {
    this.loadDTUs();
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