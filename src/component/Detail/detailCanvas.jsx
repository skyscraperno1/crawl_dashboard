import { useEffect, useState, useRef } from "react";
import { Network, DataSet } from "vis-network/standalone/esm/vis-network";
import { debounce } from "../../utils";
import { checkAddress } from "../../apis/checkApis";
import Spin from "../common/Spin";
import Empty from "../common/Empty";
import ToolBox from "./toolBox";
function getAddress(pathname) {
  const idx = pathname.lastIndexOf("/");
  const hash = pathname.substring(idx + 1);
  if (hash === "detail") {
    return "";
  } else {
    return hash;
  }
}
import { handleData, pushData } from "./handleData";
let initialData = [];
let network = null;
function DetailCanvas({ t }) {
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
    // network.on("click", function (params) {
    //   const [node] = params.nodes;
    //   if (node) {
    //     console.log(node, nodes.get(node), "click");
    //   }
    // });
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
  }
  useEffect(() => {
    if (data.nodes.length) {
      if (network === null) {
        initNet()
      } else {
        const nodes = new DataSet(data.nodes);
        const edges = new DataSet(data.edges);
        const _data = {
          nodes,
          edges,
        };
        console.log(_data);
        network.setData(_data)
        network.redraw()
        console.log(network.redraw, network.setData);
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
      nodes: [...data.nodes, ...newData.nodes],
      edges: [...data.edges, ...newData.edges],
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
    </div>
  );
}

export default DetailCanvas;
