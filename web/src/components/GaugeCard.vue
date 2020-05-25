<template>
    <el-card shadow="hover" :style="{background:background,color:color,width:width}">
        <el-row>
            <el-col :span=7>
                <i :class="icon" class="fa-3x"></i>
            </el-col>
            <el-col :span=17>
                <span style="font-size:40px">{{title}}</span>
                {{units}}
            </el-col>
        </el-row>
    </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class GaugeCard extends Vue {
    @Prop({ default: "fas fa-server" }) icon!: string
    @Prop({ default: "#418BCA" }) background!: string
    @Prop({ default: "white" }) color!: string
    @Prop({ default: 123 }) title!: string | number
    @Prop({ default: "nodes" }) units!: string
    @Prop({ default: "100%" }) width!: string
}
</script>