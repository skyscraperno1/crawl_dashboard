import styled from "styled-components";
import { Input, Table, Pagination } from "antd";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getProjectPage,
  followProject,
} from "../../apis/dashBoardApis";
import { camelToSnakeCase } from "../../utils";
import { FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import FilterBox from "./FilterBox";
import bsc from "/src/assets/nets/bsc.png";
import solana from "../../assets/nets/solana.png";
import eth from "../../assets/nets/eth.png";
import polygon from "../../assets/nets/polygon.png";
import arbitrum from "../../assets/nets/arbitrum.png";
import AVE from "../../assets/sources/ave.png";
import QQ from "../../assets/sources/qq.png";
import TG from "../../assets/sources/telegram.png";
import WX from "../../assets/sources/wechat.png";
import TableFilterInput from "../common/TableFilterInput";
import { debounce } from "../../utils";
import { IoMdAddCircleOutline, IoMdRemoveCircle } from "react-icons/io";
import CopyText from "../core/CopyText";
import Popover from "../core/Popover";
const nets = {
  bsc,
  solana,
  eth,
  polygon,
  arbitrum,
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
    .ant-table-thead {
      .ant-table-cell-fix-right {
        .ant-table-cell-content {
          overflow: visible;
        }
      }
      .ant-table-cell {
        font-size: 12px;
      }
    }
    .ant-table-tbody {
      .ant-table-cell {
        font-size: 13px;
        padding: 12px 16px;
      }
    }
    .striped-row {
      background-color: #303135;
      height: 30px;
      .ant-table-cell-fix-right {
        background-color: #303135;
      }
      .ant-table-cell-row-hover {
        background-color: #1d1d1d;
      }
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
  "pair",
  "token",
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
  "baiduCount",
  "bingCount",
  "googleCount",
  "totalCount",
  "openDays",
  "isHold"
];

const hiddenKeys = ["telegram", "twitter", "web", "discord", "intro", "xhsCount", "dyCount", "bingCount", "googleCount"];
const disabledKeys = [
  "name",
  "liquidity",
  "liquidityChange",
  "token",
  "isHold",
  "pair ",
  "source",
  "openDays"
];
const tokens = ["wxMsgCount", "qqMsgCount", "tgMsgCount"];
const coins = ["xhsCount", "dyCount", "wbCount"];
const search = ["baiduCount", "bingCount", "googleCount"]
const allInfos = [...tokens, ...coins, ...search]
const searchKeys = [
  "token",
  "pair",
];
const sorterKeys = ['liquidity', 'liquidityChange', 'today', 'qq', ...tokens]
const renderKeys = [
  "name",
  "liquidityChange",
  "isHold",
  "source",
  "totalCount",
  ...searchKeys,
  ...allInfos,
];
const defaultChecked = dataKeys.filter((it) => !hiddenKeys.includes(it));

export const NameCell = ({rCoin, fCoin, content}) => {
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
      <span className="text-xs">{rCoin}</span>
      {fCoin && <span className="text-neutral-400">/{fCoin}</span>}
    </div>
  );
}

export const LiquidityChangeCell = ({content, text, t}) => {
  const _title = content.lastDay
  ? `${t("last-date")}${content.lastDay}`
  : text;
  const className =
  text > 0 ? "text-green-500" : text < 0 ? "text-red-500" : "";
  return (
    <div className={className} title={_title}>
      {text}{!!text && '%'}
    </div>
  );
}
const ToPageCell = ({ text, itemKey, id }) => {
  const toPage = (key, itemId) => {
    window.open(`/overallDetail/${key}/${itemId}`)
  };

  return (
    <div
      className="cursor-pointer hover:text-themeColor"
      onClick={() => toPage(itemKey, id)}
    >
      {text}
    </div>
  );
};
const OverallCase = ({ t, messageApi }) => {
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
    ellipsis: true,
    hidden: !hiddenKeys.includes(it),
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
        fixed: 'right'
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
        width: 100,
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
        width: 80,
      };
    } else if (searchKeys.includes(key)) {
      return {
        filterDropdown: (filterProps) => (
          <TableFilterInput t={t} {...filterProps} dataIndex={key} />
        ),
        filterIcon: (filtered) => (
          <FaSearch className={filtered ? "text-themeColor" : ""} />
        ),
        ellipsis: key !== 'pair',
        width: key === 'pair' ? 100 : undefined
      };
    } else if (sorterKeys.includes(key)) {
      const isTokens = tokens.includes(key)
      return { 
        width: key === 'liquidityChange' ? 80 : isTokens ? 110 : 100,
        sorter: true,
        align: isTokens ? "center" : undefined
       };
    } else if ([...allInfos].includes(key) || key === "totalCount" || key === "openDays") {
      return {
        width: 100,
        align: "center",
      };
    } else {
      return null;
    }
  }, []);

  const renderCell = useCallback((key, text, content) => {
    if (key === "name") {
      const [rCoin, fCoin] = text.split('/')
      return <NameCell rCoin={rCoin} fCoin={fCoin} content={content}/>
    } else if (key === "liquidityChange") {
      return <LiquidityChangeCell content={content} text={text} t={t}/>
    } else if (key === "pair") {
      return <Popover data={JSON.parse(text || '[]')} t={t} messageApi={messageApi} />
    } else if (key === "token") {
      return <CopyText text={text} messageApi={messageApi}/>
    } else if (key === "source") {
      return (
        <img
          src={sources[content.source]}
          alt=""
          title={text}
          className="w-6 h-6 rounded-full"
        />
      );
    } else if (key === "isHold") {
      return (
        <div className="flex justify-between px-4 text-base transition">
          {text !== '2' &&
            (text === "1" ? (
              <div
                className="bg-zinc-700 cursor-pointer text-themeColor p-1 rounded hover:text-lightTheme hover:bg-zinc-600"
                onClick={clickFollow.bind(null, "0", content.id)}
              >
                <FaHeart />
              </div>
            ) : (
              <div
                className="bg-zinc-700 cursor-pointer text-zinc-400 p-1 rounded hover:text-zinc-300 hover:bg-gray-700/70"
                onClick={clickFollow.bind(null, "1", content.id)}
              >
                <FaRegHeart />
              </div>
            ))}
          {text === "2" ? (
            <div
            className="cursor-pointer text-green-300 p-1 hover:text-green-200 hover:bg-green-600 rounded bg-green-300/20"
            onClick={clickFollow.bind(null, "0", content.id)}
          >
            <IoMdAddCircleOutline
            />
          </div>
          ) : (
            <div
              className="cursor-pointer text-red-300 p-1 hover:text-red-200 hover:bg-red-600 rounded bg-red-300/20"
              onClick={clickFollow.bind(null, "2", content.id)}
            >
              <IoMdRemoveCircle />
            </div>
          )}
        </div>
      );
    } else if (tokens.includes(key) || coins.includes(key) || search.includes(key) || key === 'totalCount') {
      const regex = /(Count|MsgCount)/g;
      key = key.replace(regex, '');
      return (
        <ToPageCell text={text} itemKey={key} id={content.id} />
      )
    }
  }, []);

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
            liquidity: it.liquidity ? `$${it.liquidity}` : '',
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
  const [sortInfo, setSortInfo] = useState({});

  const handleHeaderCellClick = (column) => {
    if (!sorterKeys.includes(column.dataIndex)) {
      return;
    }
    const lastOrder = sortInfo.field === column.dataIndex ? sortInfo.order : null;
    if (lastOrder === 'ascend') {
      setReqData({
        ...reqData,
        order: camelToSnakeCase(column.key),
        orderType: "DESC"
      })
    } else if (lastOrder === 'descend') {
      setReqData({
        ...reqData,
        order: undefined,
        orderType: undefined
      })
    } else {
      setReqData({
        ...reqData,
        order: camelToSnakeCase(column.key),
        orderType: "ASC"
      })
    }
  }
  const handleFilterChange = (_, filter, sorter) => {
    setSortInfo(sorter);
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
      <Heading className="h-20 text-3xl font-bold lg:px-24 px-8">
      {t("allCase")}
      {}

      </Heading>
      <Main className="lg:px-24 px-8 bg-boardBg py-8">
        <section className="flex px-4 mb-5">
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
            columns={columns.map((col) => ({
              ...col,
              onHeaderCell: (column) => ({
                onClick: () => handleHeaderCellClick(column)
              })
            }))}
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
