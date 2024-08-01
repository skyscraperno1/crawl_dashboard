import Ajax  from "./Ajax";

export function getOverAllData() {
  return Ajax({
    url: 'v1/api/coin/findProjectStatistics',
    method: 'POST',
  })
}