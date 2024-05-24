import { useState } from "react"
import { Modal, Input, Button } from "antd"
const { TextArea } = Input
interface ModalProps {
    onChange: (a: string) => void
}
const ModalE: React.FC<ModalProps> = (prpos) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [address, setAddress] = useState<string>("")
    const { onChange } = prpos
    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleOk = () => {
        setIsModalOpen(false)
        onChange(address)
        setAddress("")
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }
    return (
        <>
            <Button type="primary" onClick={showModal} loading={loading}>
                批量添加钱包
            </Button>
            <Modal
                title="添加地址"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <TextArea
                    value={address}
                    onInput={(e) => {
                        setAddress(e.currentTarget.value)
                    }}
                    rows={10}
                    placeholder="每行输入一个地址"
                    maxLength={6000}
                />
            </Modal>
        </>
    )
}

export default ModalE
