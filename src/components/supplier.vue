<template>
    <div class="supplier">
        <!-- 搜索框 -->
        <el-form :inline="true" :model="searchMap" ref="searchForm" style="margin-top:20px">
        <el-form-item prop="name">
            <el-input v-model="searchMap.name" placeholder="供应商名称"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEdit" prop="linkman">
            <el-input v-model="searchMap.linkman" placeholder="联系人"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEdit" prop="mobile">
            <el-date-picker v-model="searchMap.mobile" placeholder="联系电话"></el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="fetch">查询</el-button>
            <el-button v-if="!isEdit" type="primary" @click="dialogShow()">新增</el-button>
            <el-button v-if="!isEdit" @click="resetSearch('searchForm')">重置</el-button>
        </el-form-item>
        </el-form>
        <!-- 会员列表 -->
        <el-table :data="list"  :highlight-current-row="isEdit" @current-change="handleCurrentChange" 
        height="380" border style="width: 100%">
            <el-table-column type="index" label="序号" width="100px"></el-table-column>
            <el-table-column prop="name" label="供应商名称"></el-table-column>
            <el-table-column prop="linkman" label="联系人"></el-table-column>
            <el-table-column v-if="!isEdit" prop="mobile" label="联系电话"></el-table-column>
            <el-table-column v-if="!isEdit" prop="remark" label="备注信息"></el-table-column>
            <el-table-column v-if="!isEdit" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        :layout="!isEdit ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'"
        :total="total">
        </el-pagination>
        <!-- 弹出框 -->
        <el-dialog v-if="!isEdit" title="供应商编辑" :visible.sync="dialogFormVisible" width="500px">
        <el-form :model="edits" :rules="rules" ref="dialogForm" label-width="100px">
            <el-form-item label="供应商名称" prop="name">
                <el-input v-model="edits.name"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="linkman">
                <el-input v-model="edits.linkman"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
                <el-input v-model="edits.mobile"></el-input>
            </el-form-item>
            <el-form-item label="备注信息" prop="remark">
                <el-input type="textarea" v-model="edits.remark"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="edits.id === null ? addNew('dialogForm') : changeSupplier('dialogForm')">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>
<script>
import supplierApi from '@/api/supplier'

export default {
    props: {
        isEdit: Boolean
    },
    data() {
        return {
            list: [],
            pageSize: 10,
            currentPage: 1,
            total: 0,
            searchMap: {
                name: '',
                linkman: '',
                mobile: ''
            },
            dialogFormVisible: false,
            edits: {
                id: null,
                name: '',
                linkman: '',
                mobile: '',
                remark: ''
            },
            rules: {
                name: {required: true, message: '供应商名称不能为空！', trigger: 'blur'},
                linkman: {required: true, message: '联系人不能为空！', trigger: 'blur'},
                mobile: {required: true, message: '联系电话不能为空！', trigger: 'blur'}
            }
        }
    },
    created() {
        this.fetch()
    },
    methods: {
        fetch() {
            supplierApi.searchSupplier(this.currentPage, this.pageSize, this.searchMap).then(response => {
                const resp = response.data
                if (resp.flag) {
                    this.list = resp.data.rows
                    this.total = resp.data.total
                } else {
                    this.$message('获取数据失败')
                }
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.fetch()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.fetch()
        },
        resetSearch(searchForm) {
            this.$refs[searchForm].resetFields()
        },
        dialogShow() {
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.resetSearch('dialogForm')
            })
        },
        addNew(dialogForm) {
            this.$refs[dialogForm].validate(valid => {
                if (valid) {
                    supplierApi.addSupplier(this.edits).then(response => {
                        const resp = response.data
                        if(resp.flag) {
                            this.$message(resp.message)
                            this.fetch()
                        } else {
                            this.$message('新增失败')
                        }
                    })
                    this.dialogFormVisible = false
                } else {
                    return false
                }
            })   
        },
        changeSupplier(dialogForm) {
            this.$refs[dialogForm].validate(valid => {
                if (valid) {
                    supplierApi.changeById(this.edits).then(response => {
                        const resp = response.data
                        if (resp.flag) {
                            this.$message(resp.message)
                        } else {
                            this.$message('修改会员信息失败')
                        }
                    })
                    this.fetch()
                    this.dialogFormVisible = false
                } else {
                    return false
                }
            })
        },
        handleEdit(id) {
            this.dialogShow()
            supplierApi.getById(id).then(response => {
                const resp = response.data
                if (resp.flag) {
                    this.$message(resp.message)
                    this.edits = resp.data
                } else {
                    this.$message('获取会员信息失败')
                }
            })
        },
        handleDelete(id) {
            this.$confirm('确定删除此条信息？', '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                supplierApi.deleteById(id).then(response => {
                    const resp = response.data
                    if (resp.flag) {
                        this.$message(resp.message)
                    } else {
                        this.$message('删除失败')
                    }
                })
                this.fetch()
            })
        },
        handleCurrentChange(supplier) { //将当前行信息传给父组件
            this.$emit('get-Supplier', supplier)
        }
    }
}
</script>