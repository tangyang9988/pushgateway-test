import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import ElementUI from 'element-ui' //element-ui的全部组件
// import 'element-ui/lib/theme-chalk/index.css'//element-ui的css

import { Message, Loading, Card, Button, Input, InputNumber, Select, Option, Container, Header, Aside, Main, Menu, MenuItem, Avatar, Dropdown, DropdownItem, DropdownMenu } from 'element-ui'
import { Row, Col, Table, TableColumn, Dialog, DatePicker, Pagination, Tag, Radio, Form, FormItem, ButtonGroup, MessageBox, Divider, Checkbox,CheckboxGroup,CheckboxButton,Tabs,TabPane,RadioGroup,Breadcrumb,BreadcrumbItem } from 'element-ui'
import * as filters from "./utils/time"; //过滤器
//动态管控图
const Chartkick = require('chartkick')
const VueChartkick = require('vue-chartkick')
const Chart = require('chart.js')
const infiniteScroll = require('vue-infinite-scroll')


require('@fortawesome/fontawesome-free/css/fontawesome.min.css')
require('@fortawesome/fontawesome-free/css/solid.min.css')
require('@fortawesome/fontawesome-free/css/regular.min.css')
// require('@fortawesome/fontawesome-free/css/brands.min.css')

Vue.config.productionTip = false
Vue.use(Card)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Container)
Vue.use(Main)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Radio)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Divider)
Vue.use(Avatar)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(RadioGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
//动态管控图
Vue.use(VueChartkick, { Chartkick })
// 懒加载
Vue.use(infiniteScroll)


// Vue.use(ElementUI) //使用elementUI

Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


Object.keys(filters).forEach((key: string) => {
  Vue.filter(key, (filters as any)[key]);
});
