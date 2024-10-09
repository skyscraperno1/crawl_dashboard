import G6 from "@antv/g6";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdZoomOutMap, MdZoomInMap  } from "react-icons/md";
import './toolbar.scss'
import { debounce } from "../../../utils";
import { getFromData, getToData } from '../../../apis/checkApis'
import { _handleData } from "./canvasUtils";

const OverallG6 = () => {
  const ref = useRef(null);
  const graph = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(0)

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
    if (!ref.current) {
      return;
    }
    setX(ref.current.getBoundingClientRect().left)
    setY(ref.current.getBoundingClientRect().top)
    if (!graph.current) {
      const nodeStateStyles = {
        hover: {
          main_rect: {
            stroke: "#b18046",
            lineWidth: 3,
          },
          "to": {
            stroke: "#b18046",
            lineWidth: 2,
          },
          "from": {
            stroke: "#b18046", 
            lineWidth: 2,
          },
        },
        highlight: {
          opacity: 1,
        },
        dark: {
          opacity: 0.2,
        },
      };
      
      G6.registerNode(
        "base_node",
        {
          draw(cfg, group) {
            // Main shape
            const rect = group.addShape("rect", {
              attrs: {
                x: -100,
                y: -35,
                width: 200,
                height: 70,
                stroke: "#1f1f1f",
                fill: '#212121',
                radius: 10,
              },
              name: "main_rect",
            });
            // 节点左边 “+” 图标，点击添加出金记录
            group.addShape("marker", {
              attrs: {
                x: 100,
                y: 0,
                r: 8,
                cursor: "pointer",
                symbol: G6.Marker.expand,
                stroke: "#fff",
                fill: '#212121',
                lineWidth: 1,
              },
              name: "to",
            });
            // 节点左边 “+” 图标，点击添加入金记录
            group.addShape("marker", {
              attrs: {
                x: -100,
                y: 0,
                r: 8,
                cursor: "pointer",
                symbol: G6.Marker.expand,
                fill: '#212121',
                stroke: "#fff",
                lineWidth: 1,
              },
              name: "from",
            });
    
            // 节点信息，地址
            if (cfg.label) {
              group.addShape("text", {
                attrs: {
                  x: -87,
                  y: 10,
                  textAlign: "left",
                  textBaseline: "middle",
                  text: cfg.label,
                  fill: "#a2a2a2",
                  fontFamily: "Inter",
                  cursor: "pointer",
                },
                name: "address",
              });
            }
    
            // 节点信息标签，地址标签
            if (cfg.label) {
              group.addShape("text", {
                attrs: {
                  x: -87,
                  y: -10,
                  textAlign: "left",
                  textBaseline: "middle",
                  text: cfg.year,
                  fill: "#ffffff",
                  fontFamily: "Inter",
                  cursor: "pointer",
                },
                name: "address_label",
              });
            }
            return rect;
          },
        },
        "rect"
      );
      graph.current = new G6.Graph({
        container: document.getElementById('overall-g6'),
        fitView: false,
        defaultNode: {
          type: "base_node",
        },
        layout: {
          type: "dagre",
          rankdir: "LR",
          align: 'DL',
          nodesepFunc: () => 10,
          ranksepFunc: () => 200,
        },
        modes: {
          default: ["drag-canvas", "zoom-canvas", "drag-node"],
        },
        nodeStateStyles,
        minZoom: 0.2,
        maxZoom: 2
      });
  
     
      setScale(20)
      graph.current.on('wheel', () => {
        setScale((graph.current.getZoom() * 100).toFixed(0))
      });
    }

  }, [ref.current]);

  
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

  let nodeDataCache = {
    "0x5f04708b524ecf5e182e3cfe48c9e8c4a14fd6e1": {
      fromData: [],    
      toData: [],    
      fromLoaded: 1,
      toLoaded: 1,   
    }
  };


  const PAGE_SIZE = 10
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
        getFromData(address).then(res => {
          if (!res.edges || (res.edges.length === 1 && data.nodes.some(item => item.address === res.edges[0].from_address))) {
            alert('没有数据了')
          } else {
            const _edges = res.edges.filter(item => {
              return !Object.keys(nodeDataCache).some(key => key.split("__")[0] === item.from_address)
            })
            const { nodes, edges } = _handleData(_edges.slice(0, PAGE_SIZE), address, false, nodeId)
            nodeDataCache[nodeId].fromData = _edges
            nodeDataCache[nodeId].fromLoaded = 1
            data = {
              nodes: [...data.nodes, ...nodes],
              edges: [...data.edges, ...edges]
            }
            graph.current.data(data)
            graph.current.render();
          }
        })
      } else {
        getToData(address).then(res => {
          if (!res.edges || (res.edges.length === 1 && data.nodes.some(item => item.address === res.edges[0].to_address))) {
            alert('没有数据了')
          } else {
            const _edges = res.edges.filter(item => {
              return !Object.keys(nodeDataCache).some(key => key.split("__")[0] === item.to_address)
            })
            const { nodes, edges } = _handleData(_edges.slice(0, PAGE_SIZE), address, false, nodeId)
            nodeDataCache[nodeId].toData = _edges
            nodeDataCache[nodeId].toLoaded = 1
            data = {
              nodes: [...data.nodes, ...nodes],
              edges: [...data.edges, ...edges]
            }
            graph.current.data(data)
            graph.current.render();
          }
        })
      }
    } else {

      // 这里是已经加载过的
      const transactions = direction === 'from' ? nodeCache.fromData : nodeCache.toData;
      const loadedCount = direction === 'from' ? nodeCache.fromLoaded : nodeCache.toLoaded;
      if (loadedCount === 0) {
        if (direction === 'from') {
          getFromData(address).then(res => {
            if (!res.edges || (res.edges.length === 1 && data.nodes.some(item => item.address === res.edges[0].from_address))) {
              alert('没有数据了')
            } else {
              const _edges = res.edges.filter(item => {
                return !Object.keys(nodeDataCache).some(key => key.split("__")[0] === item.from_address)
              })
              const { nodes, edges } = _handleData(_edges.slice(0, PAGE_SIZE), address, false, nodeId)
              nodeDataCache[nodeId].fromData = _edges
              nodeDataCache[nodeId].fromLoaded = 1
              data = {
                nodes: [...data.nodes, ...nodes],
                edges: [...data.edges, ...edges]
              }
              graph.current.data(data)
              graph.current.render();
            }
          })
        } else {
          getToData(address).then(res => {
            if (!res.edges || (res.edges.length === 1 && data.nodes.some(item => item.address === res.edges[0].to_address))) {
              alert('没有数据了')
            } else {
              const _edges = res.edges.filter(item => {
                return !Object.keys(nodeDataCache).some(key => key.split("__")[0] === item.to_address)
              })
              const { nodes, edges } = _handleData(_edges.slice(0, PAGE_SIZE), address, false, nodeId)
              nodeDataCache[nodeId].toData = _edges
              nodeDataCache[nodeId].toLoaded = 1
              data = {
                nodes: [...data.nodes, ...nodes],
                edges: [...data.edges, ...edges]
              }
              graph.current.data(data)
              graph.current.render();
            }
          })
        }
      }
      else if (transactions.length > loadedCount * PAGE_SIZE) {
        if (direction === 'from') {
          nodeDataCache[nodeId].fromLoaded = loadedCount + 1;
          const nextPage = transactions.slice(loadedCount * PAGE_SIZE, (loadedCount + 1) * PAGE_SIZE);
          const { nodes, edges } = _handleData(nextPage, address) 
          data = {
            nodes: [...data.nodes, ...nodes],
            edges: [...data.edges, ...edges]
          }
          graph.current.data(data)
          graph.current.render();
        } else {
          nodeDataCache[nodeId].toLoaded = loadedCount + 1;
          const nextPage = transactions.slice(loadedCount * PAGE_SIZE, (loadedCount + 1) * PAGE_SIZE);
          const { nodes, edges } = _handleData(nextPage, address) 
          data = {
            nodes: [...data.nodes, ...nodes],
            edges: [...data.edges, ...edges]
          }
          graph.current.data(data)
          graph.current.render();
        }
      } else {
        alert('加载完啦')
      }
    }
  }
  
  let data = {
    nodes: [], edges: []
  }
  const address = '0x5f04708b524ecf5e182e3cfe48c9e8c4a14fd6e1'
  const fetchData = () => {
    Promise.all([getToData(address), getFromData(address)]).then(([toData, fromData]) => {
      const _fromData = _handleData(fromData.edges.slice(0, PAGE_SIZE), address, true)
      const _toData = _handleData(toData.edges.slice(0, PAGE_SIZE), address)
      data = {
        nodes: [..._fromData.nodes, ..._toData.nodes],
        edges: [..._fromData.edges, ..._toData.edges]
      }
      nodeDataCache[address].fromData = fromData.edges
      nodeDataCache[address].toData = toData.edges
      graph.current.data(data)
      graph.current.render()
      graph.current.on("node:click", function (e) {
        const target = e.target; 
        const item = e.item; 
        const name = target.get("name"); 
        if (name === "to" || name === 'from') {
          const address = item.getModel().address
          const nodeId = item.get("id");
          showNextPage(address, name, nodeId)
        }
      });
    })
  }

  useEffect(() => {
    fetchData()
    window.addEventListener("resize", handleResize);
    () => {
      graph.current?.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, [])
  return (
      
    <motion.div ref={ref} className="w-full h-full"
    initial="normal"
    animate={isZoomed ? "zoom" : "normal"}
    transition={{ type: "spring", bounce: 0.05, duration: 0.3 }}
    variants={getVariants()}
    onUpdate={handleResize}
    >
    <div
      id='overall-g6'
      className="rounded-lg w-full h-full overflow-hidden bg-gray-950 z-50"
     
    >
    <ul className="tool-bar flex absolute bottom-4 text-sm justify-end right-4 rounded gap font-thin">
      <li><FaPlus onClick={zoomIn}/></li>
      <li ><p>{scale}</p></li>
      <li ><FaMinus onClick={zoomOut}/></li>
      <li >{
        isZoomed ? <MdZoomInMap onClick={() => setIsZoomed(false)} /> 
        : <MdZoomOutMap onClick={() => setIsZoomed(true)}/>
      }</li>
    </ul>
    </div>
    </motion.div>

  );
};

export default OverallG6;