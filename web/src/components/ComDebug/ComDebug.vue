<template>
  <div>
    <header-card-list></header-card-list>
    <el-card style="margin-top:18px;">
      
      <div slot="header">
        <div class="page-title">
          <img :src="pageTitleImg" alt="">
          <span>串口调试</span>
        </div>
      </div>

      <el-form
        :rules="formRule"
        ref="form"
        :model="formData"
        size="mini"
      >
        <div class="form-item-wrapper">
          <div style="white-space:nowrap;margin-right:80px;">
            <el-form-item label="com口:" prop="com">
              <el-select v-model="formData.com" placeholder="请选择" style="width:90px" >
                <el-option
                  v-for="item in comOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
    
          <div style="white-space:nowrap;margin-right:100px;">
            <el-form-item label="波特率:" prop="baudrate">
              <el-select v-model="formData.baudrate" placeholder="请选择" style="width:110px">
                <el-option
                  v-for="item in baudrateOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div style="white-space:nowrap;margin-right:100px;">
            <el-form-item label="数据位:" prop="dataBit">
              <el-select v-model="formData.dataBit" placeholder="请选择" style="width:75px">
                <el-option
                  v-for="item in dataBitOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div style="white-space:nowrap;margin-right:100px;">
            <el-form-item label="校验位:" prop="checkBit">
              <el-select v-model="formData.checkBit" placeholder="请选择" style="width:95px">
                <el-option
                  v-for="item in checkBitOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div style="white-space:nowrap;margin-right:100px;">
            <el-form-item label="停止位:" prop="stopBit">
              <el-select v-model="formData.stopBit" placeholder="请选择" style="width:75px">
                <el-option
                  v-for="item in stopBitOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div style="white-space:nowrap;margin-right:85px;">
            <el-form-item label="校验方式:" prop="checkType">
              <el-select v-model="formData.checkType" placeholder="请选择" style="width:110px">
                <el-option
                  v-for="item in checkTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="message-box-wrapper">
          <el-form-item label="" prop="message">
            <el-input 
              type="textarea" 
              v-model="formData.message" 
              placeholder="请输入消息"
              :rows="3"
            ></el-input>
          </el-form-item>
        </div>

        <div class="submitBtn-wrapper">
          <el-button type="primary" size="mini" @click="onSubmit">发送</el-button>
          <el-button size="mini" @click="resetForm" style="margin-right:20px;">重置</el-button>
        </div>
      </el-form>

      <el-divider></el-divider>

      <div class="submitBtn-wrapper">
        <el-button size="mini" @click="clearMessage">清空</el-button>
      </div>
      <div class="box2-wrapper">
        <div v-for="(item, index) in messageList" :key="index">{{ item }}</div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ComDebugService from "@/services/ComDebugService";
import HeaderCardList from "../RTU/HeaderCardList.vue";
import pageTitleImg from '@/assets/images/pageTitle.png'

@Component({components: {
    HeaderCardList: HeaderCardList,
}})
export default class ComDebug extends Vue {
  
  pageTitleImg :any = pageTitleImg
  // 串口选择框数据
  comOption:any[] = [
    {
      value: "COM8",
      label: "COM8"
    },
    {
      value: "1",
      label: "ttyS0"
    },
    {
      value: "2",
      label: "ttyS1"
    },
    {
      value: "3",
      label: "ttyS3"
    },
    {
      value: "4",
      label: "ttyS4"
    },
    {
      value: "5",
      label: "ttyS5"
    }
  ]
  // 波特率选择框数据
  baudrateOption:any[] = [
    {
      value: "Custom",
      label: "Custom"
    },
    {
      value: "110",
      label: "110"
    },
    {
      value: "300",
      label: "300"
    },
    {
      value: "600",
      label: "600"
    },
    {
      value: "1200",
      label: "1200"
    },
    {
      value: "2400",
      label: "2400"
    },
    {
      value: "4800",
      label: "4800"
    },
    {
      value: "9600",
      label: "9600"
    },
    {
      value: "14400",
      label: "14400"
    },
    {
      value: "19200",
      label: "19200"
    },
    {
      value: "38400",
      label: "38400"
    },
    {
      value: "56000",
      label: "56000"
    },
    {
      value: "57600",
      label: "57600"
    },
    {
      value: "115200",
      label: "115200"
    },
    {
      value: "128000",
      label: "128000"
    },
    {
      value: "230400",
      label: "230400"
    },
    {
      value: "256000",
      label: "256000"
    },
    {
      value: "460800",
      label: "460800"
    },
    {
      value: "500000",
      label: "500000"
    },
    {
      value: "512000",
      label: "512000"
    },
    {
      value: "600000",
      label: "600000"
    },
    {
      value: "750000",
      label: "750000"
    },
    {
      value: "921600",
      label: "921600"
    },
    {
      value: "1000000",
      label: "1000000"
    },
    {
      value: "1500000",
      label: "1500000"
    },
    {
      value: "2000000",
      label: "2000000"
    }
  ]
  // 数据位
  dataBitOption:any[] = [
    {
      value: "5",
      label: "5"
    },
    {
      value: "6",
      label: "6"
    },
    {
      value: "7",
      label: "7"
    },
    {
      value: "8",
      label: "8"
    }
  ];
  // 校验位
  checkBitOption:any[] = [
    {
      value: "None",
      label: "None"
    },
    {
      value: "Odd",
      label: "Odd"
    },
    {
      value: "Even",
      label: "Even"
    },
    {
      value: "Mark",
      label: "Mark"
    },
    {
      value: "Space",
      label: "Space"
    }
  ];
  // 停止位
  stopBitOption:any[] = [
    {
      value: "1",
      label: "1"
    },
    {
      value: "1.5",
      label: "1.5"
    },
    {
      value: "2",
      label: "2"
    }
  ];
  // 校验方式
  checkTypeOption:any[] = [
    {
      value: "CRC16",
      label: "CRC16"
    },
    {
      value: "LRC",
      label: "LRC"
    },
  ];

  // 表单验证规则
  formRule:object = {
    com: [{ required: true, message: "请选择COM口", trigger: "blur" }],
    baudrate: [{ required: true, message: "请选择波特率", trigger: "blur" }],
    dataBit: [{ required: true, message: "请选择数据位", trigger: "blur" }],
    checkBit: [{ required: true, message: "请选择校验位", trigger: "blur" }],
    stopBit: [{ required: true, message: "请选择停止位", trigger: "blur" }],
    checkType: [{ required: true, message: "请选择校验方式", trigger: "blur" }],
    message: [{ required: true, message: "请输入消息", trigger: "blur" }],
  }
  // 表单验证绑定数据
  formData:any = {
    com: '',
    baudrate: '',
    dataBit: '',
    checkBit: '',
    stopBit: '',
    checkType: '',
    message: '',
  }

  messageList:any[] = []

  /**
   * 提交表单
   */
  onSubmit() {
    this.$refs['form'].validate((valid:any) => {
      if (valid) {
        ComDebugService.ComDebugSubmit(
          sessionStorage.getItem('rtuMN') || '',
          this.formData.com,
          this.formData.baudrate,
          this.formData.dataBit,
          this.formData.checkBit,
          this.formData.stopBit,
          this.formData.checkType,
          this.formData.message,
        ).then((res:any) => {
          if(res && res.code == 200) {
            this.$message.success("提交成功")
            this.messageList.push(res.data || '')
          }else {
            this.$message.error(res.msg)
          }
        }).catch((err:any) => {
          this.$message.error("提交失败")
        })
      } else {
        this.$message.error("表单验证失败")
        return false
      }
    });
  }
  /**
   * 重置表单项以及验证
   */
  resetForm() {
    this.$refs['form'].resetFields()
    this.formData = {
      com: this.comOption[0].label,
      baudrate: this.baudrateOption[0].label,
      dataBit: this.dataBitOption[0].label,
      checkBit: this.checkBitOption[0].label,
      stopBit: this.stopBitOption[0].label,
      checkType: this.checkTypeOption[0].label,
      message: '',
    }
  }

  /**
   * 清空消息框
   */
  clearMessage() {
    this.messageList = []
  }

  mounted() {
    this.formData = {
      com: this.comOption[0].label,
      baudrate: this.baudrateOption[0].label,
      dataBit: this.dataBitOption[0].label,
      checkBit: this.checkBitOption[0].label,
      stopBit: this.stopBitOption[0].label,
      checkType: this.checkTypeOption[0].label,
      message: '',
    }
  }
}
</script>

<style scoped>
  .form-item-wrapper {
    display: flex;
    flex-wrap: wrap;
  }
  .submitBtn-wrapper {
    display: flex;
    flex-direction: row-reverse;
  }
  .box2-wrapper {
    border: 1px solid rgb(220, 223, 230);
    border-radius: 3px;
    height: 80px;
    max-height: 80px;
    margin-top: 15px;
    padding: 5px 15px;
    color: #9b9b9b;
    font-size: 14px;
    overflow: auto;
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



