import axios from 'axios'
import { message } from 'antd';
import { calValueType } from '../utils';
const Axios = axios.create({
  baseURL: '/api',
  // baseURL: 'http://' + window.location.hostname + ':9011',
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
const Ajax = (req, showMessage) => {
  const { url, method, data, params } = req
  if (!req.url) {
    throw new Error('请求没有url')
  }
  return new Promise((resolve, reject) => {
    Axios.request({
      url,
      method: method || 'GET',
      data: data || {},
      params: params || {},
    }).then((result) => {
      if (result.code === 200) {
        if (showMessage) {
         const msg = calValueType(showMessage, 'string') ? showMessage : result?.msg || "操作成功"
         message.success(msg, 0.8);
        }
        resolve(result.data)
      } else {
        const msg = result?.message || result?.msg || '网络错误' 
        message.error(msg)
        reject(result)
      }
    }).catch((error) => {
      const msg = error?.message || '网络错误' 
      message.error(msg)
      resolve(error)
    })
  })
}
export default Ajax