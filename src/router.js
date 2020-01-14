import Vue from 'vue'
import Router from 'vue-router'
import Login from './login/index'
import Layout from '@/components/layout.vue'
import Home from '@/components/home.vue'
import Member from '@/components/member.vue'
import Supplier from '@/components/supplier.vue'
import Goods from '@/components/goods.vue'
import Staff from '@/components/staff.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: Home,
          meta: {title: "首页"}
        }
      ]
    },
    {
      path: '/member',
      component: Layout,
      children: [
        {
          path: '/',
          component: Member,
          meta: {title: '会员管理'}
        }      
      ]
    },
    {
      path: '/supplier',
      component: Layout,
      children: [
        {
          path: '/',
          component: Supplier,
          meta: {title: '供应商管理'}
        }      
      ]
    },
    {
      path: '/goods',
      component: Layout,
      children: [
        {
          path: '/',
          component: Goods,
          meta: {title: '商品管理'}
        }      
      ]
    },
    {
      path: '/staff',
      component: Layout,
      children: [
        {
          path: '/',
          component: Staff,
          meta: {title: '员工管理'}
        }      
      ]
    }
  ]
})

export default router