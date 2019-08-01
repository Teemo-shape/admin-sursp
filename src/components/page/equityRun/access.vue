<template>
    <div class='proList boxs access clearfix'>
        <div class="bannerImg"><img src="@img/sit_banner.png" alt=""></div>
        <div class="dataBox box clearfix" style="width:50%;border-right:10px solid #F9F9F9;height:390px">
            <div class="dataBox-title">实时概况</div>
            <div class="dataBox-time fr">
                <!-- <span :class="{active:activeDate==2}" @click="numberAddAnim(0)">今日</span> -->
                <span :class="{active:activeDate==1}" @click="numberAddAnim(1)">昨日</span>
                <span :class="{active:activeDate==3}" @click="numberAddAnim(3)">本周</span>
                <span :class="{active:activeDate==4}" @click="numberAddAnim(4)">上周</span>
            </div>
            <div class="dataBox-number boxs clearfix">
                <div class="item fl boxs">
                    <img src="@img/see.png" alt="">
                    <div>
                        <h1 style="color:#F9742E">{{num1}}</h1>
                        <p>浏览量</p>
                    </div>
                </div>
                <div class="item fl boxs">
                    <img src="@img/fangke.png" alt="">
                    <div>
                        <h1 style="color:#0B9CFF">{{num2}}</h1>
                        <p>访客数</p>
                    </div>
                </div>
                <div class="item fl boxs">
                    <img src="@img/order.png" alt="">
                    <div>
                        <h1 style="color:#58B733">{{num3}}</h1>
                        <p>订单数</p>
                    </div>
                </div>
                <div class="item fl boxs">
                    <img src="@img/user.png" alt="">
                    <div>
                        <h1 style="color:#FFB524">{{num4}}</h1>
                        <p>注册用户数</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="dataBox box clearfix" style="width:50%;height:390px">
            <div class="dataBox-title">各等级用户概况</div>
            <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
        </div>
        <div class="dataBox box clearfix" style="border-bottom:none;width:100%;">
            <div class="dataBox-title">运营学院</div>
            <div class="dataBox-list">
                <div class="item hands" v-for="(item,index) in situationData" :key="index" @click="goWenzhang(item.path)">
                    <img :src='item.imgName' alt="">
                    <h3>{{item.title}}</h3>
                    <p class="ellipsis">{{item.desc}}</p>
                </div>
            </div>
        </div>
    </div> 
</template>
   
   
<script>
import { getsumUserInfo,getDataStatisticsList } from '@/api/api.js'
import { clearInterval } from 'timers';
export default {
    components: {
    },
    data() {
        return {
            activeDate:1,
            situationData:[
                {
                    imgName:require("@img/situation-1.png"),
                    title:"中国有12%的城市在收缩，怎么办？",
                    desc:"4月份，国家发展改革委官网发布了《2019年新型城镇化建设重点任务》，首次提到了“收缩型城市”的说法。发改委指出，收缩型中小城市要瘦身强体，转变惯性的增量规划思维，严控增量、盘活存量，引导人口和公共资源向城区集中",
                    path:"https://mp.weixin.qq.com/s?__biz=MTQzMjE1NjQwMQ==&mid=2655560287&idx=1&sn=7cbbb46f6311d40e308e96080c9e9e38&scene=0#wechat_redirect"
                },
                 {
                    imgName:require("@img/situation-2.png"),
                    title:"存量时代，看头部房企如何破局",
                    desc:"存量时代，转型是关键词。当一个国家的住房自有率超过65%、人均GDP突破8000美元、户均住房套数大于1，由增量开发主导的新房市场趋于稳定和成熟，基于二手房流通和房屋资产管理的存量时代将逐步来临。在这样的趋势下，越来越多的开发商开始多元化布局，进行战略转型，探索新的业务增长点。",
                    path:"https://www.huxiu.com/article/297102.html"
                },
                 {
                    imgName:require("@img/situation-3.png"),
                    title:"唯品会公布2018 Q4财报：活跃用户重回两位数增长，存量战场的突围战",
                    desc:"网购用户增量空间在这几年，几乎被不同平台收割殆尽，2017年整个市场月活增长是1.2亿，但是2018年前9个月，仅有0.2亿增量。流量增长在放缓，市场乏力。反之，存量市场的用户深度运营，成为了唯品会发展的关键。",
                    path:"https://baijiahao.baidu.com/s?id=1626073638500852126&wfr=spider&for=pc"
                },
                 {
                    imgName:require("@img/situation-4.png"),
                    title:"个推高级副总裁刘宇：用户存量，如何利用大数据实现精细化运营| 2018商业新生态峰会",
                    desc:"用户每个阶段都有不同的特点，针对性的运营才会使得每一个生命周期的客户得到更好的服务，也会增加它的黏性，进而增加团队的运营效力和服务产出。",
                    path:"https://36kr.com/p/5142679"
                },
            ],
            lineChartInfoX:[],//x轴数据
            lineChartInfoY:[],//y轴数据
            num1:0,
            num2:0,
            num3:0,
            num4:0,
            timer:null
        }
    },
    created() {
        this.getsumUserInfo() 
        this.numberAddAnim(1) 
    },
    mounted(){
        
    },
    methods: {
        numberAddAnim(type){
            this.activeDate = type
            let data = {
                companyId:localStorage.getItem('companyId'),
                startTime:'',
                endTime:''
            }
            if(type==1){
                let day1 = new Date();
                day1.setTime(day1.getTime()-24*60*60*1000);
                let s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
                data.startTime = s1;
                data.endTime = s1;
            }else if(type==3){
                data.startTime = this.getTime(0);
                data.endTime = this.getTime(-6);
            }else if(type==4){
                data.startTime = this.getTime(7);
                data.endTime = this.getTime(1);
            }
            getDataStatisticsList(data).then(res=>{
                if(res.data!=null&&res.data.length!=0){
                    res.data.forEach(item=>{
                        if(item.type==1){
                            this.num1 = item.totalNumber
                        }else if(item.type==2){
                            this.num2 = item.totalNumber
                        }else if(item.type==3){
                            this.num3 = item.totalNumber
                        }else if(item.type==4){
                            this.num4 = item.totalNumber
                        }
                    })
                }else{
                    this.num1 = 0
                    this.num2 = 0
                    this.num3 = 0
                    this.num4 = 0
                }
            })
        },
        getsumUserInfo(){
            getsumUserInfo().then(res=>{
                res.data.forEach(item => {
                    this.lineChartInfoX.push(item.grade);
                    this.lineChartInfoY.push(item.userNum);
                });
                this.drawLine()
            })
        },
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            let that = this
            // 绘制图表
            myChart.setOption({
                // title: { text: '在Vue中使用echarts' },
                color: ['#287BD6'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : this.lineChartInfoX,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'用户人数',
                        type:'bar',
                        barWidth: '35%',
                        data:this.lineChartInfoY
                    }
                ]
            });
        },
        goWenzhang(path){
            window.location.href=path
        }
    }
}
</script>
   
<style scoped lang='scss'>
.access{
    padding: 0;
    .bannerImg{
        width: 100%;
        max-height: 250px;
        border-bottom: 10px solid #F9F9F9;
        img{
            height: auto; 
            width: auto; 
            max-height: 100%; 
            max-width: 100%;
        }
    }
    .dataBox{
        padding: 0 20px;
        border-bottom: 10px solid #F9F9F9;
        float: left;
        .dataBox-title{
            height: 80px;
            line-height: 80px;
            font-size: 16px;
            font-weight: 900;
            border-bottom: 1px solid #eee;
        }
        .dataBox-time{
            font-size: 12px;
            margin-top: 20px;
            span{
                margin-left: 16px;
                cursor: pointer;
                &.active{
                    font-weight: 900;
                    color: $main-col;
                }
            }
        }
        .dataBox-number{
            padding: 20px;
            padding-top: 40px;
            .item{
                width: 50%;
                margin-bottom: 20px;
                padding: 30px 20px 10px 20px;
                display: flex;
                img{
                    width: 50px;
                    height: 50px;
                    border-radius: 100%;
                    display: inline-block;
                    margin-right: 10px;
                }
                p{
                    font-size: 12px;
                }
                h1{
                    font-size: 32px;
                    line-height: 36px;
                }
            }
        }
        .dataBox-list{
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            .item{
                width: 24%;
                padding-bottom: 30px;
                img{
                    // width: 100%;
                    // height: 158px;
                    display: inline-block;
                    margin-bottom: 12px;
                    height: auto; 
                    width: auto; 
                    max-height: 100%; 
                    max-width: 100%;
                }
                h3{
                    font-size: 14px;
                }
                p{
                    color: #999;
                    font-size: 14px;
                    line-height: 18px;
                }
            }
        }
    }
}
</style>