<template>
    <div class="app-content">
        <div class="app-top">
            <div class="header">
                <img src="@img/viewer.png">
            </div>
            <div class="name" style="margin-left:.18rem;">皮卡丘</div>
            <div class="interal" style="flex:1">8000积分</div>
            <div class="rights">
                <i class="iconfont icondaohangtiao-quanyiguanli" style="font-style:normal;"></i>我的权益
            </div>
        </div>
        <div class="edit-wrapper">
            <div v-for="(item, index) in rightList" :key="index" class="edit-item">
                <!-- 右侧标题内容 -->
                <div class="edit-item-content edit-title boxs" :class="{'tlt-center':item.place=='居中','is-bold':item.weight=='加粗'}" v-show="item.type==1">
                    {{item.titleValue}}
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
                                <span :style="{color:item.color}">{{item1.integral}}积分</span>
                                <div class="goods-item_btn" :style="{color:item.color,'border-color':item.color}">兑换</div>
                            </div>
                        </div>
                    </div>
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
                                <div class="edit-activity-name nowrap">{{subitem.activityName}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 右侧成长任务 -->
                <div class="edit-item-content boxs" v-show="item.type==4">
                    <div class="edit-growupTask clearfix" v-for="subitem in item.taskList" v-if="item.taskList!=null&&item.taskList.length!=0">
                        <img class="fl" :src="subitem.imgPath" v-if="subitem.imgPath!=null&&subitem.imgPath!=''" alt="">
                        <div class="fl" style="line-height:0.5rem;">
                            <div class="edit-growupTask-title">{{subitem.taskName}}
                                <span class="edit-growupTask-newTask" v-show="subitem.isNewTask!=1">新手任务</span>
                            </div>
                            <p v-if="subitem.taskType==1" class="edit-growupTask-info nowrap">完成任务后可得
                                <span>{{subitem.integral1}}积分</span> +
                                <span>{{subitem.growthValue}}点成长值</span>
                            </p>
                            <p v-else class="edit-growupTask-info nowrap">完成任务后可得
                                <span>{{subitem.integral2}}积分</span>
                            </p>
                        </div>
                        <div class="edit-growupTask-btn fr">去完成</div>
                    </div>
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
                </div>
            </div>
        </div>
    </div>
</template>
   
   
<script>
import { listViewPage } from '@/api/api.js'
import Swiper from 'swiper'
import request from '@/api/request.js'
export default {
    data() {
        return {
            rightList:[],
            normalPrivilege:[],//全局的等级特权
            baseImgPath:request.Base_IMGPATH,//图片库
        }
    },
    created() {
        this.listViewPage()
    },
    methods: {
        // 获取页面数据
        listViewPage(){
            listViewPage().then(res=>{
                this.rightList = res.data.result
                this.$nextTick(()=>{
                    let SwiperGrade = new Swiper('.swiperGrade', {
                        slidesPerView: 'auto',
                        direction : 'horizontal',
                        observer: true,//修改swiper自己或子元素时，自动初始化swiper
                        observeParents: true,//修改swiper的父元素时，自动初始化swiper
                        on:{
                            slideChange:function(){
                            }
                        }
                    })
                    new Swiper('.edit-gradeSwiper', {
                        slidesPerView: 'auto',
                        observer: true,//修改swiper自己或子元素时，自动初始化swiper
                        observeParents: true//修改swiper的父元素时，自动初始化swiper
                    })
                })
                
            })
        },
    }
}
</script>
   
<style scoped lang='scss'>
.app-content{
    min-height: 750px;
    width: 377px;
    background: #fff;
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
            .edit-item-content{
                position: relative;
            }
        }
        .edit-title{
            height: 0.8rem;
            line-height: 0.8rem;
            font-size: 0.32rem;
            padding: 0 0.3rem;
            &.tlt-center{
                text-align: center;
            }
            &.is-bold{
                font-weight: 900;
            }
        }
        .edit-goods{
            padding: 0 0.3rem;
            margin-bottom: 0.2rem;
            .goods-item{
                font-size: 0.24rem;
                &.goods-array2{
                    width: 3.3rem;
                    margin: 0.3rem 0.3rem 0 0;
                    .goods-item_img{
                        width: 100%;
                        height: 1.82rem;
                    }
                }
                &.goods-array1{
                    width: 100%;
                    margin-top: 0.3rem;
                    .goods-item_img{
                        width: 100%;
                        height: 3.75rem;
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
                        width: 2.2rem;
                        height: 1.2rem;
                        margin-right: 0.2rem;
                        margin-bottom: 0;
                        .goods-item_bottom{
                            width: 100%;
                        }
                    }
                    .goods-item-list{
                        width: 4.7rem;
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
        .edit-growupTask{
            padding: 0 0.3rem;
            margin-bottom: 0.2rem;
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
</style>