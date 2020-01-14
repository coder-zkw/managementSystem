import Router from './router'
import {getUserInfo} from '@/login/login.js'

Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('user-token')
    if (!token) {
        if (to.path !== '/login') {
            next({path: '/login'})
        } else {
            next()
        }
    } else {
        if (to.path === 'login') {
            next()
        } else {
            const user = localStorage.getItem('user-info')
            if (user) {
                next()
            } else {
                getUserInfo(token).then(response =>　{
                    const resp = response.data
                    if (resp) {
                        localStorage.setItem('user-info', JSON.stringify(resp.data))
                        next()
                    } else {
                        next({path: '/login'})
                    }
                })
            }
        }
    }
})