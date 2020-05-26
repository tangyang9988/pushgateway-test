<!-- 动态管控选项卡 -->
<template>
  <div style="height:100%;">
    <header-card-list></header-card-list>
    <!-- 选项 -->
    <!-- <el-radio v-model="range" :label="5">5分钟</el-radio>
        <el-radio v-model="range" :label="30">30分钟</el-radio>
        <el-radio v-model="range" :label="60">1小时</el-radio>
    <el-radio v-model="range" :label="43200">30天</el-radio>-->

    <!-- <el-button @click="load" type="primary">刷新</el-button> -->
    <el-card>
      <div slot="header">
          <div class="page-title">
              <img src="@/assets/images/pageTitle.png" alt="">
              <span>动态管控</span>
          </div>
      </div>
      
      <el-button @click="CloseDynamic()" type="danger" size="small" style="float:right">关闭动态管控</el-button>
      <el-button @click="OpenDynamic()" type="primary" size="small" style="float:right;margin-right:1%">开启动态管控</el-button>
      <br />
      <br />
      <!-- 列表 -->
      <el-table :data="dynamicData" border stripe size="small" max-height="200px" @row-click="geneClick">
        <el-table-column prop="factorCode" label="因子编号" align="center"></el-table-column>
        <el-table-column prop="factorId" label="因子ID" align="center"></el-table-column>
        <el-table-column prop="factorName" label="参数名称" align="center" ></el-table-column>
        <el-table-column prop="value" label="参数值" align="center"></el-table-column>
        <el-table-column prop="collectTime" label="采集时间" align="center"></el-table-column>
      </el-table>
    </el-card>
    
    <el-card style="margin-top:8px;">
      <div slot="header">
          <div class="page-title">
              <img src="@/assets/images/pageTitle.png" alt="">
              <span>实时动态图</span>
          </div>
      </div>
      <div style="width:100%;"><line-chart :data="chartData" height="200px"></line-chart></div>
      <!-- <div style="float:right;margin-right:0%;margin-top:-17%;width:50%"><line-chart :data="[[new Date(), 5], [1368174456, 4], ['2013-05-07 00:00:00 UTC', 7]]"></line-chart></div> -->
    </el-card>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import DtuService from "@/services/DtuService";
// import LineChart from '@/components/Charts/LineChart.js';
import Chartkick from "vue-chartkick";
import Chart from "chart.js";
Vue.use(Chartkick.use(Chart));

import GaugeCard from "@/components/GaugeCard.vue";
import HeaderCardList from "../RTU/HeaderCardList.vue";
 

@Component({
  components: {
    GaugeCard: GaugeCard,
    HeaderCardList: HeaderCardList
  }
})
export default class DynamicControlCard extends Vue {
  RTDynamic = { id: 0, k: 0, b: 0 }; // 用于存储实时动态管控参数

  /** 当前设备 */
  @Prop({ default: null })dtu!: any;

  //chartData !: any
  // @Prop({
  // type: Object,
  // default: ()=>{}

  // })
  // chartData !: Object

  /** 是否显示 */
  @Prop({ default: false }) visible!: boolean;
  // @Prop({ default: [] }) chartData!: Array<any>;


  @Watch("visible")
  onVisibleChanged(val: boolean) {
    if (val) {
      this.load();
    }
  }
  @Watch("range")
  onRangeChanged(val: number) {
    this.page = 1;
    this.load();
  }

 
  dynamicData = []
  dynamicMessages=[]
  range = 2000; //时间范围
  loading = false;
  // messages = []
  pageSize = 10;
  page = 1;
  total = 0;

  RtuMn = "ABC001"
  chartData:any[] = []


  geneClick(row:any) {
    let _factorCode = `${row.factorCode}-${row.factorId}`
    let results:Array<any> = []
    this.dynamicMessages.forEach((item, index) => {
      if(item.factorCode == _factorCode) {
        item.data.forEach((el:object, key:number) => {
          results.push([el.collectTime, el.value])
        })
      }
    })
    this.chartData = results
  }

  load() {
    // 因子下拉菜单： 1/ 获取因子列表 2/获取用户选择的因子
    //  获取实时动态管控参数
    this.getRealTimeDynamic(this.factorId);
    // 历史
    //根据选项计算时间范围
    this.loading = true;

    let start = new Date();
    let end = new Date();
    start.setTime(end.getTime() - this.range * 60 * 1000); // to replace 180 with this.range

    console.log(start);
    console.log(end);

    DtuService.GetDynamicMessages(this.RtuMn, start, end)
      .then(res => {
        this.dynamicMessages = res.data;
        
        let results:any = []; // 定义result

        if(this.dynamicMessages.length) { // 如果dynamicMessages数组长度不为0
          this.dynamicMessages[0].data.forEach((item:any, index:any) => { // 遍历data
            results.push([item.collectTime, item.value])  // 向results数组内添加数据
          })
        }

        this.loading = false;
        return results;
      })
      .then(res => {
        this.chartData = res;
      })
      .catch(err => {
        this.loading = false;
        this.$message.error("0加载动态管控错误:" + err);
      });
  }

  factorId = 0;

  getRealTimeDynamic(factorId:any) {
    // 获取实时动态管控参数
    this.loading = true;
    DtuService.GetDynamic(this.RtuMn)
    // DtuService.GetDynamic(this.dtu.RtuMn)
      .then(res => {

        this.$set(this, "dynamicData", res.data);
        console.log(this.dynamicData)

        
        if (this.dynamicData != null) {
          this.dynamicData.forEach((item, index) => {
            if(Number(item.factorId) == factorId) {
              if (item.factorCode == "i13007") {
                item.factorName = '斜率'
                this.RTDynamic.k = Number(item.value).toFixed(1);
              } else {
                this.RTDynamic.b = Number(item.value).toFixed(1);
                item.factorName = '截距'
              }
            }
          })
        }
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.$message.error("动态管控：获取实时工作参数错误:" + err);
      });
  }

  OpenDynamic() {
    //根据选项计算时间范围
    let st = "31";
    let cp = "";
    let cn = "2082";
    DtuService.OpenDynamic(this.RtuMn, st, cp, cn)
    
      .then(res => {
        this.$set(this, "", res.data);
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.$message.error("开启加载历史消息错误:" + err);
      });
    this.load();
  }

  CloseDynamic() {
    //根据选项计算时间范围
    let st = "31";
    let cp = "";
    let cn = "2083";
    DtuService.CloseDynamic(this.RtuMn, st, cp, cn)
      .then(res => {
        this.$set(this, "", res.data);
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.$message.error("关闭加载历史消息错误:" + err);
      });
    this.load();
  }

  mounted() {
    this.load();
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