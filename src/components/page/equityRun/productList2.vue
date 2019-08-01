<template>
    <div class='proList boxs'>
        <div class="headBox">
            <h2>待上架商品</h2>
            <!-- <y-button text="导出商品" class="button" classStyle="main-btn" @btnClick="loginFn()"></y-button> -->
        </div>
        <div class="searchBox box">
            <div>
                <span>商品名称：</span>
                <el-input v-model="searchForm.name" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
            <div>
                <span>商品类型：</span>
                <el-select v-model="searchForm.type" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>商品来源：</span>
                <el-select v-model="searchForm.supplierId" placeholder="请选择">
                    <el-option
                        key="" 
                        label="请选择" 
                        value="">
                    </el-option>
                    <el-option
                        v-for="item in newOptions2" 
                        :key="item.supplierId" 
                        :label="item.name" 
                        :value="item.supplierId">
                    </el-option>
                </el-select>
            </div>
            <y-button text="搜索" class="button" classStyle="main-btn" @btnClick="handleCurrentChange(1)"></y-button>
        </div>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="light"
            style="width: 100%;"
            stripe
            :row-style="rowStyle"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                label="商品主图"
                width="120">
                <template slot-scope="scope"><img class="proImg" :src="scope.row.imagePath" alt=""></template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="商品名称"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="type"
                label="商品类型"
                show-overflow-tooltip>
                <template slot-scope="scope"><span>{{scope.row.type==1?'实物':'卡券'}}</span></template>
            </el-table-column>
            <el-table-column
                prop="supplierName"
                label="商品来源"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="jdPrice"
                label="市场价(元)"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                v-if="showButton"
                prop="price"
                label="成本价(元)"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                v-if="!showButton"
                prop="gylPrice"
                label="成本价(元)"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                v-if="showButton"
                prop="integral"
                label="兑换价(元)"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                v-if="!showButton"
                prop="price"
                label="兑换价(元)"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-tooltip content="编辑" placement="top">
                        <span class="iconfont iconcaozuo-bianji" @click="handleEdit(scope.row.skuId,scope.row.supplierId)"></span>
                    </el-tooltip>
                    <el-tooltip content="上架" placement="top" >
                        <span class="iconfont iconcaozuo-shangjia" @click="updateProduct(scope.row.skuId)"></span>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        
        <div class="foote-page" v-show="totalRows>0">
            <y-button text="批量上架" class="button" classStyle="default-btn" @btnClick="allUpdateProducts()"></y-button>
            <el-pagination 
                :page-size="pageSize" 
                background 
                layout="prev, pager, next" 
                :total="totalRows" 
                :current-page.sync="currentPage"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <el-dialog title="编辑兑换价" :visible.sync="dialogEditVisible" width="50%" style="padding-bottom:30px;"> 
             <div class="size" v-for="item in productData.list">
                <div>规格值：{{item.value}}</div>
                <div v-for="subitem in item.list2">规格名：{{subitem.value}}</div>
             </div>
            <table cellspacing="0" cellpadding="0" style="width:90%;margin:0;margin-bottom:6px;" class="sizeTable">
                <tr>
                    <th  v-for="(item,index) in productData.list" :key="index+'a'">{{item.value}}</th>
                    <th>市场价</th>
                    <th>成本价</th>
                    <th>兑换价</th>
                </tr>
                <tr v-for="(item,index1) in productData.productItems" :key="index1">
                    <td v-show="item.oneNormValue">{{item.oneNormValue}}</td>
                    <td v-show="item.twoNormValue">{{item.twoNormValue}}</td>
                    <td v-show="item.threeNormValue">{{item.threeNormValue}}</td>
                    <td>{{item.jdPrice}}</td>
                    <td v-if="showButton">{{item.price}}</td>
                    <td v-else>{{item.gylPrice}}</td>
                    <td class="input" v-if="showButton"><el-input v-model="item.integral" placeholder="请输入内容" style="display:inline;"></el-input></td>
                    <td class="input" v-else><el-input v-model="item.price" placeholder="请输入内容" style="display:inline;"></el-input></td>
                </tr>
            </table>
            <span style="color:#ccc;font-size:12px;">注：根据您在【权益设置】-【积分设置】设置的兑换比例，自动将编辑的兑换价转换成对应{{integralName}}数值展示在前端</span>
            <span slot="footer" class="dialog-footer">
                <y-button text="保存" classStyle="main-btn"  @btnClick="editProduct"></y-button>
                <y-button text="取消"  @btnClick="dialogEditVisible = false"></y-button>
            </span>
        </el-dialog>
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import Bus from '../../common/bus.js'
import { getProducts,getProductById,editProduct,updateProduct,getPassedSupplier,getInteger} from '@/api/api.js'
export default {
    components: {
      YButton
    },
    data() {
        return {
            pageSize:10,
            totalRows:10,
            currentPage:1,
            searchForm:{},//搜索参数
            options: [{
                value: '',
                label: '请选择'
                },{
                value: '1',
                label: '实物'
                }, {
                value: '2',
                label: '卡券'
            }],
            tableData: [],
            multipleSelection:[],//钩选后的数组
            bigMenu:['首页','权益设置','营销设置','权益服务'],
            dialogEditVisible:false,//编辑弹窗
            productData:{},//商品数据
            showButton:false,//区分超级管理员(false)和系统管理员（true）
            rowStyle:{
                height:'90px'
            },
            newOptions2:[],
            integralName:'',//积分名称
        }
    },
    created() {
        this.getPassedSupplier();
        this.getProducts();
        this.getInteger();
        let companyId = localStorage.getItem('companyId');
        if(companyId){
            this.showButton = true;
        }
    },
    methods: {
        // 获取用户积分名称
        getInteger(){
            getInteger().then(res=>{
                this.integralName=res.data.integralName
            })
        },
        // 获取供应商
        getPassedSupplier() {
            getPassedSupplier().then(res=>{
                this.newOptions2 = res.data
            })
        },
        getProducts(){
            let data = {
                page: this.currentPage,
                pageSize: this.pageSize,
                pagination: true,
                jfStatus:-1,//待上架
            }
            for(var key in this.searchForm){
                if(this.searchForm[key]!=null&&this.searchForm[key]!=''){
                    data[key] = this.searchForm[key]
                }
            }
            getProducts(data).then(res=>{
                this.totalRows = res.page.totalRows;
                this.tableData = res.data;
            })
        },
        // 编辑
        handleEdit(id,supId){
            let str = supId.split('_')
            if(str[0]==="company"){
                this.routerLink('editProduct',{skuId:id})
            }else{
                getProductById({skuId:id}).then((res)=>{
                    this.productData=res.data
                    this.dialogEditVisible=true;
                })
            }
        },
        // 编辑产品
        editProduct(){
            let num=/^([1-9]\d*|0)(\.\d*[1-9])?$/;
            let flag=false;
            this.productData.productItems.forEach(item=>{
                if(this.showButton){
                    if(item.integral===""||item.integral==null){
                        this.$message.error('请输入兑换价')
                        flag=true;
                        return
                    }
                    if(!num.test(item.integral)){
                        this.$message.error('请输入兑换价')
                        flag=true;
                        return
                    }
                }else{
                    if(item.price===""||item.price==null){
                        this.$message.error('请输入兑换价')
                        flag=true;
                        return
                    }
                    if(!num.test(item.price)){
                        this.$message.error('请输入兑换价')
                        flag=true;
                        return
                    }
                }
                 
            })
            if(flag) {
                return;
            }
            let data= {
                skuId:this.productData.skuId,
                productItems:this.productData.productItems
            }
            editProduct(data).then(res=>{
                this.dialogEditVisible=false
                this.$message.success('编辑成功!')
                this.handleCurrentChange();
            })
        }, 
        updateProduct(id){
            updateProduct({
                skuIds:id,
                jfStatus:1
            }).then(res=>{
                this.$message.success('商品已上架!')
                this.handleCurrentChange();
            })
        },
        // 批量上架
        allUpdateProducts(){
            let skuIds = this.multipleSelection.join(",");
            if(skuIds==null||skuIds==''){
                this.$message.error('请先选择商品!')
                return
            }
            updateProduct({
                skuIds,
                jfStatus:1
            }).then(res=>{
                this.$message.success('商品已上架!')
                this.handleCurrentChange();
            })
        },
        // 选择后的方法
        handleSelectionChange(val) {
            val.forEach(item => {
                this.multipleSelection.push(item.skuId);
            });
        },
        // 改变页数后的方法
        handleCurrentChange(val) {
            this.currentPage = val
            this.getProducts()
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
    .sizeTable {
        text-align:center;
        margin-bottom:30px;
        border:1px solid #ccc;
        border-collapse: collapse;
        tr{
            height:70px;
            text-align:center;
            margin:0;
        }
        th,td {
            width:40px;
            height:100%;
            text-align:center;
            border:1px solid #ccc;
            margin:0;
            padding:10px;
            box-sizing:border-box;
            .el-input__inner {
               width:100px;
            }
        }
    }
    .el-select-dropdown__item{
        padding: 0 20px;
    }
    .proList .el-dialog__body{
        padding-bottom: 20px;
    }
</style>