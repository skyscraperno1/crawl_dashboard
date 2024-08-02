import styled from "styled-components";
import { Input, Table, Pagination } from "antd";
import { useState, useEffect } from "react";
import { getProjectPage } from "../../apis/dashBoardApis";
const Heading = styled.h1`
  height: 100px;
  line-height: 100px;
`;
const Main = styled.main`
  min-height: calc(100vh - 180px);
  margin: 0 auto;
`;
const RestTable = styled.div`
  .ant-table-wrapper {
    margin-top: 20px;
    .striped-row {
      background-color: #303135;
    }
  }
  .ant-pagination {
    margin: 16px 0;
    color: #fff!important;
  }
`;
const OverallCase = ({ t }) => {
  const inlineStyle = {
    width: "485px",
  };
  const columns = [
    { key: "name", title: t("name"), dataIndex: "name" },
    { key: "liquidity", title: t("liquidity"), dataIndex: "createTime" },
    { key: "liquidityChange", title: t("liquidityChange"), dataIndex: "liquidityChange", render: (text) => (
      text.split('%')[0] <= 0 
        ? <div className="text-green-500">{text}</div> 
        : <div className="text-red-500">{text}</div>
    )  },
    { key: "token", title: t("token"), dataIndex: "token", ellipsis: true },
    { key: "pair", title: t("pair"), dataIndex: "pair", ellipsis: true },
    { key: "today", title: t("date"), dataIndex: "today" },
    { key: "net", title: t("net"), dataIndex: "net" },
    { key: "web", title: t("web"), dataIndex: "web" },
    { key: "telegram", title: t("telegram"), dataIndex: "telegram" },
    { key: "twitter", title: t("twitter"), dataIndex: "twitter" },
    { key: "qq", title: t("qq"), dataIndex: "qq" },
    { key: "discord", title: t("discord"), dataIndex: "discord" },
    { key: "intro", title: t("intro"), dataIndex: "intro", ellipsis: true },
    { key: "wxMsgCount", title: t("wxMsgCount"), dataIndex: "wxMsgCount" },
    { key: "qqMsgCount", title: t("qqMsgCount"), dataIndex: "qqMsgCount" },
    { key: "tgMsgCount", title: t("tgMsgCount"), dataIndex: "tgMsgCount" },
    { key: "isHold", title: t("isHold"), dataIndex: "isHold", render: (text) => (
      text === "1" 
        ? <div className="text-green-500">是</div> 
        : <div className="text-red-500">否</div>
    )},
  ];
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reqData, setReqData] = useState({
    "isHold": "",
    "name": "",
    "net": "",
    "pageNum": 1,
    "pageSize": 20,
    "pair": "",
    "source": "",
    "token": ""
  });
  useEffect(() => {
    setLoading(true);
    getProjectPage(reqData)
      .then((res) => {
        if (res.code === 200) {
          setTotal(res.data.total);
          const newData = res.data.rows.map((it) => {
            return {
              ...it,
              name: `${it.rcoinName}/${it.fcoinName}`
            }
          })
          setData(newData)
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const onPageChange = (pageNum) => {
    setReqData({
      ...reqData,
      pageNum,
    });
  };
  const onSizeChange = (pageSize) => {
    setReqData({
      ...reqData,
      pageSize,
    });
  };
  const rowClassName = (record, index) => {
    // 给偶数行添加一个类名，用于设置背景色
    return index % 2 === 0 ? "striped-row" : undefined;
  };
  return (
    <section className="bg-neutral-950 pt-[80px] w-full h-full">
      <Heading className="h-20 text-3xl font-bold lg:px-24 px-8">
        {t("allCase")}
      </Heading>
      <Main className="lg:px-24 px-8 bg-boardBg py-8">
        <section>
          <Input placeholder={t("input-placer")} style={inlineStyle} />
        </section>
        <RestTable>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.id}
            rowClassName={rowClassName}
          />
          <Pagination
            currentPage={reqData.pageNum}
            totalPages={total}
            onPageChange={onPageChange}
            onShowSizeChange={onSizeChange}
          />
        </RestTable>
      </Main>
    </section>
  );
};

export default OverallCase;
