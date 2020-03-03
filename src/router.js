import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/map',
      name: 'statsMap',
      component: () => import(/* webpackChunkName: "map" */ './views/StatsMap.vue')
    },
    {
      path: '/search',
      props: (route) => ({ query: route.query.q }),
      name: 'search',
      component: () => import(/* webpackChunkName: "search" */ './views/Search.vue')
    },
    {
      path: '/trip/:id?',
      props: true,
      name: 'trips',
      component: () => import(/* webpackChunkName: "trips" */ './views/Trips.vue')
    },
    {
      path: '/:id?',
      props: true,
      name: 'home',
      component: Home
    },
    {
      path: '*',
      component: () => import(/* webpackChunkName: "404" */'./views/404.vue')
    }
  ]
})
