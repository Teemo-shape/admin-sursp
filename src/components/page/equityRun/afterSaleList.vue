<template>
    <div class='proList boxs'>
        <div class="headBox">
            <h2>发货列表</h2>
        </div>
        <div class="searchBox box">
            <div>
                <span>订单号：</span>
                <el-input v-model="searchForm.parentOrderId" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
            <div>
                <span>子订单号：</span>
                <el-input v-model="searchForm.orderId" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
            <div>
                <span>商品名称：</span>
                <el-input v-model="searchForm.productName" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
            <div>
                <span>售后编号：</span>
                <el-input v-model="searchForm.id" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
             <div v-show="searchCondition">
                <span>售后类型：</span>
                <el-select v-model="searchForm.afterType" placeholder="请选择">
                    <el-option
                        v-for="item in afterTypes"
                        :key="item.afterType"
                        :label="item.label"
                        :value="item.afterType">
                    </el-option>
                </el-select>
            </div>
             <div v-show="searchCondition">
                <span>售后状态：</span>
                <el-select v-model="searchForm.status" placeholder="请选择">
                    <el-option
                        v-for="item in afterStatus"
                        :key="item.status"
                        :label="item.label"
                        :value="item.status">
                    </el-option>
                </el-select>
            </div>
            <div v-show="searchCondition">
                <span>开始时间：</span>
                <el-date-picker
                    v-model="searchForm.startDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择开始时间" style="display:inline;">
                </el-date-picker>
            </div>
            <div v-show="searchCondition">
                <span>结束时间：</span>
                <el-date-picker
                    v-model="searchForm.endDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择结束时间" style="display:inline;">
                </el-date-picker>
            </div>
            <div v-show="searchCondition">
                <span>用户ID：</span>
                <el-input v-model="searchForm.userId" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
        </div>
        <div class="searchCondition">
            <el-switch
                v-model="searchCondition"
                active-text="更多条件"
                inactive-text="简单条件">
            </el-switch>
            <y-button text="搜索" class="button" classStyle="main-btn" @btnClick="handleCurrentChange(1)"></y-button>
        </div>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column type="expand">
            <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="订单号">
                        <span>{{ scope.row.parentOrderId }}</span>
                    </el-form-item>
                    <el-form-item label="子订单号">
                        <span>{{ scope.row.orderId }}</span>
                    </el-form-item>
                    <el-form-item label="申请时间">
                        <span>{{ scope.row.createdDate }}</span>
                    </el-form-item>
                    <el-form-item label="用户ID">
                        <span>{{ scope.row.userId }}</span>
                    </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
                label="售后编号"
                prop="id">
            </el-table-column>
            <el-table-column
                label="售后类型"
                prop="afterTypeStr">
            </el-table-column>
            <el-table-column
                label="商品名称"
                show-overflow-tooltip
                prop="productName">
            </el-table-column>
            <el-table-column
                :label="'退款'+integralName"
                prop="returnIntegral">
            </el-table-column>
            <el-table-column
                label="商品来源"
                prop="supplierName">
            </el-table-column>
            <el-table-column
                label="供应链状态"
                prop="gylStatusStr">
            </el-table-column>
            <el-table-column
                label="用户备注"
                show-overflow-tooltip
                prop="remarkDesc">
            </el-table-column>
            <el-table-column
                label="售后状态"
                prop="statusStr">
            </el-table-column>
            <el-table-column
                v-if="!showCompany"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-tooltip content="查看详情" placement="top">
                        <span class="iconfont iconcaozuo-yulan"
                            @click="afterSaleDetail(scope.row.id)">
                        </span>
                    </el-tooltip>
                    <el-tooltip content="审核" placement="top">
                        <span  class="iconfont iconcaozuo-shenhe"
                            v-show="scope.row.status==0"
                            @click="auditOrder(scope.row.id,scope.row.afterType,'form')">
                        </span>
                    </el-tooltip>
                    <el-tooltip content="确认收货" placement="top">
                        <span class="iconfont iconcaozuo-querenshouhuo"
                            @click="confirmSure(scope.row.id,scope.row.afterType)"
                            v-show="scope.row.status==1">
                        </span>
                    </el-tooltip>
                    <el-tooltip content="填写物流信息" placement="top">
                        <span class="iconfont iconcaozuo-tianxiewuliuxinxi"
                            @click="whiteLogistics(scope.row.id,scope.row.afterType,'logisticsForm')"
                            v-show="scope.row.status==3">
                        </span>
                    </el-tooltip>
                    <el-tooltip content="推送物流信息" placement="top" v-show="false">
                        <span class="iconfont iconcaozuo-tuisongwuliuxinxi"
                            @click="auditOrder()"
                            v-show="scope.row.isSend==1&&scope.row.supplierId==4">
                        </span>
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
        <el-dialog title="售后订单审核" :visible.sync="dialogEditVisible" width="35%"> 
            <el-form ref="form" :model="form" label-width="120px" size="medium" :rules="rules">
                <el-form-item label="订单审核：" prop="verifyStatus">
                    <el-radio-group v-model="form.verifyStatus" class="auditRadio">
                        <el-radio :label="1">通过</el-radio>
                        <el-radio :label="0">不通过</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="收货人姓名" prop="consigneeName" v-show="isShowPeopleInfo&&form.verifyStatus==1">
                    <el-input v-model="form.consigneeName"></el-input>
                </el-form-item>
                <el-form-item label="收货人手机号" prop="consigneeMoblie" v-show="isShowPeopleInfo&&form.verifyStatus==1">
                    <el-input v-model="form.consigneeMoblie" type="tel" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="收货人地址" prop="consigneeAddress" v-show="isShowPeopleInfo&&form.verifyStatus==1">
                    <el-input v-model="form.consigneeAddress"></el-input>
                </el-form-item>
                <el-form-item label="审核留言：">
                    <el-input type="textarea" v-model="form.replyContent" placeholder="请输入留言"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <y-button text="确定" classStyle="main-btn"  @btnClick="submitForm('form')"></y-button>
                <y-button text="取消"  @btnClick="dialogEditVisible = false"></y-button>
            </span>
        </el-dialog>
        <el-dialog title="填写物流信息" :visible.sync="logisticsFormVisible" width="35%"> 
            <el-form ref="logisticsForm" :model="logisticsForm" label-width="120px" size="medium" :rules="rules">
                <el-form-item label="物流公司" prop="logisticsName">
                    <el-select v-model="logisticsForm.logisticsName" placeholder="请选择物流公司" @change="handleLogistics">
                        <el-option
                            v-for="item in options"  :key="item.logisticsNum" :label="item.logisticsName" :value="item.logisticsNum">
                        </el-option>
                    </el-select>
                    <!-- <el-input v-model="logisticsForm.logisticsName"></el-input> -->
                </el-form-item>
                <el-form-item label="物流单号" prop="logisticsCode">
                    <el-input v-model="logisticsForm.logisticsCode"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <y-button text="确定" classStyle="main-btn"  @btnClick="submitFormLogist('logisticsForm')"></y-button>
                <y-button text="取消"  @btnClick="logisticsFormVisible = false"></y-button>
            </span>
        </el-dialog>
        <el-dialog title="查看售后详情" :visible.sync="dialogVisible"> 
            <el-collapse v-model="activeNames">
                <el-collapse-item title="订单信息" name="1">
                    <div class="collapse_item">
                        <span>订单号：{{orderInfo.parentOrderId}}</span>
                        <span>子订单号：{{orderInfo.orderId}}</span>
                        <span>下单时间：{{orderInfo.orderDate}}</span>
                        <span>收货人姓名：{{orderInfo.receiveName}}</span>
                        <span>联系电话：{{orderInfo.receiveMobile}}</span>
                        <span>详细收货地址：{{orderInfo.receiveAddress}}</span>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="商品信息" name="2">
                    <div class="collapse_item">
                        <span>商品编号：{{orderInfo.skuId}}</span>
                        <span>商品名称：{{orderInfo.productName}}</span>
                        <span>购买数量：{{orderInfo.buyCount}}</span>
                        <span>销售单价：{{orderInfo.saleIntegral}}</span>
                        <span>销售{{integralName}}：{{orderInfo.returnIntegral}}</span>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="售后信息" name="3">
                    <div class="collapse_item">
                        <span>售后编号：{{orderInfo.id}}</span>
                        <span>售后类型：{{orderInfo.afterTypeStr}}</span>
                        <span>退换货数量：{{orderInfo.returnCount}}</span>
                        <span>退款{{integralName}}：{{orderInfo.returnIntegral}}</span>
                        <span>售后状态：{{orderInfo.statusStr}}</span>
                        <span>审核留言：{{orderInfo.replyContent}}</span>
                        <span>售后申请时间：{{orderInfo.createdDate}}</span>
                        <span>问题原因：{{orderInfo.remarkDesc}}</span>
                        <span>问题图片：
                            <vue-preview :slides="orderInfo.attachFiles"></vue-preview>
                            <!-- <img :src="baseImgPath+item.fileUrl" alt="" v-for="item in orderInfo.attachFiles" style="width:200px;height:200px;"> -->
                        </span>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="退货物流信息" name="4">
                    <div class="collapse_item">
                        <span>快递公司：{{orderInfo.userLogisticsName}}</span>
                        <span>快递单号：{{orderInfo.userLogisticsCode}}</span>
                        <span>收货人姓名：{{orderInfo.consigneeName}}</span>
                        <span>联系方式：{{orderInfo.consigneeMoblie}}</span>
                        <span>收货人地址：{{orderInfo.consigneeAddress}}</span>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="换货物流信息" name="5">
                    <div class="collapse_item">
                        <span>快递公司：{{orderInfo.logisticsName}}</span>
                        <span>快递单号：{{orderInfo.logisticsCode}}</span>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <span slot="footer" class="dialog-footer">
                <y-button text="确定" classStyle="main-btn"  @btnClick="dialogVisible = false"></y-button>
                <y-button text="取消"  @btnClick="dialogVisible = false"></y-button>
            </span>
        </el-dialog>
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import Bus from '../../common/bus.js'
import request from '@/api/request.js'
import {queryAfterSaleList,addCompanyPage,afterSaleDetail,verify,confirmCollect,updateLogisticsInfo,getlogisticsName,getInteger } from '@/api/api.js'
export default {
    components: {
      YButton
    },
    data() {
        return {
            pageSize:10,
            totalRows:0,
            currentPage:1,
            searchForm:{},//搜索参数
            tableData: [],
            afterTypes: [{
                    afterType: '',
                    label: '请选择'
                },{//售后类型
                    afterType: 1,
                    label: '退货退款'
                }, {
                    afterType: 2,
                    label: '换货'
                }, {
                    afterType: 3,
                    label: '仅退款'
            }],
            afterStatus: [{
                    status: '',
                    label: '请选择'
                },{//售后状态
                    status: 0,
                    label: '待审批'
                }, {
                    status: 1,
                    label: '待退货'
                }, {
                    status: 2,
                    label: '退货待退款'
                }, {
                    status: 3,
                    label: '换货待发货'
                }, {
                    status: 4,
                    label: '换货待收货'
                }, {
                    status: 5,
                    label: '待退款'
                }, {
                    status: 6,
                    label: '退货退款完成'
                }, {
                    status: 7,
                    label: '换货完成'
                }, {
                    status: 8,
                    label: '退款完成'
                }, {
                    status: 9,
                    label: '售后驳回'
            }],
            showCompany:false,//超级管理员显示公司 系统管理员不显示
            searchCondition:true,//是否显示更多条件
            dialogEditVisible:false,//审核弹框
            dialogVisible:false,//订单详情弹框
            activeNames:['1','2'],//订单详情默认展开
            orderInfo:'',
            form:{//审核的弹框内容
                consigneeName:'',
                consigneeMoblie:'',
                consigneeAddress:'',
                replyContent:'',
                verifyStatus:'',
                id:'',
                afterType:''
            },
            rules: {
                verifyStatus: [
                    { required: true, message: '请选择审核状态', trigger: 'change' },
                ],
                consigneeName: [
                    { required: true, message: '请输入收货人姓名', trigger: 'change' },
                ],
                consigneeMoblie: [
                    { required: true, message: '请输入收货人手机号', trigger: 'change' },
                ],
                consigneeAddress: [
                    { required: true, message: '请输入收货人地址', trigger: 'change' },
                ],
                logisticsName: [
                    { required: true, message: '请输入物流公司', trigger: 'change' },
                ],
                logisticsCode: [
                    { required: true, message: '请输入物流单号', trigger: 'change' },
                ],
            },
            isShowPeopleInfo:false,//审批的时候是否显示收货人信息
            logisticsFormVisible:false,//物流信息
            logisticsForm:{//物流信息的内容
                logisticsName:'',
                logisticsCode:'',
                id:'',
                afterType:'',
            },
            options:[],//物流公司
            integralName:'',
            baseImgPath:request.Base_IMGPATH,//图片库
        }
    },
    created() {
        let companyId = localStorage.getItem('companyId');
        if(!companyId){
            this.showCompany = true;
        }
        this.getOrderList();
        this.getInteger();
    },
    methods: {
        getOrderList(){
            let data = {
                page: this.currentPage,
                pageSize: this.pageSize,
                pagination: true,
            }
            if(this.searchForm.startDate != null && this.searchForm.startDate != ''&&this.searchForm.endDate != null && this.searchForm.endDate != ''){
                if(this.searchForm.endDate<this.searchForm.startDate){
                    this.$message.error('开始时间不能大于结束时间!')
                    return
                }
            }
            for(var key in this.searchForm){
                if(this.searchForm[key]!=null&&this.searchForm[key]!==''){
                    data[key] = this.searchForm[key]
                }
            }
            queryAfterSaleList(data).then(res=>{
                this.totalRows = res.page.totalRows;
                this.tableData = res.data
            })
        },
        // 获取用户积分名称
        getInteger(){
            getInteger().then(res=>{
                this.integralName=res.data.integralName
            })
        },
        // 改变页数后的方法
        handleCurrentChange(val) {
            this.currentPage = val
            this.getOrderList()
        },
        // 查看详情
        afterSaleDetail(id){
            afterSaleDetail({id:id}).then(res=>{
                if(res.data.attachFiles!=null&&res.data.attachFiles.length!=0){
                    res.data.attachFiles.forEach(item=>{
                        item.w = 900;
                        item.h = 900;
                        item.msrc = this.baseImgPath + item.fileUrl;
                        item.src = this.baseImgPath + item.fileUrl;
                    })
                }
                this.orderInfo = res.data
                this.dialogVisible = true
            })
        },
        // 审核
        auditOrder(id,type,formName){
            // this.$refs[formName].resetFields()
            
            if(type==1||type==2){
                this.isShowPeopleInfo = true
            }else{
                this.isShowPeopleInfo = false 
            }
            this.dialogEditVisible = true
            this.form.id = id
            this.form.afterType = type  
        },
        //确认审核
        submitForm(formName) {
            if(this.isShowPeopleInfo){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(!this.checkPhone(this.form.consigneeMoblie)){
                            this.$message.error('请输入正确的手机号码!')
                            return
                        }
                        verify(this.form).then(res=>{
                            this.$message.success('审核成功!')
                            this.dialogEditVisible = false
                            this.getOrderList()
                        })
                    } else {
                        return false;
                    }
                })
            }else{
                if(this.form.verifyStatus==null||this.form.verifyStatus===''){
                    this.$message.error('请先选择订单审核状态!')
                    return
                }
                
                this.form.consigneeName = ''
                this.form.consigneeMoblie = ''
                this.form.consigneeAddress = ''
                verify(this.form).then(res=>{
                    this.$message.success('审核成功!')
                    this.dialogEditVisible = false
                    this.getOrderList()
                })
            }
            
        },
        //确认收货
        confirmSure(id,type){
            this.$confirm('确定收货吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false
            }).then(() => {
                let data = {
                    id:id,
                    afterType:type,
                    confirmStatus:1
                }
                confirmCollect(data).then(res=>{
                    this.$message.success('收货成功!')
                    this.getOrderList()
                })
            }).catch(() => {})
        },
        // 填写物流信息
        whiteLogistics(id,type,formName){
            this.logisticsForm.logisticsCode = ''
            this.logisticsForm.logisticsName = ''
            this.logisticsForm.id = id
            this.logisticsForm.afterType = type
            getlogisticsName().then(res=>{
                this.options = res.data
                this.logisticsFormVisible = true
            })
        },
        // 切换选择物流公司
        handleLogistics(val){
            this.options.forEach(item=>{
                if(item.logisticsNum==val){
                    this.logisticsForm.logisticsName = item.logisticsName
                }
            })
        },
        // 确认填写物流
        submitFormLogist(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    updateLogisticsInfo(this.logisticsForm).then(res=>{
                        this.$message.success('物流填写成功!')
                        this.logisticsFormVisible = false
                        this.getOrderList()
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
    .size {
        div {
            margin-bottom:20px;
        }
    }
    .logistics_steplist {
        padding: 34px 29px 0 29px;
        background-color: #fff;
        box-sizing: border-box;
    }
    .logistics_steplist li {
        padding: 0 0 29px 0;
        position: relative;
        border-left: 1px solid #E2E2E2;
        color: #828282;
        letter-spacing: 1px;
    }
    .logistics_steplist li:before {
        position: absolute;
        top: 0;
        margin-left: -5.5px;
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background-color: #C1C1C1;
    }
    .logistics_steplist li .title {
        position: relative;
        top: -5px;
        padding-left: 28.5px;
        word-break: break-all;
        font-size: 13px;
    }
    .logistics_steplist li .cont {
        padding-left: 28.5px;
        word-break: break-all;
        font-size: 12px;
    }
    .logistics_steplist li:first-child:before {
        position: absolute;
        top: 0;
        margin-left: -9.5px;
        content: '';
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url('../../../assets/images/logistics.png') no-repeat;
        background-size: 100% 100%;
        background-color: #fff;
    }
    .logistics_steplist li:first-child {
        color: #09BB07;
        >p {
            font-size: 14px;
        }
    }
    .logistics_steplist li:last-child {
        border-left: 2px solid #fff;
    }
    .logistics_info {
        max-height: 340px;
        overflow: scroll;
    }
    .el-collapse{
        border-bottom: none;
    }
    .el-collapse-item__header{
        font-weight: 900;
    }
    .collapse_item{
        span{
            width: 50%;
            display: inline-block;
        }
    }
    .el-select-dropdown__item{
        padding: 0 20px;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .auditRadio{
        .el-radio{
            display: initial;
        }
    }
</style>