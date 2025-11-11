import { API_ROOT } from '@/config/api';
import Axios from 'axios';

Axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    config.withCredentials = true;
    config.baseURL = API_ROOT;
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
);

Axios.interceptors.response.use(
  function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default Axios;
