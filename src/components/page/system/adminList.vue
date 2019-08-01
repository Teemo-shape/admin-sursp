<template>
    <div class='proList boxs'>
        <div class="headBox">
            <h2>管理员列表</h2>
        </div>
        <div class="searchBox box">
            <div>
                <span>登录账号：</span>
                <el-input v-model="searchForm.loginName" placeholder="" style="display:inline;"></el-input>
            </div>
            <div>
                <span>角色：</span>
                <el-select v-model="searchForm.roleId" placeholder="请选择">
                    <el-option key="" label="请选择" value=""></el-option>
                    <el-option
                        v-for="item in options"
                        :key="item.id" :label="item.roleName" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>所属公司：</span>
                <el-select v-model="searchForm.companyId" placeholder="请选择">
                    <el-option key="" label="请选择" value=""></el-option>
                    <el-option
                        v-for="item in companyOptions"
                        :key="item.companyId" :label="item.companyName" :value="item.companyId">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>状态：</span>
                <el-select v-model="searchForm.locked" placeholder="请选择">
                    <el-option
                        v-for="item in statusOptions"
                        :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <y-button text="搜索" class="button" classStyle="main-btn" @btnClick="handleCurrentChange(1)"></y-button>
        </div>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="light"
            style="width: 100%"
            stripe>
            <el-table-column
                prop="loginName"
                label="登录账号"
                width="120">
            </el-table-column>
            <el-table-column
                prop="userName"
                label="真实姓名"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="phone"
                label="手机号码"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="companyName"
                label="所属公司"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="角色"
                show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.roles[0].roleName}}</template>
            </el-table-column>
            <el-table-column
                label="状态"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-switch v-if="scope.row.roles[0].roleName!='超级管理者'" v-model="scope.row.locked==1?false:true" 
                        active-color="#287BD6"
                        @change="changeStatus(scope.row.locked,scope.row.id)">
                    </el-switch>
                    <el-switch v-else v-model="scope.row.locked==1?false:true" disabled></el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-tooltip content="编辑" placement="top">
                        <span class="iconfont iconcaozuo-bianji" @click="handleEdit(scope.row)" v-show="scope.row.roles[0].roleName!='超级管理者'&&scope.row.locked==1"></span>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <span class="iconfont iconcaozuo-lajitong red" @click="deleFn(scope.row.id)" v-show="scope.row.roles[0].roleName!='超级管理者'&&scope.row.locked==1"></span>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <div class="foote-page" v-show="totalRows>0">
            <div></div>
            <el-pagination 
                :page-size="pageSize" 
                background 
                layout="prev, pager, next" 
                :total="totalRows" 
                :current-page.sync="currentPage"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <el-dialog title="编辑管理员" :visible.sync="dialogVisible" width="30%" :rules="rules">
            <el-form ref="form" :model="form" label-width="160px" size="medium">
                <el-form-item label="登录账号：">
                    <el-input v-model="form.loginName" disabled></el-input>
                </el-form-item>
                <el-form-item label="真实姓名：" prop="userName">
                    <el-input v-model="form.userName" ></el-input>
                </el-form-item>
                <el-form-item label="手机号码：" prop="phone">
                    <el-input type="number" v-model="form.phone" ></el-input>
                </el-form-item>
                <el-form-item label="相关角色：" prop="roleId">
                    <el-select v-model="form.roleId" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属公司：" prop="companyId">
                    <el-select v-model="form.companyId" placeholder="请选择" :disabled="isDisabled">
                        <el-option
                            v-for="item in companyOptions"
                            :key="item.companyId" :label="item.companyName" :value="item.companyId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <p style="text-align:center;margin-bottom:18px;">注：新增管理员初始密码为123456</p>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <y-button text="保存" classStyle="main-btn"  @btnClick="submitForm('form')"></y-button>
                <y-button text="取消"  @btnClick="dialogVisible = false"></y-button>
            </span>
        </el-dialog>
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import { getAdminList,getAdminPage,addCompanyPage,enOrdisableAdmin,deleteAdmin,editAdmin } from '@/api/api.js'

export default {
    components: {
      YButton
    },
    data() {
        return {
            pageSize:10,
            totalRows:0,
            currentPage:1,
            searchForm:{
                loginName:'',
                locked:'',
                roleId:'',
                companyId:'',
            },
            options: [],//角色列表
            companyOptions: [],//所属公司列表
            tableData: [],
            statusOptions: [{
                value: '',
                label: '请选择'
            },{
                value: '0',
                label: '启用'
            }, {
                value: '1',
                label: '禁用'
            }],
            form:{},//编辑的数据
            dialogVisible:false,
            rules: {
                userName: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { type:'number', message: '请输入正确的手机号码',trigger: 'blur' }
                ],
                roleId: [
                    { required: true, message: '请选择相关角色', trigger: 'change' }
                ],
                companyId: [
                    { required: true, message: '请选择所属公司', trigger: 'change' }
                ],
            },
            form: {
                loginName: '',
                userName: '',
                phone: '',
                companyId: '',
                roleId: '',
                id: '',
            },
            isDisabled:false,//区分超级和系统
        }
    },
    created() {
        this.getAdminList()
        this.getAdminPage()
        this.addCompanyPage()
        let companyId = localStorage.getItem('companyId');
        if(companyId){
            this.isDisabled = true;
        }else{
            this.isDisabled = false;
        }
    },
    methods: {
        getAdminList(){
            let data = {
                page: this.currentPage,
                pageSize: this.pageSize,
                pagination: true,
            }
            for(var key in this.searchForm){
                if(this.searchForm[key]!=null&&this.searchForm[key]!=''){
                    data[key] = this.searchForm[key]
                }
            }
            getAdminList(data).then(res=>{
                this.totalRows = res.page.totalRows
                this.tableData = res.data
            })
        },
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
        // 改变页数后的方法
        handleCurrentChange(val) {
            this.currentPage = val
            this.getAdminList()
        },
        // 状态开关
        changeStatus(status,id){
            let data = {
                id:id,
                locked:status == true?0:1
            }
            enOrdisableAdmin(data).then(res=>{
                this.$message.success(status==true?'启用成功!':'禁用成功!')
                this.getAdminList()
            })
            .catch(res=>{
                this.getAdminList()
            })
        },
        // 删除
        deleFn(id){
            this.$confirm('确定删除管理员吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false
            }).then(() => {
                deleteAdmin({id:id}).then(res=>{
                    this.$message.success('删除成功!')
                    this.getAdminList()
                })
            }).catch(() => {
                // this.$message('info','已取消删除!')
            })
        },
        // 编辑
        handleEdit(info){
            this.dialogVisible = true
            this.form.loginName = info.loginName
            this.form.userName = info.userName
            this.form.phone = info.phone
            this.form.companyId = info.companyId
            this.form.id = info.id
            this.form.roleId = info.roles[0].id
        },
        //弹框确认
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(!this.checkPhone(this.form.phone)){
                        this.$message.error('请输入正确的手机号码!')
                        return
                    }
                    editAdmin(this.form).then(res=>{
                        this.$message.success('编辑成功!')
                        this.dialogVisible = false
                        this.getAdminList()
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
.el-switch.is-checked .el-switch__core{
    border-color: rgb(40, 123, 214);
    background-color: rgb(40, 123, 214);
}
</style>