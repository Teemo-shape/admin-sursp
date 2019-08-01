<template>
  <div id="app" v-loading.fullscreen.lock="this.$store.state.fullscreenLoading" element-loading-background="rgba(0, 0, 0, 0.6)">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script type="text/babel">
    export default {
        provide(){
            return {
                reload:this.reload,
            }
        },
        data(){
            return{
                isRouterAlive:true,//刷新
            }
        },
        created(){
            //在页面刷新时将vuex里的信息保存到localStorage里
            window.addEventListener("beforeunload",()=>{
                localStorage.setItem("messageStore",JSON.stringify(this.$store.state))
            })
            
            //在页面加载时读取localStorage里的状态信息
            localStorage.getItem("messageStore") && this.$store.replaceState(Object.assign(this.$store.state,JSON.parse(localStorage.getItem("messageStore"))));
            this.$store.commit('closeMask')
        },
        methods:{
            reload(){
                this.isRouterAlive = false
                this.$nextTick(function(){
                    this.isRouterAlive = true
                })
            },
        },
        
    }
</script>

<style lang="less">
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>
