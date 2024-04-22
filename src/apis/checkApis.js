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

/**
 *
 * @param {toAddress: string, fromAddress: string} params
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
