<template>
    <div class='proList boxs'>
        <div class="headBox">
            <h2>在售商品</h2>
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
                        v-for="item in options"  :key="item.label" :label="item.label" :value="item.value">
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
            style="width: 100%"
            stripe
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
                prop="productItems[0].integral"
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
                label="操作">
                <template slot-scope="scope">
                     <!-- <el-tooltip :content="scope.row.isRecommend==1?'取消推荐':'推荐'" placement="top" >
                        <span  v-if="showButton" :class="[{red:scope.row.isRecommend==1},'iconfont','iconcaozuo-tuijian','gray']" @click="recommendProduct(scope.row.skuId,scope.row.isRecommend)"></span>
                    </el-tooltip> -->
                    <el-tooltip content="下架" placement="top" >
                        <span v-if="showButton" class="iconfont iconcaozuo-xiajia" @click="updownProduct(scope.row.skuId)"></span>
                    </el-tooltip>
                    <el-tooltip content="推送" placement="top" >
                        <span v-if="!showButton&&scope.row.supplierId.split('_')[0]!='company'" class="iconfont icongengxin1" @click="handleEdit(scope.row.skuId)"></span>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <div class="foote-page" v-show="totalRows>0">
            <y-button text="批量下架" class="button" classStyle="default-btn" v-if="showButton" @btnClick="allUpdownProducts"></y-button>
            <div v-if="!showButton"></div>
            <el-pagination 
                :page-size="pageSize" 
                background 
                layout="prev, pager, next" 
                :total="totalRows" 
                :current-page.sync="currentPage"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <el-dialog title="推送" :visible.sync="dialogEditVisible" width="50%" style="padding-bottom:30px;"> 
             <div class="size" v-for="item in productData.list">
                <div>规格值：{{item.value}}</div>
                <div v-for="subitem in item.list2">规格名：{{subitem.value}}</div>
             </div>
            <table cellspacing="0" cellpadding="0" style="width:90%;margin:0" class="sizeTable">
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
                    <td>{{item.gylPrice}}</td>
                    <td class="input"><el-input v-model="item.price" placeholder="请输入内容" style="display:inline;"></el-input></td>
                </tr>
            </table>
            <span slot="footer" class="dialog-footer">
                <y-button text="确定" classStyle="main-btn"  @btnClick="editProduct"></y-button>
                <y-button text="取消"  @btnClick="dialogEditVisible = false"></y-button>
            </span>
        </el-dialog>
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import Bus from '../../common/bus.js'
import { getProducts,updownProduct,recommendProduct,getProductById,editProduct,getPassedSupplier  } from '@/api/api.js'
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
            showButton:false,//超级管理员没有推荐和下架的权限
            dialogEditVisible:false,//推送
            productData:'',
            newOptions2:[]
        }
    },
    created() {
        let companyId = localStorage.getItem('companyId');
        if(companyId){
            this.showButton = true;
        }
        this.getPassedSupplier();
        this.getProducts();
    },
    methods: {
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
                jfStatus:1,//上架
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
        // 推荐
        recommendProduct(id,isRecommend){
            let data={
                skuId:id,
                isRecommend:isRecommend==1?0:1
            }
            recommendProduct(data).then(res=>{
                this.$message.success(isRecommend==1?"取消推荐":"推荐成功")
                this.handleCurrentChange();
            })
        },
        // 单个下架
        updownProduct(id){
            updownProduct({
                skuIds:id,
                jfStatus:-1
            }).then(res=>{
                this.$message.success('商品已下架!')
                this.handleCurrentChange();
            })
        },
        // 批量下架
        allUpdownProducts(){
            let skuIds=this.multipleSelection.join(",");
            if(skuIds==null||skuIds==''){
                this.$message.error('请先选择商品!')
                return
            }
            updownProduct({
                skuIds,
                jfStatus:-1
            }).then(res=>{
                this.$message.success('商品已下架!')
                this.handleCurrentChange();
            })
        },
        // 选择后的方法
        handleSelectionChange(val) {
            val.forEach(item => {
                this.multipleSelection.push(item.skuId);
            });
            console.log(val)
        },
        // 改变页数后的方法
        handleCurrentChange(val) {
            this.currentPage = val
            this.getProducts()
        },
        // 推送
        handleEdit(id){
            getProductById({skuId:id}).then((res)=>{
                this.productData=res.data
            })
            this.dialogEditVisible=true;
        },
        // 确定推送
        editProduct(){
            let num=/^([1-9]\d*|0)(\.\d*[1-9])?$/;
            let flag=false;
            this.productData.productItems.forEach(item=>{
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
                this.$message.success('推送成功!')
                this.handleCurrentChange();
            })
        },
    }
}
</script>
   
<style lang='scss' scoped>
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
</style>