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

export function handleData(edges, address, first, nodeId) {
  let _nodes = first ? [{
    id: address,
    address,
    label: splitTextToFitWidth(address, 176)
  }] : [];

  edges.forEach((it) => {
    const nodeAddress = it.from_address === address ? it.to_address : it.from_address;
    _nodes.push({
      id: `${nodeAddress}__${uniqueId()}`,
      address: nodeAddress,
      label: splitTextToFitWidth(nodeAddress, 176),
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