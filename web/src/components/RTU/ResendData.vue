<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="时间范围">
        <!-- //<el-input v-model="formInline.user" placeholder="审批人"></el-input>  2006-01-02 15:04:05-->
        <el-date-picker
          v-model="formInline.dateTime"
          value-format="yyyy-MM-dd hh:mm:ss"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label> -->
      <!-- <el-radio-group v-model="formInline.dataType">
          <el-radio :label="1">实时数据</el-radio>
          <el-radio :label="2">统计数据</el-radio>
      </el-radio-group>-->
      <!-- <el-checkbox-group v-model="formInline.dataType">
          <el-checkbox label="实时数据">实时数据</el-checkbox>
          <el-checkbox label="统计数据">统计数据</el-checkbox>
      </el-checkbox-group>-->
      <!-- </el-form-item> -->
      <el-form-item label>
        <el-checkbox-group v-model="formInline.dataType">
          <el-checkbox label="实时数据" name="type"></el-checkbox>
          <el-checkbox label="统计数据" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">补发</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MnList from "./MNList2.vue";
import RtuService from "@/services/RtuService";

@Component({
  components: {
    MnList: MnList
  }
})
export default class ResendData extends Vue {
  @Prop({ default: null }) dtu!: any; //从父组件获取dtu

  formInline = {
    dateTime: "",
    dataType: []
  };

  onTimesChange() {
    console.log("选择的时间范围：");
  }

  onSubmit() {
    let resDataType = 1;
    console.log("submit!", this.formInline);
    
    let typeArrLen = this.formInline.dataType.length;
    if (typeArrLen >= 2) {
      resDataType = 3;
    } else if (this.formInline.dataType[0] == "实时数据") {
      resDataType = 1;
    } else {
      resDataType = 2;
    }
    
    RtuService.RTUResendData(
      this.dtu,
      this.formInline.dateTime[0],
      this.formInline.dateTime[1],
      resDataType
    )
      .then(res => {
        this.$set(this, "currentTableData", res.data);
      })
      .catch(err => {
        this.$message.error("加载上位机列表消息错误:" + err);
      });
  }
  mounted() {
    console.log("mounted,rtumn:", this.dtu);
  }
}
</script>

<style scoped>
</style>


