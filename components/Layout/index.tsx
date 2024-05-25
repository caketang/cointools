"use client"
import React, { useState,Suspense }   from "react"
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons"
import { Button, Layout, Menu, theme } from "antd"
import { useRouter } from "next/navigation"
import styles from "./index.module.css"
import Headers from "../Header"
const { Header, Sider, Content, Footer } = Layout
import menu  from "./menu"
import NoSSR from "./NoSsr"
const Loading = ()=>{
  return <>Loading</>
}
interface IProps {
    children: React.ReactNode
    curActive: string
    defaultOpen?: string[]
}

const App: React.FC<IProps> = ({
    children,
    curActive,
    defaultOpen = ["/"],
}) => {
    const [collapsed, setCollapsed] = useState(false)
    const router = useRouter()

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()
    let arr = [curActive]
    const handleSelect = (row: { key: string,keyPath: string[] }) => {
        console.log(row)
        router.push(row.key)
        arr = row.keyPath
       
    }
    
    const onOpenChange = (openKeys:string[]) => {
       console.log(openKeys)
        
    };
    return (
        <Layout className={styles.layoutStyle}>
            <NoSSR>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className={styles.logo} />
                <Menu
                    theme="dark"
                    mode="inline"
                    onOpenChange={onOpenChange}
                    defaultSelectedKeys={['/']}
                    defaultOpenKeys={['/']}
                    selectedKeys={[curActive]}
                    onClick={handleSelect}
                    items={menu}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        display: "flex",
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                        }}
                    />
                    <Headers />
                </Header>
                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        maxHeight: 'calc(100vh - 64px)',
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflowY:'scroll'
                    }}
                >
                  <Suspense fallback={<Loading />}>
                    {children}
                  </Suspense>
                    
                </Content>
                {/* <Footer style={{ textAlign: "center" }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer> */}
            </Layout>
            </NoSSR>
        </Layout>
    )
}

export default App
