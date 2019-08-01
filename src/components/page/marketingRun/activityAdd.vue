<template>
    <div class='activityAdd proList boxs'>
        <div class="headBox">
            <h2>新增活动</h2>
        </div>
        <el-form ref="form" :model="form" label-width="140px" size="medium" :rules="rules">
            <el-form-item label="活动名称" prop="activityName">
                <el-input v-model="form.activityName" placeholder="请输入1-20个字符" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="活动描述" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入1-60个字符" maxlength="60"></el-input>
            </el-form-item>
            <el-form-item label="活动类型" prop="typeId">
                <el-select v-model="form.typeId" placeholder="请选择" @change="handleSelectChange">
                    <el-option
                        v-for="item in typeIds"  :key="item.label" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动规则" prop="ruleId">
                <el-select v-model="form.ruleId" placeholder="请选择">
                    <el-option
                        v-for="item in ruleList"  :key="item.ruleId" :label="item.ruleName" :value="item.ruleId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
                <!-- <el-date-picker
                    v-model="form.valueDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="选择开始时间"
                    end-placeholder="选择结束时间">
                </el-date-picker> -->
                <el-date-picker
                    v-model="form.startTime"
                    type="date"
                    placeholder="选择开始时间" style="display:inline;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                    v-model="form.endTime"
                    type="date"
                    placeholder="选择结束时间" style="display:inline;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="活动主图" prop="fileId">
                <el-upload :data="{fileType: 'activity_file_type'}" 
                    :action="actionUrl" list-type="picture-card" 
                    :on-change="handleChange" 
                    :show-file-list="isShowFile"
                    :on-success="success1" 
                    :on-remove="remove1">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="">
                <p style="color:#ccc">图片上传大小：低于1M，尺寸：300*168px，格式：JPG、JPEG、PNG</p>
            </el-form-item>
            <el-form-item label="活动规则" prop="ruleDescription">
                <el-input type="textarea" v-model="form.ruleDescription" placeholder="请输入1-1000个字符" maxlength="1000"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">立即新增</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
   
   
<script>
import { getActivityTypeList,getActivityRuleList,deleteFile,addActivity } from '@/api/api.js'
import actionUrl from '@/api/request.js'
export default {
    components: {
    },
    data() {
        return {
            form:{
                activityName:'',
                remark:'',
                typeId:'',
                ruleId:'',
                startTime:'',
                endTime:'',
                fileId:'',
                ruleDescription:'',
            },
            rules: {
                activityName: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                remark: [
                    { required: true, message: '请输入活动描述', trigger: 'blur' }
                ],
                typeId: [
                    { required: true, message: '请选择活动类型', trigger: 'change' }
                ],
                ruleId: [
                    { required: true, message: '请选择活动规则', trigger: 'change' }
                ],
                startTime: [
                    { type: 'date',required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                endTime: [
                    { type: 'date',required: true, message: '请选择结束时间', trigger: 'change' }
                ],
                fileId: [
                    { required: true, message: '请上传活动主图' }
                ],
                ruleDescription: [
                    { required: true, message: '请输入活动规则', trigger: 'blur' }
                ],
            },
            ruleList:[],
            valueDate:'',
            typeIds:[
                // {
                //     value: '1',
                //     label: '大转盘抽奖类型'
                // },{
                //     value: '2',
                //     label: '趣味翻牌类型'
                // },{
                //     value: '3',
                //     label: '疯狂咋砸金蛋类型'
                // },
                {
                    value: '4',
                    label: '幸运刮刮乐类型'
            }],
            actionUrl:actionUrl.actionUrl,//上传图片地址
            isShowFile:true,//是否显示上传的图片
        }
    },
    created() {
    },
    methods: {
        // 选择活动类型改变活动规则
        handleSelectChange(val){
            getActivityRuleList({typeId:val}).then(res=>{
                this.ruleList = res.data
            })
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
            if(!this.form.fileId){
                return;
            }
            deleteFile({ fileId: this.form.fileId }).then(res=>{})
        },
        //提交新增
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addActivity(this.form).then(res=>{
                        this.$message.success('新增成功!')
                        this.routerLink('activityList',{id:2})
                    })
                } else {
                    return false;
                }
            })
        },
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields()
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