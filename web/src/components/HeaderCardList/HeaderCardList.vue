<template>
<div>HeaderCardList============================</div>
</template>

 <script type="text/javascript">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class HeaderCardList extends Vue { 
  //这里需要将模块引出，可在其他地方使用
    
    data (){ 
    //注意：data即使不需要传数据，也必须return,否则会报错
      return {
        message: "cardlist!"
      }
    }
  }
</script> 