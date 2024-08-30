import Ajax  from "./Ajax";
export function getDomains(data) {
  return Ajax({
    url: 'v1/api/stCerts/findLastTen',
    method: 'POST',
    data
  })
}