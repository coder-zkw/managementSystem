<template>
    <div class="staff">
        <!-- 搜索框 -->
        <el-form :inline="true" :model="searchMap" ref="searchForm" style="margin-top:20px">
        <el-form-item prop="user">
            <el-input v-model="searchMap.user" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="name">
            <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="fetch">查询</el-button>
            <el-button type="primary" @click="dialogShow()">新增</el-button>
            <el-button @click="resetSearch('searchForm')">重置</el-button>
        </el-form-item>
        </el-form>
        <!-- 会员列表 -->
        <el-table :data="list" height="380" border style="width: 100%">
            <el-table-column type="index" label="序号" width="100px"></el-table-column>
            <el-table-column prop="user" label="账号"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="age" label="年龄"></el-table-column>
            <el-table-column prop="mobile" label="联系电话"></el-table-column>
            <el-table-column prop="money" label="薪资"></el-table-column>
            <el-table-column prop="date" label="入职时间"></el-table-column>
            <el-table-column label="操作">
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
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
        <!-- 弹出框 -->
        <el-dialog title="员工编辑" :visible.sync="dialogFormVisible" width="500px">
        <el-form :model="edits" :rules="rules" ref="dialogForm" label-width="100px">
            <el-form-item label="账号" prop="user">
                <el-input v-model="edits.user"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="edits.name"></el-input>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input v-model="edits.age"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
                <el-input v-model="edits.mobile"></el-input>
            </el-form-item>
            <el-form-item label="薪资" prop="money">
                <el-input v-model="edits.money"></el-input>
            </el-form-item>
            <el-form-item label="入职时间" prop="date">
                <el-date-picker v-model="edits.date" type="date" value-format="yyyy-MM-dd" placeholder="选择时间"></el-date-picker>
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
import staffApi from '@/api/staff'

export default {
    data() {
        return {
            list: [],
            pageSize: 10,
            currentPage: 1,
            total: 0,
            searchMap: {
                user: '',
                name: ''
            },
            dialogFormVisible: false,
            edits: {
                id: null,
                user: '',
                name: '',
                age: '',
                mobile: '',
                money: '',
                date: ''
            },
            rules: {
                user: {required: true, message: '用户名不能为空！', trigger: 'blur'},
                name: {required: true, message: '姓名不能为空！', trigger: 'blur'}
            }
        }
    },
    created() {
        this.fetch()
    },
    methods: {
        fetch() {
            staffApi.searchStaff(this.currentPage, this.pageSize, this.searchMap).then(response => {
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
                    staffApi.addStaff(this.edits).then(response => {
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
                    staffApi.changeById(this.edits).then(response => {
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
            staffApi.getById(id).then(response => {
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
                staffApi.deleteById(id).then(response => {
                    const resp = response.data
                    if (resp.flag) {
                        this.$message(resp.message)
                    } else {
                        this.$message('删除失败')
                    }
                })
                this.fetch()
            })
        }
    }
}
</script>