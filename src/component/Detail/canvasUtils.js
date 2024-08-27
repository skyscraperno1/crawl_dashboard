import { splitTextToFitWidth } from "./G6Config";
export function getAddress(pathname, page = 'detail') {
  const idx = pathname.lastIndexOf("/");
  const hash = pathname.substring(idx + 1);
  if (hash === page) {
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
      isRoot,
      label: splitTextToFitWidth(node, 180),
    };
  });
  const _edges = edges.map((it) => {
    let left = true;
    if (it.to_address === address) {
      _nodes.forEach((node) => {
        if (node.id === it.from_address && node.x === undefined) {
          rightCount++;
          node.left = left;
          node.x = rootX + 800;
          node.y = rightCount * 100;
        }
      });
    } else if (it.from_address === address) {
      left = false;
      _nodes.forEach((node) => {
        if (node.id === it.to_address && node.x === undefined) {
          leftCount++;
          node.left = left;
          node.x = rootX - 800;
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
      left,
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

export function deduplicate(array, key = 'id') {
  const map = new Map();
  let leftCount = 0;
  let rightCount = 0;
  array.forEach(item => {
    if (!map.has(item[key])) {
      if (!item.isRoot) {
        if (item.left) {
          leftCount++
        } else  {
          rightCount++
        }
      }
      map.set(item[key], item);
    }
  });
  const result = Array.from(map.values());
  const len = Math.max(leftCount, rightCount);
  result.forEach((it) => {
    if (it.isRoot) {
      it.y = (len / 2) * 100;
    }
  })
  return result;
}

export function handleL2Node(edges, sourceNode, originNodes) {
  let _nodes = []
  edges.forEach((edge) => {
    const hasNode = originNodes.some((it) => (it.id === edge.from_address && it.id !== sourceNode) || (it.id === edge.to_address && it.id !== sourceNode));
    if (!hasNode) {
      _nodes.push(edge.from_address, edge.to_address)
    }
  })
  _nodes = [...new Set(_nodes)];

  const originItem = originNodes.find(el => el.id === sourceNode)
  if (originItem) {
    _nodes = _nodes.map((node) => {
      return {
        x: originItem.x,
        y: originItem.y,
        id: node,
        label: splitTextToFitWidth(node, 180)
      }
    })
    let _leftCount = 0;
    let _rightCount = 0;
    const _edges = edges.map((it) => {
      let left = true;
      if (it.to_address === sourceNode) {
        _nodes.forEach((node) => {
          if (node.id === it.to_address) {
            _leftCount++;
            node.left = left;
            node.x = node.x + 500;
            node.y = node.y + _leftCount * 100
          } 
        })
      } else if (it.from_address === sourceNode) {
        left = false;
        _nodes.forEach((node) => {
          if (node.id === it.to_address) {
            _rightCount++;
            node.left = left;
            node.x = node.x - 500;
            node.y = node.y + _rightCount * 100
          } 
        })
      }

      return {
        id: it.from_address + it.to_address,
        source: it.from_address,
        target: it.to_address,
        amount: it.raw_amount,
        time: `[${it.year}-${it.month}-${it.day}]`,
        left,
      }
    })
    return {
      nodes: _nodes,
      edges: _edges
    }
  } else {
    return {
      nodes: [],
      edges: []
    }
  }
  
}