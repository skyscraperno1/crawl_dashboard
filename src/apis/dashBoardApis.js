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
 * order: string,
 * orderType: "ASC" | "DESC"
 * } data
 * @returns Promise<any>
 */
export function getProjectPage(data) {
  return Ajax({
    url: "v1/api/coin/findCoinProjectByPage",
    method: "POST",
    data,
  });
}

/**
 *
 * @param {
 * id: number,
 * isHold: string,  0或者1
 * } params
 * @returns Promise<any>
 */
export function followProject(params, showMessage) {
  return Ajax({
    url: "/v1/api/coin/holdProject",
    method: "POST",
    params
  }, showMessage);
}

/**
 *
 * @param {
* key: "wx" | "tg" | "qq",
* token: string,
* } params
* @returns Promise<any>
*/
export function getTokenInfo(params) {
  return Ajax({
    url: "/v1/api/msg/findMsgByToken",
    method: "POST",
    params
  });
}

/**
 *
 * @param {
* key: "xhs" | "dy" | "wb",
* coinId: number,
* } params
* @returns Promise<any>
*/
export function getCoinInfo(params) {
  return Ajax({
    url: "v1/api/search/findDataByCoinId",
    method: "POST",
    params
  });
}

/**
 *
 * @param {
* key: "baidu" | "bing" | "google",
* coinId: number,
* } params
* @returns Promise<any>
*/

export function getSearchInfo(params) {
  return Ajax({
    url: "v1/api/ssBaidu/findDataByCoinId",
    method: "POST",
    params
  })
}

export function getOverDetailNum(id) {
  return Ajax({
    url: '/v1/api/coin/findPlatformCountById',
    method: 'POST',
    params: { id }
  })
}