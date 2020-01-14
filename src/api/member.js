import request from '@/utils/request'

export default {
    getMembers() {
        return request({
            url: '/member/list',
            method: 'get'
        })
    },
    search(page, size, searchMap) {
        return request({
            url: `/member/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    addMember(searchMap) {
        return request({
            url: `/member`,
            method: 'post',
            data: searchMap
        })
    },
    getById(id) {
        return request({
            url: `/member/${id}`,
            method: 'get'
        })
    },
    changeById(edits) {
        return request({
            url: `/member/${edits.id}`,
            method: 'put',
            data: edits
        })
    },
    deleteById(id) {
        return request({
            url: `/member/${id}`,
            method: 'delete',
            data: id
        })
    }

}