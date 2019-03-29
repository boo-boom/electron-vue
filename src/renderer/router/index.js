import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/home'
import Edit from '@/views/edit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/edit',
      name: 'edit',
      component: Edit
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
