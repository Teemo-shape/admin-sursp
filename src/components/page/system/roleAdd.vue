<template>
    <div class='activityAdd proList boxs'>
        <div class="headBox">
            <h2>新增角色</h2>
        </div>
        <el-form ref="form" :model="form" label-width="140px" size="medium">
            <el-form-item label="角色名称" prop="roleName"
                :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' }]">
                <el-input v-model="form.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
                <el-input v-model="form.roleDesc"></el-input>
            </el-form-item>
            <el-form-item label="角色权限"
                :rules="[{ required: true}]">
                <div>
                    <el-checkbox v-model="allchecked" @change="setCheckedKeys">勾选全部</el-checkbox>
                </div>
                <el-tree :data="data" show-checkbox 
                    node-key="id" ref="tree" 
                    highlight-current 
                    :props="defaultProps" 
                    @check-change="handleCheckChange">
                </el-tree>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">立即新增</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
   
   
<script>
import { addRolePage,addRole } from '@/api/api.js'
export default {
    components: {
      
    },
    data() {
        return {
            form:{
                roleName: '',
                roleDesc: '',
            },
            defaultProps: {
                children: 'childPermissions',
                label: 'name'
            },
            allchecked:false,
            allNdes:[],//全部节点
            newArr:[],
            data: [],//全部权限
        }
    },
    created() {
        this.addRolePage()
    },
    methods: {
        // 获取角色
        addRolePage(){
            addRolePage().then(res=>{
                this.data = res.data
                this.data.forEach(item=>{
                    this.allNdes.push(item.id)
                })
            })
        },
        //提交新增
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
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
                        roleName: this.form.roleName,
                        roleDesc: this.form.roleDesc,
                        permissionIds: res.join(',')
                    }
                    addRole(data).then(res=>{
                        this.$message.success('新增成功!')
                        this.routerLink('roleList')
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
            this.$refs.tree.setCheckedKeys([]);
        },
        //全部选中
        setCheckedKeys(value) {
            if (value) {
                let arr = []
                for (let i = 0; i < this.data.length; i++) {
                    arr.push(this.data[i].id)
                }
                this.newArr = arr
                this.$refs.tree.setCheckedKeys(arr);
            } else {
                this.newArr = []
                this.$refs.tree.setCheckedKeys([]);
            }
        },
        // 每选中就触发
        handleCheckChange(data, checked, indeterminate) {
            if(checked && this.allNdes.indexOf(data.id) > -1 && this.newArr.indexOf(data.id) == -1){
                this.newArr.push(data.id)
            }else if(checked==false){
                if(this.newArr.indexOf(data.id)>-1){
                    this.newArr.splice(this.newArr.indexOf(data.id),1)
                }
            }
            let flag = true
            this.allNdes.forEach(item=>{
                if(this.newArr.indexOf(item)==-1){
                    flag = false
                    return
                }
            })
            if(flag){
                this.allchecked = true
            }else{
                this.allchecked = false
            }
        },
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