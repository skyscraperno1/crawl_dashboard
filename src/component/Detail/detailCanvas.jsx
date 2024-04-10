import { useEffect, useState, useRef } from "react";
import { Network, DataSet } from 'vis-network/standalone/esm/vis-network';
import { debounce } from "../../utils";
import { checkAddress } from "../../apis/checkApis";
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
  const [loading, setLoading] = useState(false)
  console.log(loading)
  const networkRef = useRef(null);
  useEffect(() => {
    const nodes = new DataSet([
      { id: 1, label: 'Bitcoin' },
      { id: 2, label: 'Ethereum' },
      { id: 3, label: 'Litecoin' },
    ]);

    const edges = new DataSet([
      { from: 1, to: 2 },
      { from: 2, to: 3 },
    ]);

    const container = networkRef.current;

    const data = {
      nodes: nodes,
      edges: edges,
    };

    const options = {};

    const network = new Network(container, data, options);

    return () => {
      network.destroy();
    };
  }, []);
  const fetchData = debounce(() => {
    setLoading(true)
    checkAddress(address).then((res) => {
      console.log(res);
    }).finally(() => {
      setLoading(false)
    });
  });
  useEffect(() => {
    if (address) {
      fetchData();
    }
  }, [address, fetchData]);
  return (
    <div className="w-full h-full overflow-hidden">
      <div ref={networkRef} className="h-[800px] w-[600px]"> </div>
    </div>
  );
}

export default DetailCanvas;
