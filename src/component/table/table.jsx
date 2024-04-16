import Pagination from "../common/Pagination";
import { useState } from "react";
import { Table } from "antd";
import "./table.scss";
const columns = [
  { key: "name", title: "Name", dataIndex: "name" },
  { key: "birth", title: "Date of Birth", dataIndex: "birth" },
  { key: "role", title: "Role", dataIndex: "role" },
  { key: "salary", title: "Salary", dataIndex: "salary" },
];
const obj = {
  name: "John Doe",
  birth: "24/05/1995",
  role: "Web Developer",
  salary: "$120,000",
};

const data = Array.from({ length: 35 }, () => obj);
function MyTable() {
  const totalPages = 10;
  const [currentPage, setPage] = useState(1);
  const [loading, setLoading] = useState(false)
  const onPageChange = (pageNum) => {
    setPage(pageNum);
  };

  return (
    <div className="table-container text-text bg-[#262727] w-full h-calc">
      <div className="h-full overflow-hidden flex flex-col px-4 pb-6">
        <Table
          className="flex-1"
          dataSource={data}
          columns={columns}
          pagination={false}
          loading={loading}
          scroll={{ y: "calc(100% - 55px)" }}
        />
        ;
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
