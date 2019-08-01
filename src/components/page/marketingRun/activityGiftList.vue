<template>
    <div class='activity proList boxs'>
        <div class="headBox">
            <h2>活动奖品</h2>
            <y-button text="新增活动奖品" class="button" classStyle="main-btn" @btnClick="routerLink('activityGiftAdd')"></y-button>
        </div>
        <div class="searchBox box">
            <div>
                <span>所属活动：</span>
                <el-select v-model="searchForm.activityId" placeholder="请选择">
                    <el-option key="" label="请选择" value=""></el-option>
                    <el-option
                        v-for="item in activityList"  :key="item.activityName" :label="item.activityName" :value="item.activityId">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>奖品类型：</span>
                <el-select v-model="searchForm.giftType" placeholder="请选择">
                    <el-option
                        v-for="item in options"  :key="item.label" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>奖品名称：</span>
                <el-input v-model="searchForm.giftName" placeholder="请输入内容" style="display:inline;"></el-input>
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
                label="奖品图片"
                width="120">
                <template slot-scope="scope"><img class="proImg" :src="baseImgPath+scope.row.picUrl" alt=""></template>
            </el-table-column>
            <el-table-column
                prop="giftName"
                label="奖品名称"
                width="120"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="giftTypeName"
                label="奖品类型"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="activityName"
                label="所属活动"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="skuName"
                label="商品名称"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="商品编码"
                show-overflow-tooltip >
                <template slot-scope="scope">
                    <span>{{scope.row.giftType==3?"":scope.row.skuId}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                :prop=""
                label="商品编码"
                show-overflow-tooltip v-if="giftType==3">
            </el-table-column> -->
            <el-table-column
                prop="giftRate"
                label="中奖概率"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="giftTotalCount"
                label="奖品总库存"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="leftCount"
                label="库存剩余数"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="statuStr"
                label="状态"
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
                        <span class="iconfont iconcaozuo-bianji" @click="handleEdit(scope.row)"></span>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <span class="iconfont iconcaozuo-lajitong red" @click="deleFn(scope.row.giftId)"></span>
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
            title="编辑活动奖品"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form ref="form" :model="form" label-width="160px" size="medium" :rules="rules">
                <el-form-item label="奖品名称：" prop="giftName">
                    <el-input v-model="form.giftName" placeholder="请输入1-10个字符" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="奖品类型：">
                    <el-input v-model="form.giftTypeName" disabled></el-input>
                </el-form-item>
                <el-form-item label="关联商品：" prop="skuItemId" v-show="isShow">
                    <el-select v-model="giftPro" filterable clearable 
                        placeholder="请输入关联商品名称" 
                        @change="handleSelectChange" 
                        :filter-method="handleFiltermethod"
                        @visible-change="handlevisiblechange">
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
                <el-form-item label="奖品总库存：" prop="giftTotalCount" v-show="isShow">
                    <el-input v-model="form.giftTotalCount" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="中奖概率：" prop="giftRate">
                    <el-input v-model="form.giftRate" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="奖品主图：" prop="fileId">
                    <el-upload :data="{fileType: 'gift_file_type'}" 
                        :file-list="fileList"
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <y-button text="保存" classStyle="main-btn"  @btnClick="submitForm('form')"></y-button>
                <y-button text="取消"  @btnClick="dialogVisible = false"></y-button>
            </span>
        </el-dialog>
    </div>
</template>
   
   
<script>
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import YButton from '@/components/common/YButton.vue'
import { getActivityList,getActivityGiftList,delActivityGift,getActivityGiftPro,updateActivityGift,getActivityGiftProduct,deleteFile } from '@/api/api.js'
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
                activityId:'',
                giftType:'',
                giftName:'',
            },
            options:[{
                    value: '',
                    label: '请选择'
                },{
                    value: '1',
                    label: '实物'
                },{
                    value: '2',
                    label: '卡券'
                },{
                    value: '3',
                    label: '谢谢参与'
            }],
            activityList:[],
            tableData: [],
            searchCondition:false,//是否显示更多条件
            dialogVisible:false,
            actionUrl:actionUrl.actionUrl,//上传图片地址
            baseImgPath:actionUrl.Base_IMGPATH,
            form:{
                giftName:'',
                giftTotalCount:'',
                giftRate:'',
                giftId:'',
                fileId:'',
                status:0,
                skuItemId:'',
                giftTypeName:'',
            },
            rules: {
                giftName: [
                    { required: true, message: '请输入奖品名称', trigger: 'blur' },
                ],
                // skuItemId
                skuItemId: [
                    { required: true, message: '请选择关联商品', trigger: 'blur' },
                ],
                giftTotalCount: [
                    { required: true, message: '请输入奖品总库存', trigger: 'blur' }
                ],
                giftRate: [
                    { required: true, message: '请输入中奖概率', trigger: 'change' }
                ],
                fileId: [
                    { required: true, message: '请上传活动奖品主图' }
                ],
                status: [
                    { required: true,message: '请选择活动奖品的状态'}
                ],
            },
            fileList:[{url:''}],//图片列表
            proList:[],//上传商品的列表
            isShow:false,//是否是谢谢参与
            isShowFile:true,//是否显示上传的图片
            giftPro:'',//编辑活动奖品的时候关联的商品名称
            skuName:'',//编辑时保存商品名称 便于回显
        }
    },
    created() {
        this.getData()
        this.getActivityList()
        // this.handleFiltermethod()
    },
    methods: {
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
            getActivityGiftList(data).then(res=>{
                this.totalRows = res.page.totalRows
                this.tableData = res.data
            })
        },
        // 获取所有活动
        getActivityList(){
            getActivityList().then(res=>{
                this.activityList = res.data
            })
        },
        // 改变页数后的方法
        handleCurrentChange(val) {
            this.currentPage = val
            this.getData()
        },
        // 删除
        deleFn(id){
            this.$confirm('确定删除活动奖品吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false
            }).then(() => {
                delActivityGift({giftId:id}).then(res=>{
                    this.$message.success('删除成功!')
                    this.getData()
                })
            }).catch(() => {
                // this.$message('info','已取消删除!')
            })
        },
        // 点击编辑
        handleEdit(info){
            this.dialogVisible = true
            this.form.giftId = info.giftId
            this.form.giftName = info.giftName
            this.form.giftTotalCount = info.giftTotalCount
            this.form.giftRate = info.giftRate
            this.form.fileId = info.fileId
            this.form.status = info.status
            this.fileList[0].url = this.baseImgPath+info.picUrl
            this.form.skuItemId=info.skuId+","+info.skuItemId
            this.form.activityId=info.activityId;
            this.form.giftTypeName=info.giftTypeName;
            this.giftPro = info.skuName+' '+info.oneNormValue+' '+info.twoNormValue+' '+info.threeNormValue;
            this.skuName = info.skuName
            if(info.giftType==3){
                this.isShow=false;
                this.rules.skuItemId[0].required=false;
                this.rules.giftTotalCount[0].required=false;
            }else {
                this.isShow=true;
                this.rules.skuItemId[0].required=true;
                this.rules.giftTotalCount[0].required=true;
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
            deleteFile({ fileId: this.form.fileId }).then(res=>{
                this.form.fileId = ''
            })
        },
        //搜索商品
        handleFiltermethod(val){
            if(this.form.giftTypeName=='实物'){
                getActivityGiftProduct({name:val}).then(res=>{
                    this.proList = res.data
                })
            }else if(this.form.giftTypeName=='卡券'){
                getActivityGiftPro({name:val}).then(res=>{
                    this.proList = res.data
                })
            }
        },
        handlevisiblechange(flag){
            if(flag){
                this.handleFiltermethod(this.skuName)
            }
        },
        // 点击搜索出来的结果
        handleSelectChange(val){
            if(val==null||val==''){
                this.form.skuItemId = ''
                return
            }
            this.form.skuItemId = val
        },
        //提交编辑
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    updateActivityGift(this.form).then(res=>{
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
   
<style scoped lang='scss'>
    
</style>