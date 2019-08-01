<template>
    <div class='proList boxs'>
        <div class="headBox">
            <h2>会员列表</h2>
            <y-button text="导入用户" class="button" classStyle="main-btn" @btnClick="importUser()" v-show="isDisabled"></y-button>
        </div>
        <div class="searchBox box">
            <div>
                <span>会员ID：</span>
                <el-input v-model="searchForm.customerId" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
            <div>
                <span>会员昵称：</span>
                <el-input v-model="searchForm.nickName" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
            <div>
                <span>会员手机号：</span>
                <el-input v-model="searchForm.Mobile" type="number" placeholder="请输入内容" style="display:inline;"></el-input>
            </div>
            <div v-show="!isDisabled">
                <span>所属公司：</span>
                <el-select v-model="searchForm.companyId" placeholder="请选择" @change="queryMember">
                    <el-option key="" label="请选择" value=""></el-option>
                    <el-option
                        v-for="item in companyOptions"
                        :key="item.companyId"
                        :label="item.companyName"
                        :value="item.companyId">
                    </el-option>
                </el-select>
            </div>
            <div v-show="searchCondition">
                <span>会员等级：</span>
                <el-select v-model="searchForm.memberGrade" placeholder="请选择">
                    <el-option key="" label="请选择" value=""></el-option>
                    <el-option
                        v-for="(item,index) in options"
                        :key="item.index"
                        :label="item.gradeName"
                        :value="item.grade">
                    </el-option>
                </el-select>
            </div>
            <div v-show="searchCondition">
                <span>会员状态：</span>
                <el-select v-model="searchForm.status" placeholder="请选择">
                    <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <!-- <y-button text="搜索" class="button" classStyle="main-btn" @btnClick="handleCurrentChange(1)"></y-button> -->
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
                prop="customerId"
                label="会员ID"
                width="120">
            </el-table-column>
            <el-table-column
                prop="nickName"
                label="会员昵称"
                width="120">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="会员手机号"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="sexStr"
                label="性别"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                 v-if="!isDisabled"
                prop="companyName"
                label="所属公司"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="memberGrade"
                label="会员等级"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="createdDate"
                label="创建时间"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="integral"
                :label="!isDisabled?'余额':integralName"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="statusStr"
                label="会员状态"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-tooltip content="积分明细" placement="top">
                        <span class="iconfont iconcaozuo-jifenmingxi" @click="getJingFenMingXi(scope.row.customerId)"></span>
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
        <el-dialog title="积分明细" :visible.sync="jifenmingxiVisible" class="jifenmingxiBox">
            <div class="integralInfo clearfix">
                <div class="item" v-for="(item,index) in integralFlows" :key="index">
                    <div class="fl" style="line-height:20px;height:100%;padding: 13px 0;box-sizing: border-box;">
                        <div style="font-size:15px;">{{item.flowTypeStr}}</div>
                        <div style="font-size:12px;color:#BEBFC1">{{item.createdDate}}</div>
                    </div>
                    <div class="fr" style="text-align:right;height: 100%;padding-top: 5px;box-sizing: border-box;">
                        <div style="color:#E16E64;font-size:23px;" v-show="item.integral>=0">{{item.integral}}</div>
                        <div style="color:#069C04;font-size:23px;" v-show="item.integral<0">{{item.integral}}</div>
                        <div style="font-size:12px;color:#BEBFC1">剩余总积分：{{item.surplusIntegral}}</div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="jifenmingxiVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="导入用户" :visible.sync="exportUserVisible" class="jifenmingxiBox" width="30%">
            <el-form ref="form" label-width="140px" size="medium" style="margin-bottom:10px;">
                <el-form-item label="下载导入模板">
                    <div style="color:blue;cursor:pointer;" @click="downloadTem()">点击下载模板</div>
                </el-form-item>
                <el-form-item label="导入用户" prop="importPro"
                    :rules="[{ required: true }]">
                    <el-upload :data="{userName:this.loginName}"
                        :on-success="success" 
                        :on-change="handleChange" 
                        class="upload-demo" ref="upload" 
                        :action="actionUrl" :on-error="error" 
                        :auto-upload="false" :on-remove="handleRemove">
                        <el-button slot="trigger" size="small" type="primary" @click="changeSelect()">选取文件</el-button>
                    </el-upload>
                </el-form-item>
                <!-- <el-form-item label=""> -->
                    <span style="font-size:12px;color:#ccc;margin-top:-10px;">提示：如果导入速度较慢，建议您把文件拆分为几个小文件，然后分别导入;导入的商品文件可 .xlsx 与 .xls格式，每次导入的商品不超过1000个</span>
                <!-- </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="clearCon()">取消</el-button>
                <el-button type="primary" v-show="!isExport" @click="onSubmit()">导入</el-button>
                <el-button type="primary" v-show="isSuccess" @click="submitExcel()" v-loading.fullscreen.lock="fullscreenLoading" element-loading-background="rgba(0, 0, 0, 0.8)">{{btnCon}}</el-button>
                <!-- <el-button type="primary" v-show="isExport" @click="exportExcel()">导出校验结果数据</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import { addCompanyPage,getMemberList,getJingFenMingXi,getInteger,queryMember,batchImportCustomer,getUserName } from '@/api/api.js'
import request from '@/api/request.js'
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
                customerId:"",//会员id
                nickName:"",//会员昵称
                mobile:"",//手机号
                companyId:"",//所属公司id
                memberGrade:"",//会员等级
                status:"",//会员状态（状态 0：可用 1：不可用）
            },
            statusOptions: [{
                value: '',
                label: '请选择'
            },{
                value: '0',
                label: '启用'
            }, {
                value: '1',
                label: '禁用'
            }],//状态选择
            companyOptions:[],//所属公司选择
            options: [],//会员等级选择
            tableData: [],//表格数据
            jifenmingxiVisible:false,//积分明细弹窗
            integralFlows:[],//积分明细数据
            integralName:'',//用户积分名称
            isDisabled:false,//区分超级和系统
            exportUserVisible:false,//导入用户弹框
            actionUrl:request.BASE_URL+'/customer/importExcel',//导入用户路径
            isSuccess: false,
            isExport: false,
            fileInputVal: '',
            fullscreenLoading: false,
            btnCon: '提交',
            loginName:'',
            searchCondition:true,//是否显示更多条件
        }
    },
    created() {
        let companyId = localStorage.getItem('companyId');
        if(companyId){
            this.isDisabled = true;
        }else{
            this.isDisabled = false;
        }
        this.addCompanyPage();
        this.getMemberList();
        this.getInteger();
        this.getUserName();
        
    },
    methods: {
        getUserName(){
            getUserName().then(res=>{
                this.loginName=res.data;
            })
        },
        // 获取用户积分名称
        getInteger(){
            getInteger().then(res=>{
                this.integralName=res.data.integralName
            })
        },
        //获取公司
        addCompanyPage(){
            addCompanyPage().then(res=>{
                this.companyOptions = res.data
                if(this.isDisabled){
                    this.searchForm.companyId = this.companyOptions[0].companyId
                    this.queryMember(this.searchForm.companyId)
                }else{
                    this.queryMember('')
                }
            })
        },
        // 获取等级
        queryMember(companyId){
            queryMember({companyId:companyId}).then(res=>{
                this.options = res.data
            })
        },
        // 获取会员列表数据
        getMemberList(){
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
            getMemberList(data).then(res=>{
                this.totalRows = res.page.totalRows
                this.tableData=res.data.customers;
            })
        },
        // 获取积分明细
        getJingFenMingXi(customerId){
            getJingFenMingXi({
                userId:customerId
            }).then(res=>{
                if(res.data==null||res.data==''){
                    this.$message.info('暂无积分明细!')
                    return
                }
                this.jifenmingxiVisible = true
                this.integralFlows = res.data
            })
        },
        // 选择后的方法
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 改变页数后的方法
        handleCurrentChange(val) {
            this.currentPage = val
            this.getMemberList()
        },
        // 导入用户
        importUser(){
            this.exportUserVisible = true
        },
        // 下载模板
        downloadTem() {
            location.href = encodeURI(encodeURI(request.EXPORT_URL + "?template=customer_import_template.xls&fileName=用户导入模板"));
        },
        onSubmit() {
            if (this.fileInputVal == '' || this.fileInputVal == null) {
                this.$message.error('上传文件不存在!')
                return;
            }
            if (this.fileInputVal.lastIndexOf(".") < 0) {
                this.$message.error('请上传xls或者xlsx格式的文件!');
                this.$refs.upload.clearFiles()
                return false;
            }
            var subfix = this.fileInputVal.substr(this.fileInputVal.lastIndexOf(".") + 1).toLowerCase();
            if (!(subfix == 'xlsx' || subfix == 'xls')) {
                this.$message.error("请上传xls或者xlsx格式的文件!");
                this.$refs.upload.clearFiles()
                return false;
            }
            this.$refs.upload.submit()
        },
        // 上传失败
        error(err, file, fileList) {
            this.$message.error(err)
        },
        // 上传成功
        success(response, file, fileList) {
            if (response.status == 0) {
                this.btnCon = '提交'
                this.isSuccess = true
                // var msg = response.data
                // if (msg.success > 0) {
                //     if (msg.error > 0) {
                //         this.$message.warning('数据有误!')
                //         this.btnCon = '忽略错误提交'
                //         this.isSuccess = true
                //         this.isExport = true
                //     } else {
                //         if (msg.repetition > 0) {
                //             this.$message.warning('数据有误!')
                //             this.isExport = true
                //         } else {
                //             this.btnCon = '提交'
                //             this.isSuccess = true
                //         }
                //     }
                // } else {
                //     // this.$message.error('没有校验成功的数据!')
                //     // return
                // }
            } else {
                this.$message.error(response.message)
                this.isExport = true
            }
        },
        // 选取文件
        handleChange(file, fileList) {
            fileList.length = 1
            fileList[0] = file
            this.fileInputVal = file.name
        },
        handleRemove(file, fileList) {
            this.fileInputVal = ''
        },
        // 上传
        submitExcel() {
            batchImportCustomer().then(res=>{
                this.$message.success('导入用户成功!')
                this.exportUserVisible = false
                this.fileInputVal = ''
                this.getMemberList()
            })
        },
        // 导出错误数据
        exportExcel() {
            window.location.href = encodeURI(encodeURI(request.EXPORT_URL + "?template=customer_import_template.xls&datas=datas&cellNum=5&ignoreRows=1&fileName=用户导入校验结果"));
        },
        // 取消清空数据
        clearCon() {
            this.$refs.upload.clearFiles()
            this.isSuccess = false
            this.isExport = false
            this.exportUserVisible = false
        },
        changeSelect() {
            if (this.isSuccess == true) {
                this.isSuccess = false
            }
            if (this.isExport == true) {
                this.isExport = false
            }
        }
    }
}
</script>
   
<style lang='scss' >
    .integralInfo  {
        width:100%;
        .item {
            width:100%;
            height:60px;
        }
    }
    .btns{
        text-align: center;
        margin-bottom: 30px;
    }
</style>