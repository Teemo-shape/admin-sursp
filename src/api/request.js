import axios from "axios";
import router from "../router/router";
import Qs from 'qs'
import store from '../store/store'
import {messages} from '../assets/js/common.js'
axios.defaults.timeout = 60000;
axios.defaults.withCredentials = true
let BASE_URL = '',actionUrl = '',Base_IMGPATH = '',EXPORT_URL = '',EMPORT_URL = '',BASE_URL_M = '',BASE_URL_ADMIN = ''
if(process.env.NODE_ENV == 'development'){
    Base_IMGPATH = 'http://res.duoduo13.com/'
    // Base_IMGPATH = 'http://192.168.1.78/images/'
    BASE_URL = 'http://192.168.1.152:9094/manager' //龙飞林
    // BASE_URL = 'http://192.168.1.111:8081/mall-web' //朱定升
    // BASE_URL = 'http://192.168.2.7:8091/quanFuAdmin' //夏威
    // BASE_URL = 'http://192.168.1.102:8080/mall-web' //高超
    // BASE_URL = 'http://39.108.6.22:38162/mall-web' //测试
    // BASE_URL = '/api' 

    BASE_URL_M = 'http://qftest.duoduo13.com/mp/#/home' //前端首页链接
    BASE_URL_ADMIN = 'http://192.168.1.5:8080/#/' //后台链接
    
}else if(process.env.NODE_ENV=='production'){
    // 本地测试
    Base_IMGPATH = 'http://res.duoduo13.com/'
    // BASE_URL = 'http://qftest.duoduo13.com/mall-web'
    // BASE_URL_M = 'http://qftest.duoduo13.com/mp/#/home'
    // BASE_URL_ADMIN = 'http://qftest.duoduo13.com/sursp-admin/#/'

    // 线上
    BASE_URL = 'http://qf.duoduo13.com/mall-web'
    BASE_URL_M = 'http://qf.duoduo13.com/mp/#/home'
    BASE_URL_ADMIN = 'http://qf.duoduo13.com/sursp-admin/#/'
}
actionUrl = BASE_URL + '/file/upload' //上传图片路径
EXPORT_URL = BASE_URL + '/product/exportExcel' //导出路径
EMPORT_URL = BASE_URL + '/product/importExcel' //导入路径
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.transformRequest=[function (data) {
    return Qs.stringify({...data});
}];
/*
 *请求前拦截
 *用于处理需要请求前的操作
 */
axios.interceptors.request.use(
    config => {
        store.commit('openMask')
        //添加请求头
        // if (store.state.token) {
        //     config.headers["Authorization"] = "Bearer " + store.state.token;
        // }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
/*
 *请求响应拦截
 *用于处理数据返回后的操作
 */
axios.interceptors.response.use(
    response => {
        return new Promise((resolve, reject) => {
            //请求成功后关闭加载框
            store.commit('closeMask')
            const res = response.data;
            if (res.status === 0) {
                resolve(res)
            } else{
                reject(res)
                messages("error", res.message);
            }
        })
    },
    error => {
        console.log(error)
        //请求成功后关闭加载框
        store.commit('closeMask')
        //断网处理或者请求超时
        if (!error.response) {
            //请求超时
            if (error.message.includes("timeout")) {
                console.log("超时了");
                messages("error", "请求超时，请检查互联网连接");
            } else {
                //断网，可以展示断网组件
                console.log("断网了");
                messages("error", "请检查网络是否已连接");
            }
            return;
        }
        const status = error.response.status;
        switch (status) {
            case 500:
                messages("error", "服务器内部错误");
                break;
            case 404:
                messages(
                    "error",
                    "未找到远程服务器"
                );
                break;
            case 401:
                messages("warning", "用户登陆过期，请重新登陆");
                localStorage.removeItem("token");
                setTimeout(() => {
                    router.replace({
                        path: "/login",
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                }, 1000);
                break;
            case 400:
                messages("error", "数据异常");
                break;
            default:
                messages("error", error.response.data.message);
        }
        return Promise.reject(error);
    }
);
/*
 *get方法，对应get请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params
            })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}
/*
 *post方法，对应post请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function post(url, params,config) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, params,config)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}

export default {BASE_URL,actionUrl,Base_IMGPATH,EXPORT_URL,EMPORT_URL,BASE_URL_M,BASE_URL_ADMIN }