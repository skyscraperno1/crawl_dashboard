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
 * @param {toAddress: string, fromAddress: string, tokenAddress: string | undefined} params
 * @returns
 */
export function checkDetail(params, type) {
  return Ajax({
    url: `/v1/api/${type}/findAddressByEdge`,
    method: "POST",
    params,
  });
}