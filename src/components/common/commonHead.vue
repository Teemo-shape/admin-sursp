<template>
    <div class='commonHead'>
        <div class="fixedTop">
            <div class="middleEare">
                <div class="logo"><router-link to="home"><img src="@img/logo.png" alt=""></router-link></div>
                <ul class="bigMenu" v-show="this.$store.state.isLogin">
                    <li @click="handlebigMenu(index)" :class="{active:bigMenuActive==index}" v-for="(item,index) in bigMenu">{{item}}</li>
                </ul>
                <div>
                    <span class="adminName" v-show="this.$store.state.isLogin">你好，{{form.loginName}}</span>
                    <y-button text="登录" class="button" classStyle="white-btn" @btnClick="loginFn()" v-show="!this.$store.state.isLogin&&this.$route.path=='/home'"></y-button>
                    <div class="gohomeBtn hands" @click="routerLink('home')" v-show="!this.$store.state.isLogin&&this.$route.path=='/login'"><span class='iconfont iconjifenshezhi'></span>进入首页</div>
                    <el-dropdown @command="handleCommand" class="hands"  v-show="this.$store.state.isLogin">
                        <span class="el-dropdown-link">
                            <img class="headImg" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" alt="">
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="1">修改密码</el-dropdown-item>
                            <el-dropdown-item command="2">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                
            </div>
        </div>
        <el-dialog
            title="修改密码"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form ref="form" :model="form" label-width="160px" size="medium" :rules="rules">
                <el-form-item label="登录账号：">
                    <el-input v-model="form.loginName" disabled></el-input>
                </el-form-item>
                <el-form-item label="旧密码：" prop="password">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newPassword">
                    <el-input type="password" v-model="form.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="sureNewPassword">
                    <el-input type="password" v-model="form.sureNewPassword"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <y-button text="保存" classStyle="main-btn"  @btnClick="submitForm('form')"></y-button>
                <y-button text="取消"  @btnClick="dialogVisible = false"></y-button>
            </span>
        </el-dialog>
        <router-view style="padding-top:60px;" v-if="$route.meta.title=='首页'" ></router-view>
        <router-view style="padding-top:70px;" v-if="$route.meta.title!='首页'" ></router-view>
    </div>
</template>
   
   
<script>
import YButton from '../common/YButton.vue'
import Bus from './bus.js'
import { resetPassword,logout,getUserName} from '@/api/api.js'
export default {
    inject:['reload'],
    components: {
      YButton
    },
    data() {
        return {
            bigMenuActive:0,
            bigMenu:['首页','权益设置','营销设置','权益服务'],
            dialogVisible: false,
            form:{
                loginName:'',
                password:'',
                newPassword:'',
                sureNewPassword:'',
            },
            rules: {
                password: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' },
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' }
                ],
                sureNewPassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' }
                ],
            },
        }
    },
    created() {
        Bus.$off('loginName').$on('loginName',val=>{
            this.form.loginName = val
        })
        Bus.$off('type').$on('type',val=>{
            this.bigMenuActive = val
        })
        // 刷新页面定位顶部菜单
        this.bigMenuActive = localStorage.getItem('type')
        this.getUserName();
    },
    methods: {
        getUserName(){
            getUserName().then(res=>{
                if(res.data==null||res.data==''){
                    this.$store.commit('saveLoginStatus',false)
                    Bus.$emit('loginName','')
                    this.routerLink('login')
                }else{
                    this.form.loginName=res.data;
                }
            })
        },
        loginFn(){
            this.routerLink('login')
        },
        handlebigMenu(index){
            localStorage.setItem('type',index)
            this.bigMenuActive = index
            if(index==0){
                this.routerLink('home')
            }else if(index==1){
                this.routerLink('memberList',{id:index})
            }else if(index==2){
                this.routerLink('activityRuleList',{id:index})
            }else if(index==3){
                this.routerLink('menu',{id:index})
            }
            this.reload()  //刷新页面默认打开第一个菜单
        },
        // 退出登录 修改密码
        handleCommand(command) {
            if(command==2){
                logout().then(res=>{
                    localStorage.setItem('type',0)
                    this.routerLink('home')
                    this.$store.commit('saveLoginStatus',false)
                    Bus.$emit('loginName','')
                })
                
            }else{
                this.form.password = ''
                this.form.newPassword = ''
                this.form.sureNewPassword = ''
                this.dialogVisible = true
            }
        },
        //确认修改密码
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.form.sureNewPassword!==this.form.newPassword){
                        this.$message.error('确认密码与新密码输入不一致!')
                        return
                    }
                    let data = {
                        loginName: this.form.loginName,
                        password: this.form.password,
                        newPassword: this.form.newPassword
                    }
                    resetPassword(data).then(res=>{
                        this.$message.success('修改成功!')
                        this.routerLink('login')
                        this.dialogVisible = false
                    })
                } else {
                    return false;
                }
            })
        },
    }
}
</script>
   
<style lang='scss'>
.commonHead{
    // background: $head-bgc;
    // height: 60px;
    // line-height: 60px;
    .fixedTop{
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: 999;
        width: 100%;
        background: $main-col;
        height: 60px;
        line-height: 60px;
        .gohomeBtn{
            height: 32px;
            line-height: 32px;
            vertical-align: middle;
            text-align: center;
            padding: 0 10px;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
            border-radius: 2px;
            font-size: 12px;
            color: $main-col;
            background-color: #fff;
            margin-top: 14px;
            .iconfont{
                font-size: 20px;
                vertical-align: middle;
                margin-right: 4px;
            }
        }
    }
    .middleEare{
        display: flex;
        justify-content: space-between;
        .logo {
            a {
                display:block;
                img {
                    vertical-align: middle;
                }
            }
        }
        .bigMenu{
            font-size: 14px;
            color: #fff;
            display: flex;
            height: 100%;
            li{
                padding: 0 20px;
                box-sizing: border-box;
                cursor: pointer;
                &:hover{
                    background: #2f73e8;
                }
                &.active{
                    background: #2f73e8;
                }
            }
        }
        .headImg{
            width: 36px;
            height: 36px;
            border-radius: 100%;
            display: inline-block;
        }
        .el-dropdown{
            margin-top: 12px;
            i{
                color: #e5e5e5;
                vertical-align: top;
                margin-top: 14px;
                margin-left: 10px;
            }
            
        }
        .adminName{
            color: #fff;
            vertical-align: top;
            margin-right: 30px;
            font-size: 14px;
        }
    }
}

</style>