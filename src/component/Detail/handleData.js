function getColor(symbol) {
  if (symbol === "USDT") {
    return "#6ba995";
  } else if (symbol === "BNB") {
    return "#e0b444";
  } else {
    return "#b5b4b2";
  }
}
let rightCount = 0;
let leftCount = 0;
let duplicateEdges = {};

export function handleData(edges, address) {
  let _nodes = [];
  edges.forEach((it) => {
    _nodes.push(it.from_address, it.to_address);
  });
  _nodes = [...new Set(_nodes)];
  _nodes = _nodes.map((node) => {
    const isRoot = node === address;
    return {
      x: isRoot ? 0 : undefined,
      y: isRoot ? 500 : undefined,
      id: node,
      label: node,
      widthConstraint: isRoot ? 100 : 150,
    };
  });
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
        strokeWidth: 0,
      },
      smooth: { roundness: duplicateEdges[key] * 0.1 },
    };
  });
  return {
    nodes: _nodes,
    edges: _edges,
  };
}

export function pushData(oldData, edges, address) {
  let _nodes = [];
  edges.forEach((it) => {
    const exist = oldData.nodes.some(
      (val) => val.id === it.from_address || val.id === it.to_address
    );
    if (!exist) {
      _nodes.push(it.from_address, it.to_address);
    }
  });
  _nodes = [...new Set(_nodes)];
  _nodes = _nodes.map((node) => {
    return {
      x: undefined,
      y: undefined,
      id: node,
      label: node,
      widthConstraint: 150,
    };
  });
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
        strokeWidth: 0,
      },
      smooth: { roundness: duplicateEdges[key] * 0.1 },
    };
  });
  return {
    nodes: _nodes,
    edges: _edges,
  };
}
