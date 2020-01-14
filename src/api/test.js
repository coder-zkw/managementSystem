import request from '@/utils/request'

request.get('/db.json').then(response => {
    console.log('1',response.data)
})

export default {
    getList () {
        const req = request({
            method: 'get',
            url: '/db.json'
        })
        return req
    }
}