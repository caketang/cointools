import {
   
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons"
const menu = [
    {
        key: "/",
        id:'/',
        icon: <UserOutlined />,
        label: "首页",
    },
    {
        key: "/dashboard",
        id:'/dashboard',
        icon: <UserOutlined />,
        label: "面板",
    },
    {
        key: "/cex",
        id:'/cex',
        icon: <VideoCameraOutlined />,
        label: "交易所批量提现",
        children: [
            { key: '/cex/withdrawOkx', id:'/cex/withdrawOkx', label: 'Okx 批量提现' },
            { key: '/cex/withdrawBn', id:'/cex/withdrawBn', label: 'Bianace 批量提现' },           
          ],
    },
    {
        key: "/l2",
        id:'/l2',
        icon: <UploadOutlined />,
        label: "撸毛钱包管理",
       
    },
]
export default menu