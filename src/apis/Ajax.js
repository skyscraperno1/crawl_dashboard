import axios from 'axios'

const Axios = axios.create({
  // baseURL: '/api',
  // baseURL: 'http://' + window.location.hostname + ':9011',
  baseURL: 'http://http://192.168.110.50:9011',
  timeout: 10000
})

Axios.interceptors.request.use(config => {
  return config
})

Axios.interceptors.response.use(res => {
  return res.data
})

/**
 * 请求进行async + await处理
 * @param {{url: string, method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH', data: any, params: any}} req 请求对象
 * @returns {Promise}
 */
const Ajax = req => {
  const { url, method, data, params } = req
  if (!req.url) {
    throw new Error('请求没有url')
  }
  return new Promise(resolve => {
    Axios.request({
      url,
      method: method || 'GET',
      data: data || {},
      params: params || {}
    }).then((result) => {
      resolve(result)
    }).catch((error) => {
      resolve(error)
    })
  })
}
export default Ajax