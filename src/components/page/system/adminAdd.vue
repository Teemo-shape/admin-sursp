<template>
    <div class='activityAdd proList boxs'>
        <div class="headBox">
            <h2>新增管理员</h2>
        </div>
        <el-form ref="form" :model="form" label-width="140px" size="medium" :rules="rules">
            <el-form-item label="登录账号" prop="loginName">
                <el-input v-model="form.loginName"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="userName">
                <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input type="tel" v-model="form.phone" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="相关角色" prop="roleId">
                <el-select v-model="form.roleId" placeholder="请选择" @change="changeRole">
                    <el-option
                        v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属公司" :prop="isShowCompany?'companyId':''" v-show="isShowCompany">
                <el-select v-model="form.companyId" placeholder="请选择">
                    <el-option
                        v-for="item in companyOptions" :key="item.companyId" :label="item.companyName" :value="item.companyId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="locked">
                <el-switch v-model="form.locked" 
                    active-color="#287BD6">
                </el-switch>
            </el-form-item>
            <el-form-item label="">
                <p style="text-align:left;">注：新增管理员初始密码为123456</p>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">立即新增</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
            
        </el-form>
    </div>
</template>
   
   
<script>
import { addAdmin,getAdminPage,addCompanyPage } from '@/api/api.js'
export default {
    components: {
      
    },
    data() {
        return {
            form:{
                loginName: '',
                userName: '',
                phone: '',
                roleId: '',
                companyId: '',
                locked: true,
            },
            rules: {
                loginName: [
                    { required: true, message: '请输入登录账号', trigger: 'blur' },
                ],
                userName: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                ],
                roleId: [
                    { required: true, message: '请选择相关角色', trigger: 'change' }
                ],
                companyId: [
                    { required: true, message: '请选择所属公司', trigger: 'change' }
                ],
                locked: [{ required: true}],
            },
            options:[],
            companyOptions:[],
            isShowCompany:true,//是否显示所属公司
        }
    },
    created() {
        this.getAdminPage()
        this.addCompanyPage()
    },
    methods: {
        // 获取角色
        getAdminPage(){
            getAdminPage().then(res=>{
                this.options = res.data
            })
        },
        // 获取公司
        addCompanyPage(){
            addCompanyPage().then(res=>{
                this.companyOptions = res.data
            })
        },
        //提交新增
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(!this.checkPhone(this.form.phone)){
                        this.$message.error('请输入正确的手机号码!')
                        return
                    }
                    this.form.locked = this.form.locked ? 0 : 1
                    addAdmin(this.form).then(res=>{
                        this.$message.success('新增成功!')
                        this.routerLink('adminList')
                        this.$parent.getPermissions(3)
                    })
                } else {
                    return false;
                }
            })
        },
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        // 判断是不是选择的超级管理员
        changeRole(val){
            if(val==1){
                this.isShowCompany = false
            }else{
                this.isShowCompany = true
            }
        }
    }
}
</script>
   
<style lang='scss'>
.activityAdd{
    .el-input__inner{
        width: 400px;
    }
    .el-input__prefix{
        top: -8px;
    }
    .el-input__suffix{
        top: 0;   
    }
}
</style>