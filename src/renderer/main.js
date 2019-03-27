import Vue from 'vue'
import axios from 'axios'
import { 
  Button, 
  Form,
  FormItem,
  Input,
  Row, 
  Col, 
  Radio,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Message,
  Select,
  Option,
} from 'element-ui'

import App from './App'
import router from './router'
import store from './store'
import '@/assets/style/reset.scss'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Radio)
Vue.use(Autocomplete)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Select)
Vue.use(Option)

Vue.prototype.$message = Message;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
