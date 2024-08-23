import Ajax  from "./Ajax";

/**
 * 
 * @param {pageNum: number, pageSize: number, domain: string, endTime: number, startTime: number} params 
 * @returns 
 */
export function stHost(data) {
  return Ajax({
    url: 'v1/api/stHostCollideResult/findStHostCollideResultByPage',
    method: 'POST',
    data
  })
}
export function stDomain(data) {
  return Ajax({
    url: 'v1/api/stIpToDomain/findStIpToDomainByPage',
    method: 'POST',
    data
  })
}
export function stCerts(data) {
  return Ajax({
    url: 'v1/api/stCerts/findStCertsByPage',
    method: 'POST',
    data
  })
}
export function stGithub(data) {
  return Ajax({
    url: 'v1/api/stGithub/findStGithubByPage',
    method: 'POST',
    data
  })
}
export function stSubdomain(data) {
  return Ajax({
    url: 'v1/api/stSubDomainsIps/findStSubDomainsIpsByPage',
    method: 'POST',
    data
  })
}
export function stWebTitle(data) {
  return Ajax({
    url: 'v1/api/stWebTitle/findStWebTitleByPage',
    method: 'POST',
    data
  })
}
export function stService(data) {
  return Ajax({
    url: 'v1/api/stService/findStServiceByPage',
    method: 'POST',
    data
  })
}
export function stVul(data) {
  return Ajax({
    url: 'v1/api/stService/findStServiceByPage',
    method: 'POST',
    data
  })
}
export function stSpider(data) {
  return Ajax({
    url: '/v1/api/stSpider/findStSpiderByPage',
    method: 'POST',
    data
  })
}
export function stRelative(data) {
  return Ajax({
    url: '/v1/api/stNewDomainAndCsubnet/findStNewDomainAndCsubnetByPage',
    method: 'POST',
    data
  })
}
export function stSearch(data) {
  return Ajax({
    url: '/v1/api/stWebSpaceName/findStWebSpaceNameByPage',
    method: 'POST',
    data
  })
}
