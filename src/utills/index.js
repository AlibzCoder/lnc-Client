import { useEffect, useRef } from 'react';

export const getCookie = (cname)=>{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
export const setCookie = (n, v, exDate)=>{
    var expires = "expires="+ exDate.toUTCString();
    document.cookie = n + "=" + v + ";" + expires + ";path=/";
}
export const deleteAllCookies = ()=>{
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}



export const toEnglishDegits = (string)=>{
  //replace persian and arabic numbers with english
  return string.replace(/[\u0660-\u0669\u06f0-\u06f9]/g, function (c) {return c.charCodeAt(0) & 0xf;});
}
export const maxLengthCheck = (e) => {
  e.target.value = toEnglishDegits(e.target.value).replace(/\D/g, "")
  if (e.target.value.length > e.target.maxLength) {
      e.target.value = e.target.value.slice(0, e.target.maxLength)
  }
}

const numberFormat = new Intl.NumberFormat('en-US', {style: 'decimal'});
export const formatNumber = (num)=>numberFormat.format(num);



export const isIOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const isEmpty = (obj)=>{
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}



function buildFormData(formData, data, parentKey) {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File) && !(data instanceof Blob)) {
      Object.keys(data).forEach(key => {
        if(data[key] instanceof Blob || data[key] instanceof File){
          buildFormData(formData, data[key], parentKey ? `${parentKey}` : key);
        }else{
          buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
        }
      });
  } else {
    if(data){
      if(data instanceof Blob){
        formData.append(parentKey, data,`${Date.now()}.${data.type.split('/')[1]}`);
      }else{
        formData.append(parentKey, data);
      }
    }
  }
}
export function jsonToFormData(data) {
  const formData = new FormData();
  buildFormData(formData, data);
  return formData;
}



export const useInterval  = (callback, delay)=>{
  const intervalRef = useRef();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof delay === 'number') {
      intervalRef.current = window.setInterval(() => callbackRef.current(), delay);
      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);
  return intervalRef;
}
export const usePrevious = (value)=>{
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const useEvent = (callback,event)=>{
  useEffect(()=>{
      const eventListener = (e)=>{callback(e.detail)}
      document.addEventListener(event,eventListener)
      return ()=>{document.removeEventListener(event,eventListener)}
  },[])
}



const OpenIndexedDB = ()=>{
  return new Promise((resolve,reject)=>{
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    if (!indexedDB) {
      reject("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.")
      throw "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.";
    }

    let db;
    let request = indexedDB.open("Chiwant");
    request.onerror = function(event) {
      reject(event)
      console.log("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = function(event) {
      db = event.target.result;
      resolve(db);
    };
    request.onupgradeneeded = function(event) {
      let objectStore = event.target.result.createObjectStore("isLoggedIn", { keyPath: "isLoggedIn" });
      objectStore.add({isLoggedIn:'isLoggedIn',value:false});
    };
  });
}

export const isLoggedIn = ()=>{
  return new Promise((resolve,reject)=>{
    OpenIndexedDB().then((db)=>{
      let isLoggedInRequest = db.transaction("isLoggedIn").objectStore("isLoggedIn").get("isLoggedIn");
      isLoggedInRequest.onsuccess = function(event) {resolve(event.target.result.value)};
      isLoggedInRequest.onerror = function(err) {reject(err)};
      db.close();
    }).catch((err)=>{console.log(err)})
  })
}
export const setIsLoggedIn = (isLoggedIn)=>{
  return new Promise((resolve,reject)=>{
    OpenIndexedDB().then((db)=>{
      let objectStore = db.transaction(["isLoggedIn"], "readwrite").objectStore("isLoggedIn");
      let isLoggedInRequest = objectStore.get("isLoggedIn");
      isLoggedInRequest.onsuccess = function(event) {
        let req = isLoggedInRequest.result;
        req.value = isLoggedIn;
        objectStore.put(req);
        resolve(isLoggedIn)
      };
      isLoggedInRequest.onerror = function(err) {reject(err)};
      db.close();
    }).catch((err)=>{console.log(err)})
  })
}


export function copyToClp(txt){
  var m = document;
  txt = m.createTextNode(txt);
  var w = window;
  var b = m.body;
  b.appendChild(txt);
  if (b.createTextRange) {
      var d = b.createTextRange();
      d.moveToElementText(txt);
      d.select();
      m.execCommand('copy');
  } 
  else {
      var d = m.createRange();
      var g = w.getSelection;
      d.selectNodeContents(txt);
      g().removeAllRanges();
      g().addRange(d);
      m.execCommand('copy');
      g().removeAllRanges();
  }
  txt.remove();
}