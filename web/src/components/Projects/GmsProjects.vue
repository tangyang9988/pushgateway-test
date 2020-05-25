<template>
  <div>
    <el-button @click="onCreate" type="primary" icon="fas fa-plus-circle fa-fw">新增项目</el-button>
    <div style="margin-top:10px">
      <el-input v-model="projectName" placeholder="项目名称" style="width:200px"></el-input>
      <el-input v-model="LeaderName" placeholder="负责人" style="width:200px;margin-left:20px"></el-input>
      <el-button
        @click="load"
        type="primary"
        icon="el-icon-search"
        style="margin-left:20px"
      >查询</el-button>
      <el-button @click="load" type="primary" icon="fas fa-sync-alt fa-fw">刷新</el-button>
    </div>
    <br />
    <el-table
      ref="table"
      :data="projects"
      v-loading="loading"
      @current-change="onCurrentChanged"
      border
      stripe
      highlight-current-row
      readonly
      size="small"
    >
      <el-table-column type="index" :index="getRowIndex" label="序号"></el-table-column>
      <el-table-column prop="ProjectName" label="项目名称"></el-table-column>
      <el-table-column prop="LeaderName" label="负责人"></el-table-column>
      <el-table-column prop="LeaderMobile" label="联系电话" width="200"></el-table-column>
      <el-table-column prop="TopicName" label="MQ Tag" width="100"></el-table-column>
      <el-table-column label="操作" width="400" align="center">
        <el-button @click="onEdit" type="primary" size="small">编辑</el-button>
        <el-button @click="onDelete" type="primary" size="small">删除</el-button>
      </el-table-column>
    </el-table>
    <br />
    <!-- 分页组件 -->
    <el-pagination
      layout="prev, pager, next, total"
      :page-size="pageSize"
      :current-page.sync="page"
      :total="total"
      @current-change="load"
    ></el-pagination>
    <!-- 对话框 -->
    <el-dialog title="项目信息" :visible.sync="dlgVisible" width="400px">
      <project-view :project="curPrj" :visible="dlgVisible"></project-view>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import ProjectView from "./ProjectView.vue";
import ProjectService from "@/services/ProjectService";

@Component({
  components: { ProjectView: ProjectView }
})
export default class GmsProjects extends Vue {
  loading = false;
  projects = [];
  dlgVisible = false;
  pageSize = 10;
  page = 1;
  total = 0;
  curPrj: any = null;
  projectName:string = ''
  LeaderName:string = ''

  load() {
    this.loading = true;
    ProjectService.Query(
      this.projectName, // 项目名称
      this.LeaderName,  // 负责人
      this.pageSize, 
      this.page
    )
      .then(res => {
        this.total = res.total;
        this.$set(this, "projects", res.data);
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.$message.error("加载项目错误: " + err);
      });
  }

  getRowIndex(index: number): number {
    return index + 1 + (this.page - 1) * this.pageSize;
  }

  onCurrentChanged(curRow: any, oldRow: any) {
    this.curPrj = curRow;
  }

  onCreate() {
    (<any>this.$refs.table).setCurrentRow(); //清除当前选择的行
    this.curPrj = {
      ProjectName: "",
      LeaderName: "",
      LeaderMobile: "",
      TopicName: ""
    };
    this.dlgVisible = true;
  }

  onEdit() {
    if (this.curPrj) {
      this.dlgVisible = true;
    } else {
      this.$message.warning("请先选择项目");
    }
  }

  onDelete() {
    if (!this.curPrj) {
      this.$message.warning("请选择待删除的项目");
      return;
    }
    this.$confirm("确认删除选择的项目吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        ProjectService.Delete(this.curPrj.Id)
          .then(res => {
            this.$message.success("删除项目成功");
            this.load(); //暂简单直接刷新
          })
          .catch(err => {
            this.$message.error("删除项目失败:" + err);
          });
      })
      .catch(() => {});
  }

  mounted() {
    this.load();
  }
}
</script>