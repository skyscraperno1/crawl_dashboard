import Ajax from "./Ajax";

export function getOverAllData() {
  return Ajax({
    url: "v1/api/coin/findProjectStatistics",
    method: "POST",
  });
}

/**
 *
 * @param {
 * pageNum: number,
 * pageSize: number,
 * isHold: string,  0或者1
 * name: string,
 * net: string,
 * pair: string,
 * source: string,
 * token: string
 * } data
 * @returns Promise<any>
 */
export function getProjectPage(data) {
  return Ajax({
    url: "v1/api/coin/findCoinProjectByPage",
    method: "POST",
    data
  });
}
