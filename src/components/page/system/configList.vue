<template>
    <div class='proList boxs'>
        <div class="headBox">
            <h2>系统设置</h2>
            <y-button text="新增" class="button" classStyle="main-btn" @btnClick="dialogAddVisible = true"></y-button>
        </div>
        <div class="searchBox box">
            <div>
                <span>参数名称：</span>
                <el-input v-model="configName" placeholder="请输入内容" style="display:inline;"></el-input>
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
                prop="configName"
                label="参数名称">
            </el-table-column>
            <el-table-column
                prop="configValue"
                label="参数值"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="configDesc"
                label="参数描述"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="updatedDateStr"
                label="最后修改时间"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-tooltip content="编辑" placement="top">
                        <span class="iconfont iconcaozuo-bianji" @click="handleEdit(scope.row)"></span>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <span class="iconfont iconcaozuo-lajitong red" @click="deleFn(scope.row.configName)"></span>
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
        <el-dialog title="编辑" :visible.sync="dialogVisible" width="30%">
            <el-form ref="form" :model="form" label-width="160px" size="medium">
                <el-form-item label="参数名称：">
                    <el-input v-model="form.configName" disabled></el-input>
                </el-form-item>
                <el-form-item label="参数值：" prop="configValue"
                    :rules="[{ required: true, message: '请输入参数值', trigger: 'blur' }]">
                    <el-input v-model="form.configValue" ></el-input>
                </el-form-item>
                <el-form-item label="参数描述：">
                    <el-input type="textarea" v-model="form.configDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <y-button text="保存" classStyle="main-btn"  @btnClick="submitForm('form')"></y-button>
                <y-button text="取消"  @btnClick="dialogVisible = false"></y-button>
            </span>
        </el-dialog>
        <el-dialog title="新增" :visible.sync="dialogAddVisible" width="30%">
            <el-form ref="newform" :model="newform" label-width="160px" size="medium">
                <el-form-item label="参数名称：" prop="configName"
                    :rules="[{ required: true, message: '请输入参数名称', trigger: 'blur' }]">
                    <el-input v-model="newform.configName"></el-input>
                </el-form-item>
                <el-form-item label="参数值：" prop="configValue"
                    :rules="[{ required: true, message: '请输入参数值', trigger: 'blur' }]">
                    <el-input v-model="newform.configValue" ></el-input>
                </el-form-item>
                <el-form-item label="参数描述：">
                    <el-input type="textarea" v-model="newform.configDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <y-button text="保存" classStyle="main-btn"  @btnClick="addSubmitForm('newform')"></y-button>
                <y-button text="取消"  @btnClick="dialogAddVisible = false"></y-button>
            </span>
        </el-dialog>
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import { queryConfigs,editConfig,deleteConfig,addConfig } from '@/api/api.js'
export default {
    components: {
      YButton
    },
    data() {
        return {
            pageSize:10,
            totalRows:0,
            currentPage:1,
            configName:'',
            tableData: [],
            dialogVisible:false,
            form:{
                configName:'',
                configValue:'',
                configDesc:'',
            },
            newform:{
                configName:'',
                configValue:'',
                configDesc:'',
            },
            dialogAddVisible:false
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
            if(this.configName!=null&&this.configName!=''){
                data.configName = this.configName
            }
            queryConfigs(data).then(res=>{
                this.tableData = res.data
                this.totalRows = res.page.totalRows
            })
        },
        // 改变页数后的方法
        handleCurrentChange(val) {
            this.currentPage = val
            this.getData()
        },
        // 编辑
        handleEdit(info){
            this.dialogVisible = true
            this.form.configName = info.configName
            this.form.configValue = info.configValue
            this.form.configDesc = info.configDesc
        },
        //弹框确认编辑
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    editConfig(this.form).then(res=>{
                        this.$message.success('编辑成功!')
                        this.dialogVisible = false
                        this.getData()
                    })
                } else {
                    return false;
                }
            })
        },
        //弹框确认新增
        addSubmitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let reg = /^[0-9a-zA-Z_]{1,}$/
                    if (!reg.test(this.newform.configName)) {
                        this.$message.error('请输入数字或字母或下划线组合的参数名称!')
                        return
                    }
                    addConfig(this.newform).then(res=>{
                        this.$message.success('新增成功!')
                        this.dialogAddVisible = false
                        this.getData()
                    })
                } else {
                    return false;
                }
            })
        },
        // 删除
        deleFn(configName){
            this.$confirm('确定删除这条系统设置吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false
            }).then(() => {
                deleteConfig({configName:configName}).then(res=>{
                    this.$message.success('删除成功!')
                    this.getData()
                })
            }).catch(() => {
                // this.$message('info','已取消删除!')
            })
        },
        
    }
}
</script>
   
<style lang='scss'>
.proList .el-textarea__inner{
    width: 100%;
}
</style>