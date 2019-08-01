<template>
    <div class='proList boxs addProduct'>
        <div class="headBox">
            <h2>编辑商品</h2>
        </div>
        <div class="addProduct-info">
            <div class="itemName"><span>商品类型</span></div>
            <div class="proType">
                <div class="proType-item matter " :class="{active:proType==1}" v-if="proType==1">
                    <span class="iconfont iconxinzengshangpin-shangpin"></span>
                    <p>实物</p>
                    <img src="@img/proActive.png" v-if="proType==1" alt="">
                </div>
                <div class="proType-item coupon" :class="{active:proType==2}" v-if="proType==2">
                    <span class="iconfont iconxinzengshangpin-youhuiquan"></span>
                    <p>优惠券</p>
                    <img src="@img/couponActive.png" v-if="proType==2" alt="">
                </div>
            </div>
            <div class="itemName"><span>基本信息</span></div>
            <el-form ref="form" :model="form" label-width="100px" size="medium" :rules="rules">
                <el-form-item label="商品名称" prop="name">
                    <el-input type="text" v-model="form.name" maxlength="20" show-word-limit placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品描述">
                    <el-input type="textarea" v-model="form.productTextDesc" maxlength="30" show-word-limit placeholder="请输入商品描述"></el-input>
                </el-form-item>
                <el-form-item label="商品主图" prop="fileId">
                    <el-upload :data="{fileType: 'product_img_type'}" 
                        :action="actionUrl" list-type="picture-card"
                        :on-success="success1" 
                        :file-list="fileList"
                        :on-remove="remove1"
                        :limit="5"
                        :multiple="true">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <span v-for="(item,index) in picFileMoreArr" class="setMainImg" >
                        <el-button type="primary" size="mini" v-if="!item.isMain" @click="setMainImg(index)">设为主图</el-button>
                        <el-button type="primary" plain size="mini" v-else>商品主图</el-button>
                    </span>
                </el-form-item>
                <el-form-item label="">
                    <span class="hint">按住ctrl可同时批量选择多张图片上传，最多可上传5张，图片大小不能超过1M，格式为JPG、JPEG、PNG、SVG，主图为商品列表图，其他图为商品详情轮播图</span>
                </el-form-item>
                <div class="itemName"><span>规格信息</span></div>
                <el-form-item label="规格设置" style="margin-top:40px;">
                    <div class="setSpec">
                        <div class="spec-item" v-for="(item,index) in specList">
                            <el-select v-model="item.specName" placeholder="请选择规格" size="small" @change="handleSpecChange" @visible-change="handleSpecechange">
                                <el-option
                                v-for="(v,i) in options"
                                :key="v.normId"
                                :label="v.normName"
                                :value="v.normId"
                                :disabled="v.disabled">
                                </el-option>
                            </el-select>
                            <div class="spec-item-nature" v-show="item.specName!=null&&item.specName!=''">
                                <div class="natureBox">
                                    <span class="nature boxs" v-for="(subitem,subindex) in item.natureList">{{subitem.natureName}}
                                        <i class="el-icon-close hands" @click="deleNature(index,subindex)"></i>
                                    </span>
                                </div>
                                <div>
                                    <span class="nature boxs addnature hands" @click="addnature(index)" v-show="item.natureList.length<=4"><i class="el-icon-plus"></i>添加属性</span>
                                    <el-select v-model="item.natureValue" placeholder="搜索或自定义属性" 
                                        filterable allow-create size="small" v-show="item.isShowNatureSelect" @change="handleNatureChange(index)" @visible-change="handlevisiblechange(index,$event)"> 
                                        <el-option
                                            v-for="item in valueOptions"
                                            :key="item.normId"
                                            :label="item.normName"
                                            :value="item.normName"
                                            :disabled="item.disabled">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="deleSpec hands" @click="deleSpec(index)">删除</div>
                        </div>
                        <el-button class="addSpec" v-if="specList.length<=2" @click="addSpec()"><i class="el-icon-circle-plus"></i> 添加规格</el-button>
                        <el-button type="info" v-else>已达添加上限</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="售卖信息">
                    <table cellspacing="0" cellpadding="0" style="width:90%;margin:0" class="sizeTable" v-show="isShowTable">
                        <th v-for="item in specList" v-show="item.specName!=null&&item.specName!=''">{{item.specName}}</th>
                        <th><span style="color:#F56C6C">*</span>市场价</th>
                        <th><span style="color:#F56C6C">*</span>成本价</th>
                        <th><span style="color:#F56C6C">*</span>兑换价</th>
                        <th><span style="color:#F56C6C">*</span>可售库存</th>
                        <tr v-for="item in proArr">
                            <td v-show="item.oneNormValue">{{item.oneNormValue}}</td>
                            <td v-show="item.twoNormValue">{{item.twoNormValue}}</td>
                            <td v-show="item.threeNormValue">{{item.threeNormValue}}</td>
                            <td style="width:15%"><el-input v-model="item.jdPrice" style="display:inline;"></el-input></td>
                            <td style="width:15%"><el-input v-model="item.price" style="display:inline;"></el-input></td>
                            <td style="width:15%"><el-input v-model="item.integral" style="display:inline;"></el-input></td>
                            <td style="width:15%"><el-input v-model="item.skuNum" style="display:inline;"></el-input></td>
                        </tr>
                    </table>
                    <div class="setBatch" v-show="isShowTable">批量设置：
                        <span v-show="isShowBatch">
                            <span @click="showBatchInp(1)" class="batchBtns">市场价</span>
                            <span @click="showBatchInp(0)" class="batchBtns">成本价</span>
                            <span @click="showBatchInp(3)" class="batchBtns">兑换价</span>
                            <span @click="showBatchInp(4)" class="batchBtns">可售库存</span>
                        </span>
                        <span v-show="!isShowBatch"><input type="text" v-model="batchNum">
                            <span class="batchBtns" @click="saveBatchInp()">保存</span>
                            <span class="batchBtns" @click="this.isShowBatch = true">取消</span>
                        </span>
                    </div>
                    <table cellspacing="0" cellpadding="0" style="width:90%;" class="sizeTable saleInfo"  v-show="!isShowTable">
                        <tr>
                            <td style="width:15%">市场价 <el-input v-model="saleInfoPrice.jdPrice" :disabled="isShowTable" style="display:inline;"></el-input></td>
                            <td style="width:15%">成本价 <el-input v-model="saleInfoPrice.price" :disabled="isShowTable" style="display:inline;"></el-input></td>
                            <td style="width:15%">兑换价 <el-input v-model="saleInfoPrice.integral" :disabled="isShowTable" style="display:inline;"></el-input></td>
                            <td style="width:15%">可售库存 <el-input v-model="saleInfoPrice.skuNum" :disabled="isShowTable" style="display:inline;"></el-input></td>
                        </tr>
                    </table>
                </el-form-item>
                <div class="itemName"><span>商品详情</span></div>
                <el-form-item label="商品详情" prop="saleInfo" style="width:100%;margin-top:40px"
                    :rules="[{ required: true ,message:'请输入产品介绍、使用说明、注意事项等内容'}]">
                    <quill-editor 
                        v-model="editorContent" 
                        ref="myQuillEditor" 
                        :options="editorOption" 
                        :fileName="fileName"
                        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)"
                        :uploadUrl="actionUrl+'?fileType=product_img_type'">
                    </quill-editor>
                </el-form-item>
                <el-form-item label="">
                    <div style="color:#ccc;text-align:left;">图片大小不能超过5M,格式为JPG,JPEG,PNG,GIF;视频大小不能超过20M,格式为AVI,MOV,RMVB,FLV,MP4</div>
                </el-form-item>
                <el-upload :data="{fileType: 'product_video_type'}" class="upload-demo" :action="videoUrl" :on-success='upScuccess' :before-upload='beforeUpload'
                    ref="upload" style="display:none">
                    <el-button size="small" type="primary" id="imgInput">点击上传</el-button>
                </el-upload>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">确认编辑</el-button>
                    <!-- <el-button @click="resetForm('form')">重置</el-button> -->
                </el-form-item>
            </el-form>
            
            
        </div>
    </div>
</template>
   
   
<script>
import { deleteFile,getItemNorm,getProductById,editSelfProduct } from '@/api/api.js'
import request from '@/api/request.js'
import { quillEditor } from 'vue-quill-editor'
import * as Quill from 'quill'
import { addQuillTitle } from '@/assets/js/quill-title.js'
import { debug } from 'util';
export default {
    data() {
        return {
            proType:1,//商品类型 1是实物
            actionUrl:request.actionUrl,//上传图片地址
            form:{name:'',fileId:'',productTextDesc:'',saleInfo:''},
            rules:{
                name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                fileId: [
                    { required: true, message: '请上传商品主图' }
                ],
                saleInfo: [
                    {  }
                ],
                detailId: [
                    {  }
                ],
            },
            isShowFile:true,//是否显示上传的图片
            picFileMoreArr:[],
            specList:[
                // {
                //     specName:'',
                //     isShowNatureSelect:false,
                //     natureValue:'',
                //     natureList:[
                //         { natureName:'' }
                //     ]
                // }
            ],// 规格列表
            options: [],//规格列表
            valueOptions: [],//规格值列表
            proArr:[],//售卖信息表格
            isShowTable:false,
            editorContent:'',//富文本内容
            editorOption:{
                placeholder: '请输入产品介绍、使用说明、注意事项等内容',
                theme: 'snow', //主题风格
            },
            uploadType:'video',
            fileName:'file',
            videoUrl:request.BASE_URL+'/file/uploadVideo',
            picDetailIdArr: [],//商品详情图id和视频ID
            picFileId:'',//商品主图ID
            picFileMore:[],//轮播图ID
            saleInfoPrice:{ //没有规格时的售卖信息
                jdPrice:'',
                price:'',
                integral:'',
                skuNum:'',
            },
            isShowBatch: true,//是否显示批量设置下的按钮
            batchNum: '',//批量设置的数量
            witchBatch: '',//批量设置哪一个
            fileList: [
                // {url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, 
                // {url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
            ]
        }
    },
    created() {
        this.getItemNorm('')
        this.getProductById()
    },
    methods: {
        // 获取详情
        getProductById(){
            getProductById({skuId:this.$route.query.skuId}).then(res=>{
                this.proType = res.data.goodsType
                this.form.name = res.data.name
                this.form.fileId = true
                this.form.productTextDesc = res.data.productTextDesc
                this.picFileId = res.data.picFileId
                let picMap = res.data.picMap
                for(let key in picMap){
                    let str = {
                        url:picMap[key],
                        fileId:key
                    }
                    this.fileList.push(str)

                    this.picFileMore.push(key)
                    let str2 = {
                        fileId:key,
                        isMain:false
                    }
                    if(res.data.picFileId==key){
                        str2.isMain = true
                    }
                    this.picFileMoreArr.push(str2)
                }
                this.editorContent = res.data.appintroduce
                if(res.data.list!=null&&res.data.list.length!=0){
                    this.isShowTable = true
                    res.data.list.forEach((i,a)=>{
                        let str = {
                            specName:i.value,
                            isShowNatureSelect:false,
                            natureValue:'',
                            natureList:[]
                        } 
                        i.list2.forEach((j,b)=>{
                            let str2 = {
                                natureName:j.value
                            }
                            str.natureList.push(str2)
                        })
                        this.specList.push(str)
                    })
                    // this.setTable(this.specList, 0, {arr:[]})
                    res.data.productItems.forEach((item,index)=>{
                        let str = {
                            integral:item.integral,
                            jdPrice:item.jdPrice,
                            price:item.price,
                            skuNum:item.skuNum,
                            oneNormName:item.oneNormName,
                            oneNormValue:item.oneNormValue,
                            twoNormName:item.twoNormName,
                            twoNormValue:item.twoNormValue,
                            threeNormName:item.threeNormName,
                            threeNormValue:item.threeNormValue,
                        }
                        this.proArr.push(str)
                    })
                }else{
                    this.isShowTable = false
                    this.saleInfoPrice.jdPrice = res.data.productItems[0].jdPrice
                    this.saleInfoPrice.price = res.data.productItems[0].price
                    this.saleInfoPrice.integral = res.data.productItems[0].integral
                    this.saleInfoPrice.skuNum = res.data.productItems[0].skuNum
                }
            })
        },
        // 获取规格
        getItemNorm(id){
            getItemNorm({normId:id}).then(res=>{
                if(id!=null&&id!=''){
                    this.valueOptions = res.data
                    for(let i = 0;i<this.valueOptions.length;i++){
                        this.valueOptions[i].disabled = false
                        for(let j = 0;j<this.specList.length;j++){
                            for(let a = 0;a<this.specList[j].natureList.length;a++){
                                if(this.valueOptions[i].normName==this.specList[j].natureList[a].natureName){
                                    this.valueOptions[i].disabled = true
                                    break
                                }
                            }
                        }
                    }
                }else{
                    this.options = res.data
                    //循环所有的规格和已选的规格列表 把已选的禁用
                    for(let i = 0;i<this.options.length;i++){
                        this.options[i].disabled = false
                        for(let j = 0;j<this.specList.length;j++){
                            if(this.specList[j].specName==this.options[i].normId||this.specList[j].specName==this.options[i].normName){
                                this.options[i].disabled = true
                                this.getItemNorm(this.options[i].normId)
                            }
                        }
                    }
                }
            })
        },
        // 选择商品类型
        changeType(val){
            this.proType = val
        },
        // 设为主图
        setMainImg(ind){
            this.picFileMoreArr.forEach(item=>{
                item.isMain = false
            })
            this.picFileMoreArr[ind].isMain = true
            this.picFileId = this.picFileMoreArr[ind].fileId
        },
        // 上传成功
        success1(response, file, fileList) {
            if (response.status == 0) {
                this.picFileMore.push(response.data.fileId)
                let str = {
                    fileId:response.data.fileId,
                    isMain:false
                }
                this.picFileMoreArr.push(str)
                this.isShowFile = true
                this.form.fileId = true
            } else {
                fileList.pop()
                this.$message.error(response.message)
                this.isShowFile = false
            }
        },
        // 删除文件
        remove1(file, fileList) {
            let fileIdaa ;
            // 如果是新上传的图片直接删除
            if(file.response!=null&&file.response!=''){
                fileIdaa = file.response.data.fileId
                if(!fileIdaa){
                    return;
                }
                deleteFile({ fileId: fileIdaa }).then(res=>{
                    for(let i = 0;i<this.picFileMoreArr.length;i++){
                        if(this.picFileMoreArr[i].fileId==fileIdaa){
                            this.picFileMoreArr.splice(i,1)
                            break
                        }
                    }
                    let index = this.picFileMore.indexOf(fileIdaa)
                    this.picFileMore.splice(index,1)
                })
            //如果是编辑过来的图片先页面删除  保存的时候再数据库删除
            }else{
                fileIdaa = file.fileId
                if(!fileIdaa){
                    return;
                }
                for(let i = 0;i<this.picFileMoreArr.length;i++){
                    if(this.picFileMoreArr[i].fileId==fileIdaa){
                        this.picFileMoreArr.splice(i,1)
                        break
                    }
                }
                let index = this.picFileMore.indexOf(fileIdaa)
                this.picFileMore.splice(index,1)
            }
        },
        // 添加属性
        addnature(ind){
            this.specList[ind].isShowNatureSelect = true
            this.specList[ind].natureValue = ''
        },
        // 选择属性
        handleNatureChange(ind){
            for(let i = 0;i<this.options.length;i++){
                if(this.options[i].normId==this.specList[ind].specName){
                    this.specList[ind].specName = this.options[i].normName
                    break
                }
            }
            for(let i = 0;i<this.valueOptions.length;i++){
                if(this.valueOptions[i].normName==this.specList[ind].natureValue){
                    this.valueOptions[i].disabled = true
                    break
                }
            }
            this.specList[ind].isShowNatureSelect = false
            let str = {
                natureName:this.specList[ind].natureValue
            }
            this.specList[ind].natureList.push(str)
            this.isShowTable = true
            this.proArr = []
            this.setTable(this.specList, 0, {arr:[]})
        },
        handlevisiblechange(ind,flag){
            if(flag){
                for(let i = 0;i<this.options.length;i++){
                    if(this.specList[ind].specName==this.options[i].normId||this.specList[ind].specName==this.options[i].normName){
                        this.getItemNorm(this.options[i].normId)
                        break
                    }
                }
                
            }
        },
        // 选择规格禁用选择项并查找属性值
        handleSpecChange(ind){
            //循环所有的规格和已选的规格列表 把已选的禁用
            for(let i = 0;i<this.options.length;i++){
                this.options[i].disabled = false
                for(let j = 0;j<this.specList.length;j++){
                    if(this.specList[j].specName==this.options[i].normId){
                        this.options[i].disabled = true
                        this.getItemNorm(this.options[i].normId)
                    }
                }
            }
        },
        handleSpecechange(flag){
            if(flag){
                this.getItemNorm('')
            }
        },
        // 删除属性
        deleNature(ind,subind){
            for(let i = 0;i<this.valueOptions.length;i++){
                if(this.valueOptions[i].normName==this.specList[ind].natureList[subind].natureName){
                    this.valueOptions[i].disabled = false
                    break
                }
            }
            this.specList[ind].natureList.splice(subind,1)
            this.proArr = []
            this.setTable(this.specList, 0, {arr:[]})
        },
        // 删除规格
        deleSpec(ind){
            if(this.specList[ind].specName!=null&&this.specList[ind].specName!=''){
                for(let i = 0;i<this.options.length;i++){
                    if(this.options[i].normId==this.specList[ind].specName||this.options[i].normName==this.specList[ind].specName){
                        this.options[i].disabled = false
                        break
                    }
                }
            }
            
            this.specList.splice(ind,1)
            if(this.specList.length==0){
                this.isShowTable = false
                return
            }
            this.proArr = []
            this.setTable(this.specList, 0, {arr:[]})
        },
        // 添加规格
        addSpec(){
            let str = {
                specName:'', 
                isShowNatureSelect:false,
                natureValue:'',
                natureList:[]
            }
            this.specList.push(str)
            // this.proArr = []
            // this.setTable(this.specList, 0, {arr:[]})
        },
        // 遍历表格里面的数据
        setTable(obj, index, arr) {
            // if(obj[index].natureList.length!=0){
                // debugger
                for (var j = 0; j < obj[index].natureList.length; j++) {
                    arr[index] = j;
                    if (index != obj.length - 1) {
                        this.setTable(obj, index + 1, arr);
                    } else {
                        var pro = {};
                        for (var i = 0; i < obj.length - 1; i++) {
                            if (i == 0) {
                                pro.oneNormName = obj[i].specName
                                pro.oneNormValue = obj[i].natureList[arr[i]].natureName
                            } else if (i == 1) {
                                pro.twoNormName = obj[i].specName
                                pro.twoNormValue = obj[i].natureList[arr[i]].natureName
                            }
                        }
                        if (obj.length > 2) {
                            pro.threeNormName = obj[index].specName
                            pro.threeNormValue = obj[index].natureList[j].natureName
                        } else if(obj.length < 2){
                            pro.oneNormName = obj[i].specName
                            pro.oneNormValue = obj[i].natureList[arr[i]].natureName
                        }else{
                            pro.twoNormName = obj[index].specName
                            pro.twoNormValue = obj[index].natureList[j].natureName
                        }
                        pro.price = ''
                        pro.jdPrice = ''
                        pro.integral = ''
                        pro.skuNum = ''
                        this.proArr.push(pro)
                    }
                }
            // }
        },
        // 点击视频ICON触发事件
        videoHandler(state) {
            this.addRange = this.$refs.myQuillEditor.quill.getSelection()
            if (state) {
                let fileInput = document.getElementById('imgInput')
                fileInput.click() // 加一个触发事件
            }
            this.uploadType = 'video'
        },
        onEditorBlur(e){//失去焦点事件
        },
        onEditorFocus(){//获得焦点事件
        },
        onEditorChange({ editor, html, text }){//内容改变事件
            if(html!=null&&html!=''){
                this.form.saleInfo = true
            }else{
                this.form.saleInfo = ''
            }
        },
        // 图片上传之前调取的函数
        beforeUpload(file) {},
        upScuccess(e, file, fileList) {
            if (e.status == 0) {
                this.picDetailIdArr.push(e.data.fileId)
                let vm = this
                let url = request.Base_IMGPATH + e.data.fileUrl
                if (url != null && url.length > 0) {  // 将文件上传后的URL地址插入到编辑器文本中
                    let value = url
                    vm.addRange = vm.$refs.myQuillEditor.quill.getSelection()
                    // value = value.indexOf('http') !== -1 ? value : 'http:' + value
                    // 调用编辑器的 insertEmbed 方法，插入URL
                    vm.$refs.myQuillEditor.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER) 
                } else {
                    console.log('插入失败')
                }
                this.$refs['upload'].clearFiles()    // 插入成功后清除input的内容
            } else {
                this.$message.error(e.message)
            }
        },
        /*选择上传图片切换*/
        onFileChange(e){
            var fileInput = e.target;
            if (fileInput.files.length == 0) {
                return;
            }
            if (fileInput.files[0].size > 1024 * 1024 * this.maxSize) {
                alert('图片过大');
                return;
            }
            if (!this.actionUrl) {
                return;
            }
            var self = this;
            var data = new FormData;
            data.append('fileType','product_img_type')
            data.append(this.fileName, fileInput.files[0],fileInput.files[0].name);
            var xhr=new XMLHttpRequest();
            
            //文件上传
            xhr.open('post',this.actionUrl);
            xhr.responseType='json';
            xhr.send(data);
            var picurl = request.Base_IMGPATH;
            self.addRange = self.$refs.myQuillEditor.quill.getSelection()
            xhr.onload=function (response) {
                if(xhr.status==200){
                    if(xhr.response.status==0){
                        self.picDetailIdArr.push(xhr.response.data.fileId)
                        self.$refs.myQuillEditor.quill.insertEmbed(self.addRange !== null ? self.addRange.index : 0, 'image', picurl+xhr.response.data.fileUrl);
                    }else{
                        self.$message.error(xhr.response.message)
                    }
                    
                }else{
                    self.$message.error('上传失败!')
                }
            }
        },
        /*点击上传图片按钮*/
        imgHandler() {
            var input = document.createElement('input');
            input.type = 'file';
            input.name = this.fileName;
            input.accept = 'image/jpeg,image/png,image/jpg,image/gif';
            input.onchange = this.onFileChange;
            input.click();
        },
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        // 确认新增
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let noZeroNum=/^[1-9]\d*$/
                    let flag = false
                    this.picFileMoreArr.forEach(item=>{
                        if(item.isMain){
                            flag = true
                        }
                    })
                    if(!flag){
                        this.$message.error('请设置一张主图!')
                        return
                    }else{
                        flag = false
                    }
                    let data = {
                        skuId:this.$route.query.skuId,
                        type:this.proType,
                        name:this.form.name,
                        productTextDesc:this.form.productTextDesc,
                        picFileId:this.picFileId,
                        picFileMore:this.picFileMore.join(','),
                        picDetailId:this.picDetailIdArr.join(','),
                    }
                    if(this.isShowTable){
                        this.proArr.forEach(item=>{
                            if(item.price==null||item.price==''){
                                this.$message.error('请输入成本价!')
                                flag = true
                            }
                            else if(!noZeroNum.test(item.price)){
                                this.$message.error('成本价只能为整数')
                                flag = true
                            }
                            else if(item.jdPrice==null||item.jdPrice==''){
                                this.$message.error('请输入市场价!')
                                flag = true
                            }
                            else if(!noZeroNum.test(item.jdPrice)){
                                this.$message.error('市场价只能为整数')
                                flag = true
                            }
                            else if (Number(String(item.price).trim()) > Number(String(item.jdPrice).trim())) {
                                this.$message.error('市场价不能低于成本价!')
                                flag = true
                            }
                            else if(item.integral==null||item.integral==''){
                                this.$message.error('请输入兑换价!')
                                flag = true
                            }
                            else if(!noZeroNum.test(item.integral)){
                                this.$message.error('兑换价只能为整数')
                                flag = true
                            }
                            else if(item.skuNum==null||item.skuNum==''){
                                this.$message.error('请输入可售库存!')
                                flag = true
                            }
                            else if(!noZeroNum.test(item.skuNum)){
                                this.$message.error('可售库存只能为整数')
                                flag = true
                            }
                        })
                        if(flag){
                            return
                        }
                        data.productItems = this.proArr
                        data.price = ''
                        data.jdPrice = ''
                        data.integral = ''
                        data.skuNum = ''
                    }else{
                        for(let key in this.saleInfoPrice){
                            if(this.saleInfoPrice[key]==null||this.saleInfoPrice[key]==''){
                                this.$message.error('请输入完整的售卖信息!')
                                flag = true
                            }
                            else if(!noZeroNum.test(this.saleInfoPrice[key])){
                                this.$message.error('售卖信息只能为整数')
                                flag = true
                            }
                        }
                        if (Number(String(this.saleInfoPrice.price).trim()) > Number(String(this.saleInfoPrice.jdPrice).trim())) {
                            this.$message.error('市场价不能低于成本价!')
                            flag = true
                        }
                        if(flag){
                            return
                        }
                        data.productItems = []
                        data.price = this.saleInfoPrice.price
                        data.jdPrice = this.saleInfoPrice.jdPrice
                        data.integral = this.saleInfoPrice.integral
                        data.skuNum = this.saleInfoPrice.skuNum
                    }
                    if(this.editorContent==null||this.editorContent==''){
                        this.$message.error('请输入商品详情!')
                        return
                    }
                    data.appintroduce = this.editorContent
                    editSelfProduct(data).then(res=>{
                        this.$message.success('编辑成功!')
                        this.routerLink('productList2')
                        this.$parent.getPermissions(1)
                    })
                } else {
                    return false;
                }
            })
        },
        // 显示批量设置的输入框
        showBatchInp(value) {
            // this.batchNum = ''
            this.isShowBatch = false
            this.witchBatch = value
        },
        // 保存批量设置的输入框
        saveBatchInp() {
            this.proArr.forEach(item => {
                if (this.witchBatch == 0) {
                    item.price = this.batchNum
                } else if (this.witchBatch == 1) {
                    item.jdPrice = this.batchNum
                } else if (this.witchBatch == 2) {
                    item.cashPrice = this.batchNum
                } else if (this.witchBatch == 3) {
                    item.integral = this.batchNum
                } else if (this.witchBatch == 4) {
                    item.skuNum = this.batchNum
                }
            })
            this.isShowBatch = true
        },
    },
    mounted(){
        this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)
        this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
        addQuillTitle()
    }
}
</script>
   
<style lang='scss'>
.addProduct-info{
    .el-input__inner,.el-textarea__inner{
        width: 400px;
    }
    .ql-toolbar.ql-snow,.ql-container.ql-snow{
        border-color: #f2f2f2;
    }
    .itemName{
        width: 100%;
        height: 32px;
        line-height: 32px;
        padding: 0 10px;
        background: #f9f9f9;
        margin-top: 50px;
        span{
            font-weight: 900;
            border-left: 4px solid $main-col;
            padding-left: 6px;
        }
    }
    .proType{
        display: flex;
        margin: 26px 0;
        margin-left: 30px;
        .proType-item{
            width: 78px;
            height: 78px;
            text-align: center;
            border-radius: 6px;
            border: 1px solid $main-col;
            position: relative;
            margin-right: 37px;
            color: $main-col;
            background: rgba(40, 123, 214, 0.1);
            padding-top: 12px;
            opacity: 0.3;
            cursor: pointer;
            span{
                margin-left: 5px;
            }
            &.coupon{
                border-color: #F9742E;
                color: #F9742E;
                background: rgba(249, 116, 46, 0.2);
                span{
                    color: #F9742E;
                }
            }
            &.active{
                opacity: 1;
            }
            img{
                position: absolute;
                top: -1px;
                right: -1px;
                width: 28px;
                height: 26px;
            }
        }
    }
    .el-form{
        padding: 20px 0;
        .setMainImg{
            width: 148px;
            display: inline-block;
            text-align: center;
            margin-top: -10px;
            margin-right: 8px;
        }
        .hint{
            line-height: 20px;
            color: #ccc;
        }
        .setSpec{
            width: 100%;
            border: 1px solid #f2f2f2;
            border-radius: 4px;
            padding: 10px;
            .spec-item{
                width: 100%;
                padding: 10px;
                background: #f9f9f9;
                position: relative;
                margin-bottom: 10px;
                .el-input__inner{
                    width: 200px;
                    font-size: 12px;
                }
                .nature{
                    width: 150px;
                    padding: 0 20px;
                    height: 28px;
                    line-height: 28px;
                    border-radius: 20px;
                    background: #eee;
                    display: flex;
                    justify-content: space-between;
                    margin-right: 10px;
                    &.addnature{
                        color: $main-col;
                        display: block;
                        text-align: center;
                    }
                    .el-icon-close{
                        line-height: 28px;
                    }
                }
                .spec-item-nature{
                    display: flex;
                    margin-top: 10px;
                    .natureBox{
                        display: flex;
                        .el-icon-close{
                            font-weight: 900;
                            color: #ccc;
                        }
                    }
                    .el-input__inner{
                        width: 150px;
                        font-size: 12px;
                    }
                }
                .deleSpec{
                    color: $main-col;
                    position: absolute;
                    top: 0;
                    right: 10px;
                }
            }
            .addSpec{
                border: none;
                background: rgba(40, 123, 214, 0.1);
                color: $main-col;
                padding: 10px 30px;
            }
            .el-button--info{
                background: #f2f2f2;
                color: #ccc;
                border: none;
            }
        }
        .setBatch {
            font-size: 12px;
            text-align: left;
            span {
                color: $main-col;
                margin-right: 15px;
                input {
                    width: 80px;
                    height: 30px;
                    border: 1px solid #999;
                    border-radius: 2px;
                    text-align: center;
                    margin-right: 10px;
                }
            }
            .batchBtns {
                cursor: pointer;
            }
        }
    }
    .sizeTable {
        text-align:center;
        margin-bottom:10px;
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
        &.saleInfo{
            border: none;
            background: #f2f2f2;
            margin-top: 10px;
            td{
                border: none;
            }
        }
    }
}
</style>