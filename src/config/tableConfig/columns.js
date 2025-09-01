const user =[
    {
        title: '头像',
        dataIndex: 'avatar',
        key: 'avatar',
        fixed: 'left'
    },
    {
        title: 'ID',
        dataIndex: 'userId',
        key: 'userId'
    },
    {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName',
    },
 
    {
        title: '手机号',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
    },
    {
        title: '余额（魔力币）',
        dataIndex: 'magicCoin',
        key: 'magicCoin',
    },
    {
        title: '累计提现金额（元）',
        dataIndex: 'alreadyBalance',
        key: 'alreadyBalance',
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    {
        title: '邀请码',
        dataIndex: 'invitationCode',
        key: 'invitationCode',
    },
    {
        title: '邀请人数',
        dataIndex: 'inviteNum',
        key: 'inviteNum',
    },
    {
        title: '查看邀请用户',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right'
    }
]
const merchant =[
    {
        title: '头像',
        dataIndex: 'avatar',
        key: 'avatar',
        fixed: 'left'
    },

    {
        title: '商户昵称',
        dataIndex: 'nickName',
        key: 'nickName', 
    },
    // {
    //     title: '邮箱',
    //     dataIndex: 'email',
    //     key: 'email',  
    // },
    {
        title: '手机号',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',  
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',  
    },
    {
        title: '余额',
        dataIndex: 'magicCoin',
        key: 'magicCoin',   
    },
    // {
    //     title: '是否是灰度测试用户',
    //     dataIndex: 'action',
    //     key: 'action',
    // }
]

const recharge =[
    {
        title: '订单号',
        dataIndex: 'rechargeNo',
        key: 'rechargeNo',
        width: 280,
    },
    {
        title: '手机号',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
    },
    {
        title: '充值金额',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: '魔力币',
        dataIndex: 'magicCoin',
        key: 'magicCoin',
    },
    {
        title: '渠道',
        dataIndex: 'payChannel',
        key: 'payChannel',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '订单创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },
    {
        title: '支付成时间',
        dataIndex: 'payTime',
        key: 'payTime',
    },
    {
        title: '支付失败的原因',
        dataIndex: 'failReason',
        key: 'failReason',
    }
]
const withdrawal =[
    {
        title: '订单号',
        dataIndex: 'withdrawNo',
        key: 'withdrawNo',
        width: 180, // 订单号需要足够宽度
        fixed: 'left'
    },
    {
        title: '手机号',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        width: 140, // 手机号固定宽度
    },
    {
        title: '魔力币',
        dataIndex: 'magicCoin',
        key: 'magicCoin',
        width: 100, // 数字列可以窄一些
    },
    {
        title: '实际到账金额',
        dataIndex: 'amount',
        key: 'amount',
        width: 120, // 金额列适中宽度
    },
    {
        title: '提现渠道',
        dataIndex: 'channel',
        key: 'channel',
        width: 100, // 图标列可以窄一些
    },
    {
        title: '银行账户信息',
        dataIndex: 'bankAccount',
        key: 'bankAccount',
        width: 200, // 长文本需要更多宽度
    },
    {
        title: '收款账号',
        dataIndex: 'withdrawAccount',
        key: 'withdrawAccount',   
        width: 180, // 账号需要足够宽度
    },
    {
        title: '第三方交易号',
        dataIndex: 'thirdPartyTxNo',
        key: 'thirdPartyTxNo',     
        width: 200, // 长文本需要更多宽度
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status', 
        width: 100, // 状态标签列可以窄一些
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 160, // 时间列需要足够宽度
    },
    {
        title: '提现完成时间',
        dataIndex: 'completedTime',
        key: 'completedTime',
        width: 160, // 时间列需要足够宽度
    },
    {
        title: '提现失败原因',
        dataIndex: 'reason',
        key: 'reason',
        width: 200, // 长文本需要更多宽度
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 120, // 操作按钮列适中宽度
        fixed: 'right'
    }
]
const cost =[
    {
        title: '费用名称',
        dataIndex: 'configName',
        key: 'configName',
    },
    {
        title: '费用描述',
        dataIndex: 'configDesc',
        key: 'configDesc',
    },
    {
        title: 'ID',
        dataIndex: 'configKey',
        key: 'configKey', 
    },
    {
        title: '费用值',
        dataIndex: 'configValue',
        key: 'configValue', 
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime', 
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right'
    }
]
const feedbackTable =[
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '用户ID',
        dataIndex: 'userId',
        key: 'userId',
    },
    {
        title: '反馈内容',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: '联系方式',
        dataIndex: 'contact',
        key: 'contact',
    },
    {
        title: '是否处理',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '反馈时间',
        dataIndex: 'createTime',
        key: 'createTime'
    },
    {
        title: '图片列表',
        dataIndex: 'imageUrlsList',
        key: 'imageUrlsList'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right'
    }
]
export const TableConfig ={
    user,
    merchant,
    recharge,
    withdrawal,
    cost,
    feedbackTable
}
