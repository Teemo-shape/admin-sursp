<template>
    <div class='proList boxs'>
        <div class="headBox">
            <h2>发货列表</h2>
        </div>
        <div class="searchBox box">
            <div>
                <span>订单号：</span>
                <el-input v-model="searchForm.orderId" placeholder="请输入订单号" style="display:inline;"></el-input>
            </div>
            <div>
                <span>商品名称：</span>
                <el-input v-model="searchForm.productName" placeholder="请输入商品名称" style="display:inline;"></el-input>
            </div>
            <div>
                <span>收货人姓名：</span>
                <el-input v-model="searchForm.consigneeName" placeholder="请输入收货人姓名" style="display:inline;"></el-input>
            </div>
            <div>
                <span>收货人手机号：</span>
                <el-input v-model="searchForm.consigneeMobile" type="number" maxlength="11" placeholder="请输入手机号" style="display:inline;"></el-input>
            </div>
             <div v-if="showCompany" v-show="searchCondition">
                <span>所属公司：</span>
                <el-select v-model="searchForm.companyId" placeholder="请选择">
                    <el-option key="" label="请选择" value="">
                    </el-option>
                    <el-option
                        v-for="item in companyOptions"
                        :key="item.companyId"
                        :label="item.companyName"
                        :value="item.companyId">
                    </el-option>
                </el-select>
            </div>
            <div v-show="searchCondition">
                <span>开始时间：</span>
                <el-date-picker
                    v-model="searchForm.orderStartDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择开始时间" style="display:inline;">
                </el-date-picker>
            </div>
            <div v-show="searchCondition">
                <span>结束时间：</span>
                <el-date-picker
                    v-model="searchForm.orderEndDate"
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
                        <span>{{ scope.row.orderId }}</span>
                    </el-form-item>
                    <el-form-item label="子订单号">
                        <span>{{ scope.row.orderItemId }}</span>
                    </el-form-item>
                    <el-form-item label="下单时间">
                        <span>{{ scope.row.orderCreateDate }}</span>
                    </el-form-item>
                    <el-form-item label="用户ID">
                        <span>{{ scope.row.userId }}</span>
                    </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
                label="商品名称"
                show-overflow-tooltip
                prop="productName">
            </el-table-column>
            <el-table-column
                label="商品数量"
                prop="productNum">
            </el-table-column>
            <el-table-column
                label="发货状态"
                prop="childrenOrderStatusStr">
            </el-table-column>
            <el-table-column
                label="收货人姓名"
                prop="consigneeName">
            </el-table-column>
            <el-table-column
                label="收货人手机号"
                prop="consigneeMobile">
            </el-table-column>
            <el-table-column
                label="收货地址"
                show-overflow-tooltip
                prop="consigneeAdress">
            </el-table-column>
            <el-table-column
                v-if="!showCompany"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <!-- <el-tooltip content="查看详情" placement="top">
                        <span class="iconfont iconcaozuo-yulan"
                            v-show="scope.row.productType==1"
                            @click="getOrderDetail(scope.row.orderItemId)">
                        </span>
                    </el-tooltip> -->
                    <el-tooltip content="发货" placement="top">
                        <span class="iconfont iconcaozuo-fahuo"
                            @click="shipments(scope.row.orderItemId,'form')">
                        </span>
                    </el-tooltip>
                    <el-tooltip content="取消订单" placement="top">
                        <span  class="iconfont iconcaozuo-quxiaodingdan" 
                            @click="cancleOrder(scope.row.orderItemId)">
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
        <el-dialog title="填写发货信息" :visible.sync="dialogEditVisible" width="30%"> 
            <el-form ref="form" :model="form" label-width="120px" size="medium" :rules="rules">
                <el-form-item label="物流公司：" prop="logisticsNum">
                    <el-select v-model="form.logisticsNum" placeholder="请选择物流公司" @change="handleLogistics">
                        <el-option
                            v-for="item in options"  :key="item.logisticsNum" :label="item.logisticsName" :value="item.logisticsNum">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物流单号：" prop="JDOrderId">
                    <el-input v-model="form.JDOrderId" placeholder="请输入物流单号"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <y-button text="确定" classStyle="main-btn"  @btnClick="submitForm('form')"></y-button>
                <y-button text="取消"  @btnClick="dialogEditVisible = false"></y-button>
            </span>
        </el-dialog>
        <!-- <el-dialog title="查看订单详情" :visible.sync="dialogVisible"> 
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="订单信息" name="1">
                    <div class="collapse_item">
                        <span>订单号：{{orderInfo.orderId}}</span>
                        <span>子订单号：{{orderInfo.orderItemId}}</span>
                        <span>订单价：{{orderInfo.costIntegral}}</span>
                        <span>商品数量：{{orderInfo.productNum}}</span>
                        <span>订单状态：{{orderInfo.childrenOrderStatusStr}}</span>
                        <span>下单时间：{{orderInfo.orderCreateDate}}</span>
                        <span>用户下单ID：{{orderInfo.userId}}</span>
                        <span>备注：{{orderInfo.userOrderRemark}}</span>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="收货信息" name="2">
                    <div class="collapse_item">
                        <span>收货人姓名：{{orderInfo.consigneeName}}</span>
                        <span>联系电话：{{orderInfo.consigneeMobile}}</span>
                        <span>详细收货地址：{{orderInfo.consigneeAdress}}</span>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="商品信息" name="3">
                    <div class="collapse_item">
                        <span>商品ID：{{orderInfo.skuId}}</span>
                        <span>供应商：{{orderInfo.supplierName}}</span>
                        <span>成本价：{{orderInfo.price}}</span>
                        <span>商品规格：{{orderInfo.normValues}}</span>
                        <span>商品名称：{{orderInfo.productName}}</span>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <span slot="footer" class="dialog-footer">
                <y-button text="确定" classStyle="main-btn"  @btnClick="dialogVisible = false"></y-button>
                <y-button text="取消"  @btnClick="dialogVisible = false"></y-button>
            </span>
        </el-dialog> -->
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import Bus from '../../common/bus.js'
import {querySendOutGoodsOrderList,addCompanyPage,getOrderDetail,updateLogistics,updateOrderStatus,getlogisticsName } from '@/api/api.js'
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
            options: [],
            tableData: [],
            companyOptions:[],//公司选择
            showCompany:false,//超级管理员显示公司 系统管理员不显示
            searchCondition:true,//是否显示更多条件
            dialogEditVisible:false,//发货弹框
            dialogVisible:false,//订单详情弹框
            activeNames:['1','2','3'],//订单详情默认展开
            orderInfo:'',
            form:{
                JDOrderId:'',
                orderItemId:'',
                logisticsNum:'',
                logisticsName:'',
            },
            rules: {
                logisticsNum: [
                    { required: true, message: '请选择物流公司', trigger: 'change' },
                ],
                JDOrderId: [
                    { required: true, message: '请输入物流单号', trigger: 'blur' }
                ],
            },
        }
    },
    created() {
        let companyId = localStorage.getItem('companyId');
        if(!companyId){
            this.showCompany = true;
        }
        this.addCompanyPage();
        this.getOrderList();
    },
    methods: {
        //获取公司
        addCompanyPage(){
            addCompanyPage().then(res=>{
                this.companyOptions = res.data
            })
        },
        getOrderList(){
            let data = {
                page: this.currentPage,
                pageSize: this.pageSize,
                pagination: true,
            }
            if(this.searchForm.consigneeMobile!=null&&this.searchForm.consigneeMobile!=''){
                if(!this.checkPhone(this.searchForm.consigneeMobile)){
                    this.$message.error('请输入正确的手机号码!')
                    return
                }
            }
            if(this.searchForm.orderStartDate != null && this.searchForm.orderStartDate != ''&&this.searchForm.orderEndDate != null && this.searchForm.orderEndDate != ''){
                if(this.searchForm.orderEndDate<this.searchForm.orderStartDate){
                    this.$message.error('开始时间不能大于结束时间!')
                    return
                }
            }
            for(var key in this.searchForm){
                if(this.searchForm[key]!=null&&this.searchForm[key]!=''){
                    data[key] = this.searchForm[key]
                }
            }
            querySendOutGoodsOrderList(data).then(res=>{
                this.totalRows = res.page.totalRows
                this.tableData = res.data.orderList
            })
        },
        // 改变页数后的方法
        handleCurrentChange(val) {
            this.currentPage = val
            this.getOrderList()
        },
        // 查看详情
        getOrderDetail(id){
            getOrderDetail({orderItemId:id}).then(res=>{
                this.orderInfo = res.data
                this.dialogVisible = true
            })
        },
        // 发货 获取物流公司
        shipments(id,formName){
            this.form.logisticsNum = ''
            this.form.logisticsName = ''
            this.form.JDOrderId = ''
            this.form.orderItemId = id
            getlogisticsName().then(res=>{
                this.options = res.data
                this.dialogEditVisible = true
            })
        },
        // 切换选择物流公司
        handleLogistics(val){
            this.options.forEach(item=>{
                if(item.logisticsNum==val){
                    this.form.logisticsName = item.logisticsName
                }
            })
        },
        //弹框确认
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    updateLogistics(this.form).then(res=>{
                        this.$message.success('发货成功!')
                        this.dialogEditVisible = false
                        this.getOrderList()
                    })
                } else {
                    return false;
                }
            })
        },
        // 取消订单
        cancleOrder(id){
            this.$confirm('确定取消订单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false
            }).then(() => {
                updateOrderStatus({orderItemId:id,childrenOrderStatus:-3}).then(res=>{
                    this.$message.success('取消成功!')
                    this.getOrderList()
                })
            }).catch(() => {
                // this.$message('info','已取消删除!')
            })
        }
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
</style>