<template>
    <div class="productImport proList boxs">
        <div class="headBox">
            <h2>商品导入</h2>
        </div>
        <div>
            <el-form ref="form" :model="form" label-width="140px" size="medium">
                <el-form-item label="供应商" prop="supplierId"
                    :rules="[{ required: true, message: '请选择供应商', trigger: 'blur' }]">
                    <el-select v-model="form.supplierId" placeholder="请选择">
                        <!-- <el-option v-for="item in newOptions2" :key="item.supplierId" :label="item.name" :value="item.supplierId">
                        </el-option> -->
                        <el-option :key="4" label="供应链" :value="4">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下载导入模板">
                    <div style="color:blue;cursor:pointer;" @click="downloadTem()">点击下载模板</div>
                </el-form-item>
                <el-form-item label="导入商品" prop="importPro"
                    :rules="[{ required: true }]">
                    <el-upload :data="{supplierId: this.form.supplierId,userName:this.loginName}" 
                        :on-success="success" 
                        :on-change="handleChange" 
                        class="upload-demo" ref="upload" 
                        :action="actionUrl" :on-error="error" 
                        :auto-upload="false" :on-remove="handleRemove">
                        <el-button slot="trigger" size="small" type="primary" @click="changeSelect()">选取文件</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="提示:" style="font-size:14px;color:red;">
                    <span>如果导入速度较慢，建议您把文件拆分为几个小文件，然后分别导入<br>导入的商品文件可 .xlsx 与 .xls格式，每次导入的商品不超过1000个</span>
                </el-form-item>
                <el-form-item>
                    <el-button style="margin-left:50px;" @click="clearCon()">取消</el-button>
                    <el-button type="primary" @click="onSubmit()">导入</el-button>
                    <el-button type="primary" v-show="isSuccess" @click="submitExcel()" v-loading.fullscreen.lock="fullscreenLoading" element-loading-background="rgba(0, 0, 0, 0.8)">{{btnCon}}</el-button>
                    <el-button type="primary" v-show="isExport" @click="exportExcel()">导出校验结果数据</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import request from '@/api/request.js'
import { getPassedSupplier,batchImport,getUserName } from '@/api/api.js'
export default {
    data() {
        return {
            form: {
                supplierId:''
            },
            newOptions2: '',
            isSuccess: false,
            isExport: false,
            fileInputVal: '',
            fullscreenLoading: false,
            btnCon: '提交',
            actionUrl: request.EMPORT_URL,
            loginName:''
        }
    },
    created() {
        this.getPassedSupplier()
        this.getUserName()
    },
    methods: {
        getUserName(){
            getUserName().then(res=>{
                this.loginName=res.data;
            })
        },
        onSubmit() {
            if (this.form.supplierId == '' || this.form.supplierId == null) {
                this.$message.error('请选择供应商!')
                return;
            }
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
        // 获取供应商
        getPassedSupplier() {
            getPassedSupplier().then(res=>{
                this.newOptions2 = res.data
            })
        },
        downloadTem() {
            location.href = encodeURI(encodeURI(request.EXPORT_URL + "?template=product_import_template.xls&fileName=商品导入模板"));
        },
        // 上传失败
        error(err, file, fileList) {
            this.$message.error(err)
        },
        // 上传成功
        success(response, file, fileList) {
            if (response.status == 0) {
                var msg = response.data
                if (msg.success > 0) {
                    if (msg.error > 0) {
                        this.$message.warning('数据有误!')
                        this.btnCon = '忽略错误提交'
                        this.isSuccess = true
                        this.isExport = true
                    } else {
                        if (msg.repetition > 0) {
                            this.$message.warning('数据有误!')
                            this.isExport = true
                        } else {
                            this.btnCon = '提交'
                            this.isSuccess = true
                        }
                    }
                } else {
                    this.$message.error('没有校验成功的数据!')
                    return
                }
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
            batchImport({supplierId: this.form.supplierId}).then(res=>{
                this.$message.success('导入商品成功!')
                this.form.supplierId = ''
                this.fileInputVal = ''
                this.routerLink('productList2')
                this.$parent.getPermissions(1)
            })
        },
        // 导出错误数据
        exportExcel() {
            window.location.href = encodeURI(encodeURI(request.EXPORT_URL + "?template=product_import_template.xls&datas=datas&cellNum=5&ignoreRows=1&fileName=商品导入校验结果"));
        },
        // 取消清空数据
        clearCon() {
            this.form.value = ''
            this.$refs.upload.clearFiles()
            this.isSuccess = false
            this.isExport = false
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
<style lang="scss">
.el-upload-list{
    width: 30%;
}
</style>

