import G6 from "@antv/g6";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdZoomOutMap, MdZoomInMap  } from "react-icons/md";
import './toolbar.scss'
import { debounce } from "../../../utils";
const data = {
  nodes: [
    {
      id: '1',
      dataType: 'alps',
      name: 'alps_file1',
      conf: [
        {
          label: 'conf',
          value: 'pai_graph.conf',
        },
        {
          label: 'dot',
          value: 'pai_graph.dot',
        },
        {
          label: 'init',
          value: 'init.rc',
        },
      ],
    },
    {
      id: '2',
      dataType: 'alps',
      name: 'alps_file2',
      conf: [
        {
          label: 'conf',
          value: 'pai_graph.conf',
        },
        {
          label: 'dot',
          value: 'pai_graph.dot',
        },
        {
          label: 'init',
          value: 'init.rc',
        },
      ],
    },
    {
      id: '3',
      dataType: 'alps',
      name: 'alps_file3',
      conf: [
        {
          label: 'conf',
          value: 'pai_graph.conf',
        },
        {
          label: 'dot',
          value: 'pai_graph.dot',
        },
        {
          label: 'init',
          value: 'init.rc',
        },
      ],
    },
    {
      id: '4',
      dataType: 'sql',
      name: 'sql_file1',
      conf: [
        {
          label: 'conf',
          value: 'pai_graph.conf',
        },
        {
          label: 'dot',
          value: 'pai_graph.dot',
        },
        {
          label: 'init',
          value: 'init.rc',
        },
      ],
    },
    {
      id: '5',
      dataType: 'sql',
      name: 'sql_file2',
      conf: [
        {
          label: 'conf',
          value: 'pai_graph.conf',
        },
        {
          label: 'dot',
          value: 'pai_graph.dot',
        },
        {
          label: 'init',
          value: 'init.rc',
        },
      ],
    },
    {
      id: '6',
      dataType: 'feature_etl',
      name: 'feature_etl_1',
      conf: [
        {
          label: 'conf',
          value: 'pai_graph.conf',
        },
        {
          label: 'dot',
          value: 'pai_graph.dot',
        },
        {
          label: 'init',
          value: 'init.rc',
        },
      ],
    },
    {
      id: '7',
      dataType: 'feature_etl',
      name: 'feature_etl_1',
      conf: [
        {
          label: 'conf',
          value: 'pai_graph.conf',
        },
        {
          label: 'dot',
          value: 'pai_graph.dot',
        },
        {
          label: 'init',
          value: 'init.rc',
        },
      ],
    },
    {
      id: '8',
      dataType: 'feature_extractor',
      name: 'feature_extractor',
      conf: [
        {
          label: 'conf',
          value: 'pai_graph.conf',
        },
        {
          label: 'dot',
          value: 'pai_graph.dot',
        },
        {
          label: 'init',
          value: 'init.rc',
        },
      ],
    },
  ],
  edges: [
    {
      source: '1',
      target: '2',
    },
    {
      source: '1',
      target: '3',
    },
    {
      source: '2',
      target: '4',
    },
    {
      source: '3',
      target: '4',
    },
    {
      source: '4',
      target: '5',
    },
    {
      source: '5',
      target: '6',
    },
    {
      source: '6',
      target: '7',
    },
    {
      source: '6',
      target: '8',
    },
  ],
};


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
      graph.current = new G6.Graph({
        container: document.getElementById('overall-g6'),
        fitView: true,
        background: {
          color: 'red',
        },
        layout: {
          type: 'dagre',
          nodesepFunc: (d) => {
            if (d.id === '3') {
              return 500;
            }
            return 50;
          },
          ranksep: 70,
          controlPoints: true,
        },
        modes: {
          default: ["drag-canvas", "zoom-canvas", "drag-node"],
        },
        minZoom: 0.2,
        maxZoom: 2
      });
  
      graph.current.data(data);
      graph.current.render();
      setScale(38)
      graph.current.on('wheel', () => {
        console.log(graph.current.getZoom());
        // setScale((graph.current.getZoom() * 100).toFixed(0))
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