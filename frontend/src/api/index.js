import axios from 'axios'
import { message } from 'antd'
import { useAuthStore } from '../store/auth'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code === 200 || data.code === 201) {
      return data
    }
    message.error(data.message || '请求失败')
    return Promise.reject(data)
  },
  (error) => {
    const { response } = error
    if (response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
      message.error('登录已过期，请重新登录')
    } else {
      message.error(response?.data?.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default api
