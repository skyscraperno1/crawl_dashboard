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
          enabled: false
        },
        nodes: {
          shape: "box",
          size: 40,
        },
        edges: {
          arrows: "to",
          font: {
            size: 14, // 设置文字大小
          },
        },
        interaction: {
          hover: true,
        },
       
        layout: {
          randomSeed: 1,
          improvedLayout: false,
          hierarchical: {
            direction: "LR",
          sortMethod: 'directed',
          edgeMinimization: true,

            levelSeparation: 300, // 调整层级之间的间距
            nodeSpacing: 150,
          },
        },
      };
      const network = new Network(networkRef.current, _data, options);

      network.on("click", function (params) {
        const [node] = params.nodes;
        if (node) {
          console.log(node, nodes.get(node), "click");
        }
      });
      network.on("hoverNode", (params) => {
        const { node } = params;
        const hoveredNode = nodes.get(node);
        hoveredNode.label +=
          '<br><button id="myButton" onclick="alert(\'Button Clicked!\')">Click Me</button>';
        nodes.update(hoveredNode);
      });
      network.on("blurNode", (params) => {
        const { node } = params;
        console.log(node);
        const blurredNode = nodes.get(node);
        blurredNode.label = blurredNode.id;
        nodes.update(blurredNode);
      });
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
          const nodes = res.data.nodes.map((it) => {
            const isRoot = it.address === address
            return {
              x: isRoot ? 0 : undefined,
              y: isRoot ? 1000 : undefined,
              id: it.address,
              label: it.address,
              widthConstraint: 150
            };
          });
          const edges = res.data.edges.map((it) => {
            return {
              id: it.from_address + it.to_address + it.symbol,
              from: it.from_address,
              to: it.to_address,
              label: `[${it.year}-${it.month}-${it.day}]`,
            };
          });
          // const rightItems = res.data.edges.filter((it) => {
          //   return it.from_address === address
          // })
          // const leftItems = res.data.edges.filter((it) => {
          //   return it.to_address === address
          // })
          // rightItems.forEach((edgeItem) => {
          //   nodes.forEach((nodeItem) => {
          //     if (edgeItem.to_address === nodeItem.id) {
          //       var leftNode = nodes.find(function(node) {
          //         return node.id === edgeItem.from;
          //     });
          //     leftNode.x = -100; // 设置左侧节点的水平位置
          //     leftNode.y = leftNodes.length * 50; // 设置左
          //     }
          //   })
          // })
          // leftItems.forEach((edgeItem) => {
          //   nodes.forEach((nodeItem) => {
          //     if (edgeItem.from_address === nodeItem.id) {

          //     }
          //   })
          // })
          // rightNodes.forEach((it, idx) => {
          //   it.id = it.address,
          //   it.label = it.address
          //   it.x = 400
          //   it.y = 100 * (idx + 1)
          //   it.widthConstraint = 150
          // })
          // leftNodes.forEach((it, idx) => {
          //   it.id = it.address,
          //   it.label = it.address
          //   it.x = -400
          //   it.y = 100 * (idx + 1)
          //   it.widthConstraint = 150
          // })
          // const _nodes = [
          //   {id: '1', label: '"0x6e5e3a727ef8a82de3aaf76a3be677ad8f160c84"'},
          //   {id: '2', label: '"0x6e5e3a727ef8a82de3aaf76a3be677ad8f160c84"'},
          //   {id: '3', label: '"0x6e5e3a727ef8a82de3aaf76a3be677ad8f160c84"'},
          //   {id: '4', label: '"0x6e5e3a727ef8a82de3aaf76a3be677ad8f160c84"'},
          // ]
          // const _edges = [
          //   {from: '1', to: '2', label: 'e-1'},
          //   { from: '1', to: '2', label: 'e-2'},
          //   { from: '2', to: '1', label: 'e-3'},
          // ]
          setData({ nodes: nodes, edges: edges });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  });
  useEffect(() => {
    if (address) {
      fetchData();
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
