importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-messaging.js');

let db;
function OpenIndexedDB(){
    return new Promise(function(resolve,reject){
      //var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
      if (!indexedDB) {
        reject("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.")
        console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
      }
  
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
        //objectStore.add({isLoggedIn:'isLoggedIn',value:0});
      };
    });
}
function isLoggedIn(){
    return new Promise(function(resolve,reject){
        let isLoggedInRequest = db.transaction("isLoggedIn").objectStore("isLoggedIn").get("isLoggedIn");
        isLoggedInRequest.onsuccess = function(event) {resolve(event.target.result.value)};
        isLoggedInRequest.onerror = function(err) {reject(err)};
    })
}
self.addEventListener('activate', function(event) {
  OpenIndexedDB().then((database)=>db=database);
});


// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    "apiKey": "AIzaSyB8ZCvMicQlp-ptTf1cslGD1ex32dHdLls",
    "authDomain": "chiwant-279004.firebaseapp.com",
    "databaseURL": "https://chiwant-279004.firebaseio.com",
    "projectId": "chiwant-279004",
    "storageBucket": "chiwant-279004.appspot.com",
    "messagingSenderId": "320962406919",
    "appId": "1:320962406919:web:dd799f391b2ba5a186d8a2",
    "measurementId": "G-R862DPGFMP"
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    isLoggedIn().then((isLoggedIn)=>{
        if(isLoggedIn){
            let data = payload.data;
            if("notification" in data){
                let notification = JSON.parse(data.notification)
                self.registration.showNotification(notification.title,{body:notification.body,icon: '/logo192.png'});
            }
        }
    })
});

