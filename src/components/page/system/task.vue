<template>
    <div class='proList boxs task'>
        <div class="headBox">
            <h2>任务设置</h2>
            <!-- <y-button text="新增" class="button" classStyle="main-btn" @btnClick=""></y-button> -->
        </div>
        <div class="hint boxs" v-show="isShowHint">
            <span>激励用户做任务，激活存量用户活跃，并快速成为忠诚会员。</span>
            <span class="icon el-icon-close" style="line-height:50px;" @click="isShowHint = false"></span>
        </div>
        <div class="setTask">
            <div class="task-item">
                <div class="itemName boxs"><span>新手任务</span></div>
                <el-checkbox-group v-model="newbieCheckList" @change="handleCheckboxChange">
                    <div v-for="(item,index) in newbieTask" :key="item.taskId">
                        <el-checkbox :label="item.taskName"></el-checkbox>
                        <div class="radioBox" v-show="newbieCheckList.indexOf(item.taskName)!=-1">
                            <el-radio-group v-model="item.taskType" @change="handleRadioChange(index,item.taskType)">
                                <el-radio :label="1">完成后赠送：
                                    <div><el-input type="number" v-model="item.integral1" :disabled="item.taskType!=1" placeholder="请输入整数"></el-input> {{integralName}}</div>
                                    <div><el-input type="number" v-model="item.growthValue1" :disabled="item.taskType!=1" placeholder="请输入整数"></el-input> 成长值</div>
                                </el-radio>
                                <el-radio :label="0">完成后赠送：
                                    <div><el-input type="number" v-model="item.integral2" :disabled="item.taskType!=0" placeholder="请输入整数"></el-input> {{integralName}}</div>
                                </el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                </el-checkbox-group>
            </div>
            <div class="task-item">
                <div class="itemName boxs"><span>日常任务</span></div>
                <el-checkbox-group v-model="dailyCheckList" @change="handleCheckboxChange1">
                    <div v-for="(item,index) in dailyTask" :key="item.taskId">
                        <el-checkbox :label="item.taskName"></el-checkbox>
                        <div class="radioBox" v-show="dailyCheckList.indexOf(item.taskName)!=-1">
                            <el-radio-group v-model="item.taskType" @change="handleRadioChange1(index,item.taskType)">
                                <el-radio :label="3" class="noRadioInput">每人每天最多可做任务数
                                    <div><el-input type="number" v-model="item.dayTime" placeholder="请输入任务数"></el-input> /天</div>
                                </el-radio>
                                <el-radio :label="1">完成后赠送：
                                    <div><el-input type="number" v-model="item.integral1" :disabled="item.taskType!=1" placeholder="请输入整数"></el-input> {{integralName}}</div>
                                    <div><el-input type="number" v-model="item.growthValue1" :disabled="item.taskType!=1" placeholder="请输入整数"></el-input> 成长值</div>
                                </el-radio>
                                <el-radio :label="0">完成后赠送：
                                    <div><el-input type="number" v-model="item.integral2" :disabled="item.taskType!=0" placeholder="请输入整数"></el-input> {{integralName}}</div>
                                </el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                </el-checkbox-group>
            </div>
        </div>
        <div class="footerBtn">
            <y-button text="保存" class="button" classStyle="main-btn" @btnClick="saveTask()"></y-button>
        </div>
    </div>
</template>
   
   
<script>
import YButton from '@/components/common/YButton.vue'
import {getTask,updateTask,getInteger } from '@/api/api.js'
export default {
    components: {
      YButton
    },
    data() {
        return {
            isShowHint:true,
            newbieCheckList:[],//新手任务多选框
            newbieTask:[ //新手任务列表
                // {taskName:'绑定手机',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
                // {taskName:'绑定邮箱',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
                // {taskName:'上传头像',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
                // {taskName:'完成实名认证',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
                // {taskName:'完善个人信息',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
            ],
            dailyCheckList:[],//日常任务多选框
            dailyTask:[ //日常任务列表
                // {taskName:'每日登陆',input0:'',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
                // {taskName:'发表动态',input0:'',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
                // {taskName:'点赞',input0:'',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
                // {taskName:'评论',input0:'',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
                // {taskName:'转发',input0:'',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
                // {taskName:'收藏',input0:'',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
                // {taskName:'分享',input0:'',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
                // {taskName:'晒单',input0:'',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
                // {taskName:'邀请好友下载APP',input0:'',input1:'',input2:'',input3:'',isDisadled1:false,isDisadled2:false,isDisadled3:false,radio:''},
            ],
            integralName:'',//设置好的名称
        }
    },
    created() {
        this.getTask();
        this.getInteger();
    },
    methods: {
        // 获取设置好的名称
        getInteger(){
            getInteger().then(res=>{
                this.integralName = res.data.integralName
            })
        },
        // 获取任务设置数据
        getTask(){
            getTask().then(res=>{
                this.newbieTask=[];
                this.dailyTask=[];
                this.newbieCheckList=[];
                this.dailyCheckList=[];
                res.data.forEach(item => {
                    // 新手任务
                    if(item.type!=1){
                        // 是否选中
                        if(item.states==1){
                            this.newbieCheckList.push(item.taskName);
                            // 0:只有奖励积分
                            if(item.taskType===0){
                                item.integral2=item.integral;
                            }
                            // 1:有奖励积分也有奖励成长值
                            if(item.taskType===1){
                                item.integral1=item.integral;
                                item.growthValue1=item.growthValue;
                            }
                        }
                        // 解决输入框输不进去的问题 属性在返回数据中没有要先声明
                        item.integral1 = ''
                        item.growthValue1 = ''
                        item.integral2 = ''
                        this.newbieTask.push(item);
                        // 日常任务
                    } else {
                        if(item.states==1){
                            this.dailyCheckList.push(item.taskName);
                            // 0:只有奖励积分
                            if(item.taskType===0){
                                item.integral2=item.integral;
                            }
                            // 1:有奖励积分也有奖励成长值
                            if(item.taskType===1){
                                item.integral1=item.integral;
                                item.growthValue1=item.growthValue;
                            }
                        }
                        // 解决输入框输不进去的问题 属性在返回数据中没有要先声明
                        item.integral1 = ''
                        item.growthValue1 = ''
                        item.integral2 = ''
                        this.dailyTask.push(item); 
                    }
                });
            })
        },
        // 新手多选框触发
        handleCheckboxChange(val){
            console.log(val)
        },
        // 新手单选框触发
        handleRadioChange(index,taskType){
            // debugger
            if(taskType==1){
                this.newbieTask[index].integral2 = ''
                this.newbieTask.push();
            }else{
                this.newbieTask[index].integral1 = ''
                this.newbieTask[index].growthValue1 = ''
                this.newbieTask.push();
            }
        },
        // 日常多选框触发
        handleCheckboxChange1(val){
            console.log(val)
        },
        // 日常单选框触发
        handleRadioChange1(index,taskType){
            if(taskType==1){
                this.dailyTask[index].integral2 = ''
                this.dailyTask.push();
            }else if(taskType==0){
                this.dailyTask[index].integral1 = ''
                this.dailyTask[index].growthValue1 = ''
                this.dailyTask.push();
            }
        },
        saveTask(){
            let _this = this;
            let noZeroNum=/^[1-9]\d*$/
            let data=this.newbieTask.concat(this.dailyTask);
            let flag=false;
            data.forEach(item=>{
                //  debugger
                if(_this.newbieCheckList.indexOf(item.taskName)>-1||_this.dailyCheckList.indexOf(item.taskName)>-1){
                    item.states=1;
                    // 如果是日常任务 需要传限制次数
                    if(item.type==1){
                         if(!item.dayTime){
                            _this.$message.error('请输入'+item.taskName+"任务每天限制的完成次数");
                            flag=true;
                            return
                        }
                        if(!noZeroNum.test(item.dayTime)){
                            _this.$message.error('限制次数只能为整数');
                            flag=true;
                            return
                        }
                    }
                    // 判断是否选择奖励
                    if(item.taskType==null){
                        _this.$message.error('请选择'+item.taskName+"任务完成后的奖励");
                        flag=true;
                        return
                    }
                    // 只有积分
                    if(item.taskType===0){
                        if(!item.integral2){
                            _this.$message.error('请输入'+item.taskName+"任务完成后增送的积分");
                            flag=true;
                            return
                        }
                        if(!noZeroNum.test(item.integral2)){
                            _this.$message.error('赠送积分值只能为整数');
                            flag=true;
                            return
                        }
                        item.integral=item.integral2;
                        // 清掉成长值
                        item.growthValue='';
                    }else {
                        // 积分和成长值
                        if(!item.integral1){
                            _this.$message.error('请输入'+item.taskName+"任务完成后增送的积分");
                            flag=true;
                            return
                        }
                        if(!noZeroNum.test(item.integral1)){
                            _this.$message.error('赠送积分值只能为整数');
                            flag=true;
                            return
                        }
                        if(!item.growthValue1){
                            _this.$message.error('请输入'+item.taskName+"任务完成后增送的成长值");
                            flag=true;
                            return
                        }
                        if(!noZeroNum.test(item.growthValue1)){
                            _this.$message.error('赠送成长值只能为整数');
                            flag=true;
                            return
                        }
                        // 积分和成长值赋值
                        item.integral=item.integral1;
                        item.growthValue=item.growthValue1;
                    }  
                }else {
                    item.states=0;
                    item.taskType=null;
                    item.growthValue="";
                    item.integral="";
                    item.dayTime="";
                    item.integral1=""
                    item.integral2=""
                    item.growthValue1=""
                    item.dayTime=""
                }
            })
            if(flag){
                return;
            }
            updateTask(data).then(res=>{
                _this.$message.success('提交成功!')
                _this.getTask();
            })
            
        }
    }
}
</script>
   
<style lang='scss'>
.task{
    .hint{
        width: 100%;
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        background: rgba($color: $main-col, $alpha: 0.1);
        color: $main-col;
    }
    .setTask{
        margin-top: 30px;
        display: flex;
        .task-item{
            width: 30%;
            margin-right: 30px;
            .itemName{
                width: 100%;
                height: 32px;
                line-height: 32px;
                padding: 0 10px;
                background: #f9f9f9;
                span{
                    font-weight: 900;
                    border-left: 4px solid $main-col;
                    padding-left: 6px;
                }
            }
            .el-checkbox-group{
                padding: 20px 30px;
                .el-checkbox{
                    display: block;
                    margin-bottom: 20px;
                }
                .radioBox{
                    padding-left: 24px;
                    .el-radio{
                        display: block;
                        .el-input{
                            width: 60%;
                            margin-top: 10px;
                            margin-left: 24px;
                        }
                    }
                    .noRadioInput{
                        .el-radio__input{
                            display: none;
                        }
                        .el-radio__label{
                            padding-left: 24px;
                        }
                        &.is-checked{
                            .el-radio__label{
                                color: #333;
                            }
                        }
                    }
                }
            }
        }
    }
    .footerBtn{
        height: 80px;
        border-top: 1px solid #eee;
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 20px 0;
    }
} 
</style>