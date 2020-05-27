<template>
    <div>
        <el-card>
            <div slot="header">
                <div class="page-title">
                    <img src="@/assets/images/pageTitle.png" alt="">
                    <span>日志消息</span>
                </div>
            </div>
            <div style="margin-bottom:10px;">
                日志级别:
                <el-select 
                    v-model="logLevel" 
                    placeholder="请选择" 
                    style="width:110px" 
                    size="small"
                    @change="dataChange" 
                >
                    <el-option
                        v-for="item in logLevelOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                时间范围:
                <el-date-picker 
                    size="small" 
                    v-model="times" 
                    @change="dataChange" 
                    type="datetimerange"
                    :picker-options="timesOptions" 
                    :clearable="false"
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
                <el-table-column prop="InsertTime" label="日期" width="180" align="center"  ></el-table-column>
                <el-table-column prop="LogLevel" label="级别" width="80" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.LogLevel=='error'" class="redColor">错误</span>
                        <span v-else-if="scope.row.LogLevel=='info'" class="greenColor">正常</span>
                        <span v-else class="yellowColor">警告</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Field" label="记录者" width="180" align="center"></el-table-column>
                <el-table-column prop="Content" label="消息"></el-table-column>
            </el-table>
            <br/>
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import LogService from "@/services/LogService";
 
@Component
export default class GmsLogs extends Vue {
    @Prop({ default: '10.211.55.2' }) node!: string

   
    times = [new Date(new Date().getTime() - 24*60*60*1000), new Date()]
    timesOptions = {
        shortcuts: [
            {
                text: 'Last 1 hours',
                onClick(picker: any) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000)
                    picker.$emit('pick', [start, end])
                }
            },
            {
                text: 'Last 8 hours',
                onClick(picker: any) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 8)
                    picker.$emit('pick', [start, end])
                }
            }
        ]
    }

    loading: boolean = false;
    logs = [] //日志列表
    pageSize: number = 10;
    page: number = 1;
    totalNum:number = 0

    logLevel = ''
    logLevelOption = [
        {
            value: '',
            label: '全部',
        },
        {
            value: 'error',
            label: '错误',
        },
        {
            value: 'warning',
            label: '警告',
        },
        {
            value: 'info',
            label: '正常',
        },
    ]
    showPagination:boolean = true

    /**
     * 日志筛选
     */
    dataChange() {
        this.loadLogs()
    }
    
    getRowIndex(index: number): number {
        return (index + 1) + (this.page - 1) * this.pageSize
    }

    loadLogs() {
        this.loading = true;
        this.showPagination = false
        
        LogService.Query(
            this.pageSize, 
            this.page,
            this.logLevel,
            this.times[0],
            this.times[1]
        ).then((res:any) => {
            this.$set(this, 'logs', res.data);

            this.totalNum = res.total
            this.showPagination = true
            this.loading = false;
        }).catch((err:any) => {
            this.loading = false;
            this.$message.error("加载日志错误: " + err);
        });
    }

    rowClass({ row, rowIndex }: any) {
        if (row.LogLevel == "warn") {
            return 'warning-row'
        } else if (row.LogLevel == "error") {
            return 'error-row'
        }
        return '';
    }

    mounted() {
        this.loadLogs()
    }
}
</script>

<style scoped>
.logsTable {
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
.redColor {
    color: red;
}
.yellowColor {
    color: rgba(255, 208, 0, 0.856);
}
.greenColor {
    color: rgb(4, 248, 4);
}
</style>