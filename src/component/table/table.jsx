import Pagination from "../common/Pagination";
import { useState, useEffect } from "react";
import { Table } from "antd";
// import "./table.scss";
import { getTableData } from "../../apis/tableApius";
import { debounce } from '../../utils/index'
import Empty from "../common/Empty";
function MyTable({ address, t }) {
  const columns = [
    { key: "createTime", title: "请求时间", dataIndex: "createTime" },
    { key: "tokenAddress", title: "报错来源地址", dataIndex: "tokenAddress" },
    { key: "value", title: "报错类型", dataIndex: "value", filters: [
      { text: '负载均衡', value: '负载均衡' }, 
      { text: '网络通信', value: '网络通信' },
      { text: '依赖关系', value: '依赖关系' }
    ] },
    { key: "token20Name", title: "错误详情", dataIndex: "token20Name",  },
  ];
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([
    // {createTime: '2024-07-04 10:18', tokenAddress: '0xe283d0e3b8c102badf5e8166b73e02d96d92f688', value: '负载均衡', token20Name: 'Load balancing algorithm error"（负载均衡算法错误）...'},
    {createTime: '2024-07-14 14:53', tokenAddress: '0xe283d0e3b8c102badf5e8166b73e02d96d92f688', value: '网络通信', token20Name: ' Connection timed out"（连接超时）...'},
    // {createTime: '2024-07-16 08:57', tokenAddress: '0x0cae2c281209309c8d0d5084bc8812f3835968ca', value: '依赖关系', token20Name: '""Dependency resolution error"（依赖解析错误）...'},
    {createTime: '2024-07-17 20:15', tokenAddress: '0xe283d0e3b8c102badf5e8166b73e02d96d92f688', value: '网络通信', token20Name: ' "Connection timed out"（连接超时）...'},
  ]);
  const [totalNum, setTotalNum] = useState(0);  
  const [reqData, setReqData] = useState({})
  const onPageChange = (pageNum) => {
    setReqData({
      ...reqData,
      pageNum
    })
  };
  useEffect(() => {
    setReqData({
      pageNum: 1,
      pageSize: 20,
      tokenAddress: address,
    })
  }, [address])

  const initData = debounce(() => {
    setLoading(true);
    if (!Object.keys(reqData).length) return;
    getTableData(reqData)
      .then((data) => {
        setTotalNum(data.count)
        const _data = data.data.map((it) => {
          return {
            key: it.id,
            ...it,
          };
        });
        setData(_data);
      })
      .finally(() => {
        setLoading(false);
      });
  })

  useEffect(() => {
    initData();
  }, [reqData]);

  return (
    <div className="table-container text-text bg-[#262727] w-full h-calc">
      <div className="h-full overflow-hidden flex flex-col px-4 pb-2">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          // loading={loading}
          scroll={{ y: "calc(100% - 55px)" }}
          locale={{ emptyText: <Empty t={t}></Empty>}}
        />
        <Pagination
          currentPage={reqData.pageNum}
          total={totalNum}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

export default MyTable;
