import axios from 'axios';
import history from '../history'
import {apiBaseUrl} from '../consts';
import {getCookie,setCookie} from '../utills'


let Authorization
let RefreshToken

const instance = axios.create({baseURL : apiBaseUrl});
const refreshTokenApi = axios.create({baseURL : apiBaseUrl});


const use_ = function(onFullfilled, onRejected) {
  instance.interceptors.response.use(
      // onFullfilled
      function(response) {
          try {
              return onFullfilled(response);
          }
          catch(e) {
              return onRejected(e);
          }
      },
      // onRejected
      onRejected,
  )
}
const interceptorConfig = (config)=>{
  config.headers["Authorization"] = getCookie("Authorization")
  config.headers["RefreshToken"] = getCookie("RefreshToken")
  return config;
};
const interceptorCatchError = (error)=>{return Promise.reject(error);};






let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};


const onResponse = (res)=>{
  if(res.data.Code==410){
    throw res;
  }
  return res;
}
const onError = (err)=>{
  console.log(err);
  if (err.response && err.response.status === 401) {
    const originalRequest = err.config;
    if(!originalRequest._retry){
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = token;
          return axios(originalRequest);
        }).catch(err => {return Promise.reject(err);});
      }
      originalRequest._retry = true;
      isRefreshing = true;

      Authorization = getCookie("Authorization")
      RefreshToken = getCookie("RefreshToken")

      if(Authorization&&RefreshToken){
        let headers = {
          "Authorization": Authorization,
          "RefreshToken": RefreshToken
        }
        return new Promise(function(resolve, reject) {
          refreshTokenApi.post('/identity/v1/Authorize/AuthRefreshToken', null, { "headers": headers }).then(response => {
            Authorization = response.Authorization
            RefreshToken = response.RefreshToken
  
            var oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  
            setCookie("Authorization", Authorization,oneYearFromNow)
            setCookie("RefreshToken", RefreshToken,oneYearFromNow)
  
  
  
            instance.defaults.headers.common['Authorization'] = Authorization;
            originalRequest.headers['Authorization'] = Authorization;
            processQueue(null, Authorization);
            resolve(instance(originalRequest));
  
            //instance.request(err.response.config);
          }).catch(err => {
            processQueue(err, null);
            document.dispatchEvent(new CustomEvent('CALL_LOGOUT'))
            reject(err);
          }).then(() => {isRefreshing = false;});
        });
      }else{
        history.push('/Login') // Go to login Page
      }
    }
  }
  return Promise.reject(err);
}



instance.interceptors.response.use_ = use_;
instance.interceptors.request.use(interceptorConfig,interceptorCatchError);
instance.interceptors.response.use_(onResponse, onError);


export default instance;



