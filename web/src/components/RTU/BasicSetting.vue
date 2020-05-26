<template>
  <div style="min-width: 1000px;">
    <header-card-list></header-card-list>
    <br />
    <el-card>
      
      <div class="page-title">
        <img src="@/assets/images/pageTitle.png" alt="">
        <span>基础设置</span>
      </div>

      <el-form ref="form" :model="ruleForm" :rules="rules">
        <div class="baseSetting-form">
          <div>
            <el-form-item prop="uploadTime" label="分钟数据上传间隔" label-width="140px" size="small">
              <el-select v-model="ruleForm.uploadTime" placeholder="请选择上传间隔" style="width:230px;">
                <el-option  
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="storeTime" label="数据存储间隔" label-width="140px" size="small">
              <el-input style="width:230px;" v-model="ruleForm.storeTime" placeholder="请输入存储间隔">
              </el-input>分
            </el-form-item>

            <el-form-item prop="saveTime" label="本地保存有效期" label-width="140px" size="small">
              <el-input style="width:230px;" v-model="ruleForm.saveTime" placeholder="请输入保存有效期">
              </el-input>月
            </el-form-item>
          </div>
          <el-form-item size="large">
            <div class="btn-wrapper">
              <el-button type="primary" @click="onSubmit">提交数据</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>

    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderCardList from "./HeaderCardList.vue";
import DtuService from "@/services/DtuService";
 

@Component({
  components: {
    HeaderCardList: HeaderCardList
  }
})
export default class BaseSetting2 extends Vue {

 
  loading = false
  options = [
    {value: 5,label: '5分钟'},
    {value: 10,label: '10分钟'},
    {value: 15,label: '15分钟'},
    {value: 20,label: '20分钟'}
  ]
  ruleForm = {
    uploadTime: '', // 上传间隔
    storeTime: '',  // 数据存储间隔
    saveTime: '',   // 保存有效期
  }
  intervalUnit = '秒'
  
  checkStoreTime = (rule: any, value: any, callback: any) => {
    if (!/^[0-9]{1,5}$/.test(value)) {
      callback(new Error("请输入5位以内的正整数"));
    } else {
      callback();
    }
  };
  checkSaveTime = (rule: any, value: any, callback: any) => {
    if (!/^[0-9]{1,5}$/.test(value)) {
      callback(new Error("请输入5位以内的正整数"));
    } else {
      callback();
    }
  };
  rules = {
    uploadTime: [
      { required: true, message: '上传间隔不能为空', trigger: 'change' }
    ],
    storeTime: [
      { required: true, message: '存储间隔不能为空', trigger: 'blur' },
      { validator: this.checkStoreTime, trigger: "blur" }
    ],
    saveTime: [
      { required: true, message: '保存有效期不能为空', trigger: 'blur' },
      { validator: this.checkSaveTime, trigger: "blur" }
    ],
  }
  // 修改本地保存有效期单位
  handleCommand(command: string) {
    this.intervalUnit = command;
  }

  resetForm() {
    const ref:any = this.$refs['form']
    ref.resetFields()
  }
  onSubmit() {
    const ref:any = this.$refs['form']
    ref.validate((valid:boolean) => {
      if (valid) {
        // alert('验证通过')
        
        this.loading = true;
        DtuService.RtuNewBasicStting(
          sessionStorage.getItem("rtuMN") || '',
          Number(this.ruleForm.uploadTime),
          Number(this.ruleForm.storeTime),
          Number(this.ruleForm.saveTime),
        ).then(res => {
          this.$message.success("基础设置提交成功");
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.$message.error("加载历史消息错误:" + err);
        });

      } else {
        console.log('验证失败')
        return false;
      }
    })
  }

  currentTableData=[{mn:"ABC001",address:"127.0.0.1:9001",protocal:"HJ212",uploadInterval:60,heartInterval:120,isTiming:false},
  {mn:"ABC002",address:"127.0.0.1:9001",protocal:"HJ212",uploadInterval:60,heartInterval:120,isTiming:false}]
  
  load(){
    console.log("load");
  }
}
</script>

<style scoped>
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button {
  
    -webkit-appearance: none !important;
    margin: 0;
}
.baseSetting-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn-wrapper {
  display: flex;
  flex-direction: row;
}
.btuSave{
  float: right;
  margin-right: 5%;
  margin-top: 5%;
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


