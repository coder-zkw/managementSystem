<template>
    <div class="member">
        <!-- 搜索框 -->
        <el-form :inline="true" :model="searchMap" ref="searchForm" style="margin-top:20px">
        <el-form-item prop="cardNum">
            <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
        </el-form-item>
        <el-form-item prop="name">
            <el-input v-model="searchMap.name" placeholder="会员姓名"></el-input>
        </el-form-item>
        <el-form-item prop="birthday">
            <el-date-picker v-model="searchMap.birthday" type="date" value-format="yyyy-MM-dd" placeholder="会员生日"></el-date-picker>
        </el-form-item>
        <el-form-item prop="payType">
            <el-select v-model="searchMap.payType" placeholder="支付方式">
            <el-option v-for="item in payTypes" :key="item.num" :value="item.num" :label="item.type"></el-option>
            <!-- <el-option value="1" label="现金"></el-option>
            <el-option value="2" label="微信"></el-option>
            <el-option value="3" label="支付宝"></el-option>
            <el-option value="4" label="银行卡"></el-option> -->
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getList()">查询</el-button>
            <el-button type="primary" @click="dialogShow()">新增</el-button>
            <el-button @click="resetSearch('searchForm')">重置</el-button>
        </el-form-item>
        </el-form>
        <!-- 会员列表 -->
        <el-table :data="list" height="380" border style="width: 100%">
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
            <el-table-column prop="name" label="会员姓名" width="100px"></el-table-column>
            <el-table-column prop="birthday" label="会员生日"></el-table-column>
            <el-table-column prop="phone" label="电话号码"></el-table-column>
            <el-table-column prop="integral" label="可用积分" width="100px"></el-table-column>
            <el-table-column prop="money" label="可用金额" width="100px"></el-table-column>
            <el-table-column prop="payType" label="支付方式" width="100px">
                <template slot-scope="scope">
                    <span>{{scope.row.payType|payText}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="家庭住址"></el-table-column>
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
        <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
        <el-form :model="edits" :rules="rules" ref="dialogForm" label-width="100px">
            <el-form-item label="会员卡号" prop="cardNum">
                <el-input v-model="edits.cardNum"></el-input>
            </el-form-item>
            <el-form-item label="会员姓名" prop="name">
                <el-input v-model="edits.name"></el-input>
            </el-form-item>
            <el-form-item label="会员生日" prop="birthday">
                <el-date-picker v-model="edits.birthday" type="date" value-format="yyyy-MM-dd" placeholder="会员生日"></el-date-picker>
            </el-form-item>
            <el-form-item label="电话号码" prop="phone">
                <el-input v-model="edits.phone"></el-input>
            </el-form-item>
            <el-form-item label="可用积分" prop="integral">
                <el-input v-model="edits.integral"></el-input>
            </el-form-item>
            <el-form-item label="可用金额" prop="money">
                <el-input v-model="edits.money"></el-input>
            </el-form-item>
            <el-form-item label="支付方式" prop="payType">
            <el-select v-model="edits.payType" placeholder="支付方式">
                <el-option value="1" label="现金"></el-option>
                <el-option value="2" label="微信"></el-option>
                <el-option value="3" label="支付宝"></el-option>
                <el-option value="4" label="银行卡"></el-option>
            </el-select>
        </el-form-item>
            <el-form-item label="家庭住址" prop="address">
                <el-input type="textarea" v-model="edits.address"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="edits.id === null ? addNew('dialogForm') : changeMember('dialogForm')">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>
<script>
import memberApi from '@/api/member.js'

const payTypes = [
    {num: 1, type: '现金'},
    {num: 2, type: '微信'},
    {num: 3, type: '支付宝'},
    {num: 4, type: '银行卡'}
]
export default {
    data() {
        return {
            list: [],
            payTypes: payTypes,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            searchMap: {
                cardNum: '',
                name: '',
                birthday: '',
                payType: ''
            },
            dialogFormVisible: false,
            rules: {
                cardNum: {required: true, message: "会员卡号不能为空！", trigger: 'blur'},
                name: {required: true, message: "会员姓名不能为空！", trigger: 'blur'},
                birthday: {required: true, message: "会员生日不能为空！", trigger: 'change'},
                payType: {required: true, message: "支付方式不能为空！", trigger: 'change'}
            },
            edits: {
                id: null,
                cardNum: '',
                name: '',
                birthday: '',
                phone: '',
                integral: '',
                money: '',
                payType: '',
                address: ''
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            //memberApi.getMembers().then(response => {
            memberApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
                const resp = response.data
                this.list = resp.data.rows
                this.total = resp.data.total
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        resetSearch(searchForm) {
            this.$refs[searchForm].resetFields()
        },
        addNew(dialogForm) {
            this.$refs[dialogForm].validate(valid => {
                if (valid) {
                    memberApi.addMember(this.edits).then(response => {
                        const resp = response.data
                        if(resp.flag) {
                            this.$message(resp.message)
                            this.getList()
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
        dialogShow() {
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.resetSearch('dialogForm')
            })
        },
        handleEdit(id) {
            this.dialogShow()
            memberApi.getById(id).then(response => {
                const resp = response.data
                if (resp.flag) {
                    this.$message(resp.message)
                    this.edits = resp.data
                } else {
                    this.$message('获取会员信息失败')
                }
            })
        },
        changeMember(dialogForm) {
            this.$refs[dialogForm].validate(valid => {
                if (valid) {
                    memberApi.changeById(this.edits).then(response => {
                        const resp = response.data
                        if (resp.flag) {
                            this.$message(resp.message)
                        } else {
                            this.$message('修改会员信息失败')
                        }
                    })
                    this.getList()
                    this.dialogFormVisible = false
                } else {
                    return false
                }
            })
        },
        handleDelete(id) {
            this.$confirm('确定删除此条信息？', '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                memberApi.deleteById(id).then(response => {
                    const resp = response.data
                    if (resp.flag) {
                        this.$message(resp.message)
                    } else {
                        this.$message('删除失败')
                    }
                })
            })
            this.getList()
        }
    },
    filters: {
        payText(paynum) {
            switch (paynum) {
                case '1': return '现金'
                    break;
                case '2': return '微信'
                    break;
                case '3': return '支付宝'
                    break;
                case '4': return '银行卡'
                    break;
                default: break;
            }
        }
    }
}
</script>