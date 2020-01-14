<template>
    <div class="goods">
        <!-- 搜索框 -->
        <el-form :inline="true" :model="searchMap" ref="searchForm" style="margin-top:20px">
        <el-form-item prop="name">
            <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item prop="code">
            <el-input v-model="searchMap.code" placeholder="商品编码"></el-input>
        </el-form-item>
        <el-form-item prop="supplierName">
            <el-input readonly @click.native="dialogSelectVisible=true"  v-model="searchMap.supplierName" 
            placeholder="选择供应商"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="fetch">查询</el-button>
            <el-button type="primary" @click="dialogShow()">新增</el-button>
            <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
        </el-form-item>
        </el-form>
        <!-- 会员列表 -->
        <el-table :data="list" height="380" border style="width: 100%">
            <el-table-column type="index" label="序号" width="100px"></el-table-column>
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column prop="code" label="商品编码"></el-table-column>
            <el-table-column prop="spec" label="商品。。"></el-table-column>
            <el-table-column prop="retailPrice" label="商品零售价"></el-table-column>
            <el-table-column prop="purchasePrice" label="商品进价"></el-table-column>
            <el-table-column prop="storageNum" label="商品库存"></el-table-column>
            <el-table-column prop="supplierName" label="供应商名称"></el-table-column>
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
        <!-- 供应商选择弹框 -->
        <el-dialog title="供应商选择" :visible.sync="dialogSelectVisible" width="500px">
            <supplier @get-Supplier="selectSupplier" :isEdit="true"></supplier>
        </el-dialog>
        <!-- 新增弹出框 -->
        <el-dialog title="商品编辑" :visible.sync="dialogFormVisible" width="500px">
        <el-form :model="edits" :rules="rules" ref="dialogForm" label-width="100px">
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="edits.name"></el-input>
            </el-form-item>
            <el-form-item label="商品编码" prop="code">
                <el-input v-model="edits.code"></el-input>
            </el-form-item>
            <el-form-item label="商品。。" prop="spec">
                <el-input v-model="edits.spec"></el-input>
            </el-form-item>
            <el-form-item label="商品零售价" prop="retailPrice">
                <el-input v-model="edits.retailPrice"></el-input>
            </el-form-item>
            <el-form-item label="商品进价" prop="purchasePrice">
                <el-input v-model="edits.purchasePrice"></el-input>
            </el-form-item>
            <el-form-item label="商品库存" prop="storageNum">
                <el-input v-model="edits.storageNum"></el-input>
            </el-form-item>
            <el-form-item label="供应商名称" prop="supplierName">
                <el-input readonly @click.native="dialogSelectVisible=true" v-model="edits.supplierName"
                placeholder="选择供应商"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="edits.id === null ? addNew('dialogForm') : changeGoods('dialogForm')">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>
<script>
import goodsApi from '@/api/goods'
import Supplier from '@/components/supplier'

export default {
    components: {
        Supplier
    },
    data() {
        return {
            list: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            searchMap: {
                name: '',
                code: '',
                supplierName: ''
            },
            dialogSelectVisible: false,
            dialogFormVisible: false,
            edits: {
                id: null,
                name: '',
                code: '',
                spec: '',
                retailPrice: '',
                purchasePrice: '',
                storageNum: '',
                supplierName: ''
            },
            rules: {
                name: {required: true, message:'商品名称不能为空！', trigger: 'blur'},
                code: {required: true, message:'商品编码不能为空！', trigger: 'blur'},
                retailPrice: {required: true, message:'商品零售价不能为空！', trigger: 'blur'}
            },
            isNewAdd: false
        }
    },
    created() {
        this.fetch()
    },
    methods: {
        fetch() {
            goodsApi.searchGoods(this.currentPage, this.pageSize, this.searchMap).then(response => {
                const resp = response.data
                if (resp.flag) {
                    this.list = resp.data.rows
                    this.total = resp.data.total
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
        selectSupplier(supplier) {
            //console.log(supplier)
            const inputTarget = this.isNewAdd ? this.edits : this.searchMap
            inputTarget.supplierName = supplier.name
            inputTarget.supplierId = supplier.id
            this.isNewAdd = false
            this.dialogSelectVisible = false
        },
        dialogShow() {
            this.dialogFormVisible = true
            this.isNewAdd = true
            this.$nextTick(() => {
                this.$refs['dialogForm'].resetFields()
            })
        },
        addNew(dialogForm) {
            this.$refs[dialogForm].validate(valid => {
                if (valid) {
                    goodsApi.addGoods(this.edits).then(response => {
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
        changeGoods(dialogForm) {
            this.$refs[dialogForm].validate(valid => {
                if (valid) {
                    goodsApi.changeById(this.edits).then(response => {
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
            goodsApi.getById(id).then(response => {
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
                goodsApi.deleteById(id).then(response => {
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