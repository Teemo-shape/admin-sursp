<template>
    <div class='activity proList boxs'>
        <div class="headBox">
            <h2>操作日志</h2>
            <!-- <y-button text="新增活动规则" class="button" classStyle="main-btn" @btnClick="loginFn()"></y-button> -->
        </div>
        <div class="searchBox box">
            <div>
                <span>操作人员：</span>
                <el-input v-model="searchForm.operateName" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
            <div>
                <span>操作模块：</span>
                <el-select v-model="searchForm.logType" placeholder="请选择">
                    <el-option key="" label="请选择" value=""></el-option>
                    <el-option
                        v-for="item in options" :key="item.name" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>开始时间：</span>
                <el-date-picker
                    v-model="searchForm.beginDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择开始时间" style="display:inline;">
                </el-date-picker>
            </div>
            <div style="margin-right:30px">
                <span>结束时间：</span>
                <el-date-picker
                    v-model="searchForm.endDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择结束时间" style="display:inline;">
                </el-date-picker>
            </div>
            <y-button text="搜索" class="button" classStyle="main-btn" @btnClick="handleCurrentChange(1)"></y-button>
        </div>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="light"
            style="width: 100%"
            stripe>
            <el-table-column
                prop="createdDate"
                label="操作时间"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="operateName"
                label="操作人员"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="operateBy"
                label="所属角色"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="clientIp"
                label="IP记录"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="logDesc"
                label="操作模块"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="remarkDesc"
                label="事件内容"
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
import { logList,logType } from '@/api/api.js'
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
                operateName:'',
                logType:'',
                beginDate:'',
                endDate:'',
            },
            options:[],
            tableData: [],
        }
    },
    created() {
        this.getData()
        this.logType()
    },
    methods: {
        getData(){
            let data = {
                page: this.currentPage,
                pageSize: this.pageSize,
                pagination: true,
            }
            if(this.searchForm.beginDate != null && this.searchForm.beginDate != ''&&this.searchForm.endDate != null && this.searchForm.endDate != ''){
                if(this.searchForm.endDate<this.searchForm.beginDate){
                    this.$message.error('开始时间不能大于结束时间!')
                    return
                }
            }
            for(var key in this.searchForm){
                if(this.searchForm[key]!=null&&this.searchForm[key]!=''){
                    data[key] = this.searchForm[key]
                }
            }
            logList(data).then(res=>{
                this.totalRows = res.page.totalRows
                this.tableData = res.data
            })
        },
        // 获取所有活动
        logType(){
            logType().then(res=>{
                this.options = res.data
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