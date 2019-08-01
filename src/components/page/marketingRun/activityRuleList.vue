<template>
    <div class='activity proList boxs'>
        <div class="headBox">
            <h2>活动规则</h2>
            <y-button text="新增活动规则" class="button" classStyle="main-btn" @btnClick="addRule('form')"></y-button>
        </div>
        <div class="searchBox box">
            <div>
                <span>规则名称：</span>
                <el-input v-model="searchForm.ruleName" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
            <div>
                <span>活动类型：</span>
                <el-select v-model="searchForm.typeId" placeholder="请选择">
                    <el-option
                        v-for="item in options"  :key="item.typeId" :label="item.label" :value="item.typeId">
                    </el-option>
                </el-select>
            </div>
            <y-button text="搜索" class="button" classStyle="main-btn" @btnClick="handleCurrentChange(1)"></y-button><br>
        </div>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="light"
            style="width: 100%"
            stripe>
            <el-table-column
                prop="ruleName"
                label="规则名称"
                width="200"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="typeName"
                label="活动类型"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="每天抽奖数"
                show-overflow-tooltip>
                <template slot-scope="scope"><span>{{scope.row.dayTimes==null||scope.row.dayTimes==''?'不限次数':scope.row.dayTimes}}</span></template>
            </el-table-column>
            <el-table-column
                prop="needIntegral"
                :label="'每次消耗'+integralName"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="createdDate"
                label="创建时间"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-tooltip content="编辑" placement="top">
                        <span class="iconfont iconcaozuo-bianji" @click="editRule(scope.row)"></span>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <span class="iconfont iconcaozuo-lajitong red" @click="deleFn(scope.row.ruleId)"></span>
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
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form ref="form" :model="form" label-width="120px" size="medium" :rules="rules">
                <el-form-item label="活动类型：" prop="typeId">
                    <el-select v-model="form.typeId" placeholder="请选择" :disabled="dialogTitle=='编辑活动规则'?true:false">
                        <el-option
                            v-for="item in options"  :key="item.typeId" :label="item.label" :value="item.typeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规则名称：" prop="ruleName">
                    <el-input v-model="form.ruleName" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="每天抽奖次数：">
                    <el-input v-model="form.dayTimes" placeholder="不限次数可不填" type="number"></el-input>
                </el-form-item>
                <el-form-item :label="'消耗'+integralName+'：'" prop="needIntegral">
                    <el-input v-model="form.needIntegral" type="number"></el-input>
                </el-form-item>
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
import { getActivityRuleList,delActivityRule,addActivityRule,updateActivityRule,getInteger } from '@/api/api.js'
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
                typeId:'',
                ruleName:'',
            },
            options:[
                // {
                //     typeId: 1,
                //     label: '大转盘抽奖类型'
                // },{
                //     typeId: 2,
                //     label: '趣味翻牌类型'
                // },{
                //     typeId: 3,
                //     label: '疯狂咋砸金蛋类型'
                // },
                {
                    typeId: 4,
                    label: '幸运刮刮乐类型'
            }],
            tableData: [],
            dialogVisible:false,
            dialogTitle:'新增活动规则',//弹框头部
            form:{
                typeId:'',
                ruleName:'',
                dayTimes:'',
                needIntegral:'',
            },
            rules: {
                typeId: [
                    { required: true, message: '请选择活动类型', trigger: 'change' },
                ],
                ruleName: [
                    { required: true, message: '请输入规则名称', trigger: 'blur' }
                ],
                needIntegral: [
                    { required: true, message: `请输入消耗值`, trigger: 'blur' }
                ],
            },
            ruleId:'',//编辑数据
            integralName:'',
        }
    },
    created() {
        this.getInteger()
        this.getData()
    },
    methods: {
        // 获取设置好的名称
        getInteger(){
            getInteger().then(res=>{
                this.integralName = res.data.integralName
                this.rules.needIntegral[0].message = `请输入消耗${this.integralName}`
            })
        },
        getData(){
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
            getActivityRuleList(data).then(res=>{
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
            this.$confirm('确定删除活动规则吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false
            }).then(() => {
                delActivityRule({ruleId:id}).then(res=>{
                    this.$message.success('删除成功!')
                    this.getData()
                })
            }).catch(() => {
                // this.$message('info','已取消删除!')
            })
        },
        // 新增活动规则
        addRule(formName){
            this.dialogVisible = true
            this.dialogTitle = '新增活动规则'
            this.form.typeId = ''
            this.form.ruleName = ''
            this.form.dayTimes = ''
            this.form.needIntegral = ''
        },
        //弹框确认
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let noZeroNum=/^[0-9]\d*$/
                    if(this.form.dayTimes===0||this.form.dayTimes==='0'){
                        this.$message.error('每天抽奖次数不能为0!')
                        flag = true
                    }
                    if(this.form.dayTimes!=null&&this.form.dayTimes!=''){
                        if(!noZeroNum.test(this.form.dayTimes)){
                            this.$message.error('每天抽奖次数为整数!')
                            flag = true
                        }
                    }else if(!noZeroNum.test(this.form.needIntegral)){
                        this.$message.error('消耗'+this.integralName+'为整数!')
                        flag = true
                    }
                    if(this.dialogTitle == '编辑活动规则'){
                        this.form.ruleId = this.ruleId
                        updateActivityRule(this.form).then(res=>{
                            this.$message.success('编辑成功!')
                            this.dialogVisible = false
                            this.getData()
                        })
                        return   
                    }
                    addActivityRule(this.form).then(res=>{
                        this.$message.success('新增成功!')
                        this.dialogVisible = false
                        this.getData()
                    })
                } else {
                    return false;
                }
            })
        },
        // 编辑活动规则
        editRule(info,typeName){
            this.dialogVisible = true
            this.dialogTitle = '编辑活动规则'
            this.ruleId = info.ruleId
            // this.form.typeId = this.options[Number(info.typeId)-1].typeId
            this.form.typeId = 4
            this.form.ruleName = info.ruleName
            this.form.dayTimes = info.dayTimes
            this.form.needIntegral = info.needIntegral
        }
    }
}
</script>
   
<style scoped lang='scss'>
    
</style>