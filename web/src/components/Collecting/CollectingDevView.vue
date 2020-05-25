<template>
  <div>
    <el-card>
      <div style="overflow:auto">
        <!-- 串口 -->
        <el-form
          ref="formHeader"
          :model="formHeader"
          :rules="rulesHeader"
          label-width="100px"
          size="mini"
        >
          <div style="display:flex;justify-content:space-between;" v-if="showForm == true">
            <div>
              <el-form-item label="接入类型:" prop="access_type">
                <el-select :disabled="isEdit" v-model="formHeader.access_type" placeholder="请选择" style="width:200px" @change="typeChange('串口')">
                  <el-option
                    v-for="item in accessOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="数据位:" prop="data_bit">
                <el-select v-model="formHeader.data_bit" placeholder="请选择" style="width:200px">
                  <el-option
                    v-for="item in dataBitsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="通讯协议:" prop="communication_protocol">
                <el-select
                  v-model="formHeader.communication_protocol"
                  placeholder="请选择"
                  style="width:200px"
                >
                  <el-option
                    v-for="item in deviceProtocols"
                    :key="item.id"
                    :label="item.protocalName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              
              <div style="display:flex;">
                <el-form-item label="ST:" prop="st">
                    <el-select v-model="formHeader.st" placeholder="请选择" style="width:200px">
                      <el-option v-for="item in stList" :key="item.id+'-'+item.name" :label="item.id+'-'+item.name" :value="item.id+'-'+item.name"></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="stDef" style="margin-left:20px">
                  <el-button
                    type="primary"
                    @click="stDef=false"
                    size="mini"
                  >自定义</el-button>
                </div>
                <div v-else style="margin-left:20px;display:flex;white-space:nowrap;">
                  <el-input placeholder="st ID" size="mini" v-model="stId" @input="replaceSt()" style="width:70px;"></el-input>
                  <span style="line-height:28px;margin:0 2px;">-</span>
                  <el-input placeholder="st 名" size="mini" v-model="stName" @input="replaceSt()" style="width:70px;"></el-input>
                  <div style="margin-left:10px">
                    <el-button type="success" icon="el-icon-check" circle size="mini" @click="addSt(1)"></el-button>
                    <el-button type="danger" icon="el-icon-close" circle size="mini" @click="cancelAddSt"></el-button>
                  </div>
                </div>
              </div>

            </div>
            
            <div>
              <el-form-item label="COM口:" prop="com">
                <el-select v-model="formHeader.com" placeholder="请选择" style="width:200px">
                  <el-option
                    v-for="item in comsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="停止位:" prop="stop_bit">
                <el-select v-model="formHeader.stop_bit" placeholder="请选择" style="width:200px">
                  <el-option
                    v-for="item in stopOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备地址位:" prop="device_address">
                <el-select v-model="formHeader.device_address" placeholder="请选择" style="width:200px">
                  <el-option
                    v-for="item in addressOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="采集间隔:" prop="interval_collect">
                <el-input v-model.number="formHeader.interval_collect" style="width:200px"></el-input>
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    {{intervalUnit}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" @command="handleCommand">
                    <el-dropdown-item command="秒">秒</el-dropdown-item>
                    <el-dropdown-item command="分">分</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
            </div>

            <div>
              <el-form-item label-width="200px" label="波特率:" prop="baudrate">
                <el-select v-model="formHeader.baudrate" placeholder="请选择" style="width:200px">
                  <el-option
                    v-for="item in baudOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="200px" label="校验位:" prop="check_bit">
                <el-select v-model="formHeader.check_bit" placeholder="请选择" style="width:200px">
                  <el-option
                    v-for="item in parityOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="200px" label="读取指令参数:" prop="params">
                <el-input v-model="formHeader.params" style="width:200px"></el-input>
              </el-form-item>
              <el-form-item label-width="200px" label="通讯失败忽略次数:" prop="fail_time">
                <el-input v-model.number="formHeader.fail_time" style="width:200px"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>

        <!-- 网口 -->
        <el-form
          ref="formHeader2"
          :model="formHeader2"
          :rules="rulesHeader2"
          label-width="100px"
          size="mini"
        >
          <div style="display:flex;justify-content:space-between;" v-if="showForm == false">
            <div>
              <el-form-item label="接入类型:" prop="access_type">
                <el-select :disabled="isEdit" v-model="formHeader2.access_type" placeholder="请选择" style="width:200px" @change="typeChange('网口')">
                  <el-option
                    v-for="item in accessOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="IP:" prop="id">
                <el-input v-model="formHeader2.id" style="width:200px"></el-input>
              </el-form-item>
              <el-form-item label="采集间隔:" prop="interval_collect">
                <el-input v-model.number="formHeader2.interval_collect" style="width:200px"></el-input>
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    {{intervalUnit}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" @command="handleCommand">
                    <el-dropdown-item command="秒">秒</el-dropdown-item>
                    <el-dropdown-item command="分">分</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
            </div>

            <div>
              <el-form-item label="设备地址位:" prop="device_address">
                <el-select v-model="formHeader2.device_address" placeholder="请选择" style="width:200px">
                  <el-option
                    v-for="item in addressOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="通讯协议:" prop="communication_protocol">
                <el-select
                  v-model="formHeader2.communication_protocol"
                  placeholder="请选择"
                  style="width:200px"
                >
                  <el-option
                    v-for="item in deviceProtocols"
                    :key="item.id"
                    :label="item.protocalName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>

              <div style="display:flex;">
                <el-form-item label="ST:" prop="st">
                  <el-select v-model="formHeader2.st" placeholder="请选择" style="width:200px">
                    <el-option v-for="item in stList" :key="item.id+'-'+item.name" :label="item.id+'-'+item.name" :value="item.id+'-'+item.name"></el-option>
                  </el-select>
                </el-form-item>
                <div v-if="stDef" style="margin-left:20px">
                  <el-button
                    type="primary"
                    @click="stDef=false"
                    size="mini"
                  >自定义</el-button>
                </div>
                <div v-else style="margin-left:20px;display:flex;white-space:nowrap;">
                  <el-input placeholder="st ID" size="mini" v-model="stId" @input="replaceSt()" style="width:70px;"></el-input>
                  <span style="line-height:28px;margin:0 2px;">-</span>
                  <el-input placeholder="st 名" size="mini" v-model="stName" @input="replaceSt()" style="width:70px;"></el-input>
                  <div style="margin-left:10px">
                    <el-button type="success" icon="el-icon-check" circle size="mini" @click="addSt(2)"></el-button>
                    <el-button type="danger" icon="el-icon-close" circle size="mini" @click="cancelAddSt"></el-button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <el-form-item label-width="200px" label="读取指令参数:" prop="params">
                <el-input v-model="formHeader2.params" style="width:200px"></el-input>
              </el-form-item>
              <el-form-item label-width="200px" label="通讯失败忽略次数:" prop="fail_time">
                <el-input v-model.number="formHeader2.fail_time" style="width:200px"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>

    </el-card>
    <br />
    <el-card>
      <div style="display:flex;overflow:auto;">

        <div style="width:50%;height:230px">
          采集因子列表
          <el-table
            ref="factorList"
            :data="factorList"
            border
            stripe
            highlight-current-row
            size="mini"
            @row-click="openDetails"
          >
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="st" label="ST"></el-table-column>
            <el-table-column prop="factor_code" label="CODE"></el-table-column>
            <el-table-column prop="factor_name" label="NAME"></el-table-column>
            <el-table-column prop="factor_alias" label="别名"></el-table-column>
            <el-table-column prop="factor_id" label="因子标识"></el-table-column>
            <el-table-column prop="register_addr" label="寄存器序号"></el-table-column>
            <el-table-column prop="register_length" label="数据长度"></el-table-column>
            <el-table-column prop="name" label="操作">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="onDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="width:50%;">
          <el-form
            :rules="factorRules"
            ref="formTail"
            :model="formTail"
            label-width="85px"
            size="mini"
            class="demo-form-inline"
          >
            <div style="display:flex;justify-content:space-between;">
              <div style="min-width:477px;">
                <div style="display:flex;">
                  <el-form-item label="因子:" prop="factor_code">
                    <el-select filterable  allow-create  v-model="formTail.factor_code" placeholder="请选择" style="width:150px">
                      <el-option
                        v-for="item in parameterFactors"
                        :key="item.code+'-'+item.name"
                        :label="item.code+'-'+item.name"
                        :value="item.code+'-'+item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <div v-if="geneDef" style="margin-left:20px">
                    <el-button
                      type="primary"
                      @click="geneDef=false"
                      size="mini"
                    >自定义</el-button>
                  </div>
                  <div v-else style="margin-left:20px;display:flex;white-space:nowrap;">
                    <el-input placeholder="因子id" size="mini" v-model="geneId" @input="replaceGene()"></el-input>
                    <span style="line-height:28px;margin:0 2px;">-</span>
                    <el-input placeholder="因子名" size="mini" v-model="geneName" @input="replaceGene()"></el-input>
                    <div style="margin-left:10px">
                      <el-button type="success" icon="el-icon-check" circle size="mini" @click="addGene"></el-button>
                      <el-button type="danger" icon="el-icon-close" circle size="mini" @click="cancelAddGene"></el-button>
                    </div>
                  </div>
                </div>

                <el-form-item label="因子标识:" prop="factor_id">
                  <el-select v-model="formTail.factor_id" placeholder="请选择" style="width:150px">
                    <el-option
                      v-for="item in factorIdOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="别名:" prop="factor_alias">
                  <el-input v-model="formTail.factor_alias" style="width:150px"></el-input>
                </el-form-item>

                <span>报警范围</span>
                <span style="color:red;font-size:12px;margin-left:20px" v-if="alarmError">报警下限不能超过上限</span>
                <div style="display:flex;flex-direction:row;">
                  <el-form-item label="报警下限:" prop="alarm_lower">
                    <el-input v-model="formTail.alarm_lower" style="width:100px" @change="alarmChange"></el-input>
                  </el-form-item>
                  <el-form-item label="报警上限:" prop="alarm_upper">
                    <el-input v-model="formTail.alarm_upper" style="width:100px" @change="alarmChange"></el-input>
                  </el-form-item>
                  
                </div>

                <span style="margin-right:10px;">模拟量</span>
                <el-checkbox v-model="formTail.is_analog" size="mini" @change="isAnalog">是否模拟量</el-checkbox>
                <span style="color:red;font-size:12px;margin-left:20px" v-if="analogError">模拟量下限不能超过上限</span>
                <div style="display:flex;flex-direction:row;" v-if="formTail.is_analog">
                  <el-form-item label="模拟量下限:" prop="analog_lower" label-width="100px">
                    <el-input v-model="formTail.analog_lower" style="width:100px" size="mini" @change="analogChange"></el-input>
                  </el-form-item>
                  <el-form-item label="模拟量上限:" prop="analog_upper" label-width="100px">
                    <el-input v-model="formTail.analog_upper" style="width:100px" size="mini" @change="analogChange"></el-input>
                  </el-form-item>
                </div>
              </div>

              <div>
                <el-form-item label="st:" label-width="100px" prop="st">
                  <el-input v-model.number="formTail.st" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="寄存器序号:" label-width="100px" prop="register_addr">
                  <el-input v-model="formTail.register_addr" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="数据长度:" label-width="100px" prop="register_length">
                  <el-input v-model.number="formTail.register_length" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="换算系数:" label-width="100px" prop="ratio">
                  <el-input v-model.number="formTail.ratio" style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="小数位数:" label-width="100px" prop="decimals">
                  <el-input v-model.number="formTail.decimals" style="width:150px"></el-input>
                </el-form-item>
              </div>
            </div>

            <el-button
              type="primary"
              v-if="isLineClick"
              @click="factorsAdd('formTail')"
              size="mini"
            >因子修改</el-button>
            <el-button type="primary" v-else @click="factorsAdd('formTail')" size="mini">因子新增</el-button>
            <el-button type="primary" @click="resetFactorForm('formTail')" size="mini">因子重置</el-button>
            <br />
            <br />
          </el-form>
        </div>
      </div>
    </el-card>
    <br />
    <el-button
      type="primary"
      v-if="isEdit"
      @click="collectAdd('formHeader')"
      size="small"
      style="margin-left:50%"
    >修改</el-button>
    <el-button
      type="primary"
      v-else
      @click="collectAdd()"
      size="small"
      style="margin-left:50%"
    >新增</el-button>
    <el-button size="small" @click="closeDio()">取消</el-button>
    <el-dialog title="自定义因子" :visible.sync="factorVisable" width="50%">
      <Factor-View :visible="factorVisable"></Factor-View>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

import FactorView from "./FactorView.vue";

import CollectService from "@/services/CollectService";

// 表单验证方法
let checkInterval = (rule: any, value: any, callback: any) => {
  if (!Number.isInteger(value)) {
    callback(new Error("请输入整数"));
  } else if (value <= 0) {
    callback(new Error("采集间隔必须大于0"));
  } else if (String(value).length > 5) {
    callback(new Error("长度在 1 到 5 个字符"));
  } else {
    callback();
  }
};
let checkFailTime = (rule: any, value: any, callback: any) => {
  if (!Number.isInteger(value)) {
    callback(new Error("请输入整数"));
  } else if (value < 0) {
    callback(new Error("忽略次数不能小于0"));
  } else if (String(value).length > 5) {
    callback(new Error("长度在 1 到 5 个字符"));
  } else {
    callback();
  }
};
let checkAlarm = (rule: any, value: any, callback: any) => {
  if (!/^-?\d+\.?\d{0,2}$/.test(value)) {
    callback(new Error("请输入数字值,最多2位小数"));
  } else if (value <= -1000 || value >= 1000) {
    callback(new Error("请输入3位以内的数字"));
  } else {
    callback();
  }
};
let checkRegister = (rule: any, value: any, callback: any) => {
  if (!Number.isInteger(value)) {
    callback(new Error("请输入正整数"));
  } else if (value < 0) {
    callback(new Error("数据长度不能为负"));
  } else if (value > 100) {
    callback(new Error("数据长度不能大于10"));
  } else {
    callback();
  }
};
let checkSt = (rule: any, value: any, callback: any) => {
  if (!Number.isInteger(value)) {
    callback(new Error("请输入正整数"));
  } else if (value < 0) {
    callback(new Error("数据长度不能为负"));
  } else if (value > 100) {
    callback(new Error("数据不能大于100"));
  } else {
    callback();
  }
};
let checkRatio = (rule: any, value: any, callback: any) => {
  if (!Number.isInteger(value)) {
    callback(new Error("请输入正整数"));
  } else if (value < 0) {
    callback(new Error("换算系数不能为负"));
  } else if (value > 10) {
    callback(new Error("换算系数不能大于10"));
  } else {
    callback();
  }
};
let checkDecimals = (rule: any, value: any, callback: any) => {
  if (!Number.isInteger(value)) {
    callback(new Error("请输入正整数"));
  } else if (value < 0) {
    callback(new Error("小数位数不能为负"));
  } else if (value > 5) {
    callback(new Error("小数位数不能大于5"));
  } else {
    callback();
  }
};

@Component({
  components: {
    FactorView: FactorView
  }
})
export default class CollectingDevView extends Vue {
  @Prop({ type: Object, default: null }) dtu!: any; //从父组件获取dtu
  /** 是否打开对话框 */
  @Prop({ default: false }) visible!: boolean;
  /** 是否修改 */
  @Prop({ default: null }) isEdit!: boolean;

  @Watch("visible")
  visableChange(newVal: boolean, oldVal: boolean) {
    if (this.isEdit) {
      if(this.dtu.access_type == '串口') {
        this.showForm = true
        this.formHeader = this.dtu;
      }else {
        this.showForm = false
        this.formHeader2 = this.dtu;
      }
      this.factorList = this.dtu.factors;
      this.currRowIndex = this.dtu.rowIndex;
    } else {
      this.cleanInfo();
    }
    this.isLineClick = false;
    this.geneDef = true
    this.stDef = true
  }

  /*-----变量------*/
  alarmError:boolean = false  // 报警值验证
  analogError:boolean = false // 模拟量值验证
  index = "";
  labelPosition = "right";
  mnHide = false;
  factorVisable = false;
  rtuMN = "ABC001";
  deviceProtocols = [];
  parameters = [];
  parameterFactors:any[] = [];
  stList:any[] = [];
  factorList = [];
  isLineClick = false;
  currRowIndex = -1; //父组件点击的行
  intervalUnit = "秒"; // 采集间隔单位
  showForm:boolean = true
  geneDef:boolean = true
  stDef:boolean = true
  geneId:string = ''
  geneName:string = ''
  stId:string = ''
  stName:string = ''
  // 接入类型
  accessOptions = [
    {
      value: "1",
      label: "串口"
    },
    {
      value: "2",
      label: "网口"
    }
  ];
  // Coms
  comsOptions = [
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
  ];
  // 数据位
  dataBitsOptions = [
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
  // 停止位
  stopOptions = [
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
  // 设备地址位
  addressOptions = [
    {
      value: "1",
      label: "1"
    },
    {
      value: "2",
      label: "2"
    },
    {
      value: "4",
      label: "4"
    },
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
    },
    {
      value: "9",
      label: "9"
    },
    {
      value: "10",
      label: "10"
    }
  ];
  // 校验位
  parityOptions = [
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
  // 波特率
  baudOptions = [
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
  ];
  // 因子标识
  factorIdOptions = [
    {
      value: "1",
      label: "1"
    },
    {
      value: "2",
      label: "2"
    },
    {
      value: "3",
      label: "3"
    },
    {
      value: "4",
      label: "4"
    },
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
    },
    {
      value: "9",
      label: "9"
    },
    {
      value: "10",
      label: "10"
    }
  ];
  // 设备表单绑定值-串口
  formHeader:any = {
    access_type: "串口",
    data_bit: "",
    communication_protocol: "",
    st: "",
    com: "",
    stop_bit: "",
    device_address: "",
    interval_collect: "",
    baudrate: "",
    check_bit: "",
    params: "",
    fail_time: ""
  };
  // 设备表单验证-串口
  rulesHeader:any = {
    access_type: [{ required: true, message: "请选择输入类型", trigger: "change" }],
    data_bit: [{ required: true, message: "请选择数据位", trigger: "change" }],
    communication_protocol: [{ required: true, message: "请选择通讯协议", trigger: "change" }],
    st: [{ required: true, message: "请选择ST", trigger: "change" }],
    com: [{ required: true, message: "请选择COM口", trigger: "change" }],
    stop_bit: [{ required: true, message: "请选择停止位", trigger: "change" }],
    device_address: [{ required: true, message: "请选择设备地址位", trigger: "change" }],
    interval_collect: [
      { required: true, message: "请输入采集间隔", trigger: "blur" },
      { validator: checkInterval, trigger: "blur" }
    ],
    baudrate: [{ required: true, message: "请选择波特率", trigger: "change" }],
    check_bit: [{ required: true, message: "请选择校验位", trigger: "change" }],
    params: [
      { required: true, message: "请输入读取指令参数", trigger: "blur" },
      { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
    ],
    fail_time: [
      { required: true, message: "请输入通讯失败忽略次数", trigger: "blur" },
      { validator: checkFailTime, trigger: "blur" }
    ]
  };
  // 设备表单绑定值-网口
  formHeader2:any = {
    access_type: "网口",
    id: '',
    interval_collect: "",
    device_address: "",
    communication_protocol: "",
    st: "",
    params: "",
    fail_time: "",
  }
  // 设备表单验证-网口
  rulesHeader2:any = {
    access_type: [{ required: true, message: "请选择接入类型", trigger: "change" }],
    id: [{ required: true, message: "请输入IP", trigger: "blur" }],
    interval_collect: [
      { required: true, message: "请输入采集间隔", trigger: "blur" },
      { validator: checkInterval, trigger: "blur" }
    ],
    device_address: [{ required: true, message: "请选择设备地址位", trigger: "change" }],
    communication_protocol: [{ required: true, message: "请选择通讯协议", trigger: "change" }],
    st: [{ required: true, message: "请选择ST", trigger: "change" }],
    params: [
      { required: true, message: "请输入读取指令参数", trigger: "blur" },
      { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
    ],
    fail_time: [
      { required: true, message: "请输入通讯失败忽略次数", trigger: "blur" },
      { validator: checkFailTime, trigger: "blur" }
    ]
  }
  // 因子表单绑定值
  formTail = {
    factor_code: "",
    factor_id: "",
    factor_alias: "",
    st: "",
    register_addr: "",
    register_length: "",
    ratio: "",
    decimals: "",
    alarm_lower: "",
    alarm_upper: "",
    is_analog: "",
    analog_lower: "",
    analog_upper: ""
  };
  // 因子表单验证
  factorRules = {
    factor_code: [{ required: true, message: "请选择因子", trigger: "change" }],
    factor_id: [
      { required: true, message: "请选择因子标识", trigger: "change" }
    ],
    factor_alias: [{ required: true, message: "请输入别名", trigger: "blur" }],
    alarm_lower: [
      { required: true, message: "请输入报警下限", trigger: "blur" },
      { validator: checkAlarm, trigger: "blur" }
    ],
    alarm_upper: [
      { required: true, message: "请输入报警上限", trigger: "blur" },
      { validator: checkAlarm, trigger: "blur" }
    ],
    analog_lower: [
      { required: true, message: "请输入模拟量下限", trigger: "blur" },
      { validator: checkAlarm, trigger: "blur" }
    ],
    analog_upper: [
      { required: true, message: "请输入模拟量上限", trigger: "blur" },
      { validator: checkAlarm, trigger: "blur" }
    ],
    st: [
      { required: true, message: "请输入st", trigger: "blur" },
      { validator: checkSt, trigger: "blur" }
    ],
    register_addr: [
      { required: true, message: "请输入寄存器序号", trigger: "blur" }
    ],
    register_length: [
      { required: true, message: "请输入数据长度", trigger: "blur" },
      { validator: checkRegister, trigger: "blur" }
    ],
    ratio: [
      { required: true, message: "请输入换算系数", trigger: "blur" },
      { validator: checkRatio, trigger: "blur" }
    ],
    decimals: [
      { required: true, message: "请输入小数位数", trigger: "blur" },
      { validator: checkDecimals, trigger: "blur" }
    ]
  };

  // 初始化页面
  mounted() {
    this.loadProtocol();
    if (this.isEdit) {
      if(this.dtu.access_type == '串口') {
        this.showForm = true
        this.formHeader = this.dtu;
      }else {
        this.showForm = false
        this.formHeader2 = this.dtu;
      }
      this.factorList = this.dtu.factors;
      this.currRowIndex = this.dtu.rowIndex;
    } else {
      this.cleanInfo();
    }
    this.isLineClick = false;
  }

  /*-----方法------*/
  replaceGene() {
    this.geneId = this.geneId.replace('-','')
    this.geneName = this.geneName.replace('-','')
    this.geneId = this.geneId.replace(' ','')
    this.geneName = this.geneName.replace(' ','')
  }
  replaceSt() {
    this.stId = this.stId.replace('-','')
    this.stName = this.stName.replace('-','')
    this.stId = this.stId.replace(' ','')
    this.stName = this.stName.replace(' ','')
  }
  // 关闭弹窗
  closeDio() {
    this.$emit("closeDialog")
  }
  // 接入类型change事件--改变表单内容
  typeChange(type:string) {
    if(type == '串口' && this.showForm) {
      this.showForm = false
      this.formHeader.access_type = '串口'
    }else if(type == '网口' && !this.showForm) {
      this.showForm = true
      this.formHeader2.access_type = '网口'
    }
  }
  // 修改采集间隔单位
  handleCommand(command: string) {
    this.intervalUnit = command;
  }
  // 报警值判断
  alarmChange() {
    if(this.formTail.alarm_lower !== '' && this.formTail.alarm_upper !== '') {
      if(Number(this.formTail.alarm_lower) > Number(this.formTail.alarm_upper)) {
        this.alarmError = true
      }else
        this.alarmError = false
    }else {
      this.alarmError = false
    }
  }
  // 模拟量值判断
  analogChange() {
    if(this.formTail.analog_lower !== '' && this.formTail.analog_upper !== '') {
      if(Number(this.formTail.analog_lower) > Number(this.formTail.analog_upper)) {
        this.analogError = true
      }else
        this.analogError = false
    }else {
      this.analogError = false
    }
  }
  // 是否模拟量-清空
  isAnalog() {
    this.formTail.analog_lower = ''
    this.formTail.analog_upper = ''
  }
  /** 查询parameter列表 **/
  loadProtocol() {
    CollectService.QueryProtocol(this.rtuMN)
      .then(res => {
        this.$set(this, "parameters", res.data);
        //TODO
        this.deviceProtocols = this.parameters.deviceProtocol;
        this.parameterFactors = this.parameters.factor;
        this.stList = this.parameters.st;
      })
      .catch(err => {
        this.$message.error("加载通讯协议败:" + err);
      });
  }
  // 自定义因子
  addGene() {
    if(this.geneId !== '' && this.geneName !== '') {
      this.parameterFactors.push({code:this.geneId,name:this.geneName})
      this.formTail.factor_code = this.geneId+'-'+this.geneName
      this.geneDef = true
      this.geneId = ''
      this.geneName = ''
    }else {
      this.$message.warning('因子格式错误')
    }
  }
  // 自定义st
  addSt(type:any) {
    if(this.stId !== '' && this.stName !== '') {
      this.stList.push({id:this.stId,name:this.stName})
      if(type == 1) this.formHeader.st = this.stId+'-'+this.stName
      else if(type == 2) this.formHeader2.st = this.stId+'-'+this.stName
      this.stDef = true
      this.stId = ''
      this.stName = ''
    }else {
      this.$message.warning('st格式错误')
    }
  }
  cancelAddGene() {
      this.geneDef = true
      this.geneId = ''
      this.geneName = ''
  }
  cancelAddSt() {
      this.stDef = true
      this.stId = ''
      this.stName = ''
  }
  /** 修改设备列表 **/
  onEdit() {
    if (this.dtu) {
      // this.collectingAddVisable = true;
      this.factorList.push(this.dtu.factors);
    } else {
      this.$message.warning("请先选择因子");
    }
  }
  /** 删除采集设备 **/
  onDelete(rowIndex: any, rowData: any) {
    this.factorList.splice(rowIndex, 1);
  }
  // 行点击获取每一行信息
  openDetails(row: any, isLineClick: any) {
    this.formTail = row;
    this.isLineClick = true;
  }
  // 传递子组件数据到父组件
  collectAdd() {
    let validateRes = false;
    //表单验证
    this.$refs[this.showForm?'formHeader':'formHeader2'].validate((result:any, errorFields:any) => {
      if (result) {
        validateRes = true;
      } else {
        console.log("error submit!!", errorFields);
        validateRes = false;
        return false;
      }
    });
    if (validateRes == false) {
      console.log("表单验证不通过！");
      return;
    }
    //设置返回数据
    let CollectingData:any = {}
    if(this.showForm) {
      CollectingData = {
        name: "",
        access_type: this.formHeader.access_type,
        st: this.formHeader.st,
        interval_collect:
          this.intervalUnit == "秒"
            ? this.formHeader.interval_collect
            : Number(this.formHeader.interval_collect) * 60,
        fail_time: this.formHeader.fail_time,
        communication_protocol: this.formHeader.communication_protocol,
        device_address: this.formHeader.device_address,
        com: this.formHeader.com,
        baudrate: this.formHeader.baudrate,
        data_bit: this.formHeader.data_bit,
        check_bit: this.formHeader.check_bit,
        stop_bit: this.formHeader.stop_bit,
        ip_addr: "",
        params: this.formHeader.params,
        factors: this.factorList,
        id: '',
      };
    }else {
      CollectingData = {
        name: "",
        access_type: this.formHeader2.access_type,
        st: this.formHeader2.st,
        interval_collect:
          this.intervalUnit == "秒"
            ? this.formHeader2.interval_collect
            : Number(this.formHeader2.interval_collect) * 60,
        fail_time: this.formHeader2.fail_time,
        communication_protocol: this.formHeader2.communication_protocol,
        device_address: this.formHeader2.device_address,
        com: '',
        baudrate: '',
        data_bit: '',
        check_bit: '',
        stop_bit: '',
        ip_addr: "",
        params: this.formHeader2.params,
        factors: this.factorList,
        id: this.formHeader2.id
      };
    }

    console.log(CollectingData);
    this.$emit(
      "newCollectingData",
      CollectingData,
      this.isEdit,
      this.currRowIndex
    );
  }
  // 采集因子列表新加
  factorsAdd(formName: string) {
    let validateRes = false;
    //表单验证
    this.$refs[formName].validate((result, errorFields) => {
      if (result) {
        validateRes = true;
      } else {
        console.log("error submit!!", errorFields);
        validateRes = false;
        return false;
      }
    });

    if (validateRes == false || this.alarmError || this.analogError) {
      console.log("表单验证不通过！");
      return;
    }
    if (!this.isLineClick) {
      let form = this.formTail;
      this.factorList.push(form);
      this.initFormTail();
    } else {
      this.initFormTail();
      this.isLineClick = false;
      (<any>this.$refs.factorList).setCurrentRow(); //清除当前选择的行
    }
  }
  /** 重置表单 */
  resetFactorForm(formName: string) {
    this.$refs[formName].resetFields();
  }
  /** 初始化表单 */
  initFormHeader() {
    this.formHeader = {
      access_type: "串口",
      data_bit: "",
      communication_protocol: "",
      st: "",
      com: "",
      stop_bit: "",
      device_address: "",
      interval_collect: "",
      baudrate: "",
      check_bit: "",
      params: "",
      fail_time: ""
    };
    this.formHeader2 = {
      access_type: "网口",
      data_bit: "",
      communication_protocol: "",
      st: "",
      com: "",
      stop_bit: "",
      device_address: "",
      interval_collect: "",
      baudrate: "",
      check_bit: "",
      params: "",
      fail_time: ""
    };
  }
  /** 初始化表单 */
  initFormTail() {
    this.formTail = {
      factor_code: "",
      factor_id: "",
      factor_alias: "",
      st: "",
      register_addr: "",
      register_length: "",
      ratio: "",
      decimals: "",
      alarm_lower: "",
      alarm_upper: "",
      is_analog: "",
      analog_lower: "",
      analog_upper: ""
    };
  }
  /** 清空表单 */
  async cleanInfo() {
    await this.initFormHeader();
    await this.initFormTail();
    this.factorList = [];
    
    this.$refs['formTail'].clearValidate()
    this.$refs['formHeader'].clearValidate()
    this.$refs['formHeader2'].clearValidate()
  }
}
</script>

<style scoped>
.divHeight {
  height: 800px;
}
.formDiv {
  width: 400px;
}
.fromLeft {
  margin-left: 10px;
  float: left;
}
.formRight {
  float: right;
  margin-right: 200px;
}
/* .mnFormHeight {
  height: 200px;
} */
.formInput {
  width: 30%;
}
.factorHeight {
  height: 300px;
}
.factorForm {
  float: left;
  width: 30%;
  margin-left: 10px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #9b9b9b;
}
</style>


