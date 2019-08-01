<template>
    <div class='activityList proList boxs'>
        <div class="headBox">
            <h2>活动列表</h2>
            <y-button text="新增活动" class="button" classStyle="main-btn" @btnClick="routerLink('activityAdd')"></y-button>
        </div>
        <div class="searchBox box">
            <div>
                <span>活动名称：</span>
                <el-input v-model="searchForm.activityName" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
            <div>
                <span>活动状态：</span>
                <el-select v-model="searchForm.status" placeholder="请选择">
                    <el-option
                        v-for="item in options"  :key="item.label" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>开始时间：</span>
                <el-date-picker
                    v-model="searchForm.startTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择开始时间" style="display:inline;">
                </el-date-picker>
            </div>
            <div style="margin-right:30px">
                <span>结束时间：</span>
                <el-date-picker
                    v-model="searchForm.endTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择结束时间" style="display:inline;">
                </el-date-picker>
            </div>
            <y-button text="搜索" class="button" classStyle="main-btn" @btnClick="handleCurrentChange(1)"></y-button>
        </div>
        <!-- <div class="searchBox box">
            <div>
                <span>开始时间：</span>
                <el-date-picker
                    v-model="searchForm.startTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择开始时间" style="display:inline;">
                </el-date-picker>
            </div>
            <div>
                <span>结束时间：</span>
                <el-date-picker
                    v-model="searchForm.endTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择结束时间" style="display:inline;">
                </el-date-picker>
            </div>
            <y-button text="搜索" class="button" classStyle="main-btn" @btnClick="handleCurrentChange(1)"></y-button>
        </div> -->
        <!-- <div class="searchBox box" v-show="searchCondition">
            <div>
                <span>活动名称：</span>
                <el-input v-model="searchForm.activityName" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
        </div>
        <div class="searchCondition" v-show="searchCondition">
            <el-switch
                v-model="searchCondition"
                active-text="更多条件"
                inactive-text="简单条件">
            </el-switch>
            <y-button text="搜索" class="button" classStyle="main-btn" @btnClick="handleCurrentChange(1)"></y-button>
        </div> -->
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="light"
            style="width: 100%"
            stripe>
            <el-table-column
                label="活动图片"
                width="120">
                <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
                <template slot-scope="scope"><img class="proImg" :src="baseImgPath+scope.row.picUrl" alt=""></template>
            </el-table-column>
            <el-table-column
                prop="activityName"
                label="活动名称"
                width="120">
            </el-table-column>
            <el-table-column
                prop="typeName"
                label="活动类型"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="ruleName"
                label="活动规则"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="startTime"
                label="开始时间"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="endTime"
                label="结束时间"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="createdDate"
                label="创建时间"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="活动状态"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status==1?true:false" 
                        active-color="#287BD6"
                        @change="changeStatus(scope.row.status,scope.row.activityId)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="120">
                <template slot-scope="scope">
                    <el-tooltip content="查看活动奖品" placement="top">
                        <span class="iconfont iconcaozuo-yulan" @click="checkdialog(scope.row.activityId)"></span>
                    </el-tooltip>
                    <el-tooltip content="编辑" placement="top">
                        <span class="iconfont iconcaozuo-bianji" @click="handleEdit(scope.row)" v-show="scope.row.status!=1"></span>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <span class="iconfont iconcaozuo-lajitong red" @click="deleFn(scope.row.activityId)" v-show="scope.row.status!=1"></span>
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
            title="编辑活动"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form ref="form" :model="form" label-width="160px" size="medium" :rules="rules">
                <el-form-item label="活动名称：" prop="activityName">
                    <el-input v-model="form.activityName" placeholder="请输入1-20个字符" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="活动描述：" prop="remark">
                    <el-input v-model="form.remark" placeholder="请输入1-60个字符" maxlength="60"></el-input>
                </el-form-item>
                <el-form-item label="活动类型：">
                    <el-input v-model="form.typeName" disabled></el-input>
                </el-form-item>
                <el-form-item label="活动规则：">
                    <el-input v-model="form.ruleName" disabled></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker
                        v-model="form.startTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择开始时间" style="display:inline;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker
                        v-model="form.endTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束时间" style="display:inline;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动主图" prop="fileId">
                    <el-upload :data="{fileType: 'activity_file_type'}" 
                        :file-list="fileList"
                        :action="actionUrl" list-type="picture-card" 
                        :show-file-list="isShowFile"
                        :on-change="handleChange" 
                        :on-success="success1" 
                        :on-remove="remove1">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="">
                    <p style="color:#ccc">图片上传大小：低于1M，尺寸：300*168px，格式：JPG、JPEG、PNG</p>
                </el-form-item>
                <el-form-item label="活动规则：" prop="ruleDescription">
                    <el-input v-model="form.ruleDescription" placeholder="请输入1-1000个字符" maxlength="1000"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <y-button text="保存" classStyle="main-btn"  @btnClick="submitForm('form')"></y-button>
                <y-button text="取消"  @btnClick="dialogVisible = false"></y-button>
            </span>
        </el-dialog>
        <el-dialog title="查看活动奖品" :visible.sync="dialogTableVisible">
            <el-table :data="gridData">
                <el-table-column property="giftName" label="奖品名称"></el-table-column>
                <el-table-column property="giftTypeName" label="奖品类型"></el-table-column>
                <el-table-column property="giftRate" label="中奖率"></el-table-column>
                <el-table-column property="giftTotalCount" label="总数量"></el-table-column>
                <el-table-column property="leftCount" label="剩余数量"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import { getActivityList,updateActivityStatuse,delActivity,deleteFile,updateActivity,getActivityGiftList } from '@/api/api.js'
import actionUrl from '@/api/request.js'
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
                activityName:'',
                status:'',
                startTime:'',
                endTime:'',
            },
            options:[{
                value: '',
                label: '请选择'
            },{
                value: '1',
                label: '启用'
            }, {
                value: '0',
                label: '禁用'
            }],
            tableData: [],
            searchCondition:false,//是否显示更多条件
            dialogTableVisible:false,
            dialogVisible:false,
            actionUrl:actionUrl.actionUrl,//上传图片地址
            baseImgPath:actionUrl.Base_IMGPATH,
            form:{
                activityName:'',
                remark:'',
                typeName:'',
                ruleName:'',
                startTime:'',
                endTime:'',
                fileId:'',
                ruleDescription:'',
            },
            rules: {
                activityName: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                ],
                remark: [
                    { required: true, message: '请输入活动描述', trigger: 'blur' }
                ],
                startTime: [
                    { required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                endTime: [
                    { required: true, message: '请选择结束时间', trigger: 'change' }
                ],
                fileId: [
                    { required: true, message: '请上传活动主图' }
                ],
                ruleDescription: [
                    { required: true, message: '请输入活动规则', trigger: 'blur' }
                ],
            },
            fileList:[{url:''}],
            gridData:[],//弹框表格
            isShowFile:true,//是否显示上传的图片
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
            if(this.searchForm.startTime != null && this.searchForm.startTime != ''&&this.searchForm.endTime != null && this.searchForm.endTime != ''){
                if(this.searchForm.endTime<this.searchForm.startTime){
                    this.$message.error('开始时间不能大于结束时间!')
                    return
                }
            }
            for(var key in this.searchForm){
                if(this.searchForm[key]!=null&&this.searchForm[key]!=''){
                    data[key] = this.searchForm[key]
                }
            }
            getActivityList(data).then(res=>{
                this.totalRows = res.page.totalRows
                this.tableData = res.data
            })
        },
        // 改变页数后的方法
        handleCurrentChange(val) {
            this.currentPage = val
            this.getData()
        },
        // 状态开关
        changeStatus(status,id){
            let data = {
                activityId:id,
                status:status==true?0:1
            }
            updateActivityStatuse(data).then(res=>{
                this.$message.success(status==true?'禁用成功!':'启用成功!')
                this.getData()
            })
            .catch(res=>{
                this.getData()
            })
        },
        // 删除
        deleFn(id){
            this.$confirm('确定删除活动吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false
            }).then(() => {
                delActivity({activityId:id}).then(res=>{
                    this.$message.success('删除成功!')
                    this.getData()
                })
            }).catch(() => {
                // this.$message('info','已取消删除!')
            })
        },
        // 查看活动奖品
        checkdialog(id){
            this.dialogTableVisible = true
            getActivityGiftList({activityId:id}).then(res=>{
                this.gridData = res.data
            })
        },
        // 点击编辑
        handleEdit(info){
            this.dialogVisible = true
            this.form.activityId = info.activityId
            this.form.activityName = info.activityName
            this.form.remark = info.remark
            this.form.typeName = info.typeName
            this.form.ruleName = info.ruleName
            this.form.startTime = info.startTime
            this.form.endTime = info.endTime
            this.form.fileId = info.fileId
            this.form.ruleDescription = info.ruleDescription
            this.fileList[0].url = this.baseImgPath+info.picUrl
        },
        // 替换图片  只能上传一张
        handleChange(file, fileList) {
            fileList.length = 1
            fileList[0] = file
        },
        // 上传成功
        success1(response, file, fileList) {
            if (response.status == 0) {
                this.form.fileId = response.data.fileId
                this.isShowFile = true
            } else {
                this.$message.error(response.message)
                this.isShowFile = false
            }
        },
        // 删除文件
        remove1(file, fileList) {
            deleteFile({ fileId: this.form.fileId }).then(res=>{
                this.form.fileId = ''
            })
        },
        //提交编辑
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    updateActivity(this.form).then(res=>{
                        this.$message.success('编辑成功!')
                        this.getData()
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
.activityList{
    .el-form-item{
        margin-bottom: 22px;
    }
    .el-select-dropdown__item{
        padding: 0 20px;
    }
}
</style>