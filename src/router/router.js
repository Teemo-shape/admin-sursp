import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'
import { getUserName} from '@/api/api.js'
import Bus from '../components/common/bus.js'

Vue.use(Router)

// 路由懒加载
const getComponent = (name) => () => import(`@/components/page/${name}.vue`);
const getComponent2 = (name, component) => () => import(`@/components/page/${name}/${component}.vue`);


const myRouter = new Router({
  routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/commonHead.vue'], resolve),
            meta: { title: '公共头部' },
            children:[
                { path: '/', redirect: '/home' },
                { path:'/home', component:getComponent('home'), meta: { title: '首页' } },
                { path:'/login', component:getComponent('login'), meta: { title: '登录' } },
                {
                    path: '/menu',
                    component: getComponent('menu'),
                    children:[
                        { path: '/', redirect: '/access' },
                        // 权益运营
                        { path:'/productList1', component:getComponent2('equityRun','productList1'), meta: { title: '上架商品列表' } },
                        { path:'/productList2', component:getComponent2('equityRun','productList2'), meta: { title: '待上架商品列表' } },
                        { path:'/access', component:getComponent2('equityRun','access'), meta: { title: '商城概况' } },
                        { path:'/orderList', component:getComponent2('equityRun','orderList'), meta: { title: '订单列表' } },
                        { path:'/decorate', component:getComponent2('equityRun','decorate'), meta: { title: '店铺装修' } },
                        { path:'/intoProduct', component:getComponent2('equityRun','intoProduct'), meta: { title: '导入商品' } },
                        { path:'/afterSaleOpenOrder', component:getComponent2('equityRun','afterSaleOpenOrder'), meta: { title: '发货列表' } },
                        { path:'/afterSaleList', component:getComponent2('equityRun','afterSaleList'), meta: { title: '售后列表' } },
                        { path:'/addProduct', component:getComponent2('equityRun','addProduct'), meta: { title: '新增商品' } },
                        { path:'/editProduct', component:getComponent2('equityRun','editProduct'), meta: { title: '编辑商品' } },
                        { path:'/test', component:getComponent2('equityRun','test'), meta: { title: '新增商品' } },

                        // 营销运营
                        { path:'/activityList', component:getComponent2('marketingRun','activityList'), meta: { title: '活动列表' } },
                        { path:'/activityAdd', component:getComponent2('marketingRun','activityAdd'), meta: { title: '新增活动' } },
                        { path:'/activityRuleList', component:getComponent2('marketingRun','activityRuleList'), meta: { title: '活动规则列表' } },
                        { path:'/activityGiftList', component:getComponent2('marketingRun','activityGiftList'), meta: { title: '活动奖品列表' } },
                        { path:'/activityGiftAdd', component:getComponent2('marketingRun','activityGiftAdd'), meta: { title: '新增活动奖品' } },
                        { path:'/activityRecordList', component:getComponent2('marketingRun','activityRecordList'), meta: { title: '抽奖记录列表' } },

                        // 设置
                        { path:'/memberList', component:getComponent2('system','memberList'), meta: { title: '会员列表' } },
                        { path:'/roleAdd', component:getComponent2('system','roleAdd'), meta: { title: '新增角色' } },
                        { path:'/roleList', component:getComponent2('system','roleList'), meta: { title: '角色列表' } },
                        { path:'/adminList', component:getComponent2('system','adminList'), meta: { title: '管理员列表' } },
                        { path:'/adminAdd', component:getComponent2('system','adminAdd'), meta: { title: '新增管理员' } },
                        { path:'/configList', component:getComponent2('system','configList'), meta: { title: '系统设置' } },
                        { path:'/configLog', component:getComponent2('system','configLog'), meta: { title: '操作日志' } },
                        { path:'/task', component:getComponent2('system','task'), meta: { title: '任务设置' } },
                        { path:'/rights', component:getComponent2('system','rights'), meta: { title: '权益设置' } },
                        { path:'/integral', component:getComponent2('system','integral'), meta: { title: '积分设置' } },
                        { path:'/documents', component:getComponent2('system','documents'), meta: { title: '文档中心' } },
                    ]
                },
            ]
        },
    ]
})

//判断是否登录
myRouter.beforeEach((to, from, next) => {
    window.document.title = to.meta.title;
    if(to.path!='/home'){
        getUserName().then(res=>{
            if(res.data!=null&&res.data!=''){
                store.commit('saveLoginStatus',true)
                Bus.$emit('loginName',res.data)
            }else{
                store.commit('saveLoginStatus',false)
                Bus.$emit('loginName','')
                next('/login')
            }
        })
    }
    next()
})

export default myRouter
