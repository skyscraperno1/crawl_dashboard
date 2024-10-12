import Ajax from "./Ajax";

export function getFromData(toAddress, type) {
  return Ajax({
    url: `/v1/api/${type}/findFromByTo`,
    method: "POST",
    params: {
      toAddress,
      orderBy: 'desc',
      tokenAddress: '0x77db21020df1e8f8548bd0d48dfbc23c0d4fbf07'
    },
  });
}

export function getToData(fromAddress, type) {
  return Ajax({
    url: `/v1/api/${type}/findToByFrom`,
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
