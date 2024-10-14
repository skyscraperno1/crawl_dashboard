import G6 from "@antv/g6";
import { copyText } from "../../../utils";

const getArrow = (fill) => {
  return {
    path: G6.Arrow.triangle(6, 8, 2),
    d: -5,
    fill,
  }
}
const fill_color = "#212121";
const fill_highlight = "#484848"
const text_color = "#a2a2a2"
const text_highlight = "#c4c4c4"

const edge_color = "#bd7c40"
const in_color = "#A58CFF"
const out_color = "#FF6B6B"

const nodeStateStyles = {
  highlight: {
    fill: 'rgb(189, 124, 64)',
    stroke: "rgb(189, 124, 64)"
  },
};
const modes = {
  default: ["drag-canvas", "zoom-canvas", "drag-node", "click-select"],
};

const getTooltip = () => {
  return new G6.Tooltip({
    offsetX: 10,
    offsetY: 10,
    getContent(e) {
      const model = e.item.getModel();
      let { raw_amount } = model;
      if (!raw_amount) {
        raw_amount = 0
      }
      const tooltipDiv = document.createElement('div');
      tooltipDiv.style.width = 'fit-content';
      tooltipDiv.style.backgroundColor = 'transparent';
      tooltipDiv.style.color = 'black';
      tooltipDiv.style.border = 'none';
      tooltipDiv.innerHTML = `
        <p>总量: ${raw_amount}</p>
      `;
      return tooltipDiv;
    },
    shouldBegin(e) {
      return e.item && e.item.getType() === 'edge';
    },
  })
}
export const defaultCfg = (container) => {
  return {
    container,
    fitView: true,
    plugins: [
      getTooltip()
    ],
    defaultNode: {
      type: "base_node",
    },
    defaultEdge: {
      type: "fund-polyline",
    },
    layout: {
      type: "dagre",
      rankdir: "LR",
      align: 'DL',
      nodesep: 10,
      ranksep: 200,
    },
    modes,
    nodeStateStyles,
    minZoom: 0.2,
    maxZoom: 2
  };
};


export const registerX = (t) => {
  G6.registerNode(
    "base_node",
    {
      draw(cfg, group) {
        const { trans } = cfg;
        const rect = group.addShape("rect", {
          attrs: {
            x: -100,
            y: -35,
            width: 200,
            height: 60,
            fill: fill_color,
            radius: 8,
          },
          name: "main_rect",
        });
        (trans === 'to' || !trans) && group.addShape("marker", {
          attrs: {
            x: 100,
            y: -5,
            r: 8,
            cursor: "pointer",
            symbol: G6.Marker.expand,
            stroke: "#a2a2a2",
            fill: fill_color,
            lineWidth: 1,
          },
          name: "to",
        });
        (trans === 'from' || !trans) && group.addShape("marker", {
          attrs: {
            x: -100,
            y: -5,
            r: 8,
            cursor: "pointer",
            symbol: G6.Marker.expand,
            fill: fill_color,
            stroke: text_color,
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
              fill: text_color,
              fontSize: 12,
              fontFamily: "Inter",
              cursor: "normal",
            },
            name: "address",
          });
        }
        return rect;
      },
      setState(name, value, item) {
        const group = item.getContainer();
        const rect = group.find((element) => element.get("name") === "main_rect");
        const text = group.find((element) => element.get("name") === "address");
        if (name === "highlight") {
          const fillColor = value ? fill_highlight : fill_color;
          const textColor = value ? text_highlight : text_color;
          
          rect.attr("fill", fillColor);
          text.attr("fill", textColor);
        }
      }
    },
    "rect"
  );
  G6.registerEdge('fund-polyline', {
    itemType: 'edge',
    draw: function draw(cfg, group) {
      const { trans } = cfg;
      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;
  
      const Ydiff = endPoint.y - startPoint.y;
  
      const slope = Ydiff !== 0 ? Math.min(800 / Math.abs(Ydiff), 40) : 0;
  
      const cpOffset = slope > 40 ? 0 : 42;
      const offset = Ydiff < 0 ? cpOffset : -cpOffset;
  
      const firstSegmentLength = 30;
      const firstLineEndPoint = {
        x: startPoint.x + firstSegmentLength,
        y: startPoint.y,
      };
  
      const line1EndPoint = {
        x: firstLineEndPoint.x + slope,
        y: endPoint.y + offset,
      };
  
      const line2StartPoint = {
        x: line1EndPoint.x + cpOffset,
        y: endPoint.y,
      };
     
      const controlPoint = {
        x: ((line1EndPoint.x - firstLineEndPoint.x) * (endPoint.y - firstLineEndPoint.y)) / (line1EndPoint.y - firstLineEndPoint.y) + firstLineEndPoint.x,
        y: endPoint.y,
      };
  
      let path 
      if (trans === 'to') {
        path = [
          ['M', startPoint.x, startPoint.y],
          ['L', firstLineEndPoint.x, firstLineEndPoint.y],
          ['L', line1EndPoint.x, line1EndPoint.y],
          ['Q', controlPoint.x, controlPoint.y, line2StartPoint.x, line2StartPoint.y],
          ['L', endPoint.x, endPoint.y],
        ];
      } else {
        path = [
          ['M', startPoint.x, startPoint.y],
          ['L', startPoint.x + 350, startPoint.y],
          ['L', endPoint.x, endPoint.y]
        ]
      }
  
      if (Math.abs(Ydiff) <= 5) {
        path = [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x, endPoint.y],
        ];
      }
  
      const line = group.addShape('path', {
        attrs: {
          path,
          stroke: edge_color, 
          lineWidth: 2,
          cursor: 'pointer',
          endArrow: getArrow(edge_color),
        },
        name: 'path-shape',
      });

      group.addShape('text', {
        attrs: {
          x: (startPoint.x + endPoint.x) / 2, 
          y: trans === 'to' ? endPoint.y - 12 : startPoint.y - 12, 
          text: cfg.time || 'Time', 
          fill: text_color,
          fontSize: 12,
          textAlign: 'center',
          cursor: 'pointer',
          textBaseline: 'middle',
        },
        name: 'time-text',
      });
  
      group.addShape('text', {
        attrs: {
          x: (startPoint.x + endPoint.x) / 2,
          y: trans === 'to' ? endPoint.y + 12 : startPoint.y + 12,
          text: t('count') + cfg.count || 'Count',
          fill: text_color,
          fontSize: 12,
          textAlign: 'center',
          cursor: 'pointer',
          textBaseline: 'middle',
        },
        name: 'count-text',
      });
  
      return line;
    },
    setState(name, value, item) {
      const group = item.getContainer(); 
      const shape = group.get('children')[0];
      const children = group.getChildren()
      let countTextShape = null;
      let timeTextShape = null

      children.forEach(child => {
        if (child.get('name') === 'count-text') {
          countTextShape = child;
        }
        if (child.get('name') === 'time-text') {
          timeTextShape = child;
        }
      });

      if (name === 'highlight_in' && value) {
        shape.attr('stroke', in_color); 
        shape.attr('endArrow', getArrow(in_color));
        countTextShape.attr('fill', text_highlight); 
        timeTextShape.attr('fill', text_highlight); 
      } else if (name === 'highlight_out' && value) {
        shape.attr('stroke', out_color); 
        shape.attr('endArrow', getArrow(out_color));
        countTextShape.attr('fill', text_highlight); 
        timeTextShape.attr('fill', text_highlight); 
      } else if (!value) {
        shape.attr('stroke', edge_color); 
        shape.attr('endArrow', getArrow(edge_color));
        countTextShape.attr('fill', text_color); 
        timeTextShape.attr('fill', text_color); 
      }
    },
  });
};

let hoverNode = null;
export const behaviors = (graph, callback, messageApi, t, edgeCallback) => {
  let timer = null
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

  graph.on("mousemove", function (e) {
    const name = e.target.get("name");
    if (name === 'to' || name === 'from') {
      hoverNode = e.target;
      hoverNode.attr('fill', "#b78c5d")
      hoverNode.attr('stroke', '#ECECEC')
    } else {
      if (hoverNode) {
        hoverNode.attr('fill', fill_color)
        hoverNode.attr('stroke', '#a2a2a2')
      }
    }
  });

  graph.on('node:dblclick', function(e) {
    const address = e.item.getModel().address
    if (timer) {
      clearTimeout(timer)
      timer = null;
    }
    copyText(address, () => {
      messageApi.open({
        type: 'success',
        content: t("copy-success"),
      });
    })
  })

  graph.on("node:click", function (e) {
    clearAllStats()
    const item = e.item;
    const name = e.target.get("name"); 
    const currentAddress = item.getModel().address;
    
    if (name === 'to' || name === 'from') {
      const { address } = item.getModel()
      const nodeId = item.get("id")
      callback(address, name, nodeId)
    } else {
      if (timer) {
        clearTimeout(timer);
      }
      graph.setAutoPaint(false);
      graph.setItemState(item, "highlight", true);
      let count = 0
      graph.getNodes().forEach((node) => {
        const model = node.getModel();
        if (model.address === currentAddress) {
          count++;
          graph.setItemState(node, 'highlight', true);
        } else {
          graph.setItemState(node, 'highlight', false);
        }
      });
      if (count > 1) {
        timer = setTimeout(() => {
          messageApi.open({
            type: 'success',
            content: t("sameCount") + count,
          })
          timer = null
        }, 300)
      }
      const edges = graph.getEdges();
      edges.forEach(function (edge) {
        const source = edge.getSource();
        const target = edge.getTarget();
        if (source === item) {
          graph.setItemState(target, "highlight", true);
          graph.setItemState(edge, "highlight_in", true);
        } else if (target === item) {
          graph.setItemState(source, "highlight", true);
          graph.setItemState(edge, "highlight_out", true);
        }
      });
    }
  });

  graph.on("edge:click", function (e) {
    clearAllStats()
    const item = e.item; 
    graph.setItemState(item, "highlight_in", true);
    const edges = graph.getEdges();
    edges.forEach(function (edge) {
      if (edge !== item) {
        graph.setItemState(edge, "highlight_in", false);
        graph.setItemState(edge, "highlight_out", false);
      }
    });
  
    graph.getNodes().forEach(function (node) {
      graph.setItemState(node, "highlight", false);
    });
    const model = item.getModel()
    const [source] = model.source.split('__')
    const [target] = model.target.split('__')
    const { count } = model
    edgeCallback(source, target, count)
  });
  
  
  graph.on("canvas:click", clearAllStats);
};