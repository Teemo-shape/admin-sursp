<template>
    <div class='homeContainer'>
        <div class="swiper-container bannerSwiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,index) in bannerList" :key="index">
                    <img :src="item" alt="">
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
        <div class="infomation boxs" ref="infomation">
            <p>存量用户权益服务平台</p>
            <p class="info">围绕“如何提升存量用户的活跃度”搭建的生态系统，以帮助企业实现主业增长为核心目标。</p>
        </div>
        <div class="rights boxs">
            <div class="middleStyle">
                <div class="rightsStep">
                    <div class="rightsItem">
                        <div class="icon"><span class="iconfont iconwuxukaifa"></span></div>
                        <div class="infos">
                            <p class="name">无需开发，一键登录</p>
                            <p class="info">只需凭借管理员账号登录后台，即可全面管理用户，赋能企业。</p>
                        </div>
                    </div>
                    <div class="rightsItem rightsItem1">
                        <div class="icon"><span class="iconfont iconyonghufenji"></span></div>
                        <div class="infos">
                            <p class="name">用户分级，灵活配置</p>
                            <p class="info">既支持企业原有用户体系的导入，也可以根据实际情况重新设计用户等级体系并配置权益范围。</p>
                        </div>
                    </div>
                    <div class="rightsItem rightsItem2">
                        <div class="icon"><span class="iconfont iconmokuaicuhuo"></span></div>
                        <div class="infos">
                            <p class="name">模块促活，简单有效</p>
                            <p class="info">围绕“促活”指标，提供丰富的模块化营销功能场景，企业只需要根据自身节点需要点选即可。</p>
                        </div>
                    </div>
                    <div class="rightsItem rightsItem3">
                        <div class="icon"><span class="iconfont iconjiemianfengge"></span></div>
                        <div class="infos">
                            <p class="name">界面风格，因需而定</p>
                            <p class="info">企业根据自身VI标准自定义前端界面，使权服平台完美嵌入企业自身终端环境。</p>
                        </div>
                    </div>
                </div>
                <div class="stockInfo">
                    <p>搭建权益生态</p>
                    <span>根据用户特征，结合企业的产品特点，通过存量用户权益服务平台，让企业多方位触达、影响用户的行为，实现企业核心主业增长。</span>
                </div>
            </div>
        </div>
        <div class="stock boxs">
            <div class="middleStyle">
                <div class="stockInfo">
                    <p style="margin-top:100px;">运营盘活存量</p>
                    <span>3大促活方式，及创建、执行、管理、反馈、迭代为一体的多场景智能化运营中台，通过对用户行为、偏好习惯的数据分析，精准触达存量用户，提高运营效能。</span>
                </div>
                <div class="stockRound">
                    <p class="center">运营</p>
                    <div class="round">
                        <span>转化</span>
                        <img src="@img/home/stock1.png" v-show="isShowStock==1" alt="">
                    </div>
                    <div class="round round1">
                        <span>转交</span>
                        <img src="@img/home/stock2.png" v-show="isShowStock==2" alt="">
                    </div>
                    <div class="round round2">
                        <span>传播</span>
                        <img src="@img/home/stock3.png" v-show="isShowStock==3" alt="">
                    </div>
                    <div class="round round3">
                        <span>留存</span>
                        <img src="@img/home/stock4.png" v-show="isShowStock==4" alt="">
                    </div>
                    <div class="round round4">
                        <span>促活</span>
                        <img src="@img/home/stock5.png" v-show="isShowStock==5" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="service-Zenzhang boxs">
            <div class="middleStyle">
                <div class="zenzhang-l">
                    <div class="item">
                        <img src="@img/home/service-Zenzhang1.png" alt="">
                        <p>数据罗盘 驱动增长</p>
                    </div>
                    <div class="item">
                        <img src="@img/home/service-Zenzhang2.png" alt="">
                        <p>数据安全  全程可控</p>
                    </div>
                </div>
                <div class="zenzhang-r">
                    <p>实现企业增长</p>
                    <span>通过权益服务生态的搭建，对存量用户进行运营盘活，从而实现企业的用户体量增长、业绩增长、市场占有率增长。</span>
                </div>
            </div>
        </div>
        <div class="service-Zenzhi boxs" ref="serviceZenzhi">
            <div class="title">增值服务</div>
            <div class="middleStyle">
                <div class="zenzhi-item boxs hands" v-for="item in serviceZzList">
                    <span class="iconfont" :class="item.icon"></span>
                    <p class="title">{{item.title}}</p>
                    <p class="info">{{item.info}}</p>
                </div>
            </div>
        </div>
        <div class="service-Pingtai boxs">
            <div class="title">四步搭建你的存量用户权益服务平台</div>
            <div class="middleStyle">
                <div class="pingtai-item">
                    <img src="@img/home/pingtai1.png" alt="">
                    <p>注册账号</p>
                    <span>一键管理存量用户权益服务平台</span>
                </div>
                <div class="dots"> 
                    <img src="@img//home/dot1.png" alt="" class="dot" v-for="item in [0,1,2,3]">
                </div>
                <div class="pingtai-item">
                    <img src="@img/home/pingtai2.png" alt="">
                    <p>接口对接</p>
                    <span>免登录接口  用户权益接口</span>
                    <div><i>（*非必要）</i></div>
                </div>
                <div class="dots">
                    <img src="@img//home/dot2.png" alt="" class="dot" v-for="item in [0,1,2,3]">
                </div>
                <div class="pingtai-item">
                    <img src="@img/home/pingtai3.png" alt="">
                    <p>自定义配置</p>
                    <span>页面板块 运营场景 商品服务</span>
                </div>
                <div class="dots">
                    <img src="@img//home/dot3.png" alt="" class="dot" v-for="item in [0,1,2,3]">
                </div>
                <div class="pingtai-item">
                    <img src="@img/home/pingtai4.png" alt="">
                    <p>盘活存量</p>
                    <span>增长从存量用户权益服务平台开始</span>
                </div>
            </div>
        </div>
        <div class="consume boxs" ref="consume">
            <div class="title">聚焦消费服务型领域</div>
            <div class="middleStyle">
                <div class="consume-item" v-for="item in consumeList">
                    <img :src="item.imgPath" alt="">
                    <p>{{item.name}}</p>
                </div>
                
            </div>
        </div>
        <div class="solve boxs" ref="solve">
            <div class="title">专注运营盘活存量 全面解决企业痛点</div>
            <div class="middleStyle boxs">
                <div v-for="item in solveList">
                    <div class="solve-number">{{item.number}}</div>
                    <p class="info">{{item.info}}</p>
                </div>
            </div>
        </div>
        <div class="honor boxs">
            <div class="title">企业荣誉</div>
            <div class="middleStyle">
                <div class="honor-info boxs">
                    <div class="honor-info-item" v-for="item in honorInfoList">
                        <img :src="item.imgPath" alt="">
                        <p>{{item.info1}}</p>
                        <p>{{item.info2}}</p>
                    </div>
                </div>
                <div class="honorImages">
                    <div class="itemImg" v-for="item in honorImages">
                        <img :src="item.imgPath" alt="">
                        <p>{{item.name}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="partner boxs">
            <div class="title">我们的合作伙伴</div>
            <div class="middleStyle">
                <el-carousel :interval="10000" arrow="always" indicator-position="outside">
                    <el-carousel-item v-for="(item,index) in partnerList" :key="index">
                        <img :src="v" alt="" v-for="v in item.images">
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
        <div class="aboutUs">
            <p>联系我们  立即体验产品服务</p>
            <y-button text="立即体验" class="button" @btnClick="linkUrl()" classStyle="white-btn"></y-button>
        </div>
        <div class="footer">
            <div class="middleStyle boxs">
                <div class="ewmImg">
                    <img src="@img/logo.png" alt="">
                    <p>搭建权益生态</br>运营盘活存量</br>助力企业增长</p>
                    <img src="@img/home/ewm.png" alt="">
                    <p>扫码回复“增长”获取详细方案资料</p>
                </div>
                <div class="navigationStyle">
                    <ul class="faster">
                        <li>快捷导航</li>
                        <li @click="jump(1)">平台价值</li>
                        <li @click="jump(2)">增值服务</li>
                        <li @click="jump(3)">服务行业</li>
                        <li @click="jump(4)">平台优势</li>
                    </ul>
                    <ul class="contact">
                        <li>联系方式</li>
                        <li>
                            <img src="@img/home/tel.png" alt="">
                            <div><span>产品接入</span><div class="tel">13686485550</div></div>
                        </li>
                        <li>
                            <img src="@img/home/partner.png" alt="">
                            <div><span>品牌资源合作</span><div class="tel">13424266585</div></div>
                        </li>
                        <li>
                            <img src="@img/home/address.png" alt="">
                            <div><span>公司地址</span><div style="line-height:18px;">深圳市南山区科发路8号金融基地2栋7AB</div></div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="copyright boxs">深圳多多益善数据科技有限公司版权所有Copyright©2018-2019 All Rights Reserved</div>
        </div>
    </div>
</template>
   
   
<script>
import YButton from '../common/YButton.vue'
import YHeader from '../common/commonHead.vue'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css';
import { setTimeout, clearTimeout } from 'timers';
export default {
    components: {
      YButton,YHeader
    },
    data() {
        return {
            bannerList:[require('@img/home/banner1.png'),require('@img/home/banner2.png'),require('@img/home/banner3.png')],
            serviceZzList:[
                {icon:'iconziyuangongxiang',title:'资源共享',info:'既可共享平台提供的海量性价比商品、服务，亦可根据企业需要增加自有供应商。'},
                {icon:'icondingzhihuakaifa',title:'定制化开发',info:'根据企业核心业务进行定制化场景开发，快速响应，稳定可靠，自由扩展。'},
                {icon:'iconyunyingxueyuan',title:'运营学院',info:'丰富的运营知识，专业的运营实战课程，干货满满。'},
                {icon:'iconduihuanfangshi',title:'兑换方式',info:'不同的权益交易方式，企业根据自身需要点选。'},
                {icon:'icondingdanguanli1',title:'订单管理',info:'订单后台清晰明了，帮助企业精准定位用户需求。'},
                {icon:'iconeduguanli',title:'额度管理',info:'额度是基于企业内部交易生态而搭建的用户虚拟货币账户。'},
                {icon:'iconqiandaogongneng',title:'签到功能',info:'多种签到方式，根据企业用户的特性，自定义签到玩法。'},
                {icon:'iconjishuzhichi',title:'技术支持',info:'多人专业团队，实时保障系统稳定性和数据安全。'},
                {icon:'iconfupanzongjie',title:'复盘总结',info:'探究问题，总结规律，提出解决方案，促进持续增长。'},
                {icon:'iconzhidaopeixun',title:'指导培训',info:'指导搭建多重体系，协助制定运营计划，线上线下沙龙课程，运营1V1指导。'},
            ],
            solveList:[
                {number:'2大',info:'权益体系'},
                {number:'20000+',info:'品牌商品'},
                {number:'3种',info:'促活方式'},
                {number:'50款',info:'互动模板'},
            ],
            consumeList:[
                {name:'保险',imgPath:require('@img/home/industry1.png')},
                {name:'航空',imgPath:require('@img/home/industry2.png')},
                {name:'地产',imgPath:require('@img/home/industry3.png')},
                {name:'物业',imgPath:require('@img/home/industry4.png')},
                {name:'银行',imgPath:require('@img/home/industry5.png')},
                {name:'大健康',imgPath:require('@img/home/industry6.png')},
                {name:'新零售',imgPath:require('@img/home/industry7.png')},
                {name:'互联网',imgPath:require('@img/home/industry8.png')},
            ],
            honorInfoList:[
                {imgPath:require('@img/home/1.png'),info1:'0成本开发',info2:'一站式接入 一键注册管理'},
                {imgPath:require('@img/home/2.png'),info1:'数据驱动运营',info2:'专业数据分析系统  确保信息安全'},
                {imgPath:require('@img/home/3.png'),info1:'自定义匹配功能场景',info2:'关联企业核心业务'},
                {imgPath:require('@img/home/4.png'),info1:'专业团队服务',info2:'7*12为您提供贴心服务'},
            ],
            honorImages:[
                {name:'国家级高新技术企业',imgPath:require('@img/home/honor1.png')},
                {name:'广东省守合同重信用企业',imgPath:require('@img/home/honor2.png')},
                {name:'企业级青年文明号',imgPath:require('@img/home/honor3.png')},
                {name:'深圳市软件行业协会会员单位',imgPath:require('@img/home/honor4.png')},
                {name:'精准扶贫公益爱心企业',imgPath:require('@img/home/honor5.png')},
                {name:'深圳市中小企业最佳雇主',imgPath:require('@img/home/honor6.png')},
            ],
            partnerList:[
                { images:[require('@img/home/LOGO1.png'),require('@img/home/LOGO2.png'),require('@img/home/LOGO3.png'),require('@img/home/LOGO4.png'),
                    require('@img/home/LOGO5.png'),require('@img/home/LOGO6.png'),require('@img/home/LOGO7.png'),require('@img/home/LOGO8.png'),require('@img/home/LOGO9.png')
                ] },
                { images:[require('@img/home/LOGO10.png'),require('@img/home/LOGO11.png'),require('@img/home/LOGO12.png'),require('@img/home/LOGO13.png'),require('@img/home/LOGO14.png'),require('@img/home/LOGO15.png')] },
            ],
            isShowStock:1
        }
    },
    created() {
        this.roundShow()
        this.$nextTick(() => {
            var swiper = new Swiper('.bannerSwiper', {
                slidesPerView: 'auto',
                loop:true,
                autoplay: true, //可选选项，自动滑动s
                speed: 500,
                // observer: true,//修改swiper自己或子元素时，自动初始化swiper
                // observeParents: true,//修改swiper的父元素时，自动初始化swiper
                pagination: {
                    el: '.swiper-pagination',
                },
                autoplayDisableOnInteraction:false
            });
        })
    },
    methods: {
        // 锚点定位
        jump(ind){
            let scrollTop
            if(ind==1){
                scrollTop = this.$refs.infomation.offsetTop-60
            }else if(ind==2){
                scrollTop = this.$refs.serviceZenzhi.offsetTop-60
            }else if(ind==3){
                scrollTop = this.$refs.consume.offsetTop-60
            }else if(ind==4){
                scrollTop = this.$refs.solve.offsetTop-60
            }
            console.log(scrollTop)
            window.scrollTo({
                top: scrollTop,
                behavior: 'smooth' // 平滑滚动
            })
        },
        linkUrl(){
            window.open('https://jinshuju.net/f/LSHaaq')
        },
        roundShow(){
            let that = this
            let timer = setInterval(function(){
                that.isShowStock ++
                if(that.isShowStock==6){
                    that.isShowStock=1
                    that.roundShow()
                    clearInterval(timer)
                }
            },3000)
        }
    },
    mounted(){
        // this.$nextTick(() => {
        //     var swiper = new Swiper('.bannerSwiper', {
        //         slidesPerView: 'auto',
        //         loop:true,
        //         autoplay: 2000, //可选选项，自动滑动s
        //         speed: 500,
        //         // observer: true,//修改swiper自己或子元素时，自动初始化swiper
        //         // observeParents: true,//修改swiper的父元素时，自动初始化swiper
        //         pagination: {
        //             el: '.swiper-pagination',
        //         },
        //     });
        // })
    }
}
</script>
   
<style lang='scss'>
.swiper-container-horizontal>.swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction{
    bottom: 30px;
}  
.middleStyle{
    max-width: 1220px;
    min-width: 1220px;
    width: 85%;
    margin: 0 auto;
    height: 100%;
}
.homeContainer{
    .title{
        font-size: 38px;
        margin-bottom: 80px;
    }
    .bannerSwiper{
        width: 100%;
        max-height: 600px;
        min-width: 1200px;
        .swiper-slide{
            width: 100%;
            height: 100%;
            img{
                height: auto; 
                width: auto; 
                max-height: 100%; 
                max-width: 100%;
            }
        }
        .swiper-pagination-bullet{
            width: 48px;
            height: 6px;
            border-radius: 3px;
            background: #9BC0FF;
            &.swiper-pagination-bullet-active{
                background: #fff;
            }
        }
    }
    .infomation{
        background: #fff;
        width: 100%;
        text-align: center;
        line-height: 66px;
        font-size: 38px;
        height: 284px;
        padding: 60px 0;
        .info{
            color: #999;
            font-size: 24px;
        }
    }
    .rights{
        background: #FCFCFC;
        height: 520px;
        .middleStyle{
            display: flex;
            justify-content: space-between;
            position: relative;
            .rightsStep{
                width: 200px;
                height: 516px;
                @include bac('../../assets/images/home/line.png');
                .rightsItem{
                    display: flex;
                    position: absolute;
                    top: 67px;
                    left: 106px;
                    max-width: 400px;
                    .icon{
                        width: 58px;
                        height: 58px;
                        text-align: center;
                        line-height: 58px;
                        background:linear-gradient(180deg,rgba(103,183,242,1) 0%,rgba(51,126,255,1) 100%);
                        border-radius:50%;
                        margin-right: 10px;
                        .iconfont{
                            color: #fff;
                            font-size: 34px;
                        }
                    }
                    .infos{
                        flex: 1;
                    }
                    p{
                        line-height: 30px;
                    }
                    .name{
                        font-size: 20px;
                    }
                    .info{
                        font-size: 12px;
                        color: #999;
                        line-height: 20px;
                    }
                    &:hover{
                        .icon{
                            margin-right: 36px;
                            transform: scale(1.3);
                            transition: 0.2s;
                            .iconfont{
                                transform: scale(1.3);
                                transition: 0.2s;
                            }
                        }
                        .name{
                            transform: scale(1.1);
                            transition: 0.2s;
                        }
                        .info{
                            transform: scale(1.1);
                            transition: 0.2s;
                        }
                    }
                }
                .rightsItem1{
                    top: 165px;
                    left: 167px;
                }
                .rightsItem2{
                    top: 290px;
                    left: 165px;
                }
                .rightsItem3{
                    top: 400px;
                    left: 124px;
                }
            }
            .stockInfo{
                max-width: 380px;
                margin-top: 150px;
                margin-right: 100px;
                p{
                    font-size: 34px;
                    margin-bottom: 20px;
                }
                span{
                    font-size: 16px;
                    color: #666;
                    line-height: 28px;
                }
            }
        }
    }
    .stock{
        background: #fff;
        padding: 68px 0;
        .middleStyle{
            display: flex;
            .stockInfo{
                max-width: 380px;
                margin-right: 150px;
                margin-left: 100px;
                p{
                    font-size: 34px;
                    margin-bottom: 20px;
                }
                span{
                    font-size: 16px;
                    color: #666;
                    line-height: 28px;
                }
            }
            .stockRound{
                width: 383px;
                height: 383px;
                @include bac('../../assets/images/home/stock.png');
                position: relative;
                .center{
                    font-size: 36px;
                    color: $main-col;
                    text-align: center;
                    line-height: 383px;
                }
                .round{
                    width: 78px;
                    height: 78px;
                    background:linear-gradient(180deg,rgba(103,183,242,1) 0%,rgba(51,126,255,1) 100%);
                    text-align: center;
                    line-height: 76px;
                    color: #fff;
                    font-size: 24px;
                    border: 2px solid #fff;
                    border-radius: 100%;
                    position: absolute;
                    top: 25px;
                    left: 154px;
                    img{
                        position: absolute;
                        top: -87px;
                        left: 28px;
                    }
                    .roundInfo{
                        width: 214px;
                        padding: 10px;
                        color: #fff;
                        background: $main-col;
                        font-size: 12px;
                        position: absolute;
                        top: -32px;
                        right: -10px;
                        &::before{
                            content: '';
                            width: 33px;
                            height: 1px;
                            background: #333;
                        }
                    }
                }
                .round1{
                    top: 133px;
                    left: 283px;
                }
                .round2{
                    top: 274px;
                    left: 232px;
                    img{
                        top: -103px;
                    }
                }
                .round3{
                    top: 274px;
                    left: 76px;
                }
                .round4{
                    top: 133px;
                    left: 25px;
                }
            }
        }
    }
    .service-Zenzhang{
        width: 100%;
        // height: 520px;
        padding: 145px 0;
        background: #FCFCFC;
        .middleStyle{
            display: flex;
            justify-content: space-between;
        }
        .zenzhang-l{
            display: flex;
            // margin-right: 260px;
            .item{
                width: 286px;
                text-align: center;
                border-right: 1px solid #F0F0F0;
                &:nth-of-type(2n){
                    border: none;
                }
            }
            img{
                width: 178px;
                height: 178px;
                margin-bottom: 20px;
            }
            p{
                color: #666;
                font-size: 16px;
            }
        }
        .zenzhang-r{
            max-width: 380px;
            margin-right: 100px;
            p{
                font-size: 34px;
                margin: 20px 0;
            }
            span{
                font-size: 16px;
                color: #666;
                line-height: 28px;
            }
        }
    }
    .service-Zenzhi{
        padding: 100px 0;
        background: #fff;
        text-align: center;
        .middleStyle{
            display: flex;
            justify-content: space-between;
            flex-wrap:wrap;
        }
        .zenzhi-item{
            width: 220px;
            height: 220px;
            border: 1px solid #E5E5E5;
            padding: 20px;
            margin: 0 20px 20px 0;
            text-align: left;
            .iconfont{
                font-size: 58px;
                color: $main-col;
            }
            .title{
                font-size: 20px;
                margin: 10px 0;
            }
            .info{
                font-size: 14px;
                color: #999;
                line-height: 22px;
                // overflow: hidden;
                // text-overflow: ellipsis;
                // display: -webkit-box;
                // -webkit-line-clamp: 3;
                // -webkit-box-orient: vertical;
            }
            &:hover{
                background: $main-col;
                color: #fff;
                .info,.iconfont{
                    color: #fff;
                }
            }
        }
    }
    .service-Pingtai{
        width: 100%;
        padding: 85px 0;
        background: #FCFCFC;
        text-align: center;
        .middleStyle{
            display: flex;
            justify-content: space-between;
        }
        .pingtai-item{
            img{
                width: 120px;
                height: 120px;
                border-radius: 100%;
            }
            p{
                font-size: 24px;
                margin: 16px 0 6px 0;
            }
            span{
                font-size: 14px;
                color: #999;
            }
            i{
                font-size: 14px;
                color: #3480FE;
            }
        }
        .dots{
            line-height: 120px;
        }
        .dot{
            width: 12px;
            height: 12px;
            margin-right: 20px;
            &:nth-of-type(4n){
                margin-right: 0;
            }
        }
    }
    .consume{
        width: 100%;
        padding: 85px 0;
        background: #fff;
        text-align: center;
        .middleStyle{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .consume-item{
                width: 285px;
                height: 330px;
                margin: 0 20px 20px 0;
                border: 1px solid #E5E5E5;
                img{
                    width: 100%;
                    height: 210px;
                }
                p{
                    font-size: 28px;
                    line-height: 120px;
                };
            }
        }
    }
    .solve{
        width: 100%;
        padding: 85px 0;
        background: linear-gradient(0deg,rgba(103,183,242,1) 0%,rgba(51,126,255,1) 100%);
        text-align: center;
        color: #fff;
        height: 520px;
        .middleStyle{
            // padding: 0 100px;   
            display: flex;
            justify-content: space-around;
            .solve-number{
                font-size: 44px;
                margin-bottom: 10px;
            }
            p{
                font-size: 24px;
            }
        }
    }
    .honor{
        width: 100%;
        padding: 350px 0 85px 0;
        text-align: center;
        background: #fff;
        .middleStyle{
            position: relative;
            .honor-info{
                background: #fff;
                display: flex;
                padding: 64px;
                justify-content: space-between;
                border-radius: 6px;
                box-shadow:0px 8px 12px 0px rgba(0, 0, 0, 0.08);
                position: absolute;
                top: -636px;
                left: 0;
                width: 100%;
                .honor-info-item{
                    img{
                        width: 182px;
                        height: 182px;
                    }
                    p{
                        font-size: 14px;
                        line-height: 22px;
                    }
                }
            }
            .honorImages{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                .itemImg{
                    width: 380px;
                    margin: 0 30px 30px 0;
                    &:nth-of-type(3n){
                        margin-right: 0;
                    }
                    img{
                        width: 100%;
                        height: 210px;
                        margin-bottom: 10px;
                    }
                    p{
                        font-size: 18px;
                    }
                }
            }
        }
    }
    .partner{
        width: 100%;
        padding: 85px 0;
        background: #FCFCFC;
        text-align: center;
        .el-carousel__container{
            height: 560px;
        }
        img{
            width: 320px;
            height: 160px;
            margin: 0 20px 20px 0;
        }
        .el-carousel__button{
            width: 22px;
            height: 8px;
            border-radius: 4px;
            border: 1px solid $main-col;
            background: transparent;
        }
        .el-carousel__indicator.is-active{
            .el-carousel__button{
                background: $main-col;
            }
        }
        .el-carousel__indicators--outside button{
            opacity: 1;
        }
    }
    .aboutUs{
        width: 100%;
        height: 230px;
        background-image: url('../../assets/images/home/aboutUs.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        text-align: center;
        overflow: hidden;
        p{
            color: #fff;
            font-size: 32px;
            margin: 50px 0 20px 0;
        }
        .white-btn{
            width: 176px;
            height: 60px;
            font-size: 20px;
            border-radius: 6px;
        }
    }
    .footer{
        background: #373D44;
        color: #DEDEDE;
        .middleStyle{
            padding: 70px 0 56px 0;
            display: flex;
            justify-content: space-between;
            .ewmImg{
                max-width: 240px;
                p{
                    font-size: 14px;
                    margin: 24px 0;
                    line-height: 24px;
                }
            }
            .navigationStyle{
                width: 40%;
                display: flex;
                justify-content: space-between;
                .faster{
                    max-width: 100px;
                    li{
                        line-height: 52px;
                        &:first-child{
                            margin-top: -8px;
                        }
                    }
                }
                .contact{
                    max-width: 200px;
                    li{
                        margin-top: 30px;
                        display: flex;
                        line-height: 28px;
                        &:first-child{
                            margin-top: 0;
                        }
                        >div{
                            margin-top: -4px;
                            float: 1;
                        }
                        img{
                            width: 24px;
                            height: 24px;
                            margin-right: 8px;
                        }
                    }
                }
                ul li:first-child{
                    font-size: 20px;
                    font-weight: 900;
                }
                li{
                    cursor: pointer;
                    .tel{
                        font-size: 18px;
                        font-weight: 900;
                    }
                    &:hover{
                        color: #fff;
                        &:first-child{
                            color: #DEDEDE;
                        }
                    }
                }
            }
        }
        .copyright{
            text-align: center;
            border-top: 1px solid #464646; 
            color: #999;
            padding: 30px 0;
            font-size: 12px;
        }
    }
}
</style>