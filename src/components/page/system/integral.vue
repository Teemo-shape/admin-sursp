<template>
    <div class='activityAdd proList boxs'>
        <div class="headBox">
            <h2>积分设置</h2>
        </div>
        <el-form ref="form" :model="form" label-width="140px" size="medium" :rules="rules">
            <el-form-item label="名称" prop="integralName">
                <el-input v-model="form.integralName"></el-input>
            </el-form-item>
            <el-form-item label="" style="margin-top:-20px;">
                <span style="color:#ccc;font-size:12px;">币（如金币）、豆（如京豆）、值、油等</span>
            </el-form-item>
            <el-form-item label="兑换比例" prop="ratioRmb" class="ratio">
                1元= <el-input type="number" v-model="form.ratioRmb"></el-input> {{form.integralName}}
            </el-form-item>
            <el-form-item label="获取上限" prop="integralDayMax" class="ratio">
                每个用户每天最多获取 <el-input type="number" v-model="form.integralDayMax"></el-input> {{form.integralName}}
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">保存</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
   
   
<script>
import {getInteger,updateInteger } from '@/api/api.js'
import { get } from 'http';
export default {
    components: {
      
    },
    data() {
        return {
            form:{
                integralName: '',//名称
                integralDayMax: '',//积分上限
                ratioRmb:"",//兑换比例
            },
            rules: {
                integralName: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                integralDayMax: [
                    { required: true, message: '请输入积分上限', trigger: 'blur' }
                ],
                ratioRmb: [
                    { required: true, message: '请输入兑换比例', trigger: 'blur' }
                ],
            },//限制规格
        }
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取用户积分
        getData(){
            getInteger().then(res=>{
                this.form.integralName=res.data?res.data.integralName:"";
                this.form.ratioRmb=res.data?res.data.ratioRmb:"";
                this.form.integralDayMax=res.data?res.data.integralDayMax:"";
            })
        },
        //提交新增
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let noZeroNum=/^[1-9]\d*$/
                    if (!noZeroNum.test(this.form.ratioRmb)) {
                        this.$message.error('兑换比例请输入非零数字')
                        return
                    }
                    if (!noZeroNum.test(this.form.integralDayMax)) {
                        this.$message.error('积分上限请输入非零数字')
                        return
                    }
                    updateInteger(this.form).then(res=>{
                        this.$message.success('提交成功!')
                        this.getData();
                    })
                } else {
                    return false;
                }
            })
        },
        // 重置
        resetForm(formName) {
             this.$refs[formName].resetFields()
        },
    }
}
</script>
   
<style lang='scss'>
.activityAdd{
    .el-input{
        display: inline;
    }
    .el-input__inner{
        width: 400px;
    }
    .el-input__prefix{
        top: -8px;
    }
    .el-input__suffix{
        top: 0;   
    }
    .ratio{
        .el-input__inner{
            width: 100px;
        }
    }
}
</style>