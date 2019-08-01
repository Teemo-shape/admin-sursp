<template>
    <h2 class='proList boxs'>
        <h2 class="headBox">
            <h2>等级权益</h2>
            <y-button text="新增" classStyle="main-btn"  @btnClick="addRight"></y-button>
        </h2>
        <div class="searchBox box">
            <!-- <div>
                <span>角色名称：</span>
                <el-input v-model="roleName" placeholder="" style="display:inline;"></el-input>
            </div>
            <y-button text="搜索" class="button" classStyle="main-btn" @btnClick="handleCurrentChange(1)"></y-button> -->
        </div>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="light"
            style="width: 100%;margin-top:0;font-weight:400"
            stripe>
            <el-table-column
                prop="grade"
                label="会员等级">
            </el-table-column>
            <el-table-column
                prop="gradeName"
                label="等级名称"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="smallValue"
                label="所需成长值"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-tooltip content="编辑" placement="top">
                        <span class="iconfont iconcaozuo-bianji" @click="handleEdit(scope.row.memberId)" ></span>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top" class="red">
                        <span class="iconfont iconcaozuo-lajitong" @click="deleFn(scope.row.memberId)"></span>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <div class="foote-page" v-show="false">
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
        <el-dialog title="等级配置" :visible.sync="dialogEditVisible" width='40%' :rules="rules">
            <el-form ref="editData" :model="editData" label-width="120px" size="medium">
                <div style="font-weight:400">
                    <h4><span class="x-red" style="margin-right:5px;">*</span>基本信息</h4>
                    <el-form-item label="等级名称" prop="gradeName">
                        <el-input v-model="editData.gradeName" ></el-input>
                    </el-form-item>
                    <el-form-item label="所需成长值" prop="smallValue">
                        <el-input v-model="editData.smallValue" maxlength="7"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <h4><span class="x-red" style="margin-right:5px;">*</span>权益礼包<span style="color:gray;font-size:12px;font-weight:400;"> （升级礼包仅在首次领取时候发放）</span></h4>
                    <el-form-item label="">
                        <el-checkbox-group v-model="checkList" @change="handleCheckboxChange">
                            <div style="display:flex;margin-top:10px;margin-left: -96px;">
                                <el-checkbox :label="integralName"></el-checkbox>
                                <el-input v-model="editData.integral" placeholder="请输入整数"></el-input>
                            </div>
                            <div style="margin-top:10px;margin-left: -96px;">
                                <el-checkbox label="送实物"></el-checkbox>
                                <div class="couponBox" v-for="(itemp,index) in proListCheck">
                                    <el-select v-model="itemp.name" filterable placeholder="请输入商品名称" 
                                         @change="selectPro(itemp.name,index)"
                                        :filter-method="handleFiltermethod"
                                        @visible-change="handlevisiblechange(itemp,$event)">
                                        <el-option
                                            v-for="item in proList"
                                            :key="item.skuId+'_'+item.skuItemId"
                                            :label="item.name+' '+item.oneNormValue+' '+item.twoNormValue+' '+item.threeNormValue"
                                            :value="item.skuId+'_'+item.skuItemId">
                                        </el-option>
                                    </el-select>
                                    <!-- <el-input class="couponInput" v-model="itemp.count" placeholder="请输入商品数量"></el-input> -->
                                    <i class="el-icon-circle-close" v-show="index!=0" @click="deleproListCheck(index)"></i>
                                </div>
                                <!-- <y-button text="新增商品" v-show="checkList.indexOf('送实物')!=-1" classStyle="default-btn"  @btnClick="addPro()"></y-button> -->
                            </div>
                            <div style="margin-top:10px;margin-left: -96px;">
                                <el-checkbox label="优惠券"></el-checkbox>
                                <div class="couponBox" v-for="(item,index) in couponListCheck">
                                    <el-select value-key="skuId" v-model="item.data" placeholder="请选择" @change="selectCoupon($event,index)"> 
                                        <el-option
                                            v-for="subitem in options"  :key="subitem.skuId" :label="subitem.name" :value="subitem">
                                        </el-option>
                                    </el-select>
                                    <el-input class="couponInput" v-model="item.count" placeholder="请输入优惠券数量"></el-input>
                                    <i class="el-icon-circle-close" v-show="index!=0" @click="delecouponListCheck(index)"></i>
                                </div>
                                <y-button text="新增优惠券" v-show="checkList.indexOf('优惠券')!=-1" classStyle="default-btn"  @btnClick="addCoupon()"></y-button>
                            </div>
                            
                        </el-checkbox-group>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <y-button text="保存" classStyle="main-btn"  @btnClick="submitForm('editData')"></y-button>
                <y-button text="取消"  @btnClick="dialogEditVisible = false"></y-button>
            </span>
        </el-dialog>
    </h2>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import { queryMember,addMember,updateMember,delMemberByid,queryMemberById,getProductList,getEntityProductList,getInteger,getActivityGiftProduct } from '@/api/api.js'
export default {
    components: {
      YButton
    },
    data() {
        return {
            pageSize:10,
            totalRows:0,
            currentPage:1,
            options: [],
            tableData: [],
            roleName:'',
            defaultProps: {
                children: 'childPermissions',
                label: 'name'
            },
            role:'',
            currIds:[],
            data:{},
            editData:{
                gradeName:"",
                smallValue:"",
                integral:"",
            },//编辑的权限
            dialogEditVisible:false,
            allPermissions:[],//全部权限
            allchecked:false,
            editRoleId:'',//当前编辑的id
            checkList:[],
            input:'',
            skuId:'',
            options:[{
                value: '',
                label: '请选择'
            },{
                value: '1',
                label: '启用'
            }, {
                value: '0',
                label: '禁用'
            }],
            couponListCheck:[{}],//选择优惠券列表
            methos:"",//add 新增 update编辑
            memberId:"",//会员id
            rules:{
                gradeName:[{ required: true, message: '请输入等级名称', trigger: 'blur' }],
                smallValue:[{ required: true, message: '请输入所需成长值', trigger: 'blur' }]
            },
            proList:[],//权益礼包赠送实物的所有商品列表
            proListCheck:[{}],//选择实物商品列表
            integralName:'',//积分名称
        }
    },
    created() {
        this.getData()
        this.getInteger()
    },
    methods: {
        getData(){
            queryMember().then(res=>{
                this.tableData = res.data
            })
        },
        // 获取积分设置的名称
        getInteger(){
            getInteger().then(res=>{
                this.integralName = `送${res.data.integralName}`
            })
        },
        // 改变页数后的方法
        handleCurrentChange(val) {
            this.currentPage = val
            this.getData()
        },
        // 删除
        deleFn(id){
            this.$confirm('确定删除该权益吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false
            }).then(() => {
                delMemberByid({memberId:id}).then(res=>{
                    this.$message.success('删除成功!')
                    this.getData()
                })
            }).catch(() => {
                // this.$message('info','已取消删除!')
            })
        },
        // 新增权益
        addRight(){
            this.dialogEditVisible = true
            this.method="add";
            // 清除数据
            this.editData.gradeName="";
            this.editData.smallValue="";
            this.editData.integral = "";
            this.checkList=[];
            this.couponListCheck=[{}];
            this.proList=[];
            this.proListCheck=[{}];
            getProductList().then(res=>{
                this.options = res.data
            })
        },
        // 选择优惠券
        selectCoupon(value,index){
            this.couponListCheck[index].skuId=value.skuId;
            this.couponListCheck[index].skuItemId=value.skuItemId;
        },
        // 选择商品
        selectPro(value,index){
            this.proListCheck[index].skuId=value.split('_')[0];
            this.proListCheck[index].skuItemId=value.split('_')[1];
        },
        // 编辑权限
        handleEdit(id){
            this.method="update"
            this.dialogEditVisible = true
            this.memberId=id;
            this.checkList=[];
            this.couponListCheck=[{}];
            this.editData.integral = ''
            queryMemberById({memberId:id}).then(res=>{
                this.editData.gradeName=res.data.gradeName
                this.editData.smallValue=res.data.smallValue
                if(res.data.integral){
                    this.checkList.push(this.integralName)
                    this.editData.integral=res.data.integral;
                }
                // 0是优惠券 1是实物
                if(res.data.equityList&&res.data.equityList.length!=0){
                    this.couponListCheck=[];
                    this.proListCheck=[];
                    res.data.equityList.forEach(item => {
                        let obj={};
                        if(item.type=='0'){
                            if(item.skuId){
                                obj.skuId=item.skuId;
                                obj.skuItemId=item.skuItemId;
                                obj.count=item.count;
                                obj.data=Object.assign(item);
                                this.couponListCheck.push(obj);
                                obj={};
                            }
                        }else if(item.type=='1'){
                            if(item.skuId){
                                obj.skuId=item.skuId;
                                obj.skuItemId=item.skuItemId;
                                obj.count=item.count;
                                obj.name=item.name+' '+item.oneNormValue+' '+item.twoNormValue+' '+item.threeNormValue;
                                obj.data=Object.assign(item);
                                this.proListCheck.push(obj);
                                obj={};
                            }
                        }
                    });
                    if(this.couponListCheck.length!=0){
                        this.checkList.push('优惠券'); 
                    }else {
                        this.couponListCheck.push({});
                    }
                    if(this.proListCheck.length!=0){
                        this.checkList.push('送实物'); 
                    }else {
                        this.proListCheck.push({});
                    }
                }
            })
            getProductList().then(res=>{
                this.options = res.data
            })
        },
        // 提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let num=/^([1-9]\d*|0)(\.\d*[1-9])?$/
                    let noZeroNum=/^[1-9]\d*$/
                    if(this.editData.gradeName==null||this.editData.gradeName==''){
                        this.$message.error('请输入等级名称')
                        return
                    }
                    if(this.editData.smallValue==null||this.editData.smallValue==''){
                        this.$message.error('请输入所需成长值')
                        return
                    }
                    if (!num.test(this.editData.smallValue)) {
                        this.$message.error('所需成长值请输入整数')
                        return
                    }
                    if(this.checkList.length==0){
                        this.$message.error('请选择权益礼包')
                        return
                    }
                    if(this.checkList.indexOf(this.integralName)!=-1&&!this.editData.integral){
                        this.$message.error(`请输入${this.integralName}数量`)
                        return
                    }
                    if(this.checkList.indexOf(this.integralName)!=-1&&!noZeroNum.test(this.editData.integral)){
                        this.$message.error(`${this.integralName}数量请输入非零数字`)
                        return
                    }
                    if(this.checkList.indexOf(this.integralName)==-1){
                        this.editData.integral="";
                    }
                    let flag=false;
                    let couponArr=[];
                    if(this.checkList.indexOf('优惠券')!=-1){
                        this.couponListCheck.forEach(item=>{
                            if(!item.skuId){
                                flag=true;
                                this.$message.error('请选择优惠券')
                                return
                            }
                            if(!item.count){
                                flag=true;
                                this.$message.error('请输入优惠券数量')
                                return
                            }
                            if(!noZeroNum.test(item.count)){
                                flag=true;
                                this.$message.error('优惠券数量请输入非零数字')
                                return
                            }
                            couponArr.push(item.skuId+"_"+item.skuItemId+"_"+item.count+"_"+0);
                        })
                    }
                    if(this.checkList.indexOf('送实物')!=-1){
                        this.proListCheck.forEach(item=>{
                            if(!item.skuId){
                                flag=true;
                                this.$message.error('请选择商品')
                                return
                            }
                            // if(!item.count){
                            //     flag=true;
                            //     this.$message.error('请输入商品数量')
                            //     return
                            // }
                            // if(!noZeroNum.test(item.count)){
                            //     flag=true;
                            //     this.$message.error('商品数量请输入非零数字')
                            //     return
                            // }
                            couponArr.push(item.skuId+"_"+item.skuItemId+"_"+1+"_"+1)
                        })
                    }
                    this.editData.skuIds=couponArr.join(",");
                    if(flag){
                        return;
                    }
                    if(this.method=="add"){
                        addMember(this.editData).then(res=>{
                            this.$message.success('新增成功!')
                            this.dialogEditVisible = false
                            this.getData()
                            this.couponListCheck=[{}];
                        })
                    } else {
                        this.editData.memberId=this.memberId;
                        updateMember(this.editData).then(res=>{
                            this.$message.success('编辑成功!')
                            this.dialogEditVisible = false
                            this.getData()
                        })
                    }
                    
                } else {
                    return false;
                }
            })
        },
        // 多选框选择
        handleCheckboxChange(val){
            // console.log(val.indexOf('优惠券'))
            if(val.indexOf(this.integralName)==-1){
                this.editData.integral="";
            }
        },
        // 新增一条选择优惠券
        addCoupon(){
            this.couponListCheck.push({})
        },
        // 删除新增后的优惠券
        delecouponListCheck(ind){
            this.couponListCheck.splice(ind,1)
        },
        //赠送实物
        handleFiltermethod(val){
            getActivityGiftProduct({name:val}).then(res=>{
                this.proList = res.data
            })
        },
        handlevisiblechange(data,flag){
            if(flag){
                this.handleFiltermethod(data.data.name)
            }
        },
        // 新增一条实物
        addPro(){
            this.proListCheck.push({})
        },
        // 删除选择后的实物
        deleproListCheck(ind){
            this.proListCheck.splice(ind,1)
        }
    }
}
</script>
   
<style lang='scss'>
.el-dialog__body{
    .el-select{
        .el-input__inner{
            width: 150px;
            margin-right: 10px;
        }
        .el-input__suffix{
            right: 10px;
        }
    }
    .couponInput{
        .el-input__inner{
            width: 150px;
        }
    }
    .couponBox{
        display:flex;
        margin-left: 96px;
        margin-bottom:10px;
        &:nth-of-type(1){
            margin-top: -36px;
        }
        .el-icon-circle-close{
            font-size: 20px;
            margin-top: 8px;
            margin-left: 6px;
        }
    }
    .default-btn{
        margin-left: 96px;
    }
}
</style>