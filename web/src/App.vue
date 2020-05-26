<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

html,
body,
#app {
    height: 100%;
}

body {
    margin: 0;
    overflow: auto;
}

/*修改滚动条样式*/
*::-webkit-scrollbar{
    width:8px;
    height:8px;
}
*::-webkit-scrollbar-track{
    background: #fff;
    border-radius: 2px;
}
*::-webkit-scrollbar-thumb{
    background: rgb(200, 200, 200);
    border-radius: 10px;
}
*::-webkit-scrollbar-thumb:hover{
    background: rgb(131, 131, 131);
}
*::-webkit-scrollbar-corner{
    background: #179a16;
}
</style>

<style scoped>
#app >>> .el-table__header-wrapper th {
    /* 所有表头的背景色 */
    background-color: #f5f7fa;
}
</style>
