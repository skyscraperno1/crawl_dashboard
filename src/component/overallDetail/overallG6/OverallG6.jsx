import G6 from "@antv/g6";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdZoomOutMap, MdZoomInMap } from "react-icons/md";
import './toolbar.scss'
import { debounce } from "../../../utils";
import { getFromData, getToData } from '../../../apis/checkApis'
import { handleData } from "./canvasUtils";
import { defaultCfg, registerX, behaviors } from "./canvasConfig";
import Spin from '../../common/Spin'
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import { Modal } from "antd";
import { useParams } from "react-router-dom";
const Tabs = ['bep20', 'bnb']
const { confirm } = Modal;
const OverallG6 = ({ messageApi, token }) => {
  const { type, add } = useParams()
  const [address, setAddress] = useState('')
  const [isFull, setIsFull] = useState(false)
  useEffect(() => {
    if (type === 'bep20' || type === 'bnb') {
      setActive(type)
      setIsFull(true)
      setAddress(add)
    } else {
      setIsFull(false)
      setAddress('0x0000000000000000000000000000000000000000')
    }
  }, [type, add])
  const { t } = useTranslation();
  const ref = useRef(null);
  const graph = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(0)
  const [loading, setLoading] = useState(false)

  const zoomIn = () => {
    const currentZoom = graph.current.getZoom();
    const newZoom = Math.min(currentZoom + 0.1, graph.current.get('maxZoom'));
    graph.current.zoomTo(newZoom);
    setScale((newZoom * 100).toFixed(0));
  };

  const zoomOut = () => {
    const currentZoom = graph.current.getZoom();
    const newZoom = Math.max(currentZoom - 0.1, graph.current.get('minZoom'));
    graph.current.zoomTo(newZoom);
    setScale((newZoom * 100).toFixed(0));
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsZoomed(false)
    }
  };

  useEffect(() => {
    if (isZoomed) {
      window.addEventListener('keydown', handleKeyDown)
    } else {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isZoomed])

  const [offsetX, setX] = useState(0)
  const [offsetY, setY] = useState(0)


  useEffect(() => {
    if (!ref.current || !address) {
      return;
    }
    window.addEventListener("resize", handleResize);
    setX(ref.current.getBoundingClientRect().left)
    setY(ref.current.getBoundingClientRect().top)
    if (!graph.current) {
      registerX(t);
      graph.current = new G6.Graph(defaultCfg(document.getElementById('overall-g6')))
      setScale(20)
      graph.current.on('wheel', () => {
        setScale((graph.current.getZoom() * 100).toFixed(0))
      });
      behaviors(graph.current, showNextPage, messageApi, t)
    }
    () => {
      graph.current?.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, [address]);

  const getVariants = () => ({
    zoom: {
      width: window.innerWidth,
      height: window.innerHeight,
      x: -offsetX,
      y: -offsetY,
      zIndex: 100,
      position: 'absolute'
    },
    normal: {
      zIndex: 50,
      position: 'absolute',
      x: 0,
      y: 0
    }
  });


  const handleResize = debounce(() => {
    if (ref.current && graph.current) {
      const newWidth = ref.current.offsetWidth;
      const newHeight = ref.current.offsetHeight;
      graph.current.changeSize(newWidth, newHeight);
    }
  });

  const PAGE_SIZE = 10
  const fetchFromData = (address, nodeId) => {
    setLoading(true)
    getFromData(address, activeTab, token).then(res => {
      if (!res.edges || (res.edges.length === 1 && data.nodes.some(item => item.address === res.edges[0].from_address))) {
        messageApi?.open({
          type: 'error',
          content: t("noMore"),
        });
        nodeDataCache[nodeId].fromLoaded = 1
      } else {
        const _edges = res.edges.filter(item => {
          const { from_address, to_address } = item;
          return !data.edges.some(edge => {
            let { source, target } = edge;
            source = source.split("__")[0]
            target = target.split("__")[0]
            return (source === from_address && target === to_address) || (source === to_address && target === from_address)
          }
          );
        })
        const { nodes, edges } = handleData(_edges.slice(0, PAGE_SIZE), address, false, nodeId, 'from')
        nodeDataCache[nodeId].fromData = _edges
        nodeDataCache[nodeId].fromLoaded = 1
        data = {
          nodes: [...data.nodes, ...nodes],
          edges: [...data.edges, ...edges]
        }
        graph.current.data(data)
        graph.current.render();
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  const fetchToData = (address, nodeId) => {
    setLoading(true)
    getToData(address, activeTab, token).then(res => {
      if (!res.edges || (res.edges.length === 1 && data.nodes.some(item => item.address === res.edges[0].to_address))) {
        messageApi?.open({
          type: 'error',
          content: t("noMore"),
        });
        nodeDataCache[nodeId].toLoaded = 1
      } else {
        const _edges = res.edges.filter(item => {
          const { from_address, to_address } = item;
          return !data.edges.some(edge => {
            let { source, target } = edge;
            source = source.split("__")[0]
            target = target.split("__")[0]
            return (source === from_address && target === to_address) || (source === to_address && target === from_address)
          }
          );
        })
        const { nodes, edges } = handleData(_edges.slice(0, PAGE_SIZE), address, false, nodeId, 'to')
        nodeDataCache[nodeId].toData = _edges
        nodeDataCache[nodeId].toLoaded = 1
        data = {
          nodes: [...data.nodes, ...nodes],
          edges: [...data.edges, ...edges]
        }
        graph.current.data(data)
        graph.current.render();
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  const fetchLocalFrom = (nodeId, address, loadedCount, transactions) => {
    nodeDataCache[nodeId].fromLoaded = loadedCount + 1;
    const nextPage = transactions.slice(loadedCount * PAGE_SIZE, (loadedCount + 1) * PAGE_SIZE);
    const { nodes, edges } = handleData(nextPage, address, false, nodeId, 'from')
    data = {
      nodes: [...data.nodes, ...nodes],
      edges: [...data.edges, ...edges]
    }
    graph.current.data(data)
    graph.current.render();
  }
  const fetchLocalTo = (nodeId, address, loadedCount, transactions) => {
    nodeDataCache[nodeId].toLoaded = loadedCount + 1;
    const nextPage = transactions.slice(loadedCount * PAGE_SIZE, (loadedCount + 1) * PAGE_SIZE);
    const { nodes, edges } = handleData(nextPage, address, false, nodeId, 'to')
    data = {
      nodes: [...data.nodes, ...nodes],
      edges: [...data.edges, ...edges]
    }
    graph.current.data(data)
    graph.current.render();
  }
  function showNextPage(address, direction, nodeId) {
    let nodeCache = nodeDataCache[nodeId];
    if (!nodeCache) {
      nodeDataCache[nodeId] = {
        fromData: [],
        toData: [],
        fromLoaded: 0,
        toLoaded: 0
      };
      if (direction === 'from') {
        fetchFromData(address, nodeId)
      } else {
        fetchToData(address, nodeId)
      }
    } else {
      const transactions = direction === 'from' ? nodeCache.fromData : nodeCache.toData;
      const loadedCount = direction === 'from' ? nodeCache.fromLoaded : nodeCache.toLoaded;
      if (loadedCount === 0) {
        if (direction === 'from') {
          fetchFromData(address, nodeId)
        } else {
          fetchToData(address, nodeId)
        }
      }
      else if (transactions.length > loadedCount * PAGE_SIZE) {
        if (direction === 'from') {
          fetchLocalFrom(nodeId, address, loadedCount, transactions)
        } else {
          fetchLocalTo(nodeId, address, loadedCount, transactions)
        }
      } else {
        messageApi?.open({
          type: 'error',
          content: t("noMore"),
        });
      }
    }
  }

  let data = {
    nodes: [], edges: []
  }

  let nodeDataCache = {
    [address]: {
      fromData: [],
      toData: [],
      fromLoaded: 1,
      toLoaded: 1,
    }
  };
  const initData = (tab) => {
    setLoading(true)
    Promise.all([getToData(address, tab, token), getFromData(address, tab, token)]).then(([toData, fromData]) => {
      const fromEdges = fromData?.edges || []
      const toEdges = toData?.edges || []
      const _fromData = handleData(fromEdges.slice(0, PAGE_SIZE), address, true, undefined, 'from')
      const _toData = handleData(toEdges.slice(0, PAGE_SIZE), address, false, undefined, 'to')
      data = {
        nodes: [..._fromData.nodes, ..._toData.nodes],
        edges: [..._fromData.edges, ..._toData.edges]
      }
      nodeDataCache[address].fromData = fromEdges
      nodeDataCache[address].toData = toEdges
      graph.current.data(data)
      graph.current.render()
    }).finally(() => {
      setLoading(false)
    })
  }
  
  const [activeTab, setActive] = useState('bep20')

  const changeTab = (tab) => {
    if (tab === activeTab) return
    confirm({
      title: t('sureTitle'),
      content: t('sureContent'),
      icon: <QuestionCircleOutlined style={{ color: 'red' }} />,
      okText: t('OK'),
      cancelText: t('Cancel'),
      onOk() {
        setActive(tab)
      },
    });
  }

  useEffect(() => {
    if (!address || !token) return;
    data = {nodes: [], edges: []}
    nodeDataCache = {
      [address]: {
        fromData: [],
        toData: [],
        fromLoaded: 1,
        toLoaded: 1,
      }
    };
    initData(activeTab)
  }, [activeTab, address, token])

  return (
    <motion.div ref={ref} className="w-full h-full overflow-hidden rounded-lg"
      initial="normal"
      animate={isZoomed ? "zoom" : "normal"}
      transition={{ type: "spring", bounce: 0.05, duration: 0.3 }}
      variants={getVariants()}
      onUpdate={handleResize}
    >
      {loading && <Spin />}
      <div id='overall-g6' className="rounded-lg w-full h-full overflow-hidden bg-gray-950 z-50">
        <ul className="tool-bar flex absolute bottom-4 text-sm justify-end right-4 rounded font-thin">
          <li><FaPlus onClick={zoomIn} /></li>
          <li style={{ cursor: 'unset'}}><p>{scale}</p></li>
          <li ><FaMinus onClick={zoomOut} /></li>
          <li className={`${isFull ? 'pointer-events-none opacity-70' : ''}`}>{
            isZoomed ? <MdZoomInMap onClick={() => setIsZoomed(false)} />
              : <MdZoomOutMap onClick={() => setIsZoomed(true)} />
          }</li>
        </ul>
        <ul className="tool-bar flex absolute top-4 text-xs justify-end right-4 rounded font-thin">
          {Tabs.map((tab) => (
            <li
              key={tab}
              className={`uppercase hover:text-themeColor select-none cursor-pointer ${activeTab === tab ? 'hover:text-white text-white bg-themeColor hover:bg-[#a46c39] active:bg-[#b78c5d]' : ''}`}
              style={{ width: 'fit-content', padding: '2px 6px' }}
              onClick={() => changeTab(tab)} 
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>

  );
};

export default OverallG6;