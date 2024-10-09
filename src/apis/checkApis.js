import Ajax from "./Ajax";

export function checkAddress(address, type) {
  const url =
    type === "Bep20"
      ? "/v1/api/bep20/findBep20ByAddress"
      : "/v1/api/bnb/queryBnbByAddress";
  return Ajax({
    url,
    method: "POST",
    params: {
      address,
    },
  });
}

export function getFromData(toAddress) {
  return Ajax({
    url: "/v1/api/bep20/findFromByTo",
    method: "POST",
    params: {
      toAddress,
      orderBy: 'desc',
      tokenAddress: '0x77db21020df1e8f8548bd0d48dfbc23c0d4fbf07'
    },
  });
}

export function getToData(fromAddress) {
  return Ajax({
    url: "/v1/api/bep20/findToByFrom",
    method: "POST",
    params: {
      fromAddress,
      orderBy: 'desc',
      tokenAddress: '0x77db21020df1e8f8548bd0d48dfbc23c0d4fbf07'
    },
  });
}

/**
 *
 * @param {toAddress: string, fromAddress: string, tokenAddress: string} params
 * @returns
 */
export function checkEdgeAdd(params, type) {
  const url =
    type === "Bep20"
      ? "/v1/api/bep20/findAddressByEdge"
      : "/v1/api/bnb/queryEdge";
  return Ajax({
    url,
    method: "POST",
    params,
  });
}
