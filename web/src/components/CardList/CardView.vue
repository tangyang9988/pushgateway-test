<template>
  <el-form ref="form" :rules="formRule" :model="dtu" size="small" style="margin-left:20%" label-width="100px">
    <el-form-item label="设备名称:" prop="RtuName">
      <el-input v-model="dtu.RtuName" style="width:200px"></el-input>
    </el-form-item>
    <el-form-item label="设备MN:" prop="RtuMn">
      <el-input v-model="dtu.RtuMn" style="width:200px;" :disabled="isAdd?false:true"></el-input>
    </el-form-item>
    <el-form-item label="访问密码:">
      <el-input v-model="dtu.RtuPw" style="width:200px"></el-input>
    </el-form-item>
    <el-form-item label="所属项目:" prop="ProjectId">
      <el-select
        v-model="dtu.ProjectId"
        placeholder="请选择"
        style="width:200px;"
        @change="currentSel"
      >
        <el-option
          v-for="(item, index) in projects"
          :key="index"
          :label="item.ProjectName"
          :value="item.Id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="save" type="primary" icon="fas fa-save fa-fw" style="margin-left:22%;">保存</el-button>
      <el-button @click="clear" type="primary" icon="fas fa-save fa-fw">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import CardList from "./CardList.vue";

import DtuService from "@/services/DtuService";

@Component({
  components: { CardList: CardList }
})
export default class CardView extends Vue {
  data() {
    return {};
  }
  proId = "";

  @Prop({ default: [] }) projects!: any; //项目列表
  @Prop({ default: null }) dtu!: any; //当前设备卡片
  @Prop({ default: null }) isAdd!: boolean;
  @Prop({ default: false }) isClear!: boolean;// 重置验证

  @Watch("dtu")
    isAddChange(newVal: boolean, oldVal: boolean) {
      // 如果isClear变化，重置表单验证
      this.$refs['form'].clearValidate()
    }

  formRule:object = {
    RtuName: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
    RtuMn: [{ required: true, message: "请输入设备MN", trigger: "blur" }],
    // RtuPw: [{ required: true, message: "请输入访问密码", trigger: "blur" }],
    ProjectId: [{ required: true, message: "请选择所属项目", trigger: "blur" }],
  }

  loadProjects() {
    DtuService.currentList()
      .then(res => {
        this.$set(this, "projects", res.data);
        // console.log(this.projects);
      })
      .catch(err => {
        this.$message.error("加载项目列表错误:" + err);
      });
  }
  // 获取所选项目proId
  currentSel(row: any) {
    this.proId = row;
  }
  // 保存
  save() {
    if (!this.isAdd) {
      this.$refs['form'].validate((valid:boolean) => {
        if (valid) {
          DtuService.Modify(
            this.dtu
          ).then(res => {
            this.$message.success("设备保存成功")
          }).catch(err => {
            this.$message.error("设备保存失败:" + err)
          })
        } else {
          this.$message.error("验证失败")
          return false;
        }
      })
    } else {
      this.$refs['form'].validate((valid:boolean) => {
        if (valid) {
          DtuService.Add(
            this.dtu
          ).then(res => {
            this.$message.success("新建设备成功")
          }).catch(err => {
            this.$message.error("新建设备失败:" + err)
          })
        } else {
          this.$message.error("验证失败")
          return false;
        }
      })
    }
  }
  clear() {

  }
  mounted() {
    // console.log(this.isAdd)
    this.loadProjects()
    // console.log(this.dtu.RtuMn+"111")
  }
}
</script>


