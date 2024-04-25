import { useEffect, useRef, useState } from "react";
import G6 from "@antv/g6";
import { defaultCfg, behaviors, registerX, splitTextToFitWidth } from "./G6Config";
import { checkAddress, checkEdgeAdd } from "../../apis/checkApis";
import { debounce } from "../../utils";
import Spin from "../common/Spin";
import { getAddress, getType, handleData } from "./canvanUtils";
const GraphComponent = () => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    nodes: [],
    edges: []
  })
  const address = getAddress(window.location.pathname);
  const type = getType(window.location.pathname);
  const fetchData = debounce(() => {
    setLoading(true);
    checkAddress(address, type)
      .then((res) => {
        if (res.code === 200) {
         const _data = handleData(res.data.edges, address, containerRef.current.clientWidth/2)
         setData(_data)
        }
      })
      .finally(() => {
        setLoading(false);
      });
  });
  useEffect(() => {
    fetchData()
  }, []);
  useEffect(() => {
    if (!containerRef.current) return;
    if (!data.nodes.length) return;
    const graph = new G6.Graph(defaultCfg(containerRef.current));
    registerX(G6, address)
    graph.data(data);
    behaviors(graph);
    graph.render();
    return () => graph.destroy();
  }, [data])
  return (
    <div className="w-full h-full overflow-hidden relative">
      {loading && <Spin />}
      <div ref={containerRef} className="w-full h-full" id="g6-canvas" />;
    </div>
  );
};

export default GraphComponent;
