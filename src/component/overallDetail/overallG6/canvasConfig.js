
import G6 from "@antv/g6";
const edgeStateStyles = {
  highlight_in: {
    stroke: "#6dc542",
  },
  highlight_out: {
    stroke: "#e43c1a",
  },
  dark: {
    stroke: "#000000",
  },
};

const defaultEdge = {
  type: "custom-line",
  style: {
    stroke: "#bd7c40",
    lineWidth: 2,
    endArrow: {
      path: G6.Arrow.triangle(6, 8, 2),
      d: -5,
      fill: "#bd7c40",
    },
  },
  labelCfg: {
    style: {
      fill: "#fff",
    },
  },
};

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
const modes = {
  default: ["drag-canvas", "zoom-canvas", "drag-node"],
};
export const defaultCfg = (container) => {
  return {
    container,
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
    modes,
    defaultEdge,
    nodeStateStyles,
    edgeStateStyles,
    minZoom: 0.2,
    maxZoom: 2
  };
};
const node_nor_color = "#212121";
export const registerX = () => {
  G6.registerNode(
    "base_node",
    {
      draw(cfg, group) {
        const rect = group.addShape("rect", {
          attrs: {
            x: -100,
            y: -35,
            width: 200,
            height: 60,
            stroke: "#1f1f1f",
            fill: node_nor_color,
            radius: 10,
          },
          name: "main_rect",
        });
        group.addShape("marker", {
          attrs: {
            x: 100,
            y: -5,
            r: 8,
            cursor: "pointer",
            symbol: G6.Marker.expand,
            stroke: "#fff",
            fill: node_nor_color,
            lineWidth: 1,
          },
          name: "to",
        });
        group.addShape("marker", {
          attrs: {
            x: -100,
            y: -5,
            r: 8,
            cursor: "pointer",
            symbol: G6.Marker.expand,
            fill: node_nor_color,
            stroke: "#fff",
            lineWidth: 1,
          },
          name: "from",
        });

        if (cfg.label) {
          group.addShape("text", {
            attrs: {
              x: -87,
              y: 10,
              textAlign: "left",
              textBaseline: "bottom",
              text: cfg.label,
              fill: "#a2a2a2",
              fontSize: 12,
              fontFamily: "Inter",
              cursor: "normal",
            },
            name: "address",
          });
        }
        return rect;
      },
    },
    "rect"
  );
};

export const behaviors = (graph, callback) => {
  function clearAllStats() {
    graph.setAutoPaint(false);
    graph.getNodes().forEach(function (node) {
      graph.clearItemStates(node);
    });
    graph.getEdges().forEach(function (edge) {
      graph.clearItemStates(edge);
    });
    graph.paint();
    graph.setAutoPaint(true);
  }

  graph.on("node:click", function (e) {
    clearAllStats()
    graph.paint();
    graph.setAutoPaint(true);
    const item = e.item;
    const name = e.target.get("name"); 
    if (name === 'to' || name === 'from') {
      const address = item.getModel().address
      const nodeId = item.get("id");
      callback(address, name, nodeId)
    } else {
      graph.setAutoPaint(false);
      graph.getNodes().forEach(function (node) {
        graph.setItemState(node, "dark", true);
      });
      graph.getEdges().forEach(function (edge) {
        graph.setItemState(edge, "dark", true);
      });
  
      graph.setItemState(item, "dark", false);
      graph.setItemState(item, "highlight", true);
  
      const edges = graph.getEdges();
      edges.forEach(function (edge) {
        const source = edge.getSource();
        const target = edge.getTarget();
        if (source === item) {
          graph.setItemState(target, "dark", false);
          graph.setItemState(target, "highlight", true);
          graph.setItemState(edge, "highlight_in", true);
          edge.toFront();
        } else if (target === item) {
          graph.setItemState(source, "dark", false);
          graph.setItemState(source, "highlight", true);
          graph.setItemState(edge, "highlight_out", true);
          edge.toFront();
        }
      });
  
      graph.paint();
      graph.setAutoPaint(true);
    }
  });
  
  graph.on("canvas:click", clearAllStats);
};