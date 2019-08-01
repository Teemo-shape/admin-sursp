export default {
    methods: {
        routerLink(path,params,params2){
            if(params){
                // this.$router.push({path: path+`/${params}/${params2}`})
                this.$router.push({path: path , query:params})
            }else{
                this.$router.push({path:path})
            }
        },
        checkPhone: function (tel) {
            let reg = /^0?1[3|4|5|7|8][0-9]{9}$/;
            return reg.test(tel)
        },
        // 去掉相同的数组
        distinct(a, b, type) {
            let arr = a.concat(b);
            for (let i=0, len=arr.length; i<len; i++) {
                for (let j=i+1; j<len; j++) {
                    if(type==4){
                        if (arr[i].taskId == arr[j].taskId) {
                            arr.splice(j, 1);
                            // splice 会改变数组长度，所以要将数组长度 len 和下标 j 减一
                            len--;
                            j--;
                        }
                    }else if(type==2){
                        if (arr[i].skuId == arr[j].skuId) {
                            arr.splice(j, 1);
                            // splice 会改变数组长度，所以要将数组长度 len 和下标 j 减一
                            len--;
                            j--;
                        }
                    }else if(type==2){
                        if (arr[i].activityId == arr[j].activityId) {
                            arr.splice(j, 1);
                            // splice 会改变数组长度，所以要将数组长度 len 和下标 j 减一
                            len--;
                            j--;
                        }
                    }
                    
                }
            }
            return arr
        },
        // 获取上周、本周、下周的时间
        getTime(n) {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDay(); //返回星期几的某一天;
            n = day == 0 ? n + 6 : n + (day - 1)
            now.setDate(now.getDate() - n);
            var date = now.getDate();
            var s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
            return s;

            // //上周的开始时间
            // console.log(getTime(7));
            // //上周的结束时间
            // console.log(getTime(1));
            // //本周的开始时间
            // console.log(getTime(0));
            // //本周的结束时间
            // console.log(getTime(-6));
            // //下周的开始时间
            // console.log(getTime(-7));
            // //下周结束时间
            // console.log(getTime(-13));
        }
    }
}