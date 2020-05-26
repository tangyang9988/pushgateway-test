<template>
  <div style="height:100%;">
    <header-card-list></header-card-list>
    <el-card>
      
      <div slot="header">
          <div class="page-title">
              <img src="@/assets/images/pageTitle.png" alt="">
              <span>反控设置</span>
          </div>
      </div>
      <div class="dlgRecriminateControl-form">
        <el-form ref="form" :model="form" :rules="formRules" label-width="80px" size="small">
          <el-form-item label="反控指令" prop="recriminatId">
            <el-select v-model="form.recriminatId" placeholder="请选择" style="width:200px">
              <el-option
                v-for="item in recriminatOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <div v-if="form.recriminatId==1000">
            <el-form-item label="超时时间" prop="overTime">
              <el-input v-model="form.overTime" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="重发次数" prop="reCount">
              <el-input v-model="form.reCount" style="width:200px"></el-input>
            </el-form-item>
          </div>
          <div v-if="form.recriminatId==1011">
          </div>
          <div v-if="form.recriminatId==1012">
           <el-form-item label="设置现场机时间" prop="systemTime">
              <el-date-picker
                v-model="form.systemTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                value-format="yyyyMMddHHmmss"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div v-if="form.recriminatId==1061">
          </div>
          <div v-if="form.recriminatId==1062">
            <el-form-item label="设置实时数据间隔" prop="rtdInterval">
              <el-input v-model="form.rtdInterval" style="width:200px"></el-input>
            </el-form-item>
          </div>
          <div v-if="form.recriminatId==1063">
          </div>
          <div v-if="form.recriminatId==1064">
            <el-form-item label="设置分钟数据间隔" prop="minInterval">
              <el-input v-model.number="form.minInterval" style="width:200px"></el-input>
            </el-form-item>
          </div>
          <div v-if="form.recriminatId==1072">
            <el-form-item label="设置现场机访问密码" prop="newPW">
              <el-input v-model.number="form.newPW" style="width:200px"></el-input>
            </el-form-item>
          </div>
          <div v-if="form.recriminatId==2011">
          </div>
          <div v-if="form.recriminatId==2012">
          </div>
          <div v-if="form.recriminatId==2021">
          </div>
          <div v-if="form.recriminatId==2022">
          </div>
          <div v-if="form.recriminatId==2031">
           <el-form-item label=" 开始时间" prop="beginTime">
              <el-date-picker
                v-model="form.beginTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                value-format="yyyyMMddHHmmss"
              ></el-date-picker>
            </el-form-item>
           <el-form-item label=" 结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                value-format="yyyyMMddHHmmss"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div v-if="form.recriminatId==2041">
           <el-form-item label=" 开始时间" prop="beginTime">
              <el-date-picker
                v-model="form.beginTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                value-format="yyyyMMddHHmmss"
              ></el-date-picker>
            </el-form-item>
           <el-form-item label=" 结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                value-format="yyyyMMddHHmmss"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div v-if="form.recriminatId==2051">
           <el-form-item label=" 开始时间" prop="beginTime">
              <el-date-picker
                v-model="form.beginTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                value-format="yyyyMMddHHmmss"
              ></el-date-picker>
            </el-form-item>
           <el-form-item label=" 结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                value-format="yyyyMMddHHmmss"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div v-if="form.recriminatId==2061">
           <el-form-item label=" 开始时间" prop="beginTime">
              <el-date-picker
                v-model="form.beginTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                value-format="yyyyMMddHHmmss"
              ></el-date-picker>
            </el-form-item>
           <el-form-item label=" 结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                value-format="yyyyMMddHHmmss"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div v-if="form.recriminatId==2081">
           <el-form-item label="上报时间" prop="dataTime">
              <el-date-picker
                v-model="form.dataTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                value-format="yyyyMMddHHmmss"
              ></el-date-picker>
            </el-form-item>
           <el-form-item label="开机时间" prop="restartTime">
              <el-date-picker
                v-model="form.restartTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00" 
                value-format="yyyyMMddHHmmss"
              ></el-date-picker>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="reControlSysTem">发送</el-button>
            <el-button @click="clear">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import HeaderCardList from "../RTU/HeaderCardList.vue";
import DtuService from "@/services/DtuService";
 

@Component({
  components: {
    HeaderCardList: HeaderCardList
  }
})
export default class DynamicControlCard extends Vue {
  /** 当前设备 */
  @Prop({ default: null }) dtu!: any;

 
  cp = "";
  cn = "";
  uuid ="";
  commandName ="";
  //发送反控指令
  reControlSysTem() {
    let mn = String(sessionStorage.getItem("rtuMN"));
    this.uuid=<any>sessionStorage.getItem("uuid")
    if (this.form.recriminatId == 1000) {
      this.cp = String( "OverTime="+this.form.overTime+";"+"ReCount="+this.form.reCount);
      this.cn = "1000";
      this.commandName="设置超时时间及重发次数";
    } else if (this.form.recriminatId == 1011) {
      this.cp = String("PolId="+"");
      this.cn = "1011";
      this.commandName="提取现场机时间";
    }else if (this.form.recriminatId == 1012) {
      this.cp = String("PolId="+""+";"+"SystemTime="+this.form.systemTime);
      this.cn = "1012";
      this.commandName="设置现场机时间";
    }
    else if (this.form.recriminatId == 1061) {
      this.cp = "";
      this.cn = "1061";
      this.commandName="提取实时数据间隔";
    }
    else if (this.form.recriminatId == 1062) {
      this.cp = String("RtdInterval="+this.form.rtdInterval);
      this.cn = "1062";
      this.commandName="设置实时数据间隔";
    }
    else if (this.form.recriminatId == 1063) {
      this.cp = "";
      this.cn = "1063";
      this.commandName="提取分钟数据间隔";
    }
    else if (this.form.recriminatId == 1064) {
      this.cp = String("MinInterval="+this.form.minInterval);
      this.cn = "1064";
      this.commandName=" 设置分钟数据间隔";
    }
    else if (this.form.recriminatId == 1072) {
      this.cp = String("NewPW="+this.form.newPW);
      this.cn = "1072";
      this.commandName="设置现场机密码";
    }
    else if (this.form.recriminatId == 2011) {
      this.cp = "";
      this.cn = "2011";
      this.commandName="取污染物实时数据";
    }
    else if (this.form.recriminatId == 2012) {
      this.cp = "";
      this.cn = "2012";
      this.commandName="停止察看污染物实时数据";
    }
    else if (this.form.recriminatId == 2021) {
      this.cp = "";
      this.cn = "2021";
      this.commandName="取设备运行状态数据";
    }
    else if (this.form.recriminatId == 2022) {
      this.cp = "";
      this.cn = "2022";
      this.commandName="停止察看设备运行状态";
    }
    else if (this.form.recriminatId == 2031) {
      this.cp = "BeginTime="+this.form.beginTime+";"+"EndTime="+this.form.endTime;
      this.cn = "2031";
      this.commandName="取污染物日历史数据";
    }
    else if (this.form.recriminatId == 2041) {
      this.cp = "BeginTime="+this.form.beginTime+";"+"EndTime="+this.form.endTime;
      this.cn = "2041";
      this.commandName="取设备运行时间日历史数据";
    }
    else if (this.form.recriminatId == 2051) {
      this.cp = "BeginTime="+this.form.beginTime+";"+"EndTime="+this.form.endTime;
      this.cn = "2051";
      this.commandName="取污染物分钟数据";
    }
    else if (this.form.recriminatId == 2061) {
      this.cp = "BeginTime="+this.form.beginTime+";"+"EndTime="+this.form.endTime;
      this.cn = "2061";
      this.commandName="取污染物小时数据";
    }
    else if (this.form.recriminatId == 2081) {
      this.cp = "DataTime="+this.form.dataTime+";"+"RestartTime="+this.form.restartTime;
      this.cn = "2081";
      this.commandName="上传数采仪开机时间";
    }
    DtuService.SendReControlC(mn, this.cp, this.cn,this.uuid,this.commandName)
      .then(res => {
        this.$set(this, "messages", res.data);
      })
      .catch(err => {
        this.$message.error("加载历史消息错误:" + err);
      });
  }
  // 取消
  clear(){
    const ref:any = this.$refs['form']
    ref.resetFields();
  }
  mounted() {}

  form = { recriminatId: 1000, overTime: "", reCount: "", systemTime: "",rtdInterval: "",minInterval: "",newPW:"",beginTime: "",endTime: "",dataTime: "",restartTime: ""};

  //rules验证
  formRules = {
    recriminatId: [{ required: true, message: "请选择指令类型", trigger: "blur" }],
    overTime: [{ required: true, message: "请输入超时时间", trigger: "blur" },],
    reCount: [{ required: true, message: "请输入重发次数", trigger: "blur" },],
    systemTime: [{ required: true, message: "请输入现场机时间", trigger: "blur" },],
    rtdInterval: [{ required: true, message: "请输入实时数据间隔", trigger: "blur" },],
    minInterval: [{ required: true, message: "请输入分钟数据间隔", trigger: "blur" },],
    newPW: [{ required: true, message: "请输入现场机访问密码", trigger: "blur" },],
    beginTime: [{ required: true, message: "请输入开始时间", trigger: "blur" },],
    endTime: [{ required: true, message: "请输入结束时间", trigger: "blur" },],
    dataTime: [{ required: true, message: "请输入上报时间", trigger: "blur" },],
    restartTime: [{ required: true, message: "请输入开机时间", trigger: "blur" },]
  };


  //反控
  recriminatOptions = [
    {
      value: "1000",
      label: "1000-设置超时时间及重发次数"
    },
    {
      value: "1011",
      label: "1011-提取现场机时间"
    },
    {
      value: "1012",
      label: "1012-设置现场机时间"
    },
    {
      value: "1061",
      label: "1061-提取实时数据间隔"
    },
    {
      value: "1062",
      label: "1062-设置实时数据间隔"
    },
    {
      value: "1063",
      label: "1063-提取分钟数据间隔"
    },
    {
      value: "1064",
      label: "1064-设置分钟数据间隔"
    },
    {
      value: "1072",
      label: "1072-设置现场机密码"
    },
    {
      value: "2011",
      label: "2011-取污染物实时数据"
    },
    {
      value: "2012",
      label: "2012-停止察看污染物实时数据"
    },
    {
      value: "2021",
      label: "2021-取设备运行状态数据"
    },
    {
      value: "2022",
      label: "2022-停止察看设备运行状态"
    },
    {
      value: "2031",
      label: "2031-取污染物日历史数据"
    },
    {
      value: "2041",
      label: "2041-取设备运行时间日历史数据"
    },
    {
      value: "2051",
      label: "2051-取污染物分钟数据"
    },
    {
      value: "2061",
      label: "2061-取污染物小时数据"
    },
    {
      value: "2081",
      label: "2081-上传数采仪开机时间"
    }
  ];
}
</script>
<style scoped>
.dlgRecriminateControl-form {
  display: flex;
  flex-direction: column;
  align-items: center;
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
