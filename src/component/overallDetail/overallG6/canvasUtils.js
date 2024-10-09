import { uniqueId } from 'lodash'
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

export function handleData(edges) {
  let _nodes = [];

  const addedNodes = new Set();

  edges.forEach((it) => {
    if (!addedNodes.has(it.from_address)) {
      _nodes.push({ id: it.id,  address: it.from_address });
      addedNodes.add(it.from_address);
    }
    if (!addedNodes.has(it.to_address)) {
      _nodes.push({ id: it.id,  address: it.to_address });
      addedNodes.add(it.to_address); 
    }
  });
  _nodes = _nodes.map((node) => {
    return {
      id: node.id,
      address: node.address,     
      label: splitTextToFitWidth(node.address, 250),
    };
  });
  const nodeMap = {};
  _nodes.forEach(node => {
    nodeMap[node.address] = node.id; 
  });
  const _edges = edges.map((it) => {
    const sourceId = nodeMap[it.from_address]; 
    const targetId = nodeMap[it.to_address];
    console.log(sourceId);
    return {
      id: it.from_address + it.to_address,
      source: sourceId,
      target: targetId,
      amount: it.raw_amount,
      time: `[${it.year}-${it.month}-${it.day}]`,
    };
  });
  return {
    nodes: _nodes,
    edges: _edges,
  };
}

export function _handleData(edges, address, first, nodeId) {
  let _nodes = first ? [{
    id: address,
    address,
    label: splitTextToFitWidth(address, 100)
  }] : [];

  edges.forEach((it) => {
    const nodeAddress = it.from_address === address ? it.to_address : it.from_address;
    _nodes.push({
      id: `${nodeAddress}__${uniqueId()}`,
      address: nodeAddress,
      label: splitTextToFitWidth(nodeAddress, 100),
    })
  })
  const nodeMap = {};
  _nodes.forEach(node => {
    nodeMap[node.address] = node.id; 
  });
  const _edges = edges.map((it) => {
    if (it.from_address === address) {
      return {
        amount: it.raw_amount,
        time: `[${it.year}-${it.month}-${it.day}]`,
        source: nodeId ? nodeId : address,
        target: nodeMap[it.to_address],
      }
    } else {
      return {
        amount: it.raw_amount,
        time: `[${it.year}-${it.month}-${it.day}]`,
        source: nodeMap[it.from_address],
        target:  nodeId ? nodeId : address,
      }
    }
  });
  return {
    nodes: _nodes,
    edges: _edges,
  };
}