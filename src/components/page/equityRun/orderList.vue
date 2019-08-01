<template>
    <div class='proList boxs'>
        <div class="headBox">
            <h2>订单列表</h2>
            <!-- <y-button text="导出订单" class="button" classStyle="main-btn" @btnClick="loginFn()"></y-button> -->
        </div>
        <div class="searchBox box">
            <div>
                <span>订单号：</span>
                <el-input v-model="searchForm.orderId" placeholder="请输入订单号" style="display:inline;"></el-input>
            </div>
            <!-- <div v-if="false"> 
                <span>用户手机号：</span>
                <el-input v-model="searchForm.buyerMobile" placeholder="请输入内容" style="display:inline;"></el-input>
            </div> -->
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
                <span>订单状态：</span>
                <el-select v-model="searchForm.childrenOrderStatus" placeholder="请选择">
                    <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
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
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="light"
            style="width: 100%"
            stripe
            @selection-change="handleSelectionChange">
            <el-table-column
                prop="orderId"
                label="订单号"
                width="120">
            </el-table-column>
            <el-table-column
                prop="orderItemId"
                label="子订单号"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="supplierName"
                label="商品来源"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="companyName"
                label="所属公司"
                show-overflow-tooltip v-if="showCompany">
            </el-table-column>
            <el-table-column
                prop="productName"
                label="商品名称"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="productNum"
                label="商品数量"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="consigneeName"
                label="收货人姓名"
                show-overflow-tooltip>
                <span slot-scope="scope">{{scope.row.consigneeName?scope.row.consigneeName:'--'}}</span>
            </el-table-column>
            <el-table-column
                prop="consigneeMobile"
                label="收货人手机号"
                show-overflow-tooltip>
                <span slot-scope="scope">{{scope.row.consigneeMobile?scope.row.consigneeMobile:'--'}}</span>
            </el-table-column>
            <el-table-column
                prop="orderCreateDate"
                label="下单时间"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="integralOne"
                label="销售单价(元)"
                show-overflow-tooltip>
            </el-table-column> 
            <el-table-column
                prop="costIntegral"
                label="订单价(元)"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="childrenOrderStatusStr"
                label="订单状态"
                show-overflow-tooltip>
            </el-table-column> 
            <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-tooltip content="查看详情" placement="top">
                        <!-- productType 1：实物，2：卡券 -->
                        <span class="iconfont iconcaozuo-yulan" 
                            v-show="scope.row.productType==1"
                            @click="getOrderDetail(scope.row.orderItemId)">
                        </span>
                    </el-tooltip>
                    <el-tooltip content="查看物流" placement="top">
                        <span  class="iconfont iconcaozuo-chakanwuliu" 
                            v-show="scope.row.productType==1&&(scope.row.childrenOrderStatus==2||scope.row.childrenOrderStatus==3||scope.row.childrenOrderStatus==4)"
                            @click="getLogisticsDetail(scope.row.orderItemId)">
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
        <el-dialog title="查看物流详情" :visible.sync="dialogEditVisible"> 
            <div class="size">
                <div>快递单号：{{logisticsDetail.jdOrderId}}</div>
                <div>快递公司：{{logisticsDetail.comname}}</div>
            </div>
            <div class="logistics_info">
                <ul class="logistics_steplist">
                    <li v-for="(item,index) in logisticsDetail.orderTrack" :key="index">
                        <p class="title">{{item.content}}</p>
                        <p class="cont">{{item.msgTime}}</p>
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <y-button text="确定" classStyle="main-btn"  @btnClick="dialogEditVisible = false"></y-button>
                <y-button text="取消"  @btnClick="dialogEditVisible = false"></y-button>
            </span>
        </el-dialog>
        <el-dialog title="查看订单详情" :visible.sync="dialogVisible"> 
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
        </el-dialog>
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import Bus from '../../common/bus.js'
import {getOrderList,addCompanyPage,getLogisticsDetail,getOrderDetail } from '@/api/api.js'
export default {
    components: {
      YButton
    },
    data() {
        return {
            pageSize:10,
            totalRows:0,
            currentPage:1,
            value:'',
            input:'',
            searchForm:{},//搜索参数
            statusOptions: [{
                value: '',
                label: '全部'
                }, {
                value: '1',
                label: '待发货'
                }, {
                value: '2',
                label: '待收货'
                },{
                value: '4',
                label: '已完成'
            }],
            tableData: [],
            multipleSelection:[],//钩选后的数组
            bigMenu:['首页','权益设置','营销设置','权益服务'],
            oneName:'',
            twoName:'',
            threeName:'',
            companyOptions:[],//公司选择
            showCompany:false,//超级管理员显示公司 系统管理员不显示
            searchCondition:true,//是否显示更多条件
            logisticsDetail:'',//物流信息
            dialogEditVisible:false,//物流详情弹框
            dialogVisible:false,//订单详情弹框
            activeNames:['1','2','3'],//订单详情默认展开
            orderInfo:''
        }
    },
    created() {
        var that = this
        Bus.$off('oneName').$on('oneName',function(val){
            that.oneName = val
        })
        Bus.$off('twoName').$on('twoName',function(val){
            that.twoName = val
        })
        Bus.$off('threeName').$on('threeName',function(val){
            that.threeName = val
        })
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
            getOrderList(data).then(res=>{
                this.totalRows = res.page.totalRows;
                this.tableData = res.data.orderList;
            })
        },
        // 查看物流
        getLogisticsDetail(id){
            getLogisticsDetail({orderItemId:id}).then(res=>{
                this.logisticsDetail = res.data
                if(this.logisticsDetail.jdOrderId==null||this.logisticsDetail.jdOrderId==''){
                    this.$message.info('暂无物流信息!')
                    return
                }
                this.dialogEditVisible = true
            })
        },
        // 选择后的方法
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
        handleChange(val) {}
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
</style>