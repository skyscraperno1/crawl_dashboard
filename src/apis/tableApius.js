import Ajax  from "./Ajax";

/**
 * 
 * @param {pageNum: number, pageSize: number, tokenAddress: string} params 
 * @returns 
 */
export function getTableData(data) {
  return Ajax({
    url: 'v1/api/tokenaddressliquidity/findTokenAddressTable',
    method: 'POST',
    data
  })
}