import Pagination from "../common/Pagination";
import { useState, useEffect } from "react";
import { Table } from "antd";
import "./table.scss";
import { getTableData } from "../../apis/tableApius";
import { debounce } from '../../utils/index'
import Empty from "../common/Empty";
function MyTable({ address, t }) {
  const columns = [
    { key: "tokenAddress", title: t('address'), dataIndex: "tokenAddress" },
    { key: "value", title: t('value'), dataIndex: "value" },
  ];
  const [currentPage, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const onPageChange = (pageNum) => {
    setPage(pageNum);
  };

  const initData = debounce(() => {
    setLoading(true);
    getTableData({
      pageNum: currentPage,
      pageSize: 20,
      tokenAddress: address,
    })
      .then((res) => {
        if (res.code === 200) {
          setTotalPages(Math.ceil(res.data.count / 20));
          const _data = res.data.data.map((it) => {
            return {
              key: it.id,
              ...it,
            };
          });
          setData(_data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  })
  useEffect(() => {
    initData()
  }, [currentPage, address]);
  return (
    <div className="table-container text-text bg-[#262727] w-full h-calc">
      <div className="h-full overflow-hidden flex flex-col px-4 pb-2">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          loading={loading}
          scroll={{ y: "calc(100% - 55px)" }}
          locale={{ emptyText: <Empty t={t}></Empty>}}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

export default MyTable;
