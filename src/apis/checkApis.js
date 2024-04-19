import Ajax from "./Ajax";

export function checkAddress(address) {
  return Ajax({
    url: "/v1/api/bep20/findBep20ByAddress",
    method: "POST",
    params: {
      address,
    },
  });
}

/**
 *
 * @param {toAddress: string, fromAddress: string, symbol: string} params
 * @returns
 */
export function checkEdgeAdd(params) {
  return Ajax({
    url: "/v1/api/bep20/findAddressByEdge",
    method: "POST",
    params,
  });
}

export function checkBnBAddress(address) {
  return Ajax({
    url: "/v1/api/bnb/queryBnbByAddress",
    method: "POST",
    params: {
      address,
    },
  });
}

/**
 *
 * @param {toAddress: string, fromAddress: string} params
 * @returns
 */
export function checkBnBEdge(params) {
  return Ajax({
    url: "/v1/api/bnb/queryEdge",
    method: "POST",
    params,
  });
}
