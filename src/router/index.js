import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ottHome from '@/components/ott_home/ott_home'
import subSeries from '@/components/subSeries/subSeries'
import secondPage from '@/components/secondPage/secondPage'
import mp from '@/components/mp/mp'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/ott_home',
      name: 'ottHome',
      component: ottHome
    },
    {
      path: '/subSeries',
      name: 'subSeries',
      component: subSeries
    },
    {
      path: '/secondPage',
      name: 'secondPage',
      component: secondPage
    },
    {
      path: '/mp',
      name: 'mp',
      component: mp
    },
    {
      path: '*',
      component: ottHome
    }
  ]
})
