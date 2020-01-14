import request from '@/utils/request'

export default {
    searchGoods(page, size, searchMap) {
        return request({
            url: `/goods/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    addGoods(edits) {
        return request({
            url: '/goods',
            method: 'post',
            data: edits
        })
    },
    getById(id) {
        return request({
            url: `/goods/${id}`,
            method: 'get'
        })
    },
    changeById(edits) {
        return request({
            url: `/goods/${edits.id}`,
            method: 'put',
            data: edits
        })
    },
    deleteById(id) {
        return request({
            url: `/goods/${id}`,
            method: 'delete',
            data: id
        })
    }
}