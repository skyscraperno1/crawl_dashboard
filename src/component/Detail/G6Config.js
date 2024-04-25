const defaultNode = {
  type: "rect",
  style: {
    fill: "#212121",
    stroke: "#212121",
    radius: 10,
    width: 200,
    height: 50,
  },
  labelCfg: {
    style: {
      fill: "#a2a2a2",
      fontSize: 12,
      fontFamily: "Inter",
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

export const behaviors = (graph) => {
  graph.on("node:mouseenter", (e) => {
    const { item } = e;
    graph.updateItem(item, {
      type: "hoverNode",
    });
  });

  graph.on("node:mouseleave", (e) => {
    const { item } = e;
    graph.updateItem(item, {
      type: "rect",
    });
  });

  graph.on("node:click", (e) => {
    const { item } = e;
    console.log(item, item.getModel());
  });
};

export const registerX = (G6, address) => {
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
              x: 0,
              y: -10,
              textAlign: "center",
              textBaseline: "middle",
              text: cfg.label,
              fill: "#a2a2a2",
              fontFamily: "Inter",
            },
          });
        }
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
          console.log("click");
        });
        return rect;
      },
    },
    "single-node"
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
          path,
          endArrow,
          startArrow,
        },
      });
      group.addShape("text", {
        attrs: {
          text: cfg.amount,
          x: (ex + sx) / 2,
          y: ey,
          textAlign: "center",
          textBaseline: "bottom",
          fill: "#fff",
          fontSize: 12,
        },
      });
      group.addShape("text", {
        attrs: {
          text: cfg.time,
          x: (ex + sx) / 2,
          y: ey,
          textAlign: "center",
          textBaseline: "top",
          fill: "#fff",
          fontSize: 12,
        },
      });
      return shape;
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
