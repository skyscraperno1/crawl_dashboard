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
let initialData = [];
let network = null;
function DetailCanvas({ t }) {
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
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    nodes: [],
    edges: [],
  });
  const [empty, setEmpty] = useState(false);
  const networkRef = useRef(null);
  const [chunkSize, setChunk] = useState(20);
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
    console.log(_data);
    network = new Network(networkRef.current, _data, options);
    network.on("click", function (params) {
      const [node] = params.nodes;
      if (node) {
        // console.log(node, nodes.get(node), "click");
      }
      const [edgeId] = params.edges;
      if (edgeId && !node) {
        setDrawerOpen(false);
        const edge = network.body.data.edges.get(edgeId);
        const fromNode = edge.from;
        const toNode = edge.to;
        console.log(fromNode, toNode);
        checkEdgeAdd({
          toAddress: toNode,
          fromAddress: fromNode,
          symbol: "",
        }).then((res) => {
          if (res.code === 200) {
            console.log(res.data);
            setDrawerData(
              res.data.map((it) => {
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
    });
    // network.on("hoverNode", (params) => {
    //   const { node } = params;
    //   const hoveredNode = nodes.get(node);
    //   hoveredNode.label +=
    //     '<br><button id="myButton" onclick="alert(\'Button Clicked!\')">Click Me</button>';
    //   nodes.update(hoveredNode);
    // });
    // network.on("blurNode", (params) => {
    //   const { node } = params;
    //   console.log(node);
    //   const blurredNode = nodes.get(node);
    //   blurredNode.label = blurredNode.id;
    //   nodes.update(blurredNode);
    // });
    setEmpty(false);
  };
  useEffect(() => {
    if (data.nodes.length) {
      if (network === null) {
        initNet();
      } else {
        const nodes = new DataSet(data.nodes);
        const edges = new DataSet(data.edges);
        const _data = {
          nodes,
          edges,
        };
        console.log(123, data, _data);
        // network.setData(_data)
      }
      // return () => {
      //   network.destroy();
      // };
    } else {
      setEmpty(true);
    }
  }, [data]);
  const fetchData = debounce(() => {
    setLoading(true);
    checkAddress(address)
      .then((res) => {
        if (res.code === 200) {
          initialData = res.data.edges;
          const _data = handleData(initialData.slice(0, chunkSize), address);
          setData(_data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  });
  useEffect(() => {
    if (address) {
      fetchData();
    } else {
      setLoading(false);
      setEmpty(true);
    }
  }, [address]);
  const [showDrawer, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState([]);
  const loadMore = () => {
    // setData((oldData) => ({
    //   nodes: [...oldData.nodes, ...newData.nodes],
    //   edges: [...oldData.edges, ...newData.edges]
    // }))
    const newData = pushData(
      data,
      initialData.slice(chunkSize, chunkSize + 20),
      address
    );
    setData({
      nodes: newData.nodes,
      edges: newData.edges,
    });
    setChunk(chunkSize + 20);
  };
  return (
    <div className="w-full h-full overflow-hidden relative">
      <ToolBox
        t={t}
        showMore={initialData.length && initialData.length > chunkSize}
        loadMore={loadMore}
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
