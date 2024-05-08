import { copyText } from "../../utils";

const defaultNode = {
  type: "rect",
  style: {
    fill: "#212121",
    stroke: "#212121",
    radius: 10,
    width: 200,
    height: 50,
    shadowColor: "rgba(189,124,64,.8)",
  },
  labelCfg: {
    style: {
      fill: "#a2a2a2",
      fontSize: 12,
      fontFamily: "Inter",
      textAlign: "left",
      x: -87,
    },
  },
};

const defaultEdge = {
  // type: 'cubic-horizontal',
  type: "smooth",
  style: {
    stroke: "#bd7c40",
  },
  labelCfg: {
    style: {
      fill: "#fff",
    },
  },
};

const modes = {
  default: ["drag-canvas", "zoom-canvas"],
};

export const defaultCfg = (container) => {
  return {
    container,
    width: container.clientWidth,
    height: container.clientHeight,
    modes,
    defaultNode,
    defaultEdge,
  };
};

export const behaviors = (graph, clickCallback) => {
  graph.on("node:mouseenter", (e) => {
    const { item } = e;
    graph.updateItem(item, {
      type: "hoverNode",
    });
  });
  graph.on("edge:click", (e) => {
    const { item } = e;
    const { source, target } = item.getModel();
    clickCallback(source, target);
  });
  graph.on("node:mouseleave", (e) => {
    const { item } = e;
    graph.updateItem(item, {
      type: "rect",
    });
  });
  graph.on("edge:mouseenter", (e) => {
    const { item } = e;
    graph.setItemState(item, "hover", true);
    const sourceNode = item.getSource();
    const targetNode = item.getTarget();
    graph.updateItem(sourceNode, {
      style: { shadowBlur: 20 },
    });
    graph.updateItem(targetNode, {
      style: { shadowBlur: 20 },
    });
  });
  graph.on("edge:mouseleave", (e) => {
    const { item } = e;
    graph.setItemState(item, "hover", false);
    const sourceNode = item.getSource();
    const targetNode = item.getTarget();
    graph.updateItem(sourceNode, {
      style: { shadowBlur: 0 },
    });
    graph.updateItem(targetNode, {
      style: { shadowBlur: 0 },
    });
  });
};

export const registerX = (G6, address, callback) => {
  G6.registerNode(
    "hoverNode",
    {
      draw(cfg, group) {
        // Main shape
        const rect = group.addShape("rect", {
          attrs: {
            x: -100,
            y: -35,
            width: 200,
            height: 70,
            stroke: "#bd7c40",
            fill: "#212121",
            radius: 10,
          },
        });

        // Label
        if (cfg.label) {
          group.addShape("text", {
            attrs: {
              x: -87,
              y: -10,
              textAlign: "left",
              textBaseline: "middle",
              text: cfg.label,
              fill: "#a2a2a2",
              fontFamily: "Inter",
              cursor: "pointer",
            },
            name: "text-shape",
          });
        }
        // 绑定点击复制事件
        group
          .find((element) => element.get("name") === "text-shape")
          .on("click", (e) => {
            const text = e.target.attr("text").replace(/\n/g, "");
            copyText(text);
          });

        // Analyze Button
        const buttonGroup = group.addGroup();
        const button = buttonGroup.addShape("rect", {
          attrs: {
            x: -30,
            y: 10,
            width: 60,
            height: 20,
            fill: "#bd7c40",
            radius: 5,
            cursor: "pointer",
          },
          name: "button-rect",
        });
        buttonGroup.addShape("text", {
          attrs: {
            x: 0,
            y: 20,
            textAlign: "center",
            textBaseline: "middle",
            text: "Analyze",
            fill: "#fff",
            fontSize: 12,
            cursor: "pointer",
          },
          name: "button-text",
        });
        buttonGroup.on("mouseenter", () => {
          button.attr("fill", "#bf9269");
        });
        buttonGroup.on("mouseleave", () => {
          button.attr("fill", "#bd7c40");
        });
        buttonGroup.on("click", () => {
          callback(cfg.id)
        });
        return rect;
      },
    },
    "rect"
  );

  G6.registerEdge("smooth", {
    draw(cfg, group) {
      let { startPoint, endPoint } = cfg;
      const right = cfg.left;
      let sx = startPoint.x;
      let sy = startPoint.y;
      let ex = endPoint.x;
      let ey = endPoint.y;
      if (right) {
        sx = endPoint.x;
        sy = endPoint.y;
        ex = startPoint.x;
        ey = startPoint.y;
      }
      const sign = right ? 1 : -1;
      const x1 = sx + 20 * sign;
      const x2 = sx + 40 * sign;
      const path = [
        ["M", sx, sy],
        ["C", sx, sy, x1, sy, x2, ey],
        ["L", ex, ey],
      ];

      const endArrow = cfg.source === address;
      const startArrow = cfg.target === address;
      const shape = group.addShape("path", {
        attrs: {
          stroke: "#bd7c40",
          lineWidth: 3,
          path,
          endArrow: endArrow && {
            path: G6.Arrow.triangle(10, 10, 10),
            d: 10,
            fill: "#bd7c40",
          },
          startArrow: startArrow && {
            path: G6.Arrow.triangle(10, 10, 10),
            d: 10,
            fill: "#bd7c40",
          },
          shadowColor: "#666",
          cursor: "pointer",
        },
      });
      group.addShape("text", {
        attrs: {
          text: cfg.amount,
          x: (ex + sx) / 2,
          y: ey - 2,
          textAlign: "center",
          textBaseline: "bottom",
          fill: "#fff",
          fontSize: 12,
        },
        name: 'amount-text'
      });
      group.addShape("text", {
        attrs: {
          text: cfg.time,
          x: (ex + sx) / 2,
          y: ey + 4,
          textAlign: "center",
          textBaseline: "top",
          fill: "#fff",
          fontSize: 12,
        },
        name: 'time-text'
      });
      return shape;
    },

    // 设置edge hover的样式
    setState(name, value, item) {
      const group = item.getContainer();
      const [shape] = group.get("children");
      const text1 = group.find(element => element.get('name') === 'amount-text');
      const text2 = group.find(element => element.get('name') === 'time-text');
      if (name === "hover") {
        if (value) {
          shape.attr("shadowBlur", "10");
          shape.attr("lineWidth", "5");
          text1 && text1.attr({
            fontSize: 16, // 放大字体大小
          });
          text2 && text2.attr({
            fontSize: 16, // 放大字体大小
          });
        } else {
          shape.attr("shadowBlur", "0");
          shape.attr("lineWidth", "3");
          text1 && text1.attr({
            fontSize: 12, // 恢复字体大小
          });
          text2 && text2.attr({
            fontSize: 12, // 恢复字体大小
          });
        }
      }
    },
  });
};

export function splitTextToFitWidth(text, maxWidth, font = "12px Inter") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;

  const words = text.split("");
  let currentLine = "";
  let result = "";

  words.forEach((word) => {
    let testLine = currentLine + word;
    let metrics = context.measureText(testLine);
    if (metrics.width > maxWidth && currentLine !== "") {
      result += currentLine.trim() + "\n";
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  result += currentLine.trim();
  return result;
}
