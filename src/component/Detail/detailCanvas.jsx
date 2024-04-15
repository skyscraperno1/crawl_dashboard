import { useEffect, useState, useRef } from "react";
import { Network, DataSet } from "vis-network/standalone/esm/vis-network";
import { debounce } from "../../utils";
import { checkAddress } from "../../apis/checkApis";
import Spin from "../common/Spin";
function getAddress(pathname) {
  const idx = pathname.lastIndexOf("/");
  const hash = pathname.substring(idx + 1);
  if (hash === "detail") {
    return "";
  } else {
    return hash;
  }
}
import { handleData } from "./handleData";
function DetailCanvas() {
  const address = getAddress(window.location.pathname);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    nodes: [],
    edges: [],
  });
  const networkRef = useRef(null);

  useEffect(() => {
    if (data.nodes.length) {
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
            border: '#212121',
            background: '#212121',
          },
          font: {
            color: '#a2a2a2',
          },
          chosen: {
            node: function (values, id, selected, hovering) {
              if (selected) {
                values.borderColor = '#bd7c40'
                values.borderWidth = 2
              } else if (hovering) {
                values.label = '321321'
                values.borderColor = '#bd7c40'
                values.borderWidth = 2
              }
            }
        }
        },
        edges: {
          arrows: {to: {enabled: true, scaleFactor: 0.4}},
          smooth: {
            enabled: true,
            type: "curvedCCW",
          }
        },
        interaction: {
          hover: true,
        },

        layout: {
          randomSeed: 1,
          improvedLayout: false,
        },
      };
      const network = new Network(networkRef.current, _data, options);

      network.on("click", function (params) {
        const [node] = params.nodes;
        if (node) {
          console.log(node, nodes.get(node), "click");
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
      return () => {
        network.destroy();
      };
    }
  }, [data]);
  const fetchData = debounce(() => {
    setLoading(true);
    checkAddress(address)
      .then((res) => {
        if (res.code === 200) {
        const _data = handleData(res.data.nodes.slice(0, 40), res.data.edges.slice(0, 40), address);
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
    }
  }, [address]);
  return (
    <div className="w-full h-full overflow-hidden relative">
      {loading && <Spin />}
      <div ref={networkRef} className="h-full w-full" id="canvas-node"></div>
    </div>
  );
}

export default DetailCanvas;
