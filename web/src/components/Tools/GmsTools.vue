<template>
    <div>
        <el-card>
            <div slot="header">
                <div class="page-title">
                    <img :src="pageTitleImg" alt="">
                    <span>CRC校验工具</span>
                </div>
            </div>
            <el-input v-model="crcSource" placeholder="请输入待校验命令" type="textarea" autosize clearable></el-input>
            <br/><br/>
            <el-input v-model="crcResult" placeholder="校验结果" type="textarea" autosize readonly></el-input>
        </el-card>

        <br/>

        <el-card>
            <div slot="header">
                <div class="page-title">
                    <img :src="pageTitleImg" alt="">
                    <span>Base64->Json</span>
                </div>
            </div>
            <el-input v-model="base64" placeholder="请输入Base64" type="textarea" autosize clearable></el-input>
            <br/><br/>
            <el-input v-model="json" placeholder="Json" type="textarea" autosize clearable></el-input>
        </el-card> 
    </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import ToolService from "@/services/ToolService";
import pageTitleImg from '@/assets/images/pageTitle.png'

@Component
export default class GmsTools extends Vue {
    pageTitleImg :any = pageTitleImg
    crcSource = "" //待校验命令
    crcResult = "" //校验结果

    base64 = ""
    json = ""

    @Watch('crcSource')
    onCrcChanged(val: string) {
        if (val && val.length > 0) {
            ToolService.CrcCheck(val).then(res => {
                this.crcResult = res.data
            }).catch(err => {
                this.$message.error('CRC计算错误: ' + err)
            })
        } else {
            this.crcResult = ""
        }
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