import styled from "styled-components";
import { Input, Table, Pagination, Tooltip } from "antd";
import { useState, useEffect } from "react";
import { getProjectPage, followProject } from "../../apis/dashBoardApis";
import { motion } from "framer-motion";
import { copyText } from "../../utils";
import { FiCopy } from "react-icons/fi";
import { FaCheckCircle, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
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
    color: #fff !important;
  }
`;
const OverallCase = ({ t }) => {
  const inlineStyle = {
    width: "485px",
  };

  const [showFilter, setShowFilter] = useState(false)
  const handleClick = () => {
    
  }
  const [copied, setCopied] = useState(false);
  const clickFollow = (isFollow, id) => {
    followProject(
      {
        id,
        isHold: isFollow ? "1" : "0",
      },
      true
    ).then(() => {
      getTable();
    });
  };
  const columns = [
    { key: "name", title: (
      <div className="flex items-center w-full">
        <FiFilter className="text-xs mr-1 hover:text-themeColor cursor-pointer" onClick={handleClick}/>
        <div>{t("name")}</div>
      </div>
    ), dataIndex: "name", width: 90 },
    { key: "liquidity", title: t("liquidity"), dataIndex: "createTime" },
    {
      key: "liquidityChange",
      title: t("liquidityChange"),
      dataIndex: "liquidityChange",
      render: (text) => {
        const [num] = text.split("%");
        const className =
          num > 0 ? "text-red-500" : num < 0 ? "text-green-500" : "";
        return <div className={className}>{text}</div>;
      },
    },
    {
      key: "token",
      title: t("token"),
      dataIndex: "token",
      ellipsis: true,
      width: 200,
      render: (text) => (
        <Tooltip
          placement="topLeft"
          afterOpenChange={(open) => {
            if (!open) {
              setCopied(false);
            }
          }}
          title={
            <div className="relative">
              <span className="inline">{text}</span>
              <div className="absolute bottom-[4px] inline w-[14px] h-[14px] overflow-hidden translate-x-1">
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: copied ? -16 : 0 }}
                  transition={{
                    duration: copied ? 0.2 : 0,
                    type: "spring",
                    damping: 10,
                    stiffness: 100,
                  }}
                  className="w-[14px] h-[30px] flex flex-col justify-between"
                >
                  <FiCopy
                    className="cursor-pointer"
                    onClick={copyText.bind(null, text, () => {
                      setCopied(true);
                    })}
                  />
                  <FaCheckCircle className="text-[#24c197]" />
                </motion.div>
              </div>
            </div>
          }
        >
          <span className="cursor-pointer hover:text-themeColor">{text}</span>
        </Tooltip>
      ),
    },
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
    { key: "xhsCount", title: t("xhsCount"), dataIndex: "xhsCount" },
    { key: "dyCount", title: t("dyCount"), dataIndex: "dyCount" },
    { key: "wbCount", title: t("wbCount"), dataIndex: "wbCount" },
    {
      key: "isHold",
      title: t("isHold"),
      dataIndex: "isHold",
      render: (text, { id }) => (
        <div>
          {text === "1" ? (
            <FaHeart
              className="cursor-pointer text-themeColor"
              onClick={clickFollow.bind(null, false, id)}
            />
          ) : (
            <FaRegHeart
              className="cursor-pointer"
              onClick={clickFollow.bind(null, true, id)}
            />
          )}
        </div>
      ),
    },
  ];
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reqData, setReqData] = useState({
    isHold: "",
    name: "",
    net: "",
    pageNum: 1,
    pageSize: 20,
    pair: "",
    source: "",
    token: "",
  });
  useEffect(() => {
    getTable();
  }, [reqData]);

  const getTable = () => {
    setLoading(true);
    getProjectPage(reqData)
      .then((data) => {
        setTotal(data.total);
        const newData = data.rows.map((it) => {
          return {
            ...it,
            name:
              !it.rcoinName && !it.fcoinName
                ? ""
                : `${it.rcoinName || ""}/${it.fcoinName || ""}`,
          };
        });
        setData(newData);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onPageChange = (pageNum, pageSize) => {
    if (pageSize !== reqData.pageSize) {
      pageNum = 1;
    }
    setReqData({
      ...reqData,
      pageNum,
      pageSize,
    });
  };
  const rowClassName = (_, index) => {
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
            current={reqData.pageNum}
            pageSize={reqData.pageSize}
            total={total}
            onChange={onPageChange}
          />
        </RestTable>
      </Main>
    </section>
  );
};

export default OverallCase;
