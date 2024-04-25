import { useEffect, useState, useRef } from "react";
import { Network, DataSet } from "vis-network/standalone/esm/vis-network";
import { debounce } from "../../utils";
import { checkAddress, checkEdgeAdd } from "../../apis/checkApis";
import Spin from "../common/Spin";
import Empty from "../common/Empty";
import ToolBox from "./toolBox";
import { Drawer, Table, Tooltip } from "antd";
import { FiCopy } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import "../table/table.scss";
import "./detailTable.scss";
import { copyText } from "../../utils";
import { handleData, pushData } from "./handleData";
import { motion } from "framer-motion";
function getAddress(pathname) {
  const idx = pathname.lastIndexOf("/");
  const hash = pathname.substring(idx + 1);
  if (hash === "detail") {
    return "";
  } else {
    return hash;
  }
}
function getType(pathname) {
  const splitArr = pathname.split("/");
  if (splitArr.length === 2) {
    return "";
  } else {
    return splitArr[2];
  }
}
let initialData = [];
let network = null;
function DetailCanvas({ t, getData }) {
  const [copied, setCopied] = useState(false);
  const columns = [
    { key: "block_time", title: t("date"), dataIndex: "block_time" },
    {
      key: "from_address",
      title: t("from_address"),
      dataIndex: "from_address",
      render: (text) => {
        return (
          <Tooltip
            afterOpenChange={(open) => {
              if (!open) {
                setCopied(false);
              }
            }}
            title={
              <div className="relative">
                <span>{text}</span>
                <div className="absolute bottom-[4px] right-[132px]  w-[14px] h-[14px] overflow-hidden">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: copied ? -16 : 0 }}
                    transition={{
                      duration: 0.2,
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
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    { key: "raw_amount", title: t("raw_amount"), dataIndex: "raw_amount" },
  ];

  const address = getAddress(window.location.pathname);
  const type = getType(window.location.pathname);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    nodes: [],
    edges: [],
  });
  const [empty, setEmpty] = useState(false);
  const networkRef = useRef(null);
  const [chunkSize, setChunk] = useState(0);
  const initNet = () => {
    const nodes = new DataSet(data.nodes);
    const edges = new DataSet(data.edges);
    const _data = {
      nodes,
      edges,
    };
    const options = {
      physics: {
        enabled: false,
      },
      nodes: {
        shape: "box",
        color: {
          border: "#212121",
          background: "#212121",
        },
        font: {
          color: "#a2a2a2",
        },
        chosen: {
          node: function (values, id, selected, hovering) {
            if (selected) {
              values.borderColor = "#bd7c40";
              values.borderWidth = 2;
            } else if (hovering) {
              values.label = "321321";
              values.borderColor = "#bd7c40";
              values.borderWidth = 2;
            }
          },
        },
      },
      edges: {
        arrows: { to: { enabled: true, scaleFactor: 0.4 } },
        smooth: {
          enabled: true,
          type: "curvedCCW",
        },
      },
      interaction: {
        hover: true,
      },
      layout: {
        randomSeed: 1,
        improvedLayout: false,
      },
    };
    network = new Network(networkRef.current, _data, options);
    network.on("click", function (params) {
      const [node] = params.nodes;
      const [edgeId] = params.edges;
      if (edgeId && !node) {
        setDrawerOpen(false);
        const edge = network.body.data.edges.get(edgeId);
        const fromNode = edge.from;
        const toNode = edge.to;
        checkEdgeAdd(
          {
            toAddress: toNode,
            fromAddress: fromNode,
            symbol: "",
          },
          type
        ).then((res) => {
          if (res.code === 200) {
            const _data = type === "Bep20" ? res.data : [res.data];
            setDrawerData(
              _data.map((it) => {
                return {
                  ...it,
                  key: it.id,
                };
              })
            );
            setDrawerOpen(true);
          }
        });
      } 
      if (node) {
        fetchData(node)
      }
    });
    setEmpty(false);
  };
  useEffect(() => {
    if (chunkSize) {
      initNet();
    } else if (network) {
      console.log('else');
    } else {
      console.log('last', chunkSize, network);
    }
  }, [chunkSize]);
  const fetchData = debounce((_address) => {
    setLoading(true);
    checkAddress(_address, type)
      .then((res) => {
        if (res.code === 200) {
          initialData = res.data.edges;
          const _data = handleData(initialData.slice(chunkSize, chunkSize + 20), address);
          setChunk(chunkSize + 20);
          setData(_data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  });
  useEffect(() => {
    if (address) {
      fetchData(address);
    } else {
      setLoading(false);
      setEmpty(true);
    }
  }, [address]);
  const [showDrawer, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState([]);
  const loadMore = () => {
    setChunk(chunkSize + 20);
  };
  return (
    <div className="w-full h-full overflow-hidden relative">
      <ToolBox
        t={t}
        showMore={initialData.length && initialData.length > chunkSize}
        loadMore={loadMore}
        getData={getData}
      />
      {loading && <Spin />}
      {empty && !loading && <Empty t={t} />}
      <div ref={networkRef} className="h-full w-full" id="canvas-node"></div>
      <Drawer
        title={t("inter_tracker")}
        placement="bottom"
        closable={false}
        onClose={setDrawerOpen.bind(null, false)}
        open={showDrawer}
        getContainer={false}
        styles={{
          body: {
            background: "#1f2124",
            padding: 0,
          },
          header: {
            background: "#bd7c40",
            color: "#e9ebf0",
          },
          mask: {
            background: "transparent",
          },
        }}
      >
        {
          <Table
            className="drawer-table"
            dataSource={drawerData}
            columns={columns}
            pagination={false}
            loading={loading}
            scroll={{ y: "calc(100% - 55px)" }}
            locale={{ emptyText: <Empty t={t}></Empty> }}
            headerBorderRadius={0}
            headerColor="red"
          />
        }
      </Drawer>
    </div>
  );
}

export default DetailCanvas;
