export const MenuMagic =[
    {
        label:'首页',
        key:'/home',
        title:'首页',
        icon:'HomeOutlined'
    },
    {
        label:'账户管理',

        key:'/account',
        title:'账户管理',
        icon:'ContactsOutlined',
        children:[
            {
                label:'用户管理',
                key:'/user',
                title:'用户管理',
                icon:'UserOutlined'
            },
            {
                label:'商户管理',
                key:'/merchant',
                title:'商户管理',
                icon:'ShopOutlined'
            }
        ]
    },
    {
        label:'交易记录',
        key:'/record',
        title:'交易记录',
        icon:'TransactionOutlined',
        children:[
            {
                label:'充值记录',
                key:'/recharge',
                title:'充值记录',
                icon:'PlusCircleOutlined'
            },
            {
                label:'提现记录',
                key:'/withdrawal',
                title:'提现记录',
                icon:'MinusCircleOutlined'
            }
        ]
    },
    {
        label:'发票管理',
        key:'/invoice',
        title:'发票管理',
        icon:'FileTextOutlined'
    },
    {
        label:'平台配置',
        key:'/platform',
        title:'平台配置',
        icon:'SettingOutlined',
        children:[
            {
                label:'常规配置',
                key:'/conventional',
                title:'常规配置',
                icon:'ControlOutlined'
            },
            {
                label:'费用配置',
                key:'/cost',
                title:'费用配置',
                icon:'DollarOutlined'
            }
            // {
            //     label:'App配置',
            //     key:'/permission',
            //     title:'App配置',
            //     icon:'KeyOutlined'
            // }

        ]
    },
    {
        label:'意见反馈',
        key:'/feedback',
        title:'意见反馈',
        icon:'MessageOutlined'
    },
    {
        label:'导出抖音数据',
        key:'/dyData',
        title:'导出抖音数据',
        icon:'TikTokOutlined'
    }

]