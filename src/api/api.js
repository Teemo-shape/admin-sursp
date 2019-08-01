import {get,post} from './request';
//登陆
export const  login=(params)=>post('/login',params)
//退出登陆
export const  logout=(params)=>post('/logout',params)
//修改密码
export const  resetPassword=(params)=>post('/resetPassword',params)
//左侧菜单栏
export const  getPermissions=(params)=>post('/getPermissions',params)


//获取活动列表
export const  getActivityList=(params)=>post('/activity/getActivityList',params)
//编辑活动
export const  updateActivity=(params)=>post('/activity/updateActivity',params)
//活动开启关闭
export const  updateActivityStatuse=(params)=>post('/activity/updateActivityStatuse',params)
//活动开启关闭
export const  delActivity=(params)=>post('/activity/delActivity',params)
//获取活动类型
export const  getActivityTypeList=(params)=>post('/activity/queryActivityTypeList',params)
//获取活动规则
export const  getActivityRuleList=(params)=>post('/activity/getActivityRuleList',params)
//新增活动规则
export const  addActivityRule=(params)=>post('/activity/addActivityRule',params)
//编辑活动规则
export const  updateActivityRule=(params)=>post('/activity/updateActivityRule',params)
//删除活动规则
export const  delActivityRule=(params)=>post('/activity/delActivityRule',params)
//获取活动奖品
export const  getActivityGiftList=(params)=>post('/activity/getActivityGiftList',params)
//获取关联卡券奖品
export const  getActivityGiftPro=(params)=>post('/product/queryActivityReProductList',params)
//获取关联实物奖品
export const  getActivityGiftProduct=(params)=>post('/product/queryActivityEntityProductList',params)
//新增活动奖品
export const  addActivityGift=(params)=>post('/activity/addActivityGift',params)
//编辑活动奖品
export const  updateActivityGift=(params)=>post('/activity/updateActivityGift',params)
//删除活动奖品
export const  delActivityGift=(params)=>post('/activity/delActivityGift',params)
//获取抽奖记录列表
export const  getActivityRecordList=(params)=>post('/activity/getActivityRecordList',params)
//删除图片
export const  deleteFile=(params)=>post('/file/delete',params)
//新增活动
export const  addActivity=(params)=>post('/activity/addActivity',params)


//获取管理员列表
export const  getAdminList=(params)=>post('/admin/getAdminList',params)
//新增管理员
export const  addAdmin=(params)=>post('/admin/addAdmin',params)
//编辑管理员
export const  editAdmin=(params)=>post('/admin/editAdmin',params)
//获取角色列表
export const  getAdminPage=(params)=>post('/admin/addAdminPage',params)
//获取公司列表
export const  addCompanyPage=(params)=>post('/company/addCompanyPage',params)
//切换管理员状态
export const  enOrdisableAdmin=(params)=>post('/admin/enOrdisableAdmin',params)
//删除管理员
export const  deleteAdmin=(params)=>post('/admin/deleteAdmin',params)
//获取角色列表
export const  getList=(params)=>post('/role/getList',params)
//获取角色列表
export const  roleList=(params)=>post('/role/roleList',params)
//删除角色
export const  deleteRole=(params)=>post('/role/deleteRole',params)
//查看角色权限
export const  roleDetail=(params)=>post('/role/roleDetail',params)
//获取角色权限进行编辑
export const  updateRolePage=(params)=>post('/role/updateRolePage',params)
//角色权限编辑
export const  updateRole=(params)=>post('/role/updateRole',params)
//获取全部权限
export const  addRolePage=(params)=>post('/role/addRolePage',params)
//新增角色
export const  addRole=(params)=>post('/role/addRole',params)


//系统设置列表
export const  queryConfigs=(params)=>post('/config/queryConfigs',params)
//编辑
export const  editConfig=(params)=>post('/config/editConfig',params)
//删除
export const  deleteConfig=(params)=>post('/config/deleteConfig',params)
//新增
export const  addConfig=(params)=>post('/config/addConfig',params)
//操作日志列表
export const  logList=(params)=>post('/businessLog/logList',params)
//操作模块
export const  logType=(params)=>post('/businessLog/logType',params)


// 商城概况
export const  getlineData=(params)=>post('/access/getlineData',params)


// 权益列表
export const  queryMember=(params)=>post('/member/queryMember',params)
// 新增权益
export const  addMember=(params)=>post('/member/addMember',params)
// 编辑权益
export const  updateMember=(params)=>post('/member/updateMember',params)
// 删除权益
export const  delMemberByid=(params)=>post('/member/delMemberByid',params)
// 查询权益
export const  queryMemberById=(params)=>post('/member/queryMemberById',params)
// 查询权益对应的优惠券
export const  getProductList=(params)=>post('/member/getProductList',params)
// 查询权益对应的实物
export const  getEntityProductList=(params)=>post('/member/getEntityProductList',params)

// 会员列表
export const  getMemberList=(params)=>post('/customer/customerList',params)
// 积分明细
export const  getJingFenMingXi=(params)=>post('/customer/integralFlows',params)
// 导入用户
export const  batchImportCustomer=(params)=>post('/customer/batchImport',params)

// 订单列表
export const  getOrderList=(params)=>post('/order/queryOrderList',params)
// 查看物流
export const  getLogisticsDetail=(params)=>post('/order/logisticsDetail',params)
// 查看订单详情
export const  getOrderDetail=(params)=>post('/order/orderDetail',params)
// 发货订单列表
export const  querySendOutGoodsOrderList=(params)=>post('/order/querySendOutGoodsOrderList',params)
// 发货 上传单号
export const  updateLogistics=(params)=>post('/order/updateLogistics',params)
// 取消订单
export const  updateOrderStatus=(params)=>post('/order/updateOrderStatus',params)
// 物流公司
export const  getlogisticsName=(params)=>post('/order/getlogisticsName',params)

// 获取积分展示
export const  getInteger=(params)=>post('/company/getInteger',params)
// 积分更新
export const  updateInteger=(params)=>post('/company/updateInteger',params)

// 获取任务设置数据
export const  getTask=(params)=>post('/task/getTask',params)
// 更新任务设置
export const  updateTask=(params)=>post('/task/updateTask',
    params,
    {
        headers:{'Content-Type':"application/json;charset=UTF-8"},
        transformRequest:[
            function(data){
                data=JSON.stringify(params)
                return data
            }
        ]
    }
)
// 获取商品列表
export const  getProducts=(params)=>post('/product/getProducts',params)
// 查询商品详情
export const  getProductById=(params)=>post('/product/queryProductById',params)
// 编辑商品详情
export const  editProduct=(params)=>post('/product/editProduct',params,{
    headers:{'Content-Type':"application/json;charset=UTF-8"},
    transformRequest:[
        function(data){
            data=JSON.stringify(params)
            return data
        }
    ]
})
//商品上架
export const  updateProduct=(params)=>post('/product/update',params)
//商品下架
export const  updownProduct=(params)=>post('/product/updateShelves',params)
// 获取用户等级数据
export const  getsumUserInfo=(params)=>post('/company/getsumUserInfo',params,)
//商品推荐
export const  recommendProduct=(params)=>post('/product/recommendProduct',params)
//新增商品
export const  addProduct=(params)=>post('/product/addProduct',params,{
    headers:{'Content-Type':"application/json;charset=UTF-8"},
    transformRequest:[
        function(data){
            data=JSON.stringify(params)
            return data
        }
    ]
})
//编辑商品
export const  editSelfProduct=(params)=>post('/product/editSelfProduct',params,{
    headers:{'Content-Type':"application/json;charset=UTF-8"},
    transformRequest:[
        function(data){
            data=JSON.stringify(params)
            return data
        }
    ]
})
//获取规格
export const  getItemNorm=(params)=>post('/itemNorm/getItemNorm',params)

// 获取用户名
export const  getUserName=(params)=>post('/getUserName',params)

// 获取导入商品的供应商
export const  getPassedSupplier=(params)=>post('/supplier/getPassedSupplier',params)
// 导入商品
export const  batchImport=(params)=>post('/product/batchImport',params)


// 店铺装修列表
export const  listViewPage=(params)=>post('/viewPage/listViewPage',params)
// 店铺装修保存或者上架 
export const  saveViewPage=(params)=>post('/viewPage/saveViewPage',params,{
    headers:{'Content-Type':"application/json;charset=UTF-8"},
    transformRequest:[
        function(data){
            data=JSON.stringify(params)
            return data
        }
    ]
})

// 售后列表 
export const  queryAfterSaleList=(params)=>post('/afterSale/queryAfterSaleList',params)
// 售后订单详情
export const  afterSaleDetail=(params)=>post('/afterSale/afterSaleDetail',params)
// 售后审批
export const  verify=(params)=>post('/afterSale/verify',params)
// 确认收货
export const  confirmCollect=(params)=>post('/afterSale/confirmCollect',params)
// 填写物流信息
export const  updateLogisticsInfo=(params)=>post('/afterSale/updateLogisticsInfo',params)
// 实时概况
export const  getDataStatisticsList=(params)=>post('/dataStatistics/getDataStatisticsList',params)
// 获取连接
export const  getUrl=(params)=>post('/viewPage/getUrl',params)