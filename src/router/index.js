import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Page from '@/components/Page'

Vue.use(Router)

export default new Router({
    mode: 'history',
    scrollBehavior: function (to, from, savedPosition) {
        return savedPosition || { x: 0, y: 0 }
    },
    routes: [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/page/:id?',
        name: 'Page',
        component: Page,
        props: true
    }
    ]
})
