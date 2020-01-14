import request from '@/utils/request'

export default {
    searchSupplier(page, size, searchMap) {
        return request({
            url: `/supplier/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    addSupplier(edits) {
        return request({
            url: '/supplier',
            method: 'post',
            data: edits
        })
    },
    getById(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'get'
        })
    },
    changeById(edits) {
        return request({
            url: `/supplier/${edits.id}`,
            method: 'put',
            data: edits
        })
    },
    deleteById(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'delete',
            data: id
        })
    }
}