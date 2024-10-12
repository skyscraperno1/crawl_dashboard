import Ajax from "./Ajax";

export function getFromData(toAddress, type, token) {
  const tokenAddress = type === 'bep20' ? token : undefined
  return Ajax({
    url: `/v1/api/${type}/findFromByTo`,
    method: "POST",
    params: {
      toAddress,
      orderBy: 'desc',
      tokenAddress
    },
  });
}

export function getToData(fromAddress, type, token) {
  const tokenAddress = type === 'bep20' ? token : undefined
  return Ajax({
    url: `/v1/api/${type}/findToByFrom`,
    method: "POST",
    params: {
      fromAddress,
      orderBy: 'desc',
      tokenAddress
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
