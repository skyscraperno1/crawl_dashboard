import { splitTextToFitWidth } from "./G6Config";
export function getAddress(pathname) {
  const idx = pathname.lastIndexOf("/");
  const hash = pathname.substring(idx + 1);
  if (hash === "detail") {
    return "";
  } else {
    return hash;
  }
}
export function getType(pathname) {
  const splitArr = pathname.split("/");
  if (splitArr.length === 2) {
    return "";
  } else {
    return splitArr[2];
  }
}

let rightCount = 0;
let leftCount = 0;
export function handleData(edges, address, rootX) {
  let _nodes = [];
  edges.forEach((it) => {
    _nodes.push(it.from_address, it.to_address);
  });
  _nodes = [...new Set(_nodes)];
  _nodes = _nodes.map((node) => {
    const isRoot = node === address;
    return {
      x: isRoot ? rootX : undefined,
      y: isRoot ? 0 : undefined,
      id: node,
      label: splitTextToFitWidth(node, 180),
    };
  });
  const _edges = edges.map((it) => {
    let left = true;
    if (it.to_address === address) {
      _nodes.forEach((node) => {
        if (node.id === it.from_address && node.x === undefined) {
          rightCount++;
          node.x = rootX + 500;
          node.y = rightCount * 100;
        }
      });
    } else if (it.from_address === address) {
      left = false
      _nodes.forEach((node) => {
        if (node.id === it.to_address && node.x === undefined) {
          leftCount++;
          node.x = rootX - 500;
          node.y = leftCount * 100;
        }
      });
    }

    return {
      id: it.from_address + it.to_address,
      source: it.from_address,
      target: it.to_address,
      amount: it.raw_amount,
      time: `[${it.year}-${it.month}-${it.day}]`,
      left
    };
  });
  const len = Math.max(leftCount, rightCount);
  _nodes.forEach((node) => {
    if (node.id === address) {
      node.y = (len / 2) * 100;
    }
  });
  return {
    nodes: _nodes,
    edges: _edges,
  };
}
