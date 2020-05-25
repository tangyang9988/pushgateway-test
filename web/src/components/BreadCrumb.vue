<template>
<div>
    <!-- separator-class="el-icon-arrow-right" -->
    <el-breadcrumb  separator="/" >
    <!-- <a href="/v/cardList">首页</a> -->
        <!-- <el-breadcrumb-item :to="{ path: '/v/cardList'  }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item v-for="bread in breadList" v-bind:key="bread" :to="{ path:   breadsName[bread] }">
            <label for="" >{{bread}}</label>
        </el-breadcrumb-item>
    </el-breadcrumb>
    <div></div>
</div>
</template>

<script lang="ts">
import { Provide, Component, Watch, Prop, Vue } from 'vue-property-decorator';

@Component
export default class BreadCrumb extends Vue {
    // TODO 将card list作为首页

    //路由name:path数组
    @Provide() private breadsName: { [index: string]: string } = {
        '首页': '/v/cardlist',
        '上位机列表': '/v/mns',
        '数采仪基本信息': '/v/rtu',
        '基础设置': '/v/bs',
        '采集设备配置':'/v/co'
    };

    //路由name数组
    @Provide() private breadList: string[] = [];

    private created() {
        this.getBreadList();
    }

    @Watch('$route')
    private getBreadList() {
        this.breadList = [];
        for (const routeInfo of this.$route.matched) {
            if (typeof routeInfo.name === 'string' && routeInfo.name !== 'home') {
                if (routeInfo.name=="项目"){
                    routeInfo.name="首页"
                }
                this.breadList.push(routeInfo.name);
                console.log("route info name:",routeInfo.name,"path:",routeInfo.path)
            }
        }
    }
}
</script>

<style scoped>
.breadcrumb {
    margin-bottom: 20px;
}
</style>
