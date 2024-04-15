import Pagination from "../common/Pagination";
import { useState } from "react";
const columns = [
  { key: "name", label: "Name" },
  { key: "birth", label: "Date of Birth" },
  { key: "role", label: "Role" },
  { key: "salary", label: "Salary" },
];
const obj = {
  name: "John Doe",
  birth: "24/05/1995",
  role: "Web Developer",
  salary: "$120,000",
};

const data = Array.from({ length: 10 }, () => obj);
function Table() {
  const totalPages = 10;
  const [currentPage, setPage] = useState(1);
  const onPageChange = (pageNum) => {
    setPage(pageNum);
  };
  return (
    <div className="table-container text-text bg-[#262727] w-full h-calc">
      <div className="table-wrapper h-full py-4 mx-2 rounded-lg border border-border">
        <div className="rounded-t-lg h-full flex flex-col">
          <table className="min-w-full divide-y-2 divide-border text-sm flex-1">
            <thead className="ltr:text-left rtl:text-right text-left">
              <tr>
                {columns.map((col) => {
                  return (
                    <th
                      key={col.key}
                      className="whitespace-nowrap px-4 py-2 font-700 text-[#A3A6Ad]"
                    >
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="w-full h-full divide-y divide-border">
              {data.map((item, index) => (
                <tr
                  className="hover:bg-[#141414] bg-slate-800 max-h-10"
                  key={index}
                >
                  {columns.map((column) => (
                    <td
                      className="whitespace-nowrap px-4 py-2 text-white max-h-10"
                      key={column.key}
                    >
                      {item[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Table;
