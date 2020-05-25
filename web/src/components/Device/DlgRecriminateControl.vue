<template>
    <el-card>

      <el-row :gutter="20">
           
          <!-- <el-col :span="3"><div class="grid-content ">  命令id <br> </div></el-col> -->
          <el-col :span="6"><div class="grid-content  mrLeft20">命令名称<br></div></el-col>
          <el-col :span="7"><div class="grid-content  mrLeft40">命令参数<br></div></el-col>
          <el-col :span="6"><div class="grid-content  mrLeft40">因子编码<br></div></el-col>
          <el-col :span="5" ><div class="grid-content mrLeft40 "></div></el-col>
        </el-row>

        <el-row :gutter="20">
            <!-- 设置现场机时间 -->
          <!-- <el-col :span="3"><div class="grid-content "><br> {{SystemTimereControl.CodeId}}</div></el-col> -->
          <el-col :span="6"><div class="grid-content "><br>{{SystemTimereControl.CodeName}}</div></el-col>
          <el-col :span="7"><div class="grid-content "><br>
              <el-date-picker 
                       v-model="SystemTimereControl.CodeParm"
                       type="datetime"
                       placeholder="选择日期时间"
                        @change="onTimesChange"
                        value-format="yyyyMMddHHmmss">
                     </el-date-picker>
                     </div></el-col>
          <el-col :span="6"><div class="grid-content "><br>
              <el-select v-model="SystemTimereControl.PolId" @change="SytimCodeSelect" placeholder="请选择因子编码">
                       <el-option
                         v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                       </el-option>
                     </el-select>
              </div></el-col>
          <el-col :span="5" ><div class="grid-content ">
              <el-button  type="primary" icon="fas "  class="butRight" @click="reControlSysTem">发送</el-button></div>
              </el-col>
        </el-row>
        
        <el-row :gutter="20">
            <!-- 零点校准量程校准 -->
          <!-- <el-col :span="3"><div class="grid-content "><br>{{ZeroReControl.CodeId}}</div></el-col> -->
          <el-col :span="6"><div class="grid-content "><br>{{ZeroReControl.CodeName}}</div></el-col>
          <el-col :span="7"><div class="grid-content "><br></div></el-col>
          <el-col :span="6"><div class="grid-content "><br>
              <el-select v-model="ZeroReControl.PolId" placeholder="请选择因子编码">
                       <el-option
                         v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                       </el-option>
                     </el-select>
              </div></el-col>
          <el-col :span="5"><div class="grid-content ">
              <el-button  type="primary" icon="fas " class="butRight" @click="ReControlZero">发送</el-button></div>
              </el-col>
        </el-row>

        <el-row :gutter="20" >
            <!-- 标定 -->
          <!-- <el-col :span="3"><div class="grid-content "><br>{{CalibrationReControl.CodeId}}</div></el-col> -->
          <el-col :span="6"><div class="grid-content "><br>{{CalibrationReControl.CodeName}}</div></el-col>
          <el-col :span="7"><div class="grid-content "><br></div></el-col>
          <el-col :span="6"><div class="grid-content "><br>
              <el-select v-model="CalibrationReControl.PolId" placeholder="请选择因子编码">
                       <el-option
                         v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                       </el-option>
                     </el-select>
              </div></el-col>
          <el-col :span="5"><div class="grid-content ">
              <el-button  type="primary" icon="fas " class="butRight" @click="ReControlCalibration">发送</el-button></div>
              </el-col>
        </el-row>

        <!-- 反控命令结果展示 -->
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 40}"
          :rows="2"
          placeholder="反控命令结果……"
          v-model="reConBackInfo">
        </el-input>
    </el-card>
</template>

<script lang="ts">
import { Component, Prop,Watch, Vue } from 'vue-property-decorator'
import DtuService from "@/services/DtuService";

@Component
export default class DlgRecriminateControl extends Vue {

    @Prop({ type: Object, default: null }) dtu!: any //从父组件获取dtu
    @Prop({ default: null }) rtuMn!: string; //从父组件获取rtuMn

    
     /** 是否显示 */
    @Prop({ default: false }) visible!: boolean

    @Watch('visible')
    onVisibleChanged(val: boolean) {
        if (val) { this.load() }
    }

    times=""

    reConBackInfo=""

    sysTimeButVisale=false
    timeSelect=false
    CodeSelectSystemTime=false
   @Watch('sysTimeButVisale')

    SystemTimereControl={CodeId: "1012", CodeName: "设置现场机时间", CodeParm: this.times,ST:"32",PolId:""}
    ZeroReControl={CodeId: "3031", CodeName: "开始测量", ST:"32",PolId:""}
    CalibrationReControl={CodeId: "3030", CodeName: "标定", ST:"32",PolId:""}


    
    

    //发送反控指令
    reControlSysTem(){
        DtuService.SendReControl(this.rtuMn, this.SystemTimereControl.CodeParm, this.SystemTimereControl.ST,this.SystemTimereControl.CodeId,this.SystemTimereControl.PolId).then(res => {
           
            this.$set(this, 'messages', res.data)
           
            if (this.SystemTimereControl.PolId==""){
              alert("请选择因子")
              return
            }
            if (this.SystemTimereControl.CodeParm==""){
              alert("请选择时间")
              return
            }
           
            let dateStr=this.nowHMSStr()
           
            this.reConBackInfo+=dateStr+"     执行指令  "+this.SystemTimereControl.CodeId+"<"+this.SystemTimereControl.CodeName+">"+"\n"  //时间，执行指令+指令id+指令名称
            
        
        }).catch(err => {
        
            this.$message.error("加载历史消息错误:" + err)

            let dateStr=this.nowHMSStr()
           
            this.reConBackInfo+=dateStr+"     执行指令  "+this.SystemTimereControl.CodeId+"<"+this.SystemTimereControl.CodeName+">"+"     失败"+"\n"  //时间，执行指令+指令id+指令名称
        })
    }

    //开始测量
    ReControlZero(){
        DtuService.SendReControl(this.rtuMn, "", this.ZeroReControl.ST,this.ZeroReControl.CodeId,this.ZeroReControl.PolId).then(res => {
           
            this.$set(this, 'messages', res.data)
             if (this.ZeroReControl.PolId==""){
              alert("请选择因子")
              return
            }
            let dateStr=this.nowHMSStr()
          
            this.reConBackInfo+=dateStr+"     执行指令  "+this.ZeroReControl.CodeId+"<"+this.ZeroReControl.CodeName+">"+"\n"  //时间，执行指令+指令id+指令名称
           
        
        }).catch(err => {
        
            this.$message.error("加载历史消息错误:" + err)
            
            let dateStr=this.nowHMSStr()
           
            this.reConBackInfo+=dateStr+"     执行指令  "+this.ZeroReControl.CodeId+"<"+this.ZeroReControl.CodeName+">"+"     失败"+"\n"  //时间，执行指令+指令id+指令名称
        })
    }

    //标定
    ReControlCalibration(){
        DtuService.SendReControl(this.rtuMn, "", this.CalibrationReControl.ST,this.CalibrationReControl.CodeId,this.CalibrationReControl.PolId).then(res => {
           
            this.$set(this, 'messages', res.data)
            if (this.CalibrationReControl.PolId==""){
              alert("请选择因子")
              return
            }
           
            let dateStr=this.nowHMSStr()
           
            this.reConBackInfo+=dateStr+"     执行指令  "+this.CalibrationReControl.CodeId+"<"+this.CalibrationReControl.CodeName+">"+"\n"  //时间，执行指令+指令id+指令名称
            
        
        }).catch(err => {
        
            this.$message.error("加载历史消息错误:" + err)
           
            let dateStr=this.nowHMSStr()
           
            this.reConBackInfo+=dateStr+"     执行指令  "+this.CalibrationReControl.CodeId+"<"+this.CalibrationReControl.CodeName+">"+"     失败"+"\n"  //时间，执行指令+指令id+指令名称
        })
    }
    
    //组件数据更新时，更新页面的数据
    load(){
         
        this.SystemTimereControl={CodeId: "1012", CodeName: "设置现场机时间", CodeParm: this.times,ST:"32",PolId:""}
        this.ZeroReControl={CodeId: "3031", CodeName: "开始测量", ST:"32",PolId:""}
        this.CalibrationReControl={CodeId: "3030", CodeName: "标定", ST:"32",PolId:""}

    }


    //因子编码
    options= [{
          value: 'w99999',
          label: 'cod'
        }
        ]
        options2= [{
          value: 'w99999',
          label: 'cod'
        }
        ]

        //返回当前时间的时分秒

        nowHMSStr(){
             var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            var second = date.getSeconds()
            let secondStr =second+""
            let minuteStr= minute+""
            let hourStr=hour+""
            if (second<10){
                secondStr="0"+second
            }
            if (minute<10){
                minuteStr="0"+minute
            }
            if (hour<10){
                hourStr="0"+hour
            }
            let dateStr=hourStr+":"+minuteStr+":"+secondStr
            return dateStr
        }
    
    //监测时间是否选择因子
    SytimCodeSelect(){
     
    }

    //时间选择控件
     onTimesChange() {
       
       
    }

}
</script>

<style scoped>
.row {
    margin-bottom: 10px;
}

.title {
    color: #409EFF;
    margin-top: 10px;
    margin-bottom: 10px;
}

.cell {
    width: 100%;
}

.property {
    text-align: right;
    margin-top: 4px;
}

/* layout */
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  /* 设置最右边的按钮的对齐 */
  .butRight {
    margin-top: 20px;
    margin-left: 40px;
  }

  .mrLeft20{
    margin-left: 20px;
  }
  .mrLeft40{
    margin-left: 40px;
  }
</style>