<template>
  <div class="form-container">
    <el-form class="form-login" :rules="rules" ref="form" :model="form" label-width="80px">
        <h2 class="form-title">遐域会员管理系统</h2>
        <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('form')">登录</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {login, getUserInfo} from './login'

export default {
    data() {
        return {
            form: {
            userName: '',
            password: ''
            },
            rules: {
                userName: [
                    {required: true, message: '用户名不能为空！', tigger: 'blur'}
                ],
                password: [
                    {required: true, message: '密码不能为空！', tigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        submitForm(formData) {
            this.$refs[formData].validate((valid) => {
                if(valid) {
                    login(this.userName, this.password).then(response => {   
                        const resp = response.data
                        if (resp.flag) {
                            getUserInfo(resp.data.token).then(response => {
                                const info = response.data
                                if (info.flag) {
                                    localStorage.setItem('user-info', JSON.stringify(info))
                                    localStorage.setItem('user-token', JSON.stringify(resp.data.token))
                                    this.$router.push('/')
                                } else {
                                    alert('获取用户信息失败')
                                }
                            })
                        } else {
                            alert('登录失败')
                        }
                    })
                    
                } else {
                    console.log('校验失败!')
                }
            })
        }
    }
};
</script>

<style>
    .form-container{
        position: absolute;
        width: 100%;
        height: 100%;
        background: url(../assets/111.jpg);
        background-size: cover;
    }
    .form-login{
        width: 380px;
        margin: 160px auto;
        background: rgba(255, 255, 255, .8);
        padding: 28px;
        border-radius: 15px;
    }
    .form-title{
        color: #333202;
        text-align: center;
    }
</style>