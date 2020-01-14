import request from '@/utils/request'

export default {
    checkPwd(userId, password) {
        return request({
            url: '/pwd',
            method: 'post',
            data: {
                userId,
                password
            }
        })
    },
    updatePwd(userId, password) {
        return request({
            url: '/pwd',
            method: 'put',
            data: {
                userId,
                password
            }
        })
    }
}