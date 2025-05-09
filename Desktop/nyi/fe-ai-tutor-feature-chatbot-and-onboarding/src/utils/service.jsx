import axios from "axios";

const backendApi = '/api'
export const _service = async (url, method, data = null) => {
    return await axios(`${backendApi + url}`, { method, data })
}
export const _authService = async (url, method, data = null) => {
    const token = localStorage.getItem('token');
    return await axios(`${backendApi + url}`, { method, data, headers: { Authorization: `Bearer ${token}` } })
}