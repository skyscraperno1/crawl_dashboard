import { useEffect, useRef, useState } from "react";
import G6 from "@antv/g6";
import { defaultCfg, behaviors, registerX } from "./G6Config";
import { checkAddress, checkEdgeAdd } from "../../apis/checkApis";
import { debounce } from "../../utils";
import Spin from "../common/Spin";
import ToolBox from "./toolBox";
import { getAddress, getType, handleData } from "./canvanUtils";
import { Drawer, Table, Tooltip } from "antd";
import { FiCopy } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import Empty from "../common/Empty";
import { motion } from "framer-motion";
import { copyText } from "../../utils";
const GraphComponent = ({ t, getData }) => {
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
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    nodes: [],
    edges: [],
  });
  const address = getAddress(window.location.pathname);
  const type = getType(window.location.pathname);
  const [showDrawer, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState([]);
  const [chunkSize, setChunk] = useState(0);
  const [initData, setInitData] = useState([])
  const fetchData = debounce(() => {
    setLoading(true);
    checkAddress(address, type)
      .then((res) => {
        if (res.code === 200) {
        setInitData(res.data.edges)
         const _data = handleData(res.data.edges.slice(0, 20), address, containerRef.current.clientWidth/2)
         setData(_data)
        }
      })
      .finally(() => {
        setLoading(false);
      });
  });
  useEffect(() => {
    fetchData();
  }, []);

  const clickEdge = (target, source) => {
    checkEdgeAdd(
      {
        toAddress: target,
        fromAddress: source,
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
    })
  };
  useEffect(() => {
    if (!containerRef.current || !data.nodes.length) return;
    const graph = new G6.Graph(defaultCfg(containerRef.current));
    registerX(G6, address);
    graph.data(data);
    behaviors(graph, clickEdge);
    graph.render();
    return () => graph.destroy();
  }, [data]);
  return (
    <div className="w-full h-full overflow-hidden relative">
      <ToolBox
        t={t}
        showMore={initData.length && initData.length > chunkSize}
        loadMore={() => {
          setChunk(chunkSize + 20)
        }}
        getData={getData}
      />
      {loading && <Spin />}
      <div ref={containerRef} className="w-full h-full" id="g6-canvas" />;
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
      </Drawer>
    </div>
  );
};

export default GraphComponent;
