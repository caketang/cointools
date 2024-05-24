"use client";
import React, { useState, useEffect } from "react";
import { Button, Table, Typography } from "antd";

const { Paragraph, Text } = Typography;
import type { TableColumnsType } from "antd";
import axios from "axios";
import { formatEther } from "ethers";
import ModalBox from "./modal";
import { DeleteOutlined, SyncOutlined } from "@ant-design/icons";
import { useLocalStorage } from "@uidotdev/usehooks";

interface DataType {
  key: React.Key;
  zksBalance: string;
  zksTx: number;
  address: string;
  ethBanlance?: string;
  ethTx?: number;
}
interface ReponseDataItem {
  id: number;
  jsonrpc: string;
  result: string;
}
interface ReponseData {
  zks: ReponseDataItem[];
  eth: ReponseDataItem[];
}
interface AxiosAllData {
  address: string;
  data: ReponseData;
}
let local: DataType[] = [];

// 默认数据
// https://rpc.ankr.com/eth

//0x9398ae733e9d9139d91083d6fb14c9e239a40f81
const Example: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [addresLocal, setAddresLocal] = useLocalStorage(
    "use-address",local ?? []
  );
  const columns: TableColumnsType<DataType> = [
    {
      title: "序号",
      dataIndex: "key",
    },
    {
      title: "地址",
      dataIndex: "address",
      render: (_, record) => <Paragraph copyable>{record.address}</Paragraph>,
    },
    {
      title: "zksync era",
      children: [
        { title: "ETH", dataIndex: "zksBalance" },
        { title: "TX数", dataIndex: "zksTx" },
      ],
    },
    {
      title: "ETH ",
      children: [
        { title: "ETH", dataIndex: "ethBanlance" },
        { title: "TX数", dataIndex: "ethTx" },
      ],
    },
    {
      title: "操作",
      key: "address",
      fixed: "right",
      render: (_, record) => (
        <>
          {" "}
          <Button
            onClick={() => onRefreshSingleAddress(record.address)}
            type="primary"
            shape="circle"
            icon={<SyncOutlined />}
          />{" "}
          <Button
            type="primary"
            onClick={() => onDeleteAddress(record.address)}
            shape="circle"
            icon={<DeleteOutlined />}
          />{" "}
        </>
      ),
    },
  ];
  //setAddressdata([...addresLocal])
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const onRefreshSingleAddress = async (address: string) => {
    let data = await getData(address);

    setAddresLocal((pre = []) => {
      let index = pre.findIndex((item) => item.address === address);
      if (index !== -1) {
        let obj = {
          key: index,
          address,
          zksTx: parseInt(data.zks[1].result, 16),
          zksBalance: formatEther(data.zks[0].result),
          ethTx: parseInt(data.eth[1].result, 16),
          ethBanlance: formatEther(data.eth[0].result),
        };
        pre.splice(index, 1, obj);
      }
      return [...pre];
    });
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const onOK = async (e: string) => {
    setAddress(e);
  };

  // add addressquery
  const getData = async (e: string): Promise<ReponseData> => {
    const res = await axios.post(
      "https://zksync-era.blockpi.network/v1/rpc/public",
      [
        {
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBalance",
          params: [e, "latest"],
        },
        {
          jsonrpc: "2.0",
          id: 2,
          method: "eth_getTransactionCount",
          params: [e, "latest"],
        },
      ]
    );
    const ress = await axios.post("https://rpc.ankr.com/eth", [
      {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [e, "latest"],
      },
      {
        jsonrpc: "2.0",
        id: 2,
        method: "eth_getTransactionCount",
        params: [e, "latest"],
      },
    ]);
    return { zks: res.data, eth: ress.data };
  };

  function getInfo(address: string):Promise<AxiosAllData> {
    return new Promise(async (resolve) => {
      let data = await getData(address);
      resolve({ data, address });
    });
  }
  const onDeleteAddress = (address: string) => {
    let index = addresLocal?.findIndex((item:DataType) => item.address === address);
    addresLocal?.splice(index as number, 1);
    setAddresLocal([...addresLocal]);
  };
  const hadnleData = async (arrAd: string[], select: boolean=false) => {
    let promises = arrAd.map((item, index) => {
      return getInfo(item);
    });
    Promise.all(promises)
      .then((allData) => {
        allData.forEach((item) => {
            debugger
            let index = addresLocal?.findIndex((e:DataType) => e.address === item.address);
           
            if (index == -1) {
              let obj = {
                key: addresLocal?.length,
                address: item.address,
                zksTx: parseInt(item.data.zks[1].result, 16),
                zksBalance: formatEther(item.data.zks[0].result),
                ethTx: parseInt(item.data.eth[1].result, 16),
                ethBanlance: formatEther(item.data.eth[0].result),
              }
                addresLocal?.push(obj);
             
            } else {
              let obj = {
                key: index,
                address: item.address,
                zksTx: parseInt(item.data.zks[1].result, 16),
                zksBalance: formatEther(item.data.zks[0].result),
                ethTx: parseInt(item.data.eth[1].result, 16),
                ethBanlance: formatEther(item.data.eth[0].result),
              }
                addresLocal?.splice(index,1,obj)
            }
           
         
        });
        setAddresLocal([...addresLocal])
       if(select){
        setSelectedRowKeys([])
        setLoading(false);
       }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (address) {
      let arrAd:string[] = [...new Set<string>(address.split("\n"))];
      hadnleData(arrAd);
    }
  }, [address]);
  const hasSelected = selectedRowKeys.length > 0;
  const start = () => {
    setLoading(true);
    let selectedID = addresLocal 
      ?.filter((item, index) => selectedRowKeys.includes(index))
      .map((item) => item.address);
    // ajax request after empty completing
    hadnleData(selectedID, true);
    
  };
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <ModalBox onChange={onOK} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={start}
          disabled={!hasSelected}
          loading={loading}
        >
          Reload
        </Button>
      </div>
      <Table
        bordered
        rowSelection={rowSelection}
        columns={columns}
        dataSource={addresLocal}
      />
    </div>
  );
};
function App() {
  return <Example />;
}
export default App;
