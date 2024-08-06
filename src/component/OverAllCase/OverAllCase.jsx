import styled from "styled-components";
import { Input, Table, Pagination, Tooltip } from "antd";
import { useState, useEffect, useMemo } from "react";
import {
  getProjectPage,
  followProject,
  getTokenInfo,
  getCoinInfo,
} from "../../apis/dashBoardApis";
import { motion } from "framer-motion";
import { copyText } from "../../utils";
import { FiCopy } from "react-icons/fi";
import { FaCheckCircle, FaHeart, FaRegHeart } from "react-icons/fa";
import FilterBox from "./FilterBox";
import BSC from '/src/assets/nets/bsc.png'
import Solana from '../../assets/nets/solana.png'
import Ethereum from '../../assets/nets/eth.png'
import Polygon from '../../assets/nets/polygon.png'
import Arbitrum from '../../assets/nets/arbitrum.png'
import AVE from '../../assets/sources/ave.png'
import QQ from '../../assets/sources/qq.png'
import TG from '../../assets/sources/telegram.png'
import WX from '../../assets/sources/wechat.png'
const nets = {
  BSC,
  Solana,
  Ethereum,
  Polygon,
  Arbitrum
}
const sources = {
  TG,
  QQ,
  WX,
  AVE
}
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

const dataKeys = [
  "name",
  "liquidity",
  "liquidityChange",
  "token",
  "pair",
  "today",
  "source",
  "web",
  "telegram",
  "twitter",
  "qq",
  "discord",
  "intro",
  "wxMsgCount",
  "qqMsgCount",
  "tgMsgCount",
  "xhsCount",
  "dyCount",
  "wbCount",
  "isHold",
];

const hiddenKeys = [
  "telegram",
  "twitter",
  "pair",
  "web",
  "qq",
  "discord",
  "intro",
];
const disabledKeys = [
  "name",
  "liquidity",
  "liquidityChange",
  "token",
  "isHold",
  "pair ",
  "source",
];
const tokens = ["wxMsgCount", "qqMsgCount", "tgMsgCount"];
const coins = ["xhsCount", "dyCount", "wbCount"];
const renderKeys = [
  "name",
  "liquidityChange",
  "token",
  "isHold",
  "source",
  ...tokens,
  ...coins,
];
const defaultChecked = dataKeys.filter((it) => !hiddenKeys.includes(it));
const OverallCase = ({ t }) => {
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

  const [checkList, setCheckList] = useState(defaultChecked);

  const options = dataKeys.map((it) => ({
    label: t(it),
    value: it,
    disabled: disabledKeys.includes(it),
  }));
  const _columns = dataKeys.map((it) => ({
    key: it,
    title: t(it),
    dataIndex: it,
    render: renderKeys.includes(it)
      ? (text, content) => renderCell(it, text, content)
      : undefined,
    hidden: !hiddenKeys.includes(it),
    ellipsis: true,
  }));
  const renderCell = (key, text, content) => {
    if (key === "name") {
      return (
        <div className="flex items-center">
          {content.net && <img className="w-4 h-4 mr-1 align-middle rounded-full" src={nets[content.net]} alt="" title={content.net}/>}
          <span>{text}</span>
        </div>
      );
    } else if (key === "liquidityChange") {
      const [num] = text.split("%");
      const className =
        num > 0 ? "text-red-500" : num < 0 ? "text-green-500" : "";
      return <div className={className}>{text}</div>;
    } else if (key === "token") {
      return (
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
      );
    } else if (key === 'source') {
      return (
        <img src={sources[content.source]} alt="" title={text} className="w-8 h-8 rounded-full"/>
      )
    } else if (key === "isHold") {
      return (
        <div>
          {text === "1" ? (
            <FaHeart
              className="cursor-pointer text-themeColor"
              onClick={clickFollow.bind(null, false, content.id)}
            />
          ) : (
            <FaRegHeart
              className="cursor-pointer"
              onClick={clickFollow.bind(null, true, content.id)}
            />
          )}
        </div>
      );
    } else if (tokens.includes(key)) {
      key = key.replace("MsgCount", "");
      return (
        <div
          className="cursor-pointer hover:text-themeColor"
          onClick={() => {
            handleTokens(key, content.token);
          }}
        >
          {text}
        </div>
      );
    } else if (coins.includes(key)) {
      key = key.replace("Count", "");
      return (
        <div
          className="cursor-pointer hover:text-themeColor"
          onClick={() => {
            handleCoins(key, content.id);
          }}
        >
          {text}
        </div>
      );
    }
  };

  const handleCoins = (key, coinId) => {
    getCoinInfo({
      key,
      coinId,
    });
  };

  const handleTokens = (key, token) => {
    getTokenInfo({
      key,
      token,
    });
  };

  const columns = useMemo(() => {
    return _columns.map((item) => ({
      ...item,
      hidden: !checkList.includes(item.key),
    }));
  }, [checkList]);

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
        const newData = data.rows?.map((it) => {
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
        <section className="flex px-4">
          <FilterBox
            defaultCheckedList={defaultChecked}
            options={options}
            onChange={(list) => {
              setCheckList(list);
            }}
          />
          <Input placeholder={t("input-placer")} style={{ width: "485px" }} />
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
