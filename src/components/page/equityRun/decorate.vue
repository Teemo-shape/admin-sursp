<template>
    <div class='decorate proList boxs'>
        <div class="headBox">
            <h2>装修</h2>
            <div style="display:flex;">
                <el-input style="width:300px" v-model="mallUrlLink" placeholder="请输入内容" disabled></el-input>
                <y-button text="复制链接" style="margin-left:20px;" class="button" classStyle="main-btn"
                    v-clipboard:copy="mallUrlLink"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError">
                </y-button>
            </div>
            
        </div>
        <div class="decorateContainer">
            <div class="app-wrapper clearfix">
                <draggable :list="leftList" :options="{group:{name: falgs,pull:false}, filter: '.undraggable', sort: false,ghostClass:'sortable-ghost'}"
                    @end="end"
                    @start="start"
                    class="dragArea">
                    <div v-for="(item,index) in leftList" :key="index" class="app-wrapper-item fl" 
                        @mouseenter="mouseenterFn(index)" @mouseleave="mouseleaveFn(index)"
                        :class="{undraggable : item.flag}">
                        <img v-if="item.isHighlight!=0" :src="item.highlightIcon" alt="">
                        <img v-else :src="item.icon" alt="">
                        <p>{{item.value}}</p>
                    </div>
                </draggable>
            </div>
            <div class="app-content">
                <div class="app-header boxs">
                    <el-input class="app-mallName" v-model="mallName" size="mini" placeholder="请输入页面名称"></el-input>
                </div>
                <div class="app-top">
                    <div class="header">
                        <img src="@img/viewer.png">
                    </div>
                    <div class="name nowrap" style="margin-left:.18rem;width:56px;">18888888888</div>
                    <div class="interal" style="flex:1">8000{{integralName}}</div>
                    <div class="rights">
                        <i class="iconfont icondaohangtiao-quanyiguanli" style="font-style:normal;"></i>我的权益
                    </div>
                </div>
                <div class="edit-wrapper">
                    <draggable :list="rightList" :options="{group:'article', disabled: disabled}"
                        @start="start22"
                        @end="end22"
                        class="dragArea11">
                        <div v-for="(item, index) in rightList" :key="index" class="edit-item" @click.stop="handleShowLine(index)">
                            <div class="edit-closeBtn" v-show="item.isEdit&&item.type!=0">
                                <el-popover
                                    placement="top"
                                    width="160"
                                    trigger="click"
                                    v-model="item.visible">
                                    <p>删除模块？</p>
                                    <div style="text-align: right; margin: 0">
                                        <el-button size="mini" type="text" @click="item.visible = false">取消</el-button>
                                        <el-button type="primary" size="mini" @click="handleDel(index,item.type)">确定</el-button>
                                    </div>
                                    <el-button slot="reference" type="danger" icon="el-icon-delete" circle></el-button>
                                </el-popover>
                            </div>
                            <!-- 右侧标题内容 -->
                            <div class="edit-item-content edit-title boxs" :class="{'tlt-center':item.place=='居中','is-bold':item.weight=='加粗'}" v-show="item.type==1">
                                {{item.titleValue}}
                                <div class="edit-hover" :class="{'edit-hover-style':item.isEdit}"></div>
                            </div>
                            <!-- 右侧商品分组 -->
                            <div class="edit-item-content edit-goods boxs clearfix" v-show="item.type==2">
                                <div class="goods-item fl" 
                                    :class="{'goods-array2':item.arrayNumber==2,'goods-array1':item.arrayNumber==1,'goods-array3':item.arrayNumber==3}" 
                                    v-for="item1 in item.proList" v-show="item.proList!=null&&item.proList.length!=0">
                                    <div class="goods-item_img"><img :src="item1.imagePath" class="img100" alt=""></div>
                                    <div class="goods-item-list">
                                        <p class="nowrap">{{item1.name}}</p>
                                        <div class="goods-item_bottom">
                                            <span :style="{color:item.color}">{{item1.integral}}{{integralName}}</span>
                                            <div class="goods-item_btn" :style="{color:item.color,'border-color':item.color}">兑换</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="goods-item fl" 
                                    :class="{'goods-array2':item.arrayNumber==2,'goods-array1':item.arrayNumber==1,'goods-array3':item.arrayNumber==3}" 
                                    v-for="item1 in [0,1,2,3]" v-show="item.proList==null||item.proList.length==0">
                                    <div class="goods-item_img"><img src="@img/placeholder1.png" class="img100" alt=""></div>
                                    <div class="goods-item-list">
                                        <p class="nowrap">此处显示商品名称</p>
                                        <div class="goods-item_bottom">
                                            <span :style="{color:item.color}">{{integralName}}</span>
                                            <div class="goods-item_btn" :style="{color:item.color,'border-color':item.color}">兑换</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="edit-hover" :class="{'edit-hover-style':item.isEdit}"></div>
                            </div>
                            <!-- 右侧热门活动 -->
                            <div class="edit-item-content boxs" v-if="item.type==3">
                                <div class="edit-activity boxs swiper-container" 
                                    :style="{padding:item.upAndown+'rem'+' '+item.leftAndright+'rem'}">
                                    <div class="clearfix" :class="{'swiper-wrapper':item.arrayNumber==4}">
                                        <div class="swiper-slide fl" 
                                            :style="{'margin-right':item.imgMargin+'rem'}"
                                            :class="{'array4':item.arrayNumber==4,'array1':item.arrayNumber==1,'array2':item.arrayNumber==2}" 
                                            v-show="item.proList!=null&&item.proList.length!=0"
                                            v-for="(subitem,index) in item.proList" >
                                            <img :src="baseImgPath+subitem.picUrl" alt="">
                                            <div class="edit-activity-name ellipsis">{{subitem.activityName}}</div>
                                        </div>
                                        <div class="swiper-slide fl" 
                                            :style="{'margin-right':item.imgMargin+'rem'}" 
                                            :class="{'array4':item.arrayNumber==4,'array1':item.arrayNumber==1,'array2':item.arrayNumber==2}" 
                                            v-show="item.proList==null||item.proList.length==0"
                                            v-for="(subitem,index) in [0,1,2]" >
                                            <img src="@img/placeholder2.png" alt="">
                                            <div class="edit-activity-name ellipsis">此处显示活动名称</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="edit-hover" :class="{'edit-hover-style':item.isEdit}"></div>
                            </div>
                            <!-- 右侧成长任务 -->
                            <div class="edit-item-content edit-item-growupTask boxs" v-show="item.type==4">
                                <div class="edit-growupTask clearfix" v-for="subitem in item.taskList" v-if="item.taskList!=null&&item.taskList.length!=0">
                                    <img class="fl" :src="subitem.imgPath" v-if="subitem.imgPath!=null&&subitem.imgPath!=''" alt="">
                                    <img class="fl" src="@img/placeholder1.png" v-else alt="">
                                    <div class="fl" style="line-height:0.5rem;">
                                        <div class="edit-growupTask-title">{{subitem.taskName}}
                                            <span class="edit-growupTask-newTask" v-show="subitem.isNewTask!=1">新手任务</span>
                                        </div>
                                        <p v-if="subitem.taskType==1" class="edit-growupTask-info nowrap">完成任务后可得
                                            <span>{{subitem.integral1}}{{integralName}}</span> +
                                            <span>{{subitem.growthValue}}点成长值</span>
                                        </p>
                                        <p v-else class="edit-growupTask-info nowrap">完成任务后可得
                                            <span>{{subitem.integral2}}{{integralName}}</span>
                                        </p>
                                    </div>
                                    <div class="edit-growupTask-btn fr">去完成</div>
                                </div>
                                <div class="edit-growupTask clearfix" v-for="subitem in [0,1]" v-if="item.taskList==null||item.taskList.length==0">
                                    <img class="fl" src="@img/placeholder1.png" alt="">
                                    <div class="fl" style="line-height:0.5rem;">
                                        <div class="edit-growupTask-title">任务名称
                                            <span class="edit-growupTask-newTask">新手任务</span>
                                        </div>
                                        <p class="edit-growupTask-info nowrap">完成任务后可得
                                            <!-- <span>100点成长值</span>
                                            <span>200{{integralName}}</span> -->
                                        </p>
                                    </div>
                                    <div class="edit-growupTask-btn fr">去完成</div>
                                </div>

                                <div class="edit-hover" :class="{'edit-hover-style':item.isEdit}"></div>
                            </div>
                            <!-- 右侧等级配置 -->
                            <div class="edit-item-content boxs" v-show="item.type==5">
                                <div class="edit-setGrade">
                                    <div class="swiper-container boxs swiperGrade">
                                        <div class="swiper-wrapper">
                                            <div class="swiper-slide edit-topSwiper-item" v-for="(subitem,index) in item.gradeList" >
                                                <div style="height:3.2rem;position: relative;">
                                                    <img :src="subitem.backImgPath" alt="" class="img100" v-if="subitem.backgroundRadio==2">
                                                    <img :src="subitem.backImgPathDefault" alt="" class="img100" v-else>
                                                    <div class="edit-setGrade-growthValue">
                                                        <div>
                                                            <p class="growthValue">{{subitem.gradeName}}</p>
                                                            <p style="font-size:0.2rem;">需要成长值{{subitem.needValue}}</p>
                                                        </div>
                                                        <div style="font-size:0.24rem;"><span class="iconfont iconchengchangzhimingxi"></span>成长值明细</div>
                                                    </div>
                                                    <div class="edit-setGrade-progress">
                                                        <div>当前成长值<span class="growthValue"> {{subitem.bigValue/2}} </span>/{{subitem.bigValue}}</div>
                                                        <div style="position:relative">
                                                            <span class="current progress-before">V{{subitem.grade}}</span>
                                                            <el-progress :percentage="50" :stroke-width="6" color="#fff"></el-progress>
                                                            <span class="current progress-after">V{{subitem.grade+1}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="swiper-container boxs edit-gradeSwiper">
                                                    <div class="swiper-wrapper">
                                                        <div class="swiper-slide edit-gradeSwiper-item" v-for="(v,i) in subitem.privilegeList" >
                                                            <img v-if="v.imgPath!=null&&v.imgPath!=''" :src="v.imgPath" alt="">
                                                            <img v-else src="@img/placeholder1.png" alt="">
                                                            <p>{{v.privilegeName}}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="swiper-slide" style="width:15px;height:100%"></div>
                                        </div>
                                    </div>
                                    <div class="edit-title edit-gradeTitle">等级特权</div>
                                    <!-- <div class="swiper-container boxs edit-gradeSwiper">
                                        <div class="swiper-wrapper">
                                            <div class="swiper-slide edit-gradeSwiper-item" v-for="(subitem,index) in normalPrivilege" >
                                                <img v-if="subitem.imgPath!=null&&subitem.imgPath!=''" :src="subitem.imgPath" alt="">
                                                <img v-else src="@img/placeholder1.png" alt="">
                                                <p>{{subitem.privilegeName}}</p>
                                            </div>
                                        </div>
                                    </div> -->
                                </div>
                                <div class="edit-hover" :class="{'edit-hover-style':item.isEdit}"></div>
                            </div>
                            <!-- 编辑开始 -->
                            <div class="app-edit" v-show="item.isEdit">
                                <div class="app-edit-header boxs">{{form.value}}
                                    <el-popover
                                        placement="top"
                                        width="400"
                                        trigger="hover">
                                        <div>
                                            <div class="popoverItem">
                                                <p class="popoverInfo">1、成长任务的作用：激励用户完成企业期望用户完成的动作，比如购买、分享等</p>
                                            </div>
                                            <div class="popoverItem">
                                                <p class="popoverInfo">2、新手任务：针对新注册用户设置的任务，只能做一次</p>
                                            </div>
                                            <div class="popoverItem">
                                                <p class="popoverInfo">3、日常任务：每天都可以做</p>
                                            </div>
                                        </div>
                                        <i class="el-icon-question" slot="reference" v-show="form.type==4"></i>
                                    </el-popover>
                                </div>
                                <div class="app-edit-body boxs">
                                    <div class="common-config-panel">
                                        <el-form ref="form" :model="form" label-width="auto">
                                            <!-- 1是标题 2是商品分组 3是热门活动-->
                                            <el-form-item :label="form.value" v-show="form.type==1">
                                                <el-input v-model="form.titleValue" placeholder="这是标题" size="mini"></el-input>
                                            </el-form-item>
                                            <el-form-item label="标题位置" v-show="form.type==1">
                                                <el-radio-group v-model="form.place">
                                                    <el-radio label="居左"></el-radio>
                                                    <el-radio label="居中"></el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                            <el-form-item label="标题展示" v-show="form.type==1">
                                                <el-radio-group v-model="form.weight">
                                                    <el-radio label="加粗"></el-radio>
                                                    <el-radio label="不加粗"></el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                            <el-form-item label="跳转链接" v-show="form.type==1">
                                                <el-input v-model="form.linkUrl" size="mini"></el-input>
                                            </el-form-item>
                                            <el-form-item label="兑换价颜色" v-show="form.type==2">
                                                <el-color-picker v-model="form.color" @change="handleColorChange"></el-color-picker>
                                                <span class="app-edit-resetColor" @click="resetColor">重置</span>
                                            </el-form-item>
                                            <el-form-item label="内边距" v-show="form.type==3">
                                                <el-radio-group v-model="form.padding" @change="handleRadioChange" style="justify-content:flex-start">
                                                    <el-radio label="默认"></el-radio>
                                                    <el-radio label="自定义"></el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                            <el-form-item label="" v-show="form.type==3&&form.padding=='自定义'">
                                                <div>
                                                    <span class="demonstration">上下边距</span>
                                                    <el-slider :max="2" :step="0.1" show-input v-model="form.upAndown"></el-slider>
                                                </div>
                                                <div>
                                                    <span class="demonstration">左右边距</span>
                                                    <el-slider :max="2" :step="0.1" show-input v-model="form.leftAndright"></el-slider>
                                                </div>
                                                <div>
                                                    <span class="demonstration">图片边距</span>
                                                    <el-slider :max="2" :step="0.1" show-input v-model="form.imgMargin"></el-slider>
                                                </div>
                                            </el-form-item>
                                            <el-form-item label="" v-show="form.type==2||form.type==3">
                                                <span v-show="form.type==2">选择商品<span style="font-size:12px;color:#ccc;">（可拖动更改排序）</span></span>
                                                <span v-show="form.type==3">选择活动<span style="font-size:12px;color:#ccc;">（可拖动更改排序）</span></span>
                                                <ul class="app-edit-checkgoodsList clearfix">
                                                    <draggable element="ul" v-model="form.proList" class="ul">
                                                        <li class="fl" v-for="(item,index) in form.proList">
                                                            <img v-if="item.imagePath&&form.type==2" :src="item.imagePath" class="img100" alt="">
                                                            <img v-if="item.picUrl&&form.type==3" :src="baseImgPath+item.picUrl" class="img100" alt="">
                                                            <!-- <img v-else-if="item.picUrl&&form.type==3" :src="baseImgPath+item.picUrl" class="img100" alt=""> -->
                                                            <!-- <img v-else src="@img/situation-4.png" class="img100" alt=""> -->
                                                            <i class="el-icon-error hands" @click="handleDeleGoods(index)"></i>
                                                        </li>
                                                        <li class="app-edit-addGoods fl hands" @click="handleCheckGoods">
                                                            <i v-show="form.type==2" style="color:#337EFF;font-size:12px;">添加商品</i>
                                                            <i v-show="form.type==3" style="color:#337EFF;font-size:12px;">添加活动</i>
                                                        </li>
                                                    </draggable>
                                                </ul>
                                            </el-form-item>
                                            <el-form-item label="" v-show="form.type==2||form.type==3">
                                                <span>列表样式</span>
                                                <el-radio-group v-model="form.arrayNumber" class="app-edit-listStyle">
                                                    <el-radio :label="1" v-show="form.type==2">
                                                        <div class="arrayNumber"><img src="@img/sp_1.png" class="img100" alt=""></div>
                                                        <p>一行一个</p>
                                                    </el-radio>
                                                    <el-radio :label="2">
                                                        <div class="arrayNumber"><img src="@img/sp_2.png" class="img100" alt=""></div>
                                                        <p>一行两个</p>
                                                    </el-radio>
                                                    <el-radio :label="3" v-show="form.type==2">
                                                        <div class="arrayNumber"><img src="@img/sp_list.png" class="img100" alt=""></div>
                                                        <p>详细列表</p>
                                                    </el-radio>
                                                    <el-radio :label="4" v-show="form.type==3">
                                                        <div class="arrayNumber"><img src="@img/sp_list.png" class="img100" alt=""></div>
                                                        <p>一行多个</p>
                                                    </el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                            <el-form-item label="" v-show="form.type==4">
                                                <span style="color:#ccc;font-size:12px;margin-bottom:10px;display: inline-block;">(尺寸：200*200px，图片大小：低于500k，格式：JPG、JPEG、PNG，可拖动更改排序)</span>
                                                <draggable element="ul" v-model="form.taskList" class="ul">
                                                    <div class="app-edit-addActivity" v-for="(item,index) in form.taskList">
                                                        <div class="app-addActivity-item">
                                                            <div class="imgStyle" @click="handleUploadImg(index)">
                                                                <el-upload
                                                                    style="width:100%;height:100%"
                                                                    :data="{fileType: 'gift_file_type'}" 
                                                                    class="avatar-uploader"
                                                                    :action="actionUrl"
                                                                    :show-file-list="false"
                                                                    :on-success="handleAvatarSuccess"
                                                                    :before-upload="beforeAvatarUpload">
                                                                    <img v-if="item.imgPath" :src="item.imgPath" class="avatar img100">
                                                                    <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                                                                    <i v-else style="color:#337EFF;font-size:12px;">添加图片</i>
                                                                </el-upload>
                                                            </div>
                                                            <div style="line-height:30px;">
                                                                <div style="font-size:12px;">链接<el-input v-model="item.linkUrl" size="mini"></el-input></div>
                                                                <div style="font-size:12px;">文本<el-input v-model="item.taskName" size="mini"></el-input></div>
                                                            </div>
                                                            <i class="el-icon-close hands" @click="handleDeleTask(index)"></i>
                                                        </div>
                                                        <el-radio-group v-model="item.isNewTask" style="justify-content:flex-start">
                                                            <el-radio :label="1">日常任务</el-radio>
                                                            <el-radio :label="0">新手任务</el-radio>
                                                        </el-radio-group>
                                                        <el-radio-group v-model="item.taskType" class="app-edit-taskType">
                                                            <el-radio :label="1">
                                                                <div style="margin-bottom:4px;"><el-input type="number" v-model="item.integral1" :disabled="item.taskType!=1" placeholder="请输入整数"></el-input> {{integralName}}</div>
                                                                <div><el-input type="number" v-model="item.growthValue" :disabled="item.taskType!=1" placeholder="请输入整数"></el-input> 成长值</div>
                                                            </el-radio>
                                                            <el-radio :label="0">
                                                                <div><el-input type="number" v-model="item.integral2" :disabled="item.taskType!=0" placeholder="请输入整数"></el-input> {{integralName}}</div>
                                                            </el-radio>
                                                            <el-radio :label="3" class="noRadioInput" v-show="item.isNewTask==1">每人每天最多可做任务数
                                                                <el-input style="width:60px;" type="number" v-model="item.dayTimes"></el-input>
                                                            </el-radio>
                                                        </el-radio-group>
                                                    </div>
                                                </draggable>
                                                <div class="app-edit-add boxs hands" @click="handleCheckGoods">
                                                    <i class="el-icon-plus"></i> 添加任务
                                                </div>
                                            </el-form-item>
                                            <el-form-item label="用户等级" v-show="form.type==5">
                                                <el-select v-model="form.grade" placeholder="请选择" @change="handleGradeChange">
                                                    <el-option v-for="item in gradeList"  :key="item.grade" :label="item.gradeName" :value="item.grade">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="背景设置" v-show="form.type==5">
                                                <el-radio-group v-model="form.backgroundRadio" @change="handleBackChange" style="justify-content:flex-start">
                                                    <el-radio :label="1">默认图</el-radio>
                                                    <el-radio :label="2">自定义</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                            <el-form-item class="app-edit-setBackground" label="上传图片"  v-show="form.type==5&&form.backgroundRadio==2">
                                                <el-upload
                                                    :data="{fileType: 'member_grade_type'}" 
                                                    class="avatar-uploader"
                                                    :action="actionUrl"
                                                    :show-file-list="false"
                                                    :on-success="handleGradeBackSuccess">
                                                    <img v-if="form.uploadImgPath" :src="form.uploadImgPath" class="avatar">
                                                    <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                                                    <i v-else style="color:#337EFF;font-size:12px;">添加图片</i>
                                                </el-upload>
                                            </el-form-item>
                                            <span style="color:#ccc;font-size:12px;" v-show="form.type==5&&form.backgroundRadio==2">尺寸：660*320px，图片大小：低于500k，格式：JPG、JPEG、PNG</span>
                                            <el-form-item label="" v-show="form.type==5">
                                                <span>特权配置<span style="font-size:12px;color:#ccc;">（特权名称最多5个字，尺寸：200*200px，图片大小：低于500k，格式：JPG、JPEG、PNG）</span></span>
                                                <!-- <draggable element="ul" v-model="normalPrivilege" class="ul"> -->
                                                    <div class="app-edit-addActivity" v-for="(item,index) in normalPrivilege">
                                                        <div class="app-addActivity-item">
                                                            <div class="imgStyle" @click="handleUploadImg(index)">
                                                                <el-upload
                                                                    style="width:100%;;height:100%"
                                                                    :data="{fileType: 'gift_file_type'}" 
                                                                    class="avatar-uploader"
                                                                    :action="actionUrl"
                                                                    :show-file-list="false"
                                                                    :on-success="handleGradeSuccess">
                                                                    <img v-if="item.imgPath" :src="item.imgPath" class="avatar img100">
                                                                    <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                                                                    <i v-else style="color:#337EFF;font-size:12px;">添加图片</i>
                                                                </el-upload>
                                                            </div>
                                                            <div style="line-height:30px;">
                                                                <div style="font-size:12px;">链接<el-input v-model="item.linkUrl" size="mini"></el-input></div>
                                                                <div style="font-size:12px;">文本<el-input v-model="item.privilegeName" size="mini" maxlength="5"></el-input></div>
                                                            </div>
                                                            <i></i>
                                                        </div>
                                                        <el-input
                                                            type="textarea"
                                                            placeholder="请输入特权详情"
                                                            v-model="item.description"
                                                            show-word-limit>
                                                        </el-input>
                                                    </div>
                                                <!-- </draggable> -->
                                            </el-form-item>
                                            
                                        </el-form>
                                    </div>
                                </div>
                                <div class="app-edit-footer boxs">
                                    <y-button text="保存" class="button" classStyle="main-btn" @btnClick="saveFn(0)"></y-button>
                                </div>
                                <div class="app-edit-arrow"></div>
                            </div>
                            <!-- 编辑结束 -->
                        </div>
                    </draggable>
                </div>
            </div>
        </div>
        <div class="footer">
            <y-button text="上架" class="button" classStyle="main-btn" @btnClick="putaway()"></y-button>
            <y-button text="保存" class="button" classStyle="default-btn" @btnClick="saveFn(0)"></y-button>
        </div>
        <el-dialog :title="form.type==2?'选择商品':'选择活动'" :visible.sync="dialogVisible" width="50%" style="padding-bottom:30px;"> 
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="light"
                style="width: 100%"
                stripe
                @select="handleSelect"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection">
                </el-table-column>
                <el-table-column
                    :label="form.type==2?'商品主图':'活动主图'">
                    <template slot-scope="scope">
                        <img class="proImg" :src="scope.row.imagePath" alt="" v-if="form.type==2||form.type==3">
                        <span v-else>{{scope.row.imagePath}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="form.type==2?'商品名称':'活动名称'"
                    prop="name">
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
            <span slot="footer" class="dialog-footer">
                <y-button text="保存" classStyle="main-btn"  @btnClick="editProduct"></y-button>
                <y-button text="取消"  @btnClick="cancleFn()"></y-button>
            </span>
        </el-dialog>
        <el-dialog title="选择任务" :visible.sync="dialogTaskVisible" width="50%" style="padding-bottom:30px;"> 
            <el-table
                ref="multipleTaskTable"
                :data="tableData"
                tooltip-effect="light"
                style="width: 100%"
                stripe
                @select="handleSelect"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection">
                </el-table-column>
                <el-table-column
                    label="任务类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.isNewTask==1?'日常任务':'新手任务'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="任务名称"
                    prop="taskName">
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
            <span slot="footer" class="dialog-footer">
                <y-button text="保存" classStyle="main-btn"  @btnClick="editProduct"></y-button>
                <y-button text="取消"  @btnClick="cancleFn()"></y-button>
            </span>
        </el-dialog>
    </div>
</template>
   
   
<script>
import draggable from 'vuedraggable'
import YButton from '@/components/common/YButton.vue'
import { getProducts,getActivityList,queryMember,listViewPage,saveViewPage,getTask,getInteger,getUrl } from '@/api/api.js'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css';
import request from '@/api/request.js'
import Bus from '../../common/bus.js'
/**
 * AES工具类
 */
import CryptoJS from 'crypto-js'
const aeskey = "jsgdkdsm736sued9";
const KEY = CryptoJS.enc.Utf8.parse(aeskey); 
const IV = CryptoJS.enc.Utf8.parse(aeskey);
export default {
    components: { draggable,YButton },
    data() {
        return {
            falgs: 'article',
            disabled: false,
            mallName:'',//商城名称
            rightList: [],
            leftList: [
                {value: '标题', type:1,isEdit:false,visible:false,titleValue:'这是标题',place:'居左',weight:'加粗',linkUrl:''},
                {value: '商品分组', type:2,isEdit:false,visible:false,proList:[],color:'#ED7713',arrayNumber:2},
                {value: '热门活动', type:3,isEdit:false,visible:false,padding:'默认',upAndown:0.3,leftAndright:0.3,imgMargin:0.3,arrayNumber:4,proList:[]},
                {value: '成长任务', type:4,isEdit:false,visible:false,taskList:[
                    //isNewTask  1是日常任务 0是新手任务 taskType：0是只送积分 1是送积分和成长值
                    // {taskName:'任务名称',dayTimes:'',checkList:[],growthValue:'',integral1:'',integral2:'',isNewTask:2,imgPath:'',linkUrl:'',taskType:0,imgPathUrl:''},
                    // {taskName:'任务名称',dayTimes:'',checkList:[],growthValue:'',integral1:'',integral2:'',isNewTask:2,imgPath:'',linkUrl:'',taskType:1,imgPathUrl:''},
                ]},
                {value: '等级配置', type:5,isEdit:false,visible:false,grade:1,backgroundRadio:'',uploadImgPath:'',gradeList:[
                    //imgPath是每个特权图 gradeName是等级名称 backImgPath 是默认背景图  needValue需要成长值 bigValue最大成长值 grade当前等级
                    // {gradeName:'',backImgPath:require('@img/V1.png'),needValue:100,bigValue:1000,grade:1,backgroundRadio:1,backImgPathUrl:'',backImgPathDefault:'',
                    //     privilegeList:[
                    //         {imgPath:'',linkUrl:'',privilegeName:'特权名称1',description:'',imgPathUrl:''},
                    //         {imgPath:'',linkUrl:'',privilegeName:'特权名称2',description:'',imgPathUrl:''},
                    //         {imgPath:'',linkUrl:'',privilegeName:'特权名称5',description:'',imgPathUrl:''},
                    //     ]
                    // },
                    // {gradeName:'',backImgPath:require('@img/V1.png'),needValue:200,bigValue:2000,grade:2,backgroundRadio:2,backImgPathUrl:'',backImgPathDefault:'',
                    //     privilegeList:[
                    //         {imgPath:'',linkUrl:'',privilegeName:'特权名称3',description:'',imgPathUrl:''},
                    //         {imgPath:'',linkUrl:'',privilegeName:'特权名称4',description:'',imgPathUrl:''},
                    //         {imgPath:'',linkUrl:'',privilegeName:'特权名称6',description:'',imgPathUrl:''},
                    //     ]
                    // },
                ]},
　　　　　　 ],
            visible:false,//弹框状态是否可见
            form:{},//编辑的表单
            dialogVisible:false,//选择商品的弹框
            tableData:[],//选择商品的数据
            pageSize:5,
            totalRows:10,
            currentPage:1,
            actionUrl:request.actionUrl,//上传图片的路径
            baseImgPath:request.Base_IMGPATH,//图片库
            handleUploadImgIndex:'',//当前要上传的是哪个图片
            multipleSelection:[],//勾选后的商品
            multipleTaskSelection:[],//勾选后的任务
            gradeList:[],//用户等级
            normalImg:'',//等级配置里面的全局默认图
            normalPrivilege:[],//等级配置下面的等级特权
            isShowFileList:false,//是否显示上传图片
            dialogTaskVisible:false,//选择任务的弹框
            integralName:'',//设置的积分名称
            mallUrlLink:'',//根据系统管理员生成的链接
        }
    },
    created() {
        let that = this
        this.listViewPage()
        this.getInteger()
        this.$nextTick(() => {
            new Swiper('.edit-activity', {
                slidesPerView: 'auto',
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true//修改swiper的父元素时，自动初始化swiper
            })
            new Swiper('.edit-gradeSwiper', {
                slidesPerView: 'auto',
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true//修改swiper的父元素时，自动初始化swiper
            })
        })
        // // 前端生成加密链接
        // let parameter = localStorage.getItem('companyId')
        // let str = encodeURIComponent(this.encrypt(parameter))
        // this.mallUrlLink = request.BASE_URL_M+'?companyId='+str
        this.getUrl()

    },
    methods: {
        // 后台生成加密连接
        getUrl(){
            getUrl().then(res=>{
                this.mallUrlLink = request.BASE_URL_M+'?companyId='+encodeURIComponent(res.data)
            })
        },
        // aes加密
        encrypt(word) {
            let key = KEY
            let iv = IV
            let srcs = CryptoJS.enc.Utf8.parse(word);
            var encrypted = CryptoJS.AES.encrypt(srcs, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            });
            return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
        },
        // aes解密
        decrypt(word) {
            let key = KEY
            let iv = IV
            let base64 = CryptoJS.enc.Base64.parse(word);
            let src = CryptoJS.enc.Base64.stringify(base64);
        
            var decrypt = CryptoJS.AES.decrypt(src, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
            });
        
            var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
            return decryptedStr.toString()
        },
        // 获取组件和页面数据
        listViewPage(){
            listViewPage().then(res=>{
                this.leftList = res.data.resultDefault
                for(let i = 0;i<this.leftList.length;i++){
                    if(this.leftList[i].type==5&&(this.leftList[i].gradeList==null||this.leftList[i].gradeList.length==0)){
                        this.$set(this.leftList[4], 'flag', true)
                    }
                }
                this.rightList = res.data.result
                this.form.backgroundRadio = this.leftList[4].gradeList[0].backgroundRadio
                if(this.rightList!=null&&this.rightList.length!=0){
                    this.mallName = this.rightList[0].pageName
                    for(let i = 0;i<this.rightList.length;i++){
                        if(this.rightList[i].type==5){
                            this.form.backgroundRadio = this.rightList[i].gradeList[0].backgroundRadio
                            this.$set(this.leftList[4], 'flag', true)
                        }
                        if(this.rightList[i].type==4){
                            this.multipleTaskSelection = this.rightList[i].taskList
                        }
                        
                    }
                }else{
                    this.mallName = ''
                }
                this.gradeList = this.leftList[4].gradeList
            })
        },
        // 保存
        saveFn(ind){
            if(this.rightList==null||this.rightList.length==0){
                this.$message.error('请先配置页面!')
                return
            }
            let flag = false
            let noZeroNum=/^[1-9]\d*$/
            if(this.rightList!=null&&this.rightList.length!=0){
                for(let i = 0;i<this.rightList.length;i++){
                    if(this.rightList[i].type==1){
                        if(this.rightList[i].titleValue==''||this.rightList[i].titleValue==null){
                            this.$message.error('请先输入标题名称!')
                            flag = true
                            break
                        }
                    }
                    if(this.rightList[i].type==2){
                        if(this.rightList[i].proList==null||this.rightList[i].proList.length==0){
                            this.$message.error('请先选择商品!')
                            flag = true
                            break
                        }
                    }
                    if(this.rightList[i].type==3){
                        if(this.rightList[i].proList==null||this.rightList[i].proList.length==0){
                            this.$message.error('请先选择活动!')
                            flag = true
                            break
                        }
                    }
                    if(this.rightList[i].type==4){
                        if(this.rightList[i].taskList==null||this.rightList[i].taskList.length==0){
                            this.$message.error('请先选择任务!')
                            flag = true
                            break
                        }
                        let str = this.rightList[i].taskList
                        for(let j = 0;j<str.length;j++){
                            if(str[j].imgPath==null||str[j].imgPath==''){
                                this.$message.error(`请先上传${str[j].taskName}任务图片!`)
                                flag = true
                                break
                            }
                            if(str[j].taskName==null||str[j].taskName==''){
                                this.$message.error(`请输入${str[j].taskName}任务名称!`)
                                flag = true
                                break
                            }
                            if(str[j].taskType==3||str[j].taskType==null){
                                this.$message.error(`请选择${str[j].taskName}任务完成后的奖励!`)
                                flag = true
                                break
                            }
                            if(str[j].taskType==0){
                                if(!str[j].integral2){
                                    this.$message.error(`请输入${str[j].taskName}任务完成后赠送的${this.integralName}!`)
                                    flag = true
                                    break
                                }
                                if(!noZeroNum.test(str[j].integral2)){
                                    this.$message.error(`赠送${this.integralName}只能为整数!`)
                                    flag=true;
                                    break
                                }
                            }
                            if(str[j].taskType==1){
                                if(!str[j].integral1){
                                    this.$message.error(`请输入${str[j].taskName}任务完成后赠送的${this.integralName}!`)
                                    flag = true
                                    break
                                }
                                if(!noZeroNum.test(str[j].integral1)){
                                    this.$message.error(`赠送${this.integralName}只能为整数!`)
                                    flag=true;
                                    break
                                }
                                if(!str[j].growthValue){
                                    this.$message.error(`请输入${str[j].taskName}任务完成后赠送的成长值!`)
                                    flag = true
                                    break
                                }
                                if(!noZeroNum.test(str[j].growthValue)){
                                    this.$message.error(`赠送成长值只能为整数!`)
                                    flag=true;
                                    break
                                }
                            }
                            if(str[j].isNewTask==1){
                                if(!str[j].dayTimes){
                                    this.$message.error(`请输入${str[j].taskName}任务每天限制的完成次数!`)
                                    flag = true
                                    break
                                }
                                if(!noZeroNum.test(str[j].dayTimes)){
                                    this.$message.error(`限制次数只能为整数!`)
                                    flag=true;
                                    break
                                }
                            }
                        }
                    }
                    if(this.rightList[i].type==5){
                        let str = this.rightList[i].gradeList;
                        for(let j = str.length-1;j>=0;j--){
                            if(this.form.grade == str[j].grade){
                                str[j].backgroundRadio = this.form.backgroundRadio
                                str[j].privilegeList = this.normalPrivilege
                            }
                            if(str[j].backgroundRadio==2&&(str[j].backImgPathUrl==null||str[j].backImgPathUrl=='')){
                                this.$message.error(`请上传${str[j].gradeName}的自定义图片!`)
                                flag=true;
                                break
                            }
                            let str2 = str[j].privilegeList
                            for(let n = 0;n<str2.length;n++){
                                if(str2[n].imgPath==null||str2[n].imgPath==''){
                                    this.$message.error(`请上传${str[j].gradeName}的特权图片!`)
                                    flag=true;
                                    break
                                }
                                if(str2[n].description==null||str2[n].description==''){
                                    this.$message.error(`请输入${str[j].gradeName}的特权详情!`)
                                    flag=true;
                                    break
                                }
                            }
                        }
                    }
                }
            }
            if(flag){
                return
            }
            if(this.mallName==null||this.mallName==''){
                this.$message.error('请填写页面名称!')
                return
            }
            let data = {
                isShelf:ind,//0是保存  1是上架
                pageName:this.mallName,
                pageType:1,//页面类型 1是首页
                viewPageList:this.rightList
            }
            saveViewPage(data).then(res=>{
                if(ind==1){
                    this.$message.success('上架成功!')
                }else{
                    this.$message.success('保存成功!')
                }
                this.listViewPage()
            })
        },
        // 上架
        putaway(){
            this.saveFn(0)
            this.saveFn(1)
        },
        // 取消
        cancleFn(){
            if(this.form.type==4){
                this.multipleTaskSelection = []
                this.dialogTaskVisible = false
            }else if(this.form.type==2||this.form.type==3){
                this.multipleSelection = []
                this.dialogVisible = false
            }
        },
        //鼠标移入左侧事件
        mouseenterFn(val){
            this.leftList[val].isHighlight = 1
        },
        //鼠标移入左侧事件
        mouseleaveFn(val){
            this.leftList[val].isHighlight = 0
        },
        // 拖动开始
        start(ev){
            this.rightList.forEach(item=>{
                item.isEdit = false
            })
        },
        // 拖动结束
        end (ev) {
            // if (ev.to.className === 'dragArea11') {
                let endObj = JSON.parse(
                    JSON.stringify(this.leftList[ev.oldIndex])
                );
                this.rightList.push(endObj)
            // }
            this.rightList.forEach(item=>{
                if(item.type==5){
                    // 禁用某选项
                    this.$set(this.leftList[4], 'flag', true)
                }
            })
        },
        start22 (event) {
            this.falgs = '222222'
        },
        end22 (ev) {
            this.falgs = 'article'
        },
        // 删除右边的组件
        handleDel (index,type) {
            this.rightList[index].visible = false
            this.rightList.splice(index, 1)
            // 删除后启用某选项
            let q = this.leftList.find((value, index, arr) => {
                return value.type === type
            })
            if(q.type==5){
                this.$set(q, 'flag', false)
            }
        },
        // 点击右边每一个组件
        handleShowLine(index){
            this.form = this.rightList[index]
            if(this.rightList[index].type==5){
                this.normalPrivilege = this.rightList[index].gradeList[this.form.grade-1].privilegeList
                this.form.backgroundRadio = this.rightList[index].gradeList[this.form.grade-1].backgroundRadio
                if(this.form.backgroundRadio==2){
                    this.form.uploadImgPath = this.rightList[index].gradeList[this.form.grade-1].backImgPath
                }else{
                    this.form.uploadImgPath = ''
                }
            }
            this.rightList.forEach(item=>{
                item.isEdit = false
            })
            this.rightList[index].isEdit = true
        },
        // 颜色变化
        handleColorChange(value){
            this.form.color = value
        },
        // 重置颜色
        resetColor(){
            this.form.color = '#ED7713'
        },
        // 商品分组删除一个商品
        handleDeleGoods(val){
            this.form.proList.splice(val,1)
        },
        // 点击选择商品
        handleCheckGoods(){
            this.currentPage = 1
            //2是商品分组 3是活动分组 4是任务
            if(this.form.type==2){
                this.getProducts()
            }else if(this.form.type==3){
                this.getActivityList()
            }else if(this.form.type==4){
                this.getTask()
            }
            // for(let i =0;i<this.rightList.length;i++){
            //     if(this.rightList[i].type==4&&this.rightList[i].taskList!=null&&this.rightList[i].taskList.length!=0){
            //         this.multipleSelection = this.rightList[i].taskList
            //         break
            //     }
            // }
        },
        // 获取商品
        getProducts(){
            let data = {
                page: this.currentPage,
                pageSize: this.pageSize,
                pagination: true,
                jfStatus:1,//上架
                fromDecoration:true
            }
            getProducts(data).then(res=>{
                if(res.data!=null&&res.data!=''){
                    this.totalRows = res.page.totalRows;
                    this.tableData = res.data;
                    for(let i =0;i<this.rightList.length;i++){
                        if(this.rightList[i].type==2){
                            if(this.rightList[i].proList!=null&&this.rightList[i].proList.length!=0){
                                this.multipleSelection = this.rightList[i].proList
                                // break
                            }else{
                                this.multipleSelection = []
                            }
                            
                        }
                    }
                    this.dialogVisible = true
                    if(this.multipleSelection!=null&&this.multipleSelection.length!=0){
                        let arr = []
                        this.multipleSelection.forEach(item=>{
                            this.tableData.forEach((i,index)=>{
                                if(item.skuId==i.skuId){
                                    arr.push(this.tableData[index])
                                }
                            })
                        })
                        this.$nextTick(()=>{
                            arr.forEach(item=>{
                                // 复选框自动选中
                                this.$refs.multipleTable.toggleRowSelection(item);
                            })
                        })
                    }
                }else{
                    this.$confirm('未上架商品，是否前往上架？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        showClose: false
                    }).then(() => {
                        // window.open(request.BASE_URL_ADMIN+'productList2')
                        this.$parent.getPermissions(1)
                        this.routerLink('productList2')
                        localStorage.setItem('type',3)
                        Bus.$emit('type',3)
                    }).catch(() => {})
                }
            })
        },
        // 获取活动
        getActivityList(){
            let data = {
                page: this.currentPage,
                pageSize: this.pageSize,
                pagination: true,
                status: 1
            }
            getActivityList(data).then(res=>{
                if(res.data!=null&&res.data!=''){
                    this.totalRows = res.page.totalRows;
                    this.tableData = res.data;
                    this.tableData.forEach(item=>{
                        item.imagePath = this.baseImgPath+item.picUrl
                        item.name = item.activityName
                    })
                    for(let i =0;i<this.rightList.length;i++){
                        if(this.rightList[i].type==3){
                            if(this.rightList[i].proList!=null&&this.rightList[i].proList.length!=0){
                                this.multipleSelection = this.rightList[i].proList
                                // break
                            }else{
                                this.multipleSelection = []
                            }
                        }
                    }
                    this.dialogVisible = true
                    if(this.multipleSelection!=null&&this.multipleSelection.length!=0){
                        let arr = []
                        this.multipleSelection.forEach(item=>{
                            this.tableData.forEach((i,index)=>{
                                if(item.activityId==i.activityId){
                                    arr.push(this.tableData[index])
                                }
                            })
                        })
                        this.$nextTick(()=>{
                            arr.forEach(item=>{
                                // 复选框自动选中
                                this.$refs.multipleTable.toggleRowSelection(item);
                            })
                        })
                    }
                }else{
                    this.$confirm('未创建/开启活动，是否前往创建/开启？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        showClose: false
                    }).then(() => {
                        // window.open(request.BASE_URL_ADMIN+'activityList')
                        this.$parent.getPermissions(2)
                        this.routerLink('activityList')
                        localStorage.setItem('type',2)
                        Bus.$emit('type',2)
                    }).catch(() => {})
                }
            })
        },
        // 获取任务
        getTask(){
            let data = {
                page: this.currentPage,
                pageSize: this.pageSize,
                pagination: true,
            }
            getTask(data).then(res=>{
                this.totalRows = res.page.totalRows;
                this.tableData = res.data;
                this.dialogTaskVisible = true
                for(let i =0;i<this.rightList.length;i++){
                    if(this.rightList[i].type==4){
                        if(this.rightList[i].taskList!=null&&this.rightList[i].taskList.length!=0){
                            this.multipleTaskSelection = this.rightList[i].taskList
                            // break
                        }else{
                            this.multipleTaskSelection = []
                        } 
                    }
                }
                if(this.multipleTaskSelection!=null&&this.multipleTaskSelection.length!=0){
                    let arr = []
                    this.multipleTaskSelection.forEach(item=>{
                        this.tableData.forEach((i,index)=>{
                            if(item.taskId==i.taskId){
                                arr.push(this.tableData[index])
                            }
                        })
                    })
                    this.$nextTick(()=>{
                        arr.forEach(item=>{
                            // 复选框自动选中
                            this.$refs.multipleTaskTable.toggleRowSelection(item);
                        })
                    })
                }
            })
        },
        // 商品勾选后的方法
        handleSelectionChange(val) {
            if(this.form.type==4){
                this.multipleTaskSelection = val
            }else if(this.form.type==2||this.form.type==3){
                this.multipleSelection = val
            }
        },
        handleSelect(selection, row){
            let str = this.form.proList
            if(this.form.type==4){
                str = this.form.taskList
            }
            if(str!=null&&str.length!=0){
                for(let i = 0;i<str.length;i++){
                    if(this.form.type==4){
                        if(str[i].taskId==row.taskId){
                            this.form.taskList.splice(i,1)
                            break
                        }
                    }else if(this.form.type==2){
                        if(str[i].skuId==row.skuId){
                            this.form.proList.splice(i,1)
                            break
                        }
                    }else if(this.form.type==3){
                        if(str[i].activityId==row.activityId){
                            this.form.proList.splice(i,1)
                            break
                        }
                    }
                    
                }
            }
            
        },
        // 改变页数后的方法
        handleCurrentChange(val) {
            this.currentPage = val
            if(this.form.type==2){
                this.getProducts()
            }else if(this.form.type==3){
                this.getActivityList()
            }else if(this.form.type==4){
                this.getTask()
            }
        },
        // 确认选择商品
        editProduct(){
            if(this.form.type==4&&(this.multipleTaskSelection==null||this.multipleTaskSelection.length==0)){
                this.$message.error('请先选择任务!')
                return
            }
            if(this.form.type==2&&(this.multipleSelection==null||this.multipleSelection.length==0)){
                this.$message.error('请先选择商品!')
                return
            }
            if(this.form.type==3&&(this.multipleSelection==null||this.multipleSelection.length==0)){
                this.$message.error('请先选择活动!')
                return
            }

            if(this.form.type==2){
                if(this.form.proList!=null){
                    this.form.proList = this.distinct(this.form.proList,this.multipleSelection,2)
                }else{
                    this.form.proList = this.multipleSelection
                }
                this.dialogVisible = false
            }else if(this.form.type==3){
                if(this.form.proList!=null){
                    this.form.proList = this.distinct(this.form.proList,this.multipleSelection,3)
                }else{
                    this.form.proList = this.multipleSelection
                }
                this.dialogVisible = false
            }else if(this.form.type==4){
                // this.distinct 解决选择后数据消失的问题
                if(this.form.taskList!=null){
                    this.form.taskList = this.distinct(this.form.taskList,this.multipleTaskSelection,4)
                }else{
                    this.form.taskList = this.multipleTaskSelection
                }
                this.dialogTaskVisible = false
            }
        },
        // 热门活动的内边距选择默认还是自定义
        handleRadioChange(val){
            if(val=='默认'){
                this.form.upAndown = 0.3
                this.form.leftAndright = 0.3
                this.form.imgMargin = 0.3
            }
        },
        // 成长任务删除一条数据
        handleDeleTask(val){
            this.form.taskList.splice(val,1)
        },
        // 成长任务添加
        handleAddTask(){
            let str = {taskName:'此处填写任务名称',dayTimes:'',checkList:[],growthValue:'',integral1:'',integral2:'',isNewTask:2,imgPath:'',linkUrl:'',taskType:0}
            this.form.taskList.push(str)
        },
        // 成长任务图片上传成功
        handleAvatarSuccess(res, file) {
            if(res.status==0){
                this.form.taskList[this.handleUploadImgIndex].imgPath = URL.createObjectURL(file.raw)
                this.form.taskList[this.handleUploadImgIndex].imgPathUrl = res.data.fileUrl
                this.isShowFileList = true
            }else{
                this.isShowFileList = false
                this.$message.error(res.message)
            }
        },
        // 等级特权图片上传成功
        handleGradeSuccess(res, file) {
            if(res.status==0){
                this.normalPrivilege[this.handleUploadImgIndex].imgPath = URL.createObjectURL(file.raw);
                this.normalPrivilege[this.handleUploadImgIndex].imgPathUrl = res.data.fileUrl
                this.isShowFileList = true
            }else{
                this.isShowFileList = false
                this.$message.error(res.message)
            }
        },
        // 等级配置背景图上传成功
        handleGradeBackSuccess(res, file) {
            if(res.status==0){
                this.form.uploadImgPath = URL.createObjectURL(file.raw);
                this.form.gradeList.forEach(item=>{
                    if(item.grade==this.form.grade){
                        item.backImgPath = URL.createObjectURL(file.raw);
                        item.backImgPathUrl = res.data.fileUrl
                    }
                })
                this.isShowFileList = true
            }else{
                this.isShowFileList = false
                this.$message.error(res.message)
            }
            
        },
        // 图片上传之前
        beforeAvatarUpload(file) {
            // const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            // if (!isJPG) {
            //     this.$message.error('上传头像图片只能是 JPG 格式!');
            // }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            // return isJPG && isLt2M;
            return isLt2M;
        },
        // 点击上传图片存当前点击的元素
        handleUploadImg(ind){
            this.handleUploadImgIndex = ind
        },
        // 获取会员等级
        queryMember(){
            queryMember().then(res=>{
                this.gradeList = res.data
            })
        },
        // 选择用户等级
        handleGradeChange(val){
            let that = this
            let SwiperGrade = new Swiper('.swiperGrade', {
                slidesPerView: 'auto',
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,//修改swiper的父元素时，自动初始化swiper
                on:{
                    slideChange:function(){
                        that.normalPrivilege = that.form.gradeList[this.realIndex].privilegeList
                        that.form.backgroundRadio = that.form.gradeList[this.realIndex].backgroundRadio
                        that.form.grade = that.form.gradeList[this.realIndex].grade
                        if(that.form.backgroundRadio==2){
                            that.form.uploadImgPath = that.form.gradeList[this.realIndex].backImgPath
                        }else{
                            that.form.uploadImgPath = ''
                        }
                    }
                }
            })
            //右边有多少组件就会生成多少个swiper
            for(let i = 0;i<this.rightList.length;i++){
                if(this.rightList[i].type==5&&this.rightList.length>1){
                    SwiperGrade[i].slideTo(val-1)
                }else if(this.rightList[i].type==5&&this.rightList.length==1){
                    SwiperGrade.slideTo(val-1)
                }
            }
            this.normalPrivilege = this.form.gradeList[val-1].privilegeList
            this.form.backgroundRadio = this.form.gradeList[val-1].backgroundRadio
            if(this.form.backgroundRadio==2){
                this.form.uploadImgPath = this.form.gradeList[val-1].backImgPath
            }else{
                this.form.uploadImgPath = ''
            }
        },
        // 等级配置切换选择背景设置
        handleBackChange(val){
            for(let i = 0;i<this.rightList.length;i++){
                if(this.rightList[i].type==5){
                    let str = this.rightList[i].gradeList
                    for(let j = 0;j<str.length;j++){
                        if(this.form.grade==str[j].grade){
                            str[j].backgroundRadio = this.form.backgroundRadio
                            if(val==2){
                                this.form.uploadImgPath = str[j].backImgPath
                            }
                        }
                        
                    }
                }
            }
        },
        // 获取用户积分名称
        getInteger(){
            getInteger().then(res=>{
                this.integralName=res.data.integralName
            })
        },
        // 复制成功
        onCopy(e){
            this.$message.success('复制成功!')
        },
        // 复制失败
        onError(e){
            this.$message.error('失败!')
        },
    },
    computed:{}
}
</script>
   
<style lang='scss'>
// .sortable-ghost{
//     width: 100px;
//     height: 50px;
//     background: red;
// }
.decorate{
    .footer{
        position: fixed;
        bottom: 0;
        // left: 400px;
        width: 66%;
        min-width: 900px;
        padding: 10px;
        box-shadow: 0 -3px 5px #eee;
        background-color: hsla(0,0%,100%,.95);
        text-align: center;
        z-index: 2;
        .main-btn{
            margin-right: 10px;
        }
    }
    .decorateContainer{
        display: flex;
        .app-wrapper{
            width: 224px;
            height: 1000px;
            box-shadow: 1px 0 0 0 #f2f2f2;
            overflow-x: hidden;
            margin-right: 50px;
            .app-wrapper-item{
                width: 100px;
                height: 100px;
                text-align: center;
                padding-top: 20px;
                margin-right: 10px;
                margin-bottom: 10px;
                &:hover{
                    background: rgba(40, 123, 214, 0.1);
                }
                .iconfont{
                    margin-right: 0;
                    font-size: 30px;
                }
                img{
                    width: 24px;
                    height: 24px;
                    display: inline-block;
                }
                p{
                    margin-top: 20px;
                }
            }
        }
        .app-content{
            min-height: 750px;
            width: 377px;
            background: #f8f8f8;
            border: 1px solid #e5e5e5;
            margin-bottom: 20px;
            position: relative;
            box-shadow: 0 2px 6px 0 rgba(0,0,0,.1);
            font-size: 0.28rem;
            // overflow-x: auto;
            &::-webkit-scrollbar {
                display: none;
            }
            .app-header{
                width: 100%;
                height: 64px;
                @include bac('../../../assets/images/phone.png');
                padding-top: 28px; 
                .app-mallName{
                    .el-input__inner{
                        background: transparent;
                        border: none;
                        text-align: center;
                        font-size: 0.3rem;
                        font-weight: 900;
                        color: #fff;
                    }
                }
            }
            .app-top{
                padding: .2rem .3rem 0.4rem .26rem;
                display: flex;
                background: #fff;
                .header{
                    height: .6rem;
                    width: .6rem;
                    border-radius: 100%;
                    img{
                        height: .6rem;
                        width:.6rem;
                    }
                }
                .name,.interal{
                    font-size: 500;
                    font-size: .28rem;
                    color: #333333;
                    line-height: .26rem;
                    margin: .18rem .25rem 0 0;
                }
                .rights{
                    height: .46rem;
                    width: 1.62rem;
                    box-sizing: border-box;
                    border: 0.02rem solid #ED7713;
                    border-radius: .28rem;
                    line-height: .36rem;
                    text-align: center;
                    font-size: .24rem;
                    color: #ED7713;
                    float: right;
                    margin-top: .07rem;
                    .iconfont{
                        position: relative;
                        top: 0.04rem;
                        font-size: .36rem;
                        color: #ED7713;
                    }
                }
            }
            .edit-wrapper{
                .edit-item{
                    position: relative;
                    width: 100%;
                    background: #fff;
                    .edit-item-content{
                        position: relative;
                        margin-bottom: 0.2rem;
                    }
                    .edit-title{
                        height: 0.8rem;
                        line-height: 0.8rem;
                        font-size: 0.32rem;
                        padding: 0 0.3rem;
                        margin: 0;
                        &.tlt-center{
                            text-align: center;
                        }
                        &.is-bold{
                            font-weight: 900;
                        }
                    }
                }
                
                .edit-goods{
                    padding: 0 0.3rem 0.3rem 0.3rem;
                    .goods-item{
                        font-size: 0.24rem;
                        &.goods-array2{
                            width: 3.3rem;
                            margin: 0.3rem 0.3rem 0 0;
                            .goods-item_img{
                                width: 100%;
                                height: 3.3rem;
                                // padding: 0.35rem;
                            }
                        }
                        &.goods-array1{
                            width: 100%;
                            margin-top: 0.3rem;
                            .goods-item_img{
                                width: 100%;
                                height: 6.9rem;
                            }
                            .goods-item_bottom {
                                line-height: 0.58rem;
                                .goods-item_btn{
                                    width: 1.8rem;
                                    height: 0.6rem;
                                    line-height: 0.58rem;
                                    border-radius: 0.3rem;
                                }
                            }
                        }
                        &.goods-array3{
                            width: 100%;
                            display: flex;
                            padding: 0.3rem 0;
                            border-bottom: 1px solid #eee;
                            .goods-item_img{
                                width: 1.2rem;
                                height: 1.2rem;
                                margin-right: 0.2rem;
                                margin-bottom: 0;
                                .goods-item_bottom{
                                    width: 100%;
                                }
                            }
                            .goods-item-list{
                                width: 5.5rem;
                            }
                        }
                        &:nth-of-type(2n){
                            margin-right: 0;
                        }
                        .goods-item_img{
                            border: 1px solid #e5e5e5;
                            border-radius: 0.1rem;
                            margin-bottom: 6px;
                            img{
                                border-radius: 0.1rem;
                            }
                        }
                        .goods-item_bottom{
                            display: flex;
                            justify-content: space-between;
                            margin-top: 3px;
                            line-height: 0.32rem;
                            .goods-item_btn{
                                width: 0.9rem;
                                height: 0.34rem;
                                line-height: 0.32rem;
                                color: #ED7713;
                                border: 1px solid #ED7713;
                                font-size: 0.22rem;
                                text-align: center;
                                border-radius: 0.17rem;
                            }
                        }
                    }
                }
                .edit-activity{
                    width: 100%;
                    padding-right: 0;
                    .swiper-slide{
                        &.array4{
                            width: 3rem;
                        }
                        &.array2{
                            width: 3.3rem;
                            &:nth-of-type(2n){
                                margin-right: 0 !important;
                            }
                        }
                        &.array1{
                            width: 100%;
                        }
                    }
                    img{
                        width: 100%;
                        height: 1.68rem;
                        border-radius: 0.1rem;
                        display: inline-block;
                    }
                }
                .edit-item-growupTask{
                    padding-bottom: 0.2rem;
                    padding-top: 0.2rem;
                }
                .edit-growupTask{
                    padding: 0 0.3rem;
                    margin-top: 0.2rem;
                    &:first-child{
                        margin-top: 0;
                    }
                    img{
                        width: 1.1rem;
                        height: 1.1rem;
                        display: inline-block;
                        border-radius: 100%;
                        margin-right: 0.3rem;
                    }
                    .edit-growupTask-title{
                        font-size: 0.28rem;
                        color: #333;
                        .edit-growupTask-newTask{
                            font-size: 0.16rem;
                            color: #fff;
                            padding: 2px 6px;
                            background:linear-gradient(-55deg,rgba(232,42,57,1) 0%,rgba(255,100,112,1) 100%);
                        }
                    }
                    .edit-growupTask-info{
                        font-size: 0.24rem;
                        color: #999;
                    }
                    .edit-growupTask-btn{
                        width: 0.96rem;
                        height: 0.42rem;
                        line-height: 0.42rem;
                        text-align: center;
                        color: #fff;
                        background:linear-gradient(-55deg,rgba(237,119,19,1) 0%,rgba(254,145,53,1) 100%);
                        border-radius: 0.21rem;
                        font-size: 0.24rem;
                        margin-top: 0.34rem;
                    }
                    .edit-growupTask-iconfont{
                        width: 1.1rem;
                        height: 1.1rem;
                        border-radius: 100%;
                        margin-right: 0.3rem;
                        line-height: 1.1rem;
                        text-align: center;
                        background: #FFF6EE;
                        .iconfont{
                            background:linear-gradient(-55deg,rgba(237,119,19,1) 0%,rgba(255,175,108,1) 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            font-size: 0.6rem;
                        }
                    }
                }
                .edit-setGrade{
                    padding: 0.3rem;
                    padding-right: 0;
                    position: relative;
                    .edit-gradeTitle{
                        position: absolute;
                        top: 3.5rem;
                    }
                    .edit-topSwiper-item{
                        // position: relative;
                        width: 6.6rem;
                        // height: 3.2rem;
                        // background:linear-gradient(-55deg,rgba(255,255,255,0) 0%,rgba(205,214,231,1) 100%);
                        margin-right: 0.3rem;
                        border-radius: 0.2rem;
                        color: #fff;
                        img{
                            border-radius: 0.2rem;
                        }
                        .edit-setGrade-growthValue{
                            display: flex;
                            justify-content: space-between;
                            position: absolute;
                            top: 0.2rem;
                            left: 5%;
                            width: 90%;
                            .iconchengchangzhimingxi{
                                font-size: 0.34rem;
                                color: #fff;
                                vertical-align: middle;
                            }
                        }
                        .growthValue{
                            font-size: 0.42rem;
                            font-weight: 900;
                        }
                        .edit-setGrade-progress{
                            position: absolute;
                            left: 5%;
                            bottom: 0.3rem;
                            font-size: 0.24rem;
                            .el-progress{
                                width: 4.2rem;
                            }
                            .el-progress__text{
                                display: none;
                            }
                            .current{
                                width: 0.38rem;
                                height: 0.38rem;
                                text-align: center;
                                line-height: 0.38rem;
                                background: hsla(0,0%,100%,.3);
                                color: #fff;
                                border-radius: 100%;
                                z-index: 1;
                            }
                            .progress-before{
                                position: absolute;
                                left: -0.15rem;
                                background: #fff;
                                color: #cbd3e5;
                                top: -0.02rem;
                            }
                            .progress-after{
                                position: absolute;
                                right: -0.36rem;
                                top: -0.04rem;
                            }
                            .el-progress-bar{
                                padding-right: 0;
                                .el-progress-bar__outer{
                                    background: hsla(0,0%,100%,.3);
                                }
                            }
                        }
                    }
                    .edit-title{
                        padding: 0;
                        font-weight: 900;
                        color: #333;
                    }
                    .edit-gradeSwiper{
                        padding-left: 0.3rem;
                        .edit-gradeSwiper-item{
                            font-size: 0.24rem;
                            width: 1.3rem;
                            text-align: center;
                            margin-right: 0.48rem;
                            margin-top: 40px;
                            img{
                                width: 1rem;
                                height: 1rem;
                                display: inline-block;
                                border-radius: 100%;
                                margin-bottom: 0.1rem;
                            }
                            p{
                                color: #333;
                            }
                        }
                    }
                }
                .edit-hover{
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    cursor: move;
                    border: 1px dashed transparent;
                    &.edit-hover-style{
                        border-color: #30B08F;
                    }
                }
                .edit-closeBtn{
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    .el-button--small.is-circle{
                        padding: 4px;
                    }
                }
            }
        }
        .app-edit{
            position: absolute;
            top: 0;
            right: -346px;
            color: #333;
            border: 1px solid #e5e5e5;
            font-size: 14px;
            border-radius: 2px;
            box-sizing: border-box;
            box-shadow: 0 2px 6px 0 rgba(0,0,0,.1);
            width: 326px;
            max-height: 750px;
            overflow: scroll;
            margin-bottom: 60px;
            &::-webkit-scrollbar {
                display: none;
            }
            .app-edit-header{
                height: 42px;
                line-height: 42px;
                border-bottom: 1px solid #f2f2f2;
                padding: 0 15px;
            }
            .app-edit-footer{
                padding: 10px 15px;
                border-top: 1px solid #f2f2f2; 
                text-align: right;
            }
            .app-edit-arrow{
                position: absolute;
                left: -6px;
                top: 12px;
                height: 0;
                width: 0;
                border-top: 7px solid transparent;
                border-right: 6px solid #e5e5e5;
                border-bottom: 7px solid transparent;
                &::after{
                    content: "";
                    position: absolute;
                    top: -6px;
                    left: 1px;
                    border-top: 6px solid transparent;
                    border-right: 5px solid #fafafa;
                    border-bottom: 6px solid transparent;
                }
            }
            .app-edit-body{
                padding: 15px;
                width: 100%;
                .el-form-item{
                    margin-bottom: 10px;
                }
                .el-input{
                    width: auto;
                }
                .el-radio{
                    margin-right: 10px;
                }
                .label-wrapper{
                    margin-bottom: 20px;
                    .app-edit-label{
                        line-height: 28px;
                    }
                }
                .common-flex{
                    display: flex;
                    .el-input{
                        width: auto;
                    }
                }
                .app-edit-resetColor{
                    vertical-align:top;
                    margin-left:6px;
                    color:#287BD6;
                    cursor: pointer;
                }
                .app-edit-checkgoodsList{
                    width: 100%;
                    padding: 10px;
                    padding-bottom: 0;
                    border: 1px dashed #ccc;
                    li{
                        height: 84px;
                        width: 84px;
                        margin-right: 10px;
                        position: relative;
                        border: 1px solid #ccc;
                        margin-bottom: 10px;
                        &.app-edit-addGoods{
                            text-align: center;
                            line-height: 84px;
                        }
                        &:nth-of-type(3n){
                            margin-right: 0;
                        }
                        .el-icon-error{
                            position: absolute;
                            top: -5px;
                            right: -5px;
                            background: #fff;
                            display: none
                        }
                        &:hover{
                            .el-icon-error{
                                display: block;
                            }
                        }
                    }
                }
                .app-edit-listStyle{
                    width: 100%;
                    text-align: center;
                    display: flex;
                    justify-content: space-around;
                    p{
                        font-size: 12px;
                    }
                }
                .arrayNumber{
                    width: 50px;
                    height: 50px;
                }
                .app-edit-addActivity{
                    width: 100%;
                    // height: 80px;
                    padding: 10px 8px;
                    border: 1px dashed #ccc;
                    margin-bottom: 10px;
                    // display: flex;
                    // justify-content: space-between;
                    .app-addActivity-item{
                        display: flex;
                        justify-content: space-between;
                        .el-icon-close{
                            line-height: 12px;
                        }
                    }
                    .el-input{
                        width: 130px;
                        margin-left: 5px;
                        .el-input__inner{
                            height: 20px;
                            line-height: 20px;
                        }
                    }
                    .el-icon-close{
                        line-height: 60px;
                    }
                    .imgStyle{
                        width: 60px;
                        height: 60px;
                        color: $main-col;
                        border: 1px solid #ccc;
                        line-height: 60px;
                        text-align: center;
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
                    .app-edit-taskType{
                        .el-radio{
                            display: flex;
                            margin-top: 10px;
                        }
                    }
                    .el-textarea__inner{
                        width: 100%;
                        margin-top: 10px;
                    }
                }
                .app-edit-add{
                    width: 100%;
                    border: 1px dashed #ccc;
                    text-align: center;
                    color: $main-col;
                    .el-icon-plus{
                        font-weight: 900;
                    }
                }
                .app-edit-setBackground{
                    .el-form-item__content{
                        margin-left: 68px !important;
                        text-align: center;
                    }
                    .avatar-uploader{
                        border: 1px solid #ccc;
                        height: 80px;
                        width: 200px;
                        line-height: 80px;
                        .el-upload{
                            width: 100%;
                            height: 100%;
                        }
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
            .el-form-item__content{
                line-height: 22px;
            }
        }
    }
}
.avatar-uploader{
    .el-upload--text{
        width: 100%;
        height: 100%;
    }
}
.el-button--mini{
    color: #333;
}
.el-button--primary.el-button--mini{
    padding: 4px 10px;
    font-size: 12px;
    color: #fff;
    background: $main-col;
    border-color: $main-col;
}
.undraggable{
    background: #eee;
    opacity: .5;
}
.popoverItem{
    .popoverTitle{
        font-weight: 900;
    }
    .popoverInfo{
        font-size: 12px;
    }
}
</style>