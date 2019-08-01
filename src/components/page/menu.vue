<template>
    <div class='menu middleEare'>
        <div class="menu-l">
            <div class="icon-bigMenu">
                <span class="iconfont" :class="bigIcon"></span>
                <div>{{bigName}}</div>
            </div>
            <el-menu
                :default-active="activeIndex"
                class="el-menu-vertical-demo"
                :unique-opened="true"
                :default-openeds="openeds"
                @select="handleSelect"
                @open="handleOpen"
                active-text-color="#287BD6">
                <template v-for="(item,index) in leftData" >
                    <template v-if="item.childPermissions!=null&&item.childPermissions.length!=0">
                        <el-submenu :index="String(index)">
                            <template slot="title">
                                <i class="iconfont" :class="item.icon"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item 
                                :index="String(subindex)" 
                                v-for="(subitem,subindex) in item.childPermissions"
                                :class="{isChecked:subitem.isChecked}"
                                @click="goPage(subitem.href,item.name,subitem.name,index,subindex)">
                                {{subitem.name}}
                            </el-menu-item>
                        </el-submenu>
                    </template>
                    <template v-else>
                        <el-menu-item :index="String(index)" class="nochild" :class="{isChecked:item.isChecked}" @click="goPage(item.href,item.name,'',index,'')">
                            <i class="iconfont" :class="item.icon"></i>
                            <span slot="title">{{item.name}}</span>
                        </el-menu-item>
                    </template>
                </template>
            </el-menu>
        </div>
        <div class="menu-r">
            <router-view></router-view>
        </div>
    </div>
</template>
   
   
<script>
import { getPermissions,getUserName } from '@/api/api.js'
import Bus from '../common/bus.js'
export default {
    data() {
        return {
            bigMenu:[
                {name:'首页',icon:''},
                {name:'权益设置',icon:'icondaohangtiao-shezhi'},
                {name:'营销设置',icon:'icondaohangtiao-yingxiaoguanli'},
                {name:'权益服务',icon:'icondaohangtiao-quanyiguanli'},
            ],
            activeIndex:'',//当前激活菜单的index
            leftData:[],
            bigIcon:'',
            bigName:'',
            openeds:['0'],//默认打开的数组
        }
    },
    created() {
        let type = this.$route.query.id
        if(type==null||type==''){
            // 刷新页面定位左侧菜单栏
            type = localStorage.getItem('type')
        }
        // 修改顶上菜单栏的顺序 0首页 1设置 2营销 3商品订单
        if(type==1){
            type = 3
        }else if(type==3){
            type = 1
        }
        this.bigIcon = this.bigMenu[type].icon
        this.bigName = this.bigMenu[type].name
        this.getPermissions(type)
    },
    methods: {
        // 获取左侧菜单栏
        getPermissions(val){
            getUserName().then(response=>{
                getPermissions({username:response.data,type:val}).then(res=>{
                    this.leftData = res.data
                    this.leftData.forEach((item,index)=>{
                        item.isChecked = false
                        if(item.childPermissions!=null&&item.childPermissions.length!=0){
                            item.childPermissions.forEach((subitem,subindex)=>{
                                subitem.isChecked = false
                                // 刷新页面定位左侧菜单栏
                                if(this.$route.path==subitem.href){
                                    this.leftData[index].childPermissions[subindex].isChecked = true
                                    this.activeIndex = String(index)
                                }
                            })
                        }else{
                            // 刷新页面定位左侧菜单栏
                            if(this.$route.path==item.href){
                                this.leftData[index].isChecked = true
                            }
                        }
                    })
                })
            })
        },
        // 点击菜单跳转
        handleSelect(index,indexPath){},
        // 跳转页面
        goPage(path,twoName,threeName,v1,v2){
            window.scrollTo(0, 0)
            this.leftData.forEach(p1=>{
                if(p1.childPermissions!=null&&p1.childPermissions.length!=0){
                    p1.childPermissions.forEach(p2=>{
                        p2.isChecked = false
                    })
                }else{
                    p1.isChecked = false
                }
            })
            if(this.leftData[v1].childPermissions!=null&&this.leftData[v1].childPermissions.length!=0){
                this.leftData[v1].childPermissions[v2].isChecked = true
            }else{
                this.leftData[v1].isChecked = true
            }
            Bus.$emit('twoName',twoName)
            Bus.$emit('threeName',threeName)

            if(path=='/access'){
                this.routerLink(path,{id:1})
            }else if(path=='/activityRuleList'){
                this.routerLink(path,{id:2})
            }else if(path=='/memberList'){
                this.routerLink(path,{id:3})
            }else{
                this.routerLink(path)
            }
        },
        handleOpen(index,indexPath){},
    },
    watch: {
        $route(to,from){
            let id = to.query.id
            if(id!=null&&id!=''){
                this.bigIcon = this.bigMenu[id].icon
                this.bigName = this.bigMenu[id].name
                // 修改顶上菜单栏的顺序 0首页 1设置 2营销 3商品订单
                if(id==1){
                    id = 3
                }else if(id==3){
                    id = 1
                }
                this.getPermissions(id)
                Bus.$emit('oneName',this.bigMenu[id].name)
            }
        },
    }
}
</script>
   
<style lang='scss'>
.menu{
    min-height: 950px;
    .menu-l{
        width: 180px;
        background: #fff;
        margin-right: 10px;
        .icon-bigMenu{
            text-align: center;
            margin-top: 30px;
            margin-bottom: 30px;
            color: $main-col;
            .iconfont{
                font-size: 56px;
                background: linear-gradient(-55deg,#337eff,#75a7ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }
    .menu-r{
        background: #fff;
        min-width: 1010px;
        max-width: 1290px;
        position: relative;
        flex: 1;
    }
}
.el-menu{
    border: none;
    .el-submenu__title{
        height: 50px;
        line-height: 50px;
        &:hover{
            background: #FFF;
        }
        i{
            color: #555;
            font-size: 20px;
            margin-right: 10px;
        }
        .el-submenu__icon-arrow{
            font-size: 14px;
            margin-right: 0;
            font-weight: 900;
        }
    }
    .is-opened .el-submenu__title{
        color: $main-col !important;
        i{
            color: $main-col;
        }
    }
    .nochild{
        height: 50px;
        line-height: 50px;
        min-width: 180px;
        padding-left: 20px !important;
        span{
            color: #555;
        }
        i{
            color: #555;
            font-size: 20px;
            margin-right: 10px;
        }
        &.isChecked{
            padding-left: 16px !important;
            border-left: 4px solid $main-col;
            background: rgba(40,123,214,0.1);
            color: $main-col;
            span{
                color: $main-col;
            }
            i{
                color: $main-col;
            }
        }
    }
}
.el-menu-item{
    padding-left: 55px !important;
}
.el-submenu .el-menu-item{
    padding-right: 0 !important;
    min-width: 180px;
    color: #555 !important;
    &:hover,&:focus{
        background: rgba(40,123,214,0.1);
    }
    &.isChecked{
        border-left: 4px solid $main-col;
        padding-left: 51px !important;
        background: rgba(40,123,214,0.1);
        color: $main-col;
    }
}
</style>