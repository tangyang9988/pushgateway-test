<template>
    <div>
        
        <el-card>
            <div slot="header">
                <div class="page-title">
                    <img src="@/assets/images/pageTitle.png" alt="">
                    <span>用户管理</span>
                </div>
            </div>

            <div>

                <!-- 工具条 -->
                <div>
                    <el-button @click="onCreate" type="primary" icon="fas fa-plus-circle fa-fw">新增用户</el-button>
                    <!-- <el-button @click="onEdit" type="primary" icon="fas fa-edit fa-fw">编辑</el-button>
                    <el-button @click="onDelete" type="primary" icon="fas fa-minus-circle fa-fw">删除</el-button>
                    <el-button @click="onResetPwd" type="primary" icon="fas fa-sync-alt fa-fw">重置密码</el-button> -->
                    <el-button @click="load" type="primary" icon="fas fa-sync-alt fa-fw">刷新</el-button>
                </div>
                <br/>
                <!-- 表格 -->
                <el-table ref="table" :data="users" v-loading="loading" size="small" @current-change="onCurrentChanged"
                    border stripe highlight-current-row readonly>
                    <el-table-column type="index" :index="getRowIndex" label="序号"></el-table-column>
                    <el-table-column prop="RealName" label="姓名" width="180"></el-table-column>
                    <el-table-column prop="Username" label="用户名" width="170"></el-table-column>
                    <el-table-column prop="Role" label="角色" :formatter="formatRole" width="70"></el-table-column>
                    <el-table-column label="查看项目">
                        <template slot-scope="scope">
                            <!-- <el-tag v-for="item in scope.row.ProjectIds" :key="item">
                                {{ item }}
                            </el-tag> -->
                            <el-select disabled v-model="scope.row.ProjectIds" multiple placeholder=" " style="width:100%">
                                <el-option v-for="item in projects" :key="item.Id"
                                    :label="item.ProjectName" :value="item.Id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="400" align="center">
                    <el-button @click="onEdit" type="primary" size="small">编辑</el-button>
                    <el-button @click="onDelete" type="primary" size="small">删除</el-button>
                    <el-button @click="onResetPwd" type="primary" size="small">重置密码</el-button>        
                    </el-table-column>

                </el-table>
                <!-- 分页 -->
                <el-pagination layout="prev, pager, next, total"
                    :page-size="pageSize" :current-page.sync="page" :total="total"
                    @current-change="load"></el-pagination>
                <!-- 对话框 -->
                <el-dialog title="用户信息" :visible.sync="dlgVisible" width="600px">
                    <user-view :user="curUser" :projects="projects" :visible="dlgVisible"></user-view>
                </el-dialog>
                <!--创建用户对话框-->
                <el-dialog title="重置密码" :visible.sync="dlgResetVisible" width="350px">
                    <span>
                        <label>密码:</label>
                        <el-input v-model="dlgPassword" size="small" type="password">
                        </el-input>
                    </span>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="text" size="small" @click="dlgResetVisible = false">取消</el-button>
                        <el-button type="primary" size="small" @click="doResetPwd">确定</el-button>
                    </span>
                </el-dialog>
            </div>
        </el-card>

    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ProjectService from "@/services/ProjectService"
import UserService from "@/services/UserService";
import UserView from "./UserView.vue";

@Component({
    components: { UserView: UserView }
})
export default class GmsUsers extends Vue {
    loading = false
    users = [] //用户列表
    projects = [] //项目列表
    pageSize = 10
    page = 1
    total = 0
    curUser: any = null //当前选择的用户
    dlgVisible = false
    dlgResetVisible = false
    dlgPassword = ""

    loadProjects() {
        ProjectService.List().then(res => {
            this.$set(this, 'projects', res.data)
        }).catch(err => {
            this.$message.error("加载项目列表错误:" + err)
        })
    }

    load() {
        this.loading = true;
        UserService.Query(this.pageSize, this.page).then(res => {
            this.total = res.total
            this.$set(this, 'users', res.data)
            this.loading = false
        }).catch(err => {
            this.loading = false
            this.$message.error("加载用户错误: " + err)
        });
    }

    getRowIndex(index: number): number {
        return (index + 1) + (this.page - 1) * this.pageSize
    }

    onCurrentChanged(curRow: any, oldRow: any) {
        this.curUser = curRow
    }

    onCreate() {
        (<any>this.$refs.table).setCurrentRow() //清除当前选择的行
        this.curUser = { RealName: "", Username: "", Role: 2, ProjectIds: [] }
        this.dlgVisible = true
    }

    onEdit() {
        if (this.curUser) {
            this.dlgVisible = true
        } else {
            this.$message.warning("请先选择用户")
        }
    }

    onDelete() {
        if (!this.curUser) {
            this.$message.warning("请选择待删除的用户")
            return
        }
        this.$confirm('确认删除选择的用户吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            UserService.Delete(this.curUser.Id).then(res => {
                this.$message.success("删除用户成功")
                this.load() //暂简单直接刷新
            }).catch(err => {
                this.$message.error("删除用户失败:" + err)
            })
        }).catch(() => { })
    }

    onResetPwd() {
        if (!this.curUser) {
            this.$message.warning("请先选择用户")
            return
        }
        this.dlgResetVisible = true
    }

    doResetPwd() {
        this.dlgResetVisible = false
        UserService.ResetPwd(this.curUser.Id, this.dlgPassword).then(res => {
            this.$message.success("重置密码成功")
        }).catch(err => {
            this.$message.error("重置密码失败:" + err)
        })
    }

    /** 格式化显示角色 */
    formatRole(row: any, col: any, cellValue: any, index: number) {
        if (cellValue === 2) return "运维人员"
        else if (cellValue === 3) return "访问人员"
        return "未知角色"
    }

    mounted() {
        this.loadProjects()
        this.load()
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