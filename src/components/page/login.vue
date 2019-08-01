<template>
    <div class="login-container">
        <div class="loginBox">
            <div class="imgBox"><img class="img100" src="@img/login.png" alt=""></div>
            <div class="login-form boxs">
                <h3>用户登录</h3>
                <el-form
                    :model="ruleForm2"
                    status-icon
                    :rules="rules2"
                    ref="ruleForm2"
                    label-width="100px"
                    class="login-ruleForm"
                >
                    <el-form-item prop="username">
                        <el-input placeholder="请输入用户名称" v-model="ruleForm2.username">
                            <i slot="prefix" class="iconfont icondengluming"></i>iconshurumima
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input placeholder="请输入密码" type="password" v-model="ruleForm2.password" autocomplete="off">
                            <i slot="prefix" class="iconfont iconshurumima"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="validateCode" class="code">
                        <el-input placeholder="请输入验证码" v-model="ruleForm2.validateCode" autocomplete="off">
                            <i slot="prefix" class="iconfont iconyanzhengma"></i>
                        </el-input>
                        <img class="codeImg" :src="codeImg" alt="" @click="getValidateCode()">
                    </el-form-item>
                    <div class="forgetPass" v-if="false">
                        <el-checkbox v-model="ruleForm2.checked">三天自动登录</el-checkbox>
                        <div>忘记密码？</div>
                    </div>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm2')" @keyup.enter="submitForm('ruleForm2')">提交</el-button>
                        <!-- <el-button @click="resetForm('ruleForm2')">重置</el-button> -->
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import { login,getValidateCode,getPermissions,getUserName } from "@/api/api.js";
import baseUrl from '@/api/request.js'
import Bus from '../common/bus.js'
export default {
    name: "login",
    data() {
        let validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.ruleForm2.checkPass !== "") {
                    this.$refs.ruleForm2.validateField("checkPass");
                }
                callback();
            }
        };
        let validateName = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入用户名"));
            } else {
                callback();
            }
        };
        let validateCode = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入验证码"));
            } else {
                callback();
            }
        };
        return {
            ruleForm2: {
                password: "",
                username: "",
                validateCode: "",
                // checked:true
            },
            rules2: {
                password: [{ validator: validatePass, trigger: "blur" }],
                username: [{ validator: validateName, trigger: "blur" }],
                validateCode: [{ validator: validateCode, trigger: "blur" }]
            },
            codeImg:''
        };
    },
    created(){
        this.$store.commit('closeMask')
        this.getValidateCode()
        let that = this
        document.onkeyup = function(e) {
            let code = e.charCode || e.keyCode;
            if (code == 13) {
                that.submitForm('ruleForm2')
            }
        }
    },
    methods: {
        getValidateCode(){
            this.codeImg = baseUrl.BASE_URL+'/validateCode?time='+ new Date().getTime()
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    login(this.ruleForm2).then(res=>{
                        // 用来判断是超级管理员还是系统管理员 
                        localStorage.setItem('companyId',res.data)
                        Bus.$emit('type',0)
                        this.$store.commit('saveLoginStatus',true)
                        this.getUserName()
                        this.$router.push({ path: "/" })
                    })
                } else {
                    return false;
                }
            })
            
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        getUserName(){
            getUserName().then(res=>{
                Bus.$emit('loginName',res.data)
            })
        },
    }
};
</script>
<style lang="scss">
.login-container {
    background: #fff;
    width: 100%;
    height: 100%;
    .loginBox{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        display: flex;
        .imgBox{
            width: 640px;
            height: 540px;
        }
    }
    .login-form {
        width:520px;
        height:540px;
        background:rgba(255,255,255,1);
        border-radius:10px;
        font-size: 16px;
        box-shadow: 0 4px 8px 0 hsla(0,0%,40%,.1);
        padding: 90px 100px;
        h3{
            color: $main-col;
        }
        .el-form{
            margin-top: 40px;
            .el-form-item{
                margin-bottom: 30px;
            }
            .el-form-item__content{
                margin-left: 0 !important;
                .el-input__inner{
                    width: 100%;
                    border-radius: 4px;
                    height: 40px;
                    line-height: 40px;
                    padding-left: 40px;
                }
                .el-input__prefix{
                    line-height: 40px;
                    margin-left: 10px;
                    .iconfont{
                        color: #ccc;
                        font-size: 20px;
                    }
                }
            }
            .code{
                .el-input__inner{
                    width: 206px;
                }
                .codeImg{
                    width: 98px;
                    height: 40px;
                    border-radius: 4px;
                    position: absolute;
                    top: 0;
                    right: 0;
                }
                .el-input__suffix{
                    right: 114px;
                }
            }
            .el-form-item--small .el-form-item__error{
                padding-top: 8px;
            }
            .forgetPass{
                display: flex;
                justify-content: space-between;
                font-size: 12px;
            }
            .el-button--primary{
                width: 100%;
                background-color: $main-col;
                border-color: $main-col;
                font-size: 16px;
                border-radius: 4px;
                height: 42px;
            }
        }
    }
}
</style>

