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

export function handleData(edges, address, first, nodeId, trans) {
  let _nodes = first ? [{
    id: address,
    address,
    label: splitTextToFitWidth(address, 176),
    highlight: false
  }] : [];

  edges.forEach((it) => {
    const nodeAddress = it.from_address === address ? it.to_address : it.from_address;
    _nodes.push({
      id: `${nodeAddress}__${uniqueId() + Date.now()}`,
      address: nodeAddress,
      label: splitTextToFitWidth(nodeAddress, 176),
      highlight: false,
      trans
    })
  })
  const nodeMap = {};
  _nodes.forEach(node => {
    nodeMap[node.address] = node.id; 
  });
  const _edges = edges.map((it) => {
    if (it.from_address === address) {
      return {
        raw_amount: it.raw_amount,
        time: `[${it.year}-${it.month}-${it.day}]`,
        count: it.cishu,
        source: nodeId ? nodeId : address,
        target: nodeMap[it.to_address],
        highlight_in: false,
        highlight_out: false,
        trans
      }
    } else {
      return {
        raw_amount: it.raw_amount,
        time: `[${it.year}-${it.month}-${it.day}]`,
        count: it.cishu,
        source: nodeMap[it.from_address],
        target:  nodeId ? nodeId : address,
        highlight_in: false,
        highlight_out: false,
        trans
      }
    }
  });
  return {
    nodes: _nodes,
    edges: _edges,
  };
}