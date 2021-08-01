import axios from 'axios';
import history from '../history'
import {apiBaseUrl} from '../consts';
import {getCookie,setCookie} from '../utills'



const instance = axios.create({baseURL : apiBaseUrl});
const refreshTokenApi = axios.create({baseURL : apiBaseUrl});


export const callRefresh = ()=>new Promise((resolve,reject)=>{
  let Authorization = getCookie("Authorization")
  let RefreshToken = getCookie("RefreshToken")
  if(Authorization&&RefreshToken){
    let headers = {"Authorization": Authorization,"RefreshToken": RefreshToken}
    refreshTokenApi.post('/refreshToken', null, { "headers": headers }).then(res=>{
      var oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      setCookie("Authorization", res.data.Authorization,oneYearFromNow)
      resolve(res.data.Authorization)
    }).catch(err=>reject(err))
  }else{reject(null)}
})



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

      return new Promise(function(resolve, reject) {
        callRefresh().then(auth => {
          instance.defaults.headers.common['Authorization'] = auth;
          originalRequest.headers['Authorization'] = auth;
          processQueue(null, auth);
          resolve(instance(originalRequest));
        }).catch(err => {
          processQueue(err, null);
          document.dispatchEvent(new CustomEvent('CALL_LOGOUT'))
          reject(err);
        }).then(() => {isRefreshing = false;});
      });
    }
  }
  return Promise.reject(err);
}



instance.interceptors.response.use_ = use_;
instance.interceptors.request.use(interceptorConfig,interceptorCatchError);
instance.interceptors.response.use_(onResponse, onError);


export default instance;



