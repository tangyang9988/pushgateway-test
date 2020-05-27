<template>
  <div>
    <el-card>
      <div slot="header">
        <div class="page-title">
          <img src="@/assets/images/pageTitle.png" alt />
          <span>报警消息</span>
        </div>
      </div>
      <div style="margin-bottom:10px;">
        报警类别:
        <el-select
          v-model="alarmType"
          placeholder="请选择"
          style="width:130px"
          size="small"
          @change="dataChange"
        >
          <el-option
            v-for="item in alarmTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>时间范围:
        <el-date-picker
          size="small"
          v-model="times"
          @change="dataChange"
          type="datetimerange"
          :picker-options="timesOptions"
          :clearable="false"
          value-format="yyyy-MM-dd-HH-mm-ss"
        ></el-date-picker>
      </div>

      <el-table
        :data="logs"
        v-loading="loading"
        class="logsTable"
        size="small"
        border
        :row-class-name="rowClass"
      >
        <el-table-column type="index" :index="getRowIndex" align="center"></el-table-column>
        <el-table-column prop="AlarmTime" label="日期" width="180" align="center"></el-table-column>
        <el-table-column prop="AlarmType" label="级别" width="180" align="center"></el-table-column>
        <el-table-column prop="Mn" label="Mn号" width="180" align="center"></el-table-column>
        <el-table-column prop="Content" label="消息"></el-table-column>
      </el-table>
      <br />
      <div v-if="showPagination">
        <el-pagination
          layout="prev, pager, next, total"
          :page-size="pageSize"
          :current-page.sync="page"
          :total="totalNum"
          @current-change="loadLogs"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import LogService from "@/services/LogService";

@Component
export default class GmsAlarmLogs extends Vue {
  @Prop({ default: "10.211.55.2" }) node!: string;

  times = [new Date(new Date().getTime() - 24 * 60 * 60 * 1000), new Date()];
  timesOptions = {
    shortcuts: [
      {
        text: "Last 1 hours",
        onClick(picker: any) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000);
          picker.$emit("pick", [start, end]);
        }
      },
      {
        text: "Last 8 hours",
        onClick(picker: any) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 8);
          picker.$emit("pick", [start, end]);
        }
      }
    ]
  };

  loading: boolean = false;
  logs = []; //日志列表
  pageSize: number = 10;
  page: number = 1;
  totalNum: number = 0;

  alarmType = "全部";
  alarmTypeOptions = [
    {
      value: "",
      label: "全部"
    },
    {
      value: "超标报警",
      label: "超标报警"
    },
    {
      value: "动态管控数据报警",
      label: "动态管控数据报警"
    }
  ];
  showPagination: boolean = true;

  /** 时间格式化 */
  formatDate(date:any, fmt:any) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    let o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = <any>o[k] + "";
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
        );
      }
    }
    return fmt;
  }

  /**
   * 报警筛选
   */
  dataChange() {
    this.loadLogs();
  }

  getRowIndex(index: number): number {
    return index + 1 + (this.page - 1) * this.pageSize;
  }

  loadLogs() {
    this.loading = true;
    this.showPagination = false;
    let _alarmType = this.alarmType == "全部" ? "" : this.alarmType;

    LogService.QueryAlarm(
      this.pageSize,
      this.page,
      _alarmType,
      this.formatDate(this.times[0], 'yyyy-MM-dd hh:mm:ss'),
      this.formatDate(this.times[1], 'yyyy-MM-dd hh:mm:ss')
    )
      .then((res: any) => {
        this.$set(this, "logs", res.data);
        this.totalNum = res.total;
        this.showPagination = true;
        this.loading = false;
      })
      .catch((err: any) => {
        this.loading = false;
        this.$message.error("加载日志错误: " + err);
      });
  }

  rowClass({ row, rowIndex }: any) {
    if (row.LogLevel == "warn") {
      return "warning-row";
    } else if (row.LogLevel == "error") {
      return "error-row";
    }
    return "";
  }

  mounted() {
    this.loadLogs();
  }
}
</script>

<style scoped>
.logsTable {
}

.logsTable >>> .warning-row {
  color: yellow;
}

.logsTable >>> .error-row {
  color: red;
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