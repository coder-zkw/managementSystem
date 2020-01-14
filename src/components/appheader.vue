<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/logo.png" />
      <span class="company">遐域会员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
            下拉菜单
            <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">修改密码</el-dropdown-item>
            <el-dropdown-item command="b">退出</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="密码修改" :visible.sync="dialogPasswordVisible" width="450px">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" style="width:380px">
        <el-form-item label="原密码" prop="oldpass">
          <el-input type="password" v-model="ruleForm.oldpass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {logout} from '@/login/login.js'
import updatePwdApi from '@/api/changepwd'

export default {
  data() {
    const validateOldPass = ((rule, value, callback) => {
      updatePwdApi.checkPwd(this.user.id, this.oldpass).then(response => {
        const resp = response.data
        if (resp.flag) {
          callback()
        } else {
          callback(new Error(resp.message))
        }
      })
    })
    const validateCheckPass =((rule, value, callback) => {
      if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致！'))
      } else {
        callback()
      }
    })
    return {
      user: JSON.parse(localStorage.getItem('user-info')),
      dialogPasswordVisible: false,
      ruleForm: {
        oldpass: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        oldpass: [
          {required: true, message: '原密码不能为空！', trigger: 'blur'},
          {validator: validateOldPass, trigger: 'blur'}
        ],
        pass: {required: true, message: '新密码不能为空！', trigger: 'blur'},
        checkPass: [
          {required: true, message: '确认密码不能为空！', trigger: 'blur'},
          {validator: validateCheckPass, trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'a': 
          this.handleUpdatePwd()
          break;
        case 'b':
          //this.$message('退出系统')
          this.handleLogout()
          break;
        default:
          break;
      }
    },
    handleLogout() {
      logout(localStorage.getItem('use-token')).then(response => {
        localStorage.removeItem('user-token')
        localStorage.removeItem('user-info')
        this.$router.push('/login ')
      })
    },
    handleUpdatePwd() {
      this.dialogPasswordVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
    },
    submitForm(format) {
      this.$refs[format].validate(valid => {
        if (valid) {
          updatePwdApi.updatePwd(this.user.id, this.ruleForm.pass).then(response => {
            const resp = response.data
            if (resp.flag) {
              this.$message(resp.message)
              this.handleLogout()
              this.dialogPasswordVisible = false
            } else {
              this.$message('修改密码失败')
            }
          })
        } else {
          return false
        }
      })  
    }
  }
}
</script>
<style scoped>
.logo {
  width: 100px;
  vertical-align: middle;
  padding: 0 8px 0 40px;
}
.company {
  color: #fff;
}
.el-dropdown{
    position: absolute;
    right: 40px;
    color: #fff;
    cursor: pointer;
}
a{
  text-decoration: none;
}
</style>