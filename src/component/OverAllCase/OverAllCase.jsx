import styled from "styled-components";
import { Input, Table, Pagination, Tooltip } from "antd";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getProjectPage,
  followProject,
  getTokenInfo,
  getCoinInfo,
} from "../../apis/dashBoardApis";
import { message } from "antd";
import { copyText } from "../../utils";
import { FiCopy } from "react-icons/fi";
import { FaCheckCircle, FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import FilterBox from "./FilterBox";
import BSC from "/src/assets/nets/bsc.png";
import Solana from "../../assets/nets/solana.png";
import Ethereum from "../../assets/nets/eth.png";
import Polygon from "../../assets/nets/polygon.png";
import Arbitrum from "../../assets/nets/arbitrum.png";
import AVE from "../../assets/sources/ave.png";
import QQ from "../../assets/sources/qq.png";
import TG from "../../assets/sources/telegram.png";
import WX from "../../assets/sources/wechat.png";
import TableFilterInput from "../common/TableFilterInput";
import { debounce } from "../../utils";
import { IoMdAddCircleOutline, IoMdRemoveCircle } from "react-icons/io";
const nets = {
  BSC,
  Solana,
  Ethereum,
  Polygon,
  Arbitrum,
};
const sources = {
  TG,
  QQ,
  WX,
  AVE,
};
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
const copyKeys = ["token", "pair", "web", "telegram", "twitter", "qq", "discord"]
const renderKeys = [
  "name",
  "liquidityChange",
  "isHold",
  "source",
  ...copyKeys,
  ...tokens,
  ...coins,
];
const defaultChecked = dataKeys.filter((it) => !hiddenKeys.includes(it));
const OverallCase = ({ t }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const clickFollow = (isHold, id) => {
    followProject(
      {
        id,
        isHold,
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

  const renderFilter = useCallback((key) => {
    if (key === "isHold") {
      return {
        filters: [
          { text: t("followed"), value: "1" },
          { text: t("un-followed"), value: "0" },
          { text: t("removed-follow"), value: "2" },
        ],
        filterMultiple: false,
        width: 120,
      };
    } else if (key === "name") {
      return {
        filters: Object.keys(nets).map((key) => ({
          text: (
            <img
              className="h-4 w-4 align-sub inline-block rounded-full"
              src={nets[key]}
              alt={key}
              title={key}
              key={key}
            />
          ),
          value: key,
        })),
        filterMultiple: false,
        width: 200
      };
    } else if (key === "source") {
      return {
        filters: Object.keys(sources).map((key) => ({
          text: (
            <img
              className="h-4 w-4 align-sub inline-block rounded-full"
              src={sources[key]}
              alt={key}
              title={key}
              key={key}
            />
          ),
          value: key,
        })),
        filterMultiple: false,
        width: 100
      };
    } else if (copyKeys.includes(key)) {
      return {
        filterDropdown: (filterProps) => (
          <TableFilterInput
            t={t}
            {...filterProps}
            dataIndex={key}
          />
        ),
        filterIcon: (filtered) => (
          <FaSearch className={filtered ? "text-themeColor" : ""} />
        ),
      };
    } else if ([...tokens, ...coins].includes(key)) {
      return {
        width: 120,
        align: 'center'
      }
    } else if (key === "today" || key === "liquidity") {
      return {
        width: 120,
      }
    } else if (key === "liquidityChange") {
      return {
        width: 140
      }
    } else {
      return null;
    }
  }, []);

  const renderCell = useCallback((key, text, content) => {
    if (key === "name") {
      return (
        <div className="flex items-center">
          {content.net && (
            <img
              className="w-4 h-4 mr-1 align-middle rounded-full"
              src={nets[content.net]}
              alt=""
              title={content.net}
            />
          )}
          <span>{text}</span>
        </div>
      );
    } else if (key === "liquidityChange") {
      const _title = content.lastDay
        ? `${t("last-date")}${content.lastDay}`
        : text;
      const [num] = text.split("%");
      const className =
        num > 0 ? "text-green-500" : num < 0 ? "text-red-500" : "";
      return (
        <div className={className} title={_title}>
          {text}
        </div>
      );
    } else if (key === "token" || key === "pair") {
      return (
        <Tooltip
          placement="topLeft"
          title={
            <div className="relative">
              <span className="inline">{text}</span>
              <div className="absolute bottom-[4px] inline w-[14px] h-[14px] overflow-hidden translate-x-1">
                <FiCopy
                  className="cursor-pointer"
                  onClick={() => {
                    copyText(text, () => {
                      messageApi.open({
                        type: "success",
                        content: t("copy-success"),
                      });
                    });
                  }}
                />
                <FaCheckCircle className="text-[#24c197]" />
              </div>
            </div>
          }
        >
          <span className="cursor-pointer hover:text-themeColor">{text}</span>
        </Tooltip>
      );
    } else if (key === "source") {
      return (
        <img
          src={sources[content.source]}
          alt=""
          title={text}
          className="w-8 h-8 rounded-full"
        />
      );
    } else if (key === "isHold") {
      return (
        <div className="flex justify-between px-4 text-base">
          {text !== 2 &&
            (text === "1" ? (
              <FaHeart
                className="cursor-pointer text-themeColor"
                onClick={clickFollow.bind(null, "0", content.id)}
              />
            ) : (
              <FaRegHeart
                className="cursor-pointer"
                onClick={clickFollow.bind(null, "1", content.id)}
              />
            ))}
          {text === "2" ? (
            <IoMdAddCircleOutline className="cursor-pointer" onClick={clickFollow.bind(null, "0", content.id)}/>
          ) : (
            <IoMdRemoveCircle className="cursor-pointer" onClick={clickFollow.bind(null, "2", content.id)}/>
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
  }, []);

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
    return _columns.map((item) => {
      return {
        ...item,
        ...renderFilter(item.key),
        hidden: !checkList.includes(item.key),
      };
    });
  }, [checkList, t]);

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

  const handleFilterChange = (_, filter) => {
    const { isHold, name, pair, source, token } = filter;
    const resetData = {
      isHold: isHold ? isHold[0] : "",
      net: name ? name[0] : "",
      pair: pair ? pair[0] : "",
      source: source ? source[0] : "",
      token: token ? token[0] : "",
    };
    setReqData({
      ...reqData,
      ...resetData,
    });
  };

  const searchDebounce = debounce((name) => {
    setReqData({
      ...reqData,
      pageNum: 1,
      name,
    });
  }, 800);
  const rowClassName = (_, index) => {
    // 给偶数行添加一个类名，用于设置背景色
    return index % 2 === 0 ? "striped-row" : undefined;
  };
  return (
    <section className="bg-neutral-950 pt-[80px] w-full h-full">
      {contextHolder}
      <Heading className="h-20 text-3xl font-bold lg:px-24 px-8">
        {t("allCase")}
      </Heading>
      <Main className="lg:px-24 px-8 bg-boardBg py-8">
        <section className="flex px-4">
          <FilterBox
            defaultCheckedList={defaultChecked}
            options={options}
            t={t}
            onChange={(list) => {
              setCheckList(list);
            }}
          />
          <Input
            placeholder={t("overall-placeholder")}
            allowClear
            style={{ width: "485px" }}
            onChange={(e) => {
              if (e.target.value === "") {
                setReqData({
                  ...reqData,
                  pageNum: 1,
                  name: "",
                });
              } else {
                searchDebounce(e.target.value);
              }
            }}
          />
        </section>
        <RestTable>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.id}
            rowClassName={rowClassName}
            onChange={handleFilterChange}
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
