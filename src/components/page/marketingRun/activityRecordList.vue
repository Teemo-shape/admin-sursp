<template>
    <div class='activity proList boxs'>
        <div class="headBox">
            <h2>抽奖记录</h2>
            <!-- <y-button text="新增活动规则" class="button" classStyle="main-btn" @btnClick="loginFn()"></y-button> -->
        </div>
        <div class="searchBox box">
            <div>
                <span>所属活动：</span>
                <el-select v-model="searchForm.activityId" placeholder="请选择">
                    <el-option key="" label="请选择" value=""></el-option>
                    <el-option
                        v-for="item in activityList" :key="item.activityName" :label="item.activityName" :value="item.activityId">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>用户手机：</span>
                <el-input v-model="searchForm.mobile" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
            <div>
                <span>奖品名称：</span>
                <el-input v-model="searchForm.giftName" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
            <!-- <y-button text="搜索" class="button" classStyle="main-btn" @btnClick="handleCurrentChange(1)"></y-button> -->
            <div>
                <span>开始时间：</span>
                <el-date-picker
                    v-model="searchForm.raffleStartDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择开始时间" style="display:inline;">
                </el-date-picker>
            </div>
            <div>
                <span>结束时间：</span>
                <el-date-picker
                    v-model="searchForm.raffleEndDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择结束时间" style="display:inline;">
                </el-date-picker>
            </div>
        </div>
        <div class="searchCondition" v-show="false">
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
            stripe>
            <el-table-column
                prop="userId"
                label="用户ID"
                width="120">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机号"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="activityName"
                label="所属活动"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="giftName"
                label="奖品名称"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="createdDate"
                label="抽奖时间"
                show-overflow-tooltip>
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
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import { getActivityRecordList,getActivityList } from '@/api/api.js'
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
                mobile:'',
                giftName:'',
                raffleStartDate:'',
                raffleEndDate:'',
            },
            activityList:[],
            tableData: [],
            searchCondition:true,//是否显示更多条件
        }
    },
    created() {
        this.getData()
        this.getActivityList()
    },
    methods: {
        getData(){
            let data = {
                page: this.currentPage,
                pageSize: this.pageSize,
                pagination: true,
            }
            if(this.searchForm.raffleStartDate != null && this.searchForm.raffleStartDate != ''&&this.searchForm.raffleEndDate != null && this.searchForm.raffleEndDate != ''){
                if(this.searchForm.raffleEndDate<this.searchForm.raffleStartDate){
                    this.$message.error('开始时间不能大于结束时间!')
                    return
                }
            }
            for(var key in this.searchForm){
                if(this.searchForm[key]!=null&&this.searchForm[key]!=''){
                    data[key] = this.searchForm[key]
                }
            }
            getActivityRecordList(data).then(res=>{
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
    }
}
</script>
   
<style scoped lang='scss'>
    
</style>