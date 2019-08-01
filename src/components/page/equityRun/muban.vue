<template>
    <div class='proList boxs'>
        <div class="headBox">
            <h2>活动列表</h2>
            <y-button text="导出商品" class="button" classStyle="main-btn" @btnClick="loginFn()"></y-button>
        </div>
        <div class="searchBox box">
            <div>
                <span>商品类型：</span>
                <el-select v-model="value" placeholder="请选择">
                    <el-option key="" label="请选择" value="">
                    </el-option>
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>商品名称：</span>
                <el-input v-model="input" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
            <y-button text="搜索" class="button" classStyle="main-btn" @btnClick="loginFn()"></y-button>
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
                <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
                <template slot-scope="scope"><img class="proImg" :src="scope.row.date" alt=""></template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="商品名称"
                width="120">
            </el-table-column>
            <el-table-column
                prop="address"
                label="商品类型"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="address"
                label="供应商"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="address"
                label="市场价"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="address"
                label="协议价"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="address"
                label="兑换积分"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="address"
                label="兑换现金"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="address"
                label="状态"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-tooltip content="删除" placement="top">
                        <span class="iconfont icondingdanguanli" @click="dele()"></span>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <div class="foote-page" v-show="totalRows>0">
            <y-button text="批量上架" class="button" classStyle="default-btn" @btnClick="loginFn()"></y-button>
            <el-pagination 
                :page-size="pageSize" 
                background 
                layout="prev, pager, next" 
                :total="totalRows" 
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import Bus from '../../common/bus.js'
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
            options: [{
                value: '选项1',
                label: '黄金糕'
                }, {
                value: '选项2',
                label: '双皮奶'
                }, {
                value: '选项3',
                label: '蚵仔煎'
                }, {
                value: '选项4',
                label: '龙须面'
                }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            tableData: [{
                date: 'http://res.duoduo13.com/2018/10/16/duoduo_28315.png',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: 'http://res.duoduo13.com/2018/10/16/duoduo_28315.png',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: 'http://res.duoduo13.com/2018/10/16/duoduo_28315.png',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: 'http://res.duoduo13.com/2018/10/16/duoduo_28315.png',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: 'http://res.duoduo13.com/2018/10/16/duoduo_28315.png',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: 'http://res.duoduo13.com/2018/10/16/duoduo_28315.png',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: 'http://res.duoduo13.com/2018/10/16/duoduo_28315.png',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: 'http://res.duoduo13.com/2018/10/16/duoduo_28315.png',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: 'http://res.duoduo13.com/2018/10/16/duoduo_28315.png',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }],
            multipleSelection:[],//钩选后的数组
            bigMenu:['首页','权益设置','营销设置','权益服务'],
            oneName:'',
            twoName:'',
            threeName:'',
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
    },
    methods: {
        // 选择后的方法
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(val)
        },
        // 改变页数后的方法
        handleCurrentChange(val) {
            // this.currentPage = val
            // this.getData()
        },
    }
}
</script>
   
<style lang='scss'>
.proList{
    padding: 30px 20px 50px 20px;
    .headBox{
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
    }
    .el-breadcrumb{
        height: 42px;
        line-height: 42px;
    }
    .searchBox{
        display: flex;
        height: 60px;
        padding: 14px 0;
        margin-bottom: 18px;
        .el-select-dropdown__item{
            padding: 0 6px;
        }
        >div{
            margin-right: 50px;
        }
    }
    .foote-page{
        display: flex;
        justify-content: space-between;
        margin-top: 22px;
    }
    .proImg{
        width: 48px;
        height: 48px;
        display: inline-block;
    }
    .el-table__footer-wrapper, .el-table__header-wrapper{
        height: 60px;
        line-height: 60px;
        color: #555;
        font-weight: 400;
        background: #f9f9f9;
    }
    .el-table thead{
        height: 60px;
        color: #555;
        font-weight: 400;
        th{
            background: #f9f9f9;
            padding: 0;
            border-bottom: none;
            text-align: center;
        }
    }
    .el-table tbody .el-table__row{
        height: 90px;
        td{
            padding: 0;
            border-bottom: none;
            text-align: center;
        }
    }
}
</style>