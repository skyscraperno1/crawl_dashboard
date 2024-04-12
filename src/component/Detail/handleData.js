function getColor(symbol) {
  if (symbol === "USDT") {
    return "#6ba995";
  } else if (symbol === "BNB") {
    return "#e0b444";
  } else {
    return "#b5b4b2";
  }
}

// function getSvg(label) {
//   const svg = `
//   <svg width="300" xmlns="http://www.w3.org/2000/svg" height="225">
//   <rect x="5" y="5" width="290" height="190" rx="10" ry="10" fill="#212121" stroke="#bd7c40" stroke-width="4" />
//   <foreignObject width="300" height="225">
//   <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; padding: 10px; box-sizing: border-box;">
//     <p style="color: #e9ebf0; font-size: 60px">
//     ${label}
//     </p>
//   </div>
//   </foreignObject>
// </svg>
// `;
//   const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
//   return url;
// }

export function handleData(nodes, edges, address) {
  const _nodes = nodes.map((it) => {
    const isRoot = it.address === address;
    return {
      x: isRoot ? 0 : undefined,
      y: isRoot ? 500 : undefined,
      id: it.address,
      label: it.address,
      widthConstraint: isRoot ? 100 : 150,
    };
  });

  let rightCount = 0;
  let leftCount = 0;
  let duplicateEdges = {};
  const _edges = edges.map((it) => {
    if (it.to_address === address) {
      _nodes.forEach((node) => {
        if (node.id === it.from_address && node.x === undefined) {
          rightCount++;
          node.x = 400;
          node.y = rightCount * 100;
        }
      });
    } else if (it.from_address === address) {
      _nodes.forEach((node) => {
        if (node.id === it.to_address && node.x === undefined) {
          leftCount++;
          node.x = -400;
          node.y = leftCount * 100;
        }
      });
    }
    const key = it.from_address + it.to_address;
    if (Object.hasOwnProperty.call(duplicateEdges, key)) {
      duplicateEdges[key]++;
    } else {
      duplicateEdges[key] = 1;
    }
    return {
      id: it.from_address + it.to_address + it.symbol,
      from: it.from_address,
      to: it.to_address,
      color: getColor(it.symbol),
      label: `[${it.year}-${it.month}-${it.day}]`,
      font: {
        color: "#fff",
      },
      smooth: { roundness: duplicateEdges[key] * 0.1 },
    };
  });
  return {
    nodes: _nodes,
    edges: _edges,
  };
}
