import request from '@/utils/request'

export default {
    searchStaff(page, size, searchMap) {
        return request({
            url: `/staff/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    addStaff(edits) {
        return request({
            url: '/staff',
            method: 'post',
            data: edits
        })
    },
    getById(id) {
        return request({
            url: `/staff/${id}`,
            method: 'get'
        })
    },
    changeById(edits) {
        return request({
            url: `/staff/${edits.id}`,
            method: 'put',
            data: edits
        })
    },
    deleteById(id) {
        return request({
            url: `/staff/${id}`,
            method: 'delete',
            data: id
        })
    }
}