<template>
    <div class='proList boxs'>
        <div class="headBox">
            <h2>角色列表</h2>
        </div>
        <div class="searchBox box">
            <div>
                <span>角色名称：</span>
                <el-input v-model="roleName" placeholder="" style="display:inline;"></el-input>
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
                prop="roleName"
                label="角色名称">
            </el-table-column>
            <el-table-column
                prop="roleDesc"
                label="角色描述"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-tooltip content="查看权限" placement="top">
                        <span class="iconfont iconcaozuo-mingxi" @click="roleDetailFn(scope.row.id)"></span>
                    </el-tooltip>
                    <el-tooltip content="编辑" placement="top">
                        <span class="iconfont iconcaozuo-bianji" @click="handleEdit(scope.row.id)" v-show="scope.row.roleName!='超级管理者'"></span>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <span class="iconfont iconcaozuo-lajitong red" @click="deleFn(scope.row.id)" v-show="scope.row.roleName!='超级管理者'"></span>
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
        <el-dialog title="查看角色权限" :visible.sync="dialogTreeVisible" width="30%">
            <el-form ref="form" :model="data" label-width="160px" size="medium">
                <el-form-item label="角色名称：">
                    <el-input v-model="data.roleName" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色描述：">
                    <el-input v-model="data.roleDesc" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色权限：">
                    <el-tree :data="data.permissions" 
                        :show-checkbox="false" 
                        default-expand-all 
                        node-key="id" ref="tree" 
                        highlight-current 
                        :props="defaultProps">
                    </el-tree>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="编辑角色" :visible.sync="dialogTreeEditVisible" width="30%">
            <el-form ref="form" :model="editData" label-width="160px" size="medium">
                <el-form-item label="角色名称："  prop="roleName"
                    :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' }]">
                    <el-input v-model="editData.roleName" ></el-input>
                </el-form-item>
                <el-form-item label="角色描述：">
                    <el-input v-model="editData.roleDesc" ></el-input>
                </el-form-item>
                <el-form-item label="角色权限："
                    :rules="[{ required: true}]">
                    <div>
                        <el-checkbox v-model="allchecked" @change="setCheckedKeys">勾选全部</el-checkbox>
                    </div>
                    <el-tree :data="allPermissions" 
                        show-checkbox default-expand-all 
                        node-key="id" ref="tree" 
                        highlight-current 
                        :props="defaultProps" 
                        :default-checked-keys="currIds" >
                    </el-tree>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <y-button text="保存" classStyle="main-btn"  @btnClick="submitForm('editData')"></y-button>
                <y-button text="取消"  @btnClick="dialogTreeEditVisible = false"></y-button>
            </span>
        </el-dialog>
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import { roleList,getList,deleteRole,roleDetail,updateRole,updateRolePage } from '@/api/api.js'
export default {
    components: {
      YButton
    },
    data() {
        return {
            pageSize:10,
            totalRows:0,
            currentPage:1,
            options: [],
            tableData: [],
            roleName:'',
            dialogTreeVisible:false,
            defaultProps: {
                children: 'childPermissions',
                label: 'name'
            },
            role:'',
            currIds:[],
            data:{},
            editData:{},//编辑的权限
            dialogTreeEditVisible:false,
            allPermissions:[],//全部权限
            allchecked:false,
            editRoleId:'',//当前编辑的id
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData(){
            let data = {
                page: this.currentPage,
                pageSize: this.pageSize,
                pagination: true,
            }
            if(this.roleName!=null&&this.roleName!=''){
                data.roleName = this.roleName
            }
            roleList(data).then(res=>{
                this.totalRows = res.page.totalRows
                this.tableData = res.data
            })
        },
        // 改变页数后的方法
        handleCurrentChange(val) {
            this.currentPage = val
            this.getData()
        },
        // 删除
        deleFn(id){
            this.$confirm('确定删除角色吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false
            }).then(() => {
                deleteRole({id:id}).then(res=>{
                    this.$message.success('删除成功!')
                    this.getData()
                })
            }).catch(() => {
                // this.$message('info','已取消删除!')
            })
        },
        // 查看权限
        roleDetailFn(id){
            this.dialogTreeVisible = true
            roleDetail({roleId:id}).then(res=>{
                this.role = res.data.allPermissions
                // this.currIds = res.data.currIds
                this.data = res.data.role
            })
        },
        // 编辑权限
        handleEdit(id){
            this.editRoleId = id
            this.dialogTreeEditVisible = true
            updateRolePage({roleId:id}).then(response=>{
                this.editData = response.data.role
                this.allPermissions = response.data.allPermissions
                let res = this.editData.permissions
                let arr = []
                if(res!=null&&res!=''){
                    for(let a=0;a<res.length;a++){
                        if(res[a].childPermissions==null||res[a].childPermissions==''){
                            arr.push(res[a].id)
                        }else{
                            let res1 = res[a].childPermissions
                            if(res1!=null&&res1!=''){
                                for(let b= 0;b<res1.length;b++){
                                    if(res1[b].childPermissions==null||res1[b].childPermissions==''){
                                        arr.push(res1[b].id)
                                    }else{
                                        let res2 = res1[b].childPermissions
                                        if(res2!=null&&res2!=''){
                                            for(let c=0;c<res2.length;c++){
                                                if(res2[c].childPermissions==null||res2[c].childPermissions==''){
                                                    arr.push(res2[c].id)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                this.currIds = arr
            })
        },
        //全部选中
        setCheckedKeys(value) {
            console.log(value)
            if (value) {
                var arr = []
                for (var i = 0; i < this.allPermissions.length; i++) {
                    arr.push(this.allPermissions[i].id)
                }
                this.$refs.tree.setCheckedKeys(arr);
            } else {
                this.$refs.tree.setCheckedKeys([]);
            }
        },
        // 提交
        submitForm(formName) {
            let res = this.$refs.tree.getCheckedKeys()
            let res2 = this.$refs.tree.getHalfCheckedKeys()
            if (res == null || res == '') {
                this.$message.error('请选择权限!')
                return
            }
            if (res2 != null && res2 != '') {
                for (let i = 0; i < res2.length; i++) {
                    res.push(res2[i])
                }
            }
            let data = {
                id:this.editRoleId,
                roleName: this.editData.roleName,
                roleDesc: this.editData.roleDesc,
                permissionIds: res.join(',')
            }
            updateRole(data).then(res=>{
                this.$message.success('编辑成功!')
                this.dialogTreeEditVisible = false
                this.getData()
            })
        },
    }
}
</script>
   
<style lang='scss'>

</style>