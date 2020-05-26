<template>
  <div class="formHeight">
    <el-card>
      <el-form
        :model="MNForm"
        :label-position="labelPosition"
        label-width="180px"
        :rules="rulesf"
        ref="MNForm"
        size="mini"
        class="mnFormHeight"
      >
        <div class="fromLeft formDiv" style="float:left">
          <el-form-item label="MN:" prop="mn">
            <el-input v-model="MNForm.mn"></el-input>
          </el-form-item>
          <el-form-item label="上位机IP和端口号:" prop="address">
            <el-input v-model="MNForm.address"></el-input>
          </el-form-item>
          <el-form-item label="上传协议:" prop="protocal">
            <el-select v-model="MNForm.protocal" placeholder="请选择">
              <el-option
                v-for="item in proOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-button v-if="isMnmodify" type="primary" @click="MNAdd('MNForm')">修改</el-button>
            <el-button v-else type="primary" @click="MNAdd('MNForm')">新增</el-button>
            <el-button>取消</el-button>
          </el-form-item> -->
        </div>
        <div class="formRight formDiv">
          <el-form-item label="上传密码:" prop="pw">
            <el-input v-model="MNForm.pw"></el-input>
          </el-form-item>

          <el-form-item label="上传间隔:" prop="interval">
            <el-input v-model="MNForm.interval"></el-input>
          </el-form-item>

          <el-form-item label="开启心跳:" prop="isHeart">
            <el-radio-group v-model="MNForm.isHeart">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="心跳间隔:" prop="heartInterval">
            <el-input v-model="MNForm.heartInterval"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <el-card style="margin-top:8px;">
      <!-- 上传编码修改 -->
      <h3>上传编码修改</h3>
      <div class="factorHeight">

        <div class="factorTable">
          <el-table
            :data="factorTableData"
            border
            style="width: 100%"
            max-height="250"
            size="mini"
            @row-click="openDetails"
          >
            <el-table-column prop="factorSt" label="ST系统编码" width="90"></el-table-column>
            <el-table-column prop="factorCode" label="因子code"></el-table-column>
            <el-table-column prop="uploadSt" label="上传ST"></el-table-column>
            <el-table-column prop="uploadFactorCode" label="上传因子code" width="100"></el-table-column>
            <el-table-column prop="ratio" label="系数"></el-table-column>
            <el-table-column prop="decimals" label="小数位数"></el-table-column>
            <el-table-column prop="num" label width="180">
              <!-- <el-table-column prop="mn" v-if="mnHide"></el-table-column> -->
              <template slot-scope="scope">
                <el-button size="mini" @click="editRow(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="factorForm">
          <!-- :rules="rules" -->
          <el-form
            :model="factorForm"
            ref="factorForm"
            label-width="110px"
            class="demo-ruleForm"
            :rules="factorRules"
            size="mini"
          >
            <div>
              <el-form-item label="原ST:" prop="factorSt">
                <el-select
                  v-model="factorForm.factorSt"
                  placeholder="请选择"
                  @change="selectFactorSt(factorForm.factorSt)"
                >
                  <el-option
                    v-for="item in STList"
                    :key="item.name"
                    :label="item.id+'-'+item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="原因子:" prop="factorCode">
                <el-select v-model="factorForm.factorCode" placeholder="请选择">
                  <el-option
                    v-for="item in factorOptions"
                    :key="item.value"
                    :label="item.factor_code+'-'+item.factor_name"
                    :value="item.factor_code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="上传ST:" prop="uploadSt">
                <el-select v-model="factorForm.uploadSt" placeholder="请选择">
                  <el-option
                    v-for="item in uploadStList"
                    :key="item.name"
                    :label="item.id+'-'+item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="上传因子编码:" prop="uploadFactorCode">
                <el-input v-model="factorForm.uploadFactorCode"></el-input>
              </el-form-item>
            </div>

            <el-form-item label="换算系数:" prop="ratio">
              <el-input v-model="factorForm.ratio"></el-input>
            </el-form-item>
            <el-form-item label="小数位数:" prop="decimals">
              <el-select v-model="factorForm.decimals" placeholder="请选择">
                <el-option
                  v-for="item in decimalsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-if="!isModify" @click="saveToFactorTable('factorForm',true)">添加因子</el-button>
              <el-button type="primary" v-else @click="saveToFactorTable('factorForm',true)">修改因子</el-button>
              <el-button @click="resetFactorForm('factorForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

      </div>
    </el-card>
    
    <div style="display:flex;justify-content:center;margin-top: 10px">
      <el-button size="small" v-if="isMnmodify" type="primary" @click="MNAdd('MNForm')">修改</el-button>
      <el-button size="small" v-else type="primary" @click="MNAdd('MNForm')">新增</el-button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import MnList from "./MNList2.vue";
import RtuService from "@/services/RtuService";

@Component({
  components: {
    MnList: MnList
  }
})
export default class MNAdd extends Vue {
  @Prop({ default: false }) visible!: boolean;
  @Prop({ default: null }) dtu!: any; //从父组件获取dtu
  @Prop({ type: Object, default: null }) mnobj!: any; //从父组件获取一个上位机信息和它的因子信息
  @Prop({  default: false }) isMnmodify!: boolean; //判断是修改还是添加

  // @Watch("visible")
  @Watch('visible')
  onVisibleChanged(val: boolean, oldVal: boolean) {
    
      console.log(
      "监听 visible 变化:",
      val,
      "old val:",
      oldVal,
      "当前ismnmodify状态：",
      this.isMnmodify,
       "mn:",
        this.MNForm
    );
    if (this.isMnmodify == true) {
      console.log("当前是修改页面");
      let oldMn = {
        mn: this.mnobj.mn,
        pw: this.mnobj.pw,
        address: this.mnobj.ip_addr,
        interval: this.mnobj.interval_upload,
        protocal: this.mnobj.hj_version,
        heartInterval: this.mnobj.interval_heartbeat,
        isHeart: this.mnobj.is_open_heartbeat,
        is_upload: this.mnobj.is_upload,
        is_upload_device_info: this.mnobj.is_upload_device_info
      };
      this.MNForm = oldMn;
      this.factorTableData = this.mnobj.uploadCodes;
      this.mnListRowIndex = this.mnobj.rowIndex;
      console.log(
        "mn修改，从父页面接收的数据并整理如下，",
        "mn:",
        this.MNForm,
        "factor table:",
        this.factorTableData,
        "row index:",
        this.mnobj.rowIndex,
        "is mn modify:",
        this.isMnmodify
      );
    } else {
      console.log("当前是添加页,清空之前内容！");
      this.cleanInfo();
      const ref: any = this.$refs['MNForm']
      ref.resetFields()
    }
    //无论添加还是修改都要初始化因子表单
    this.initFactorForm()
    //按钮文字修改
    this.isModify=false;
  }


  labelPosition = "right";
  mnHide = false;

  STList:any = [];
  uploadStList:any = [];
  factorCodes = [];
  factorMap = new Map();
  factorOptions = [];
  isModify = false;
  mnListRowIndex = -1;

  MNForm = {
    mn: "网关",
    pw: "22ii98",
    address: "localhost:1090",
    interval: 20,
    protocal: "",
    heartInterval: 10,
    isHeart: 1
  };
  factorTableData:any = [];
  factorForm:any = {
    factorSt: "",
    uploadSt: "",
    factorCode: "",
    uploadFactorCode: "",
    ratio: 1,
    decimals: 0,
    isModifySt: 0,
    mn: ""
  };
  decimalsOptions = [
    {
      value: "1",
      label: 1
    },
    {
      value: "2",
      label: 2
    },
    {
      value: "3",
      label: 3
    },
    {
      value: "4",
      label: 4
    },
    {
      value: "5",
      label: 5
    },
    {
      value: "6",
      label: 6
    },
    {
      value: "7",
      label: 7
    },
    {
      value: "8",
      label: 8
    }
  ];

  checkInterval = (rule: any, value: any, callback: any) => {
    if (!/^[0-9]{0,5}$/.test(value)) {
      callback(new Error("必须为5位以内的正整数"));
    } else {
      callback();
    }
  }
  //表单验证
  rulesf = {
    name: [
      { required: true, message: "请输入名称", trigger: "blur" },
      { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
    ],
    pw: [
      { required: true, message: "请输入密码", trigger: "blur" },
      { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
    ],
    address: [
      { required: true, message: "请输入ip和端口号", trigger: "blur" },
      { min: 3, max: 25, message: "长度在 3 到 25 个字符", trigger: "blur" }
    ],
    interval: [
      { required: true, message: "请输入间隔", trigger: "blur" },
      { validator: this.checkInterval, trigger: "blur" }
    ],
    protocal: [{ required: true, message: "请选择协议", trigger: "change" }],
    heartInterval: [
      { required: true, message: "请输入心跳间隔", trigger: "blur" },
      { validator: this.checkInterval, trigger: "blur" }
    ],
    isHeart: [
      { required: true, message: "请选择是否开启心跳间隔", trigger: "change" }
    ]
  };
  //因子表单验证
  factorRules = {
    factorSt: [{ required: true, message: "请选择原ST", trigger: "change" }],
    factorCode: [
      { required: true, message: "请选择原因子", trigger: "change" }
    ],
    uploadSt: [{ required: true, message: "请选择上传ST", trigger: "change" }],
    decimals: [
      { required: true, message: "请选择小数位数", trigger: "change" }
    ],
    uploadFactorCode: [
      { required: true, message: "请输入上传因子编码", trigger: "blur" }
    ],
    ratio: [{ required: true, message: "请输入换算系数", trigger: "blur" },
      { validator: this.checkInterval, trigger: "blur" }]
  };
  proOptions = [
    {
      value: "HJ212-2017",
      label: "HJ212-2017"
    },
    {
      value: "modbus-rtu",
      label: "modbus-rtu"
    }
  ];
  //向父组件发送MNForm数据
  MNAdd(formName: string) {
    
    console.log("进行Mnform校验……")
    let validateRes = false;
    //表单验证
    
    const ref: any = this.$refs[formName]
    ref.validate((result:any, errorFields:any) => {
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
    let MNData = {
      mn: this.MNForm.mn,
      pw: this.MNForm.pw,
      ip_addr: this.MNForm.address,
      interval_upload: this.MNForm.interval,
      hj_version: this.MNForm.protocal,
      interval_heartbeat: this.MNForm.heartInterval,
      is_open_heartbeat: this.MNForm.isHeart,
      is_upload: 1,
      is_upload_device_info: 1,

      uploadCodes: this.factorTableData
    };

    console.log(
      "开始向父组件发送数据：",
      MNData,
      "is mn modify:",
      this.isMnmodify,
      "第几行：",
      this.mnListRowIndex
    );
    this.$emit("newMNFactor", MNData, this.isMnmodify, this.mnListRowIndex);
  }
  mounted() {
    console.log(
      "当前是mounted，从父页面接收的数据并整理如下，",
      "mn:",
      this.MNForm,
      "factor table:",
      this.factorTableData,
      "row index:",
      this.mnobj.rowIndex,
      "is mn modify:",
      this.isMnmodify,
      "visible:",
      this.visible
    );
    if (this.isMnmodify == true) {
      console.log("当前是修改页面");
      let oldMn = {
        mn: this.mnobj.mn,
        pw: this.mnobj.pw,
        address: this.mnobj.ip_addr,
        interval: this.mnobj.interval_upload,
        protocal: this.mnobj.hj_version,
        heartInterval: this.mnobj.interval_heartbeat,
        isHeart: this.mnobj.is_open_heartbeat,
        is_upload: this.mnobj.is_upload,
        is_upload_device_info: this.mnobj.is_upload_device_info
      };
      this.MNForm = oldMn;
      this.factorTableData = this.mnobj.uploadCodes;
      this.mnListRowIndex = this.mnobj.rowIndex;
      console.log(
        "当前是mn修改页，从父页面接收的数据并整理如下，",
        "mn:",
        this.MNForm,
        "factor table:",
        this.factorTableData,
        "row index:",
        this.mnobj.rowIndex,
        "is mn modify:",
        this.isMnmodify
      );
    } else {
      console.log(
        "当前是mn添加页",
        "mn:",
        this.MNForm,
        "factor table:",
        this.factorTableData,
        "row index:",
        this.mnobj.rowIndex,
        "is mn modify:",
        this.isMnmodify
      );
    }
    //页面第一次初始化，判断是否修改页

    this.getStList();
    // this.factorTableData=this.dtu; GetSTList
    //console.log("dtu:",this.dtu,"table:",this.factors)
  }
  getStList() {
    console.log("mn:", this.dtu);
    RtuService.GetSTList(this.dtu)
      .then(res => {
        console.log("ST list:", res.data);
        //ST列表
        let sts = res.data.st;
        for (let j = 0, len = sts.length; j < len; j++) {
          this.STList.push(sts[j]);
          this.uploadStList.push(sts[j]);
        }

        //因子列表 factor_code factor_name

        for (var factorKey in res.data.configuredFactors) {
          console.log(
            "因子列表：",
            factorKey + " ：" + res.data.configuredFactors[factorKey]
          );
          this.factorMap.set(factorKey, res.data.configuredFactors[factorKey]);
        }
      })
      .catch(err => {
        this.$message.error("加载系统编码消息错误:" + err);
      });
  }
  //原ST变化后的change事件
  selectFactorSt(factorSt: string) {
    this.factorForm.factorCode = "";
    this.factorOptions = this.factorMap.get(factorSt);
  }
  saveToFactorTable(formName: string, isModifyFactor: boolean) {
    let validateRes = false;
    //表单验证
    const ref: any = this.$refs[formName]
    ref.validate((result:any, errorFields:any) => {
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

    //判断ST是否变化
    if (this.factorForm.factorSt!=this.factorForm.uploadSt){
      this.factorForm.isModifySt=1;
    }

    //判断是添加还是修改
    console.log("is modify:", this.isModify);
    if (this.isModify == false) {
      this.factorForm.mn = this.dtu;
      let factorRow = this.factorForm;
      this.factorTableData.push(factorRow);
      this.initFactorForm();
    } else {
      this.initFactorForm();
      this.isModify = false;
    }
    console.log("is modify then:", this.isModify);
  }
  resetFactorForm(formName: string) {
    const ref: any = this.$refs[formName]
    ref.resetFields();
  }
  //删除表格中的一行
  deleteRow(rowIndex: any, rowData: any) {
    console.log("删除选中的第", rowIndex, "行！");
    this.factorTableData.splice(rowIndex, 1);
  }
  //修改选中的行
  editRow(rowIndex: any, rowData: any) {
    this.factorForm = {};
    this.factorForm = rowData;
    this.factorForm.isModifySt = true;
  }
  openDetails(row: any) {
    this.factorForm = {};
    this.factorForm = row;
    this.isModify = true;
  }

  initFactorForm() {
    this.factorForm = {
      factorSt: "",
      uploadSt: "",
      factorCode: "",
      uploadFactorCode: "",
      ratio: 1,
      decimals: 0,
      isModifySt: 0
    };
  }

  initMnForm(){
    this.MNForm = {
    mn: "网关",
    pw: "22ii98",
    address: "localhost:1090",
    interval: 20,
    protocal: "",
    heartInterval: 10,
    isHeart: 1
  }
  }
  //填充上位机信息
  initMn(mnInfo: any) {
    this.MNForm = mnInfo;
  }
  //填充因子信息
  //清空页面信息
  cleanInfo(){
    
    this.initMnForm();
    this.initFactorForm();
    this.factorTableData=[];
    console.log("factor table length:",this.factorTableData.length)
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
.mnFormHeight {
  height: 200px;
}
.formInput {
  width: 30%;
}

.factorHeight {
  /* height: 300px; */
  display: flex;
  justify-content: space-between;
}
.factorTable {
  width: 60%;
}
.factorForm {
  float: left;
  width: 30%;
  margin-right: 50px;
  
}
.factorForm .el-input,.el-select {
  width: 200px;
}
</style>


