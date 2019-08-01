<template>
    <div class='activityAdd proList boxs'>
        <div class="headBox">
            <h2>新增活动奖品</h2>
        </div>
        <el-form ref="form" :model="form" label-width="140px" size="medium" :rules="rules">
            <el-form-item label="所属活动" prop="activityId">
                <el-select v-model="form.activityId" placeholder="请选择">
                    <el-option
                        v-for="item in activityList" :key="item.activityName" :label="item.activityName" :value="item.activityId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="奖品名称" prop="giftName">
                <el-input v-model="form.giftName" placeholder="请输入1-10个字符" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="奖品类型" prop="giftType">
                <el-select v-model="form.giftType" placeholder="请选择" @change="changeGiftType">
                    <el-option
                        v-for="item in options"  :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关联商品" prop="skuItemId" v-show="!isThanks">
                <el-input placeholder="未上架商品，请前往上架" disabled v-show="isHavePro&&form.giftType!=3"></el-input>
                <el-select v-model="form.skuItemId" filterable clearable placeholder="请输入关联商品名称" :filter-method="handleFiltermethod" v-show="!isHavePro">
                    <el-option
                        v-for="item in proList"
                        :key="item.skuId+','+item.skuItemId"
                        :label="item.name+' '+item.oneNormValue+' '+item.twoNormValue+' '+item.threeNormValue"
                        :value="item.skuId+','+item.skuItemId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="" style="margin-bottom:5px;margin-top:-20px;">
                <span style="font-size:12px;color:#ccc;">关联商品为上架商品，输入策划用于活动的商品名称即可搜索</span>
            </el-form-item>
            <el-form-item label="奖品总库存" prop="giftTotalCount" v-show="!isThanks">
                <el-input v-model="form.giftTotalCount"></el-input>
            </el-form-item>
            <el-form-item label="中奖概率" prop="giftRate">
                <el-input v-model="form.giftRate" placeholder="一个活动的所有奖品中奖概率总和应该为1"></el-input>
            </el-form-item>
            <el-form-item label="活动奖品主图" prop="fileId">
                <el-upload :data="{fileType: 'gift_file_type'}" 
                    :action="actionUrl" list-type="picture-card" 
                    :on-change="handleChange" 
                    :show-file-list="isShowFile"
                    :on-success="success1" 
                    :on-remove="remove1">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="">
                <p style="color:#ccc">图片上传尺寸：200*200px，大小：低于500k，格式：JPG、JPEG、PNG</p>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio :label="0">下架</el-radio>
                    <el-radio :label="1">上架</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">立即新增</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import { getActivityList,getActivityGiftPro,addActivityGift,getActivityGiftProduct,deleteFile,getProducts } from '@/api/api.js'
import actionUrl from '@/api/request.js'
export default {
    components: {
      YButton
    },
    data() {
        return {
            form:{
                activityId:'',
                giftName:'',
                giftType:'',
                skuItemId:'',
                giftTotalCount:'',
                giftRate:'',
                fileId:'',
                status:0,
            },
            rules: {
                activityId: [
                    { required: true, message: '请选择所属活动', trigger: 'change' },
                ],
                giftName: [
                    { required: true, message: '请输入奖品名称', trigger: 'blur' }
                ],
                giftType: [
                    { required: true, message: '请选择奖品类型', trigger: 'change' }
                ],
                skuItemId: [
                    { required: true, message: '请选择关联商品', trigger: 'change' }
                ],
                giftTotalCount: [
                    { required: true, message: '请输入奖品总库存', trigger: 'blur' }
                ],
                giftRate: [
                    {required: true, message: '请输入中奖概率', trigger: 'blur' },
                    // { type:'number', message: '该活动的中奖概率总和为1'}
                ],
                fileId: [
                    { required: true, message: '请上传活动奖品主图' }
                ],
                status: [
                    { required: true}
                ],
            },
            activityList:[],
            valueDate:'',
            options:[{
                    value: '1',
                    label: '实物'
                },
                // {
                //     value: '2',
                //     label: '卡券'
                // },
                {
                    value: '3',
                    label: '谢谢参与'
            }],
            actionUrl:actionUrl.actionUrl,//上传图片地址
            proList:[],//上传商品的列表
            isThanks:false,//是不是谢谢参与
            isShowFile:true,//是否显示上传的图片
            isHavePro:false,//是否有上架商品
        }
    },
    created() {
        this.getActivityList()
    },
    watch:{
        isThanks(newval,oldval){
            this.rules.giftTotalCount[0].required=!newval;
            this.rules.skuItemId[0].required=!newval;
        }
    },
    methods: {
        // 获取所有活动
        getActivityList(){
            getActivityList().then(res=>{
                this.activityList = res.data
            })
        },
        // 是否有上架商品
        getProducts(){
            getProducts({jfStatus:1}).then(res=>{
                if(res.data!=null&&res.data.length!=0){
                    this.isHavePro = false
                }else{
                    this.isHavePro = true
                }
            })
        },
        // 如果是谢谢参与
        changeGiftType(val){
            this.proList = []
            this.form.skuItemId = ''
            if(val==1){
                this.getProducts()
            }else if(val==2){
                this.isHavePro = true
            }
            if(val==3){
                this.isThanks = true
            }else{
                this.isThanks = false
            }
        },
        //搜索商品
        handleFiltermethod(val){
            if(this.form.giftType==null||this.form.giftType==''){
                this.$message.error('请先选择奖品类型!')
                return
            }
            //1是实物  2是卡券
            if(this.form.giftType==1){
                getActivityGiftProduct({name:val}).then(res=>{
                    if(res.data!=null&&res.data!=''){
                        this.proList = res.data
                    }else{
                        this.$message.info('请确定对应商品是否已上架，前往【权益服务】-【待上架商品】上架商品')
                    }
                })
            }else if(this.form.giftType==2){
                getActivityGiftPro({name:val}).then(res=>{
                    this.proList = res.data
                })
            }
            
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
            deleteFile({ fileId: this.form.fileId }).then(res=>{})
        },
        //提交新增
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addActivityGift(this.form).then(res=>{
                        this.$message.success('新增成功!')
                        this.routerLink('activityGiftList')
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