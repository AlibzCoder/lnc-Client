import { v4 as uuidv4 } from 'uuid';

export const DB_NAME = 'APP_DB';
export const CHAT_COLLECITON = 'CHAT_COLLECITON';
export const FILES_COLLECITON = 'FILES_COLLECITON';


export class DBHelper {
    #db;
    #indexedDB;
    isOpen = false;
    constructor(verison) {
        this.verison = verison;
        this.supported = true;
        this.#indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
        if (!this.#indexedDB) {
            this.supported = false;
            throw new Error("IndexedDB not supported");
        }
    }

    open() {
        return new Promise((resolve, reject) => {
            if (!this.supported) {
                reject("IndexedDB not supported")
                return;
            }

            let request = this.#indexedDB.open(DB_NAME, this.verison);

            request.onerror = function (event) {
                console.error("error opening IndexedDB", event);
                reject(event)
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
            request.onupgradeneeded = function (event) {
                //CREATE COLLECTIONS IF DONT EXISTS
                try {
                    event.target.result.createObjectStore(FILES_COLLECITON);
                    let chatObjectStore = event.target.result.createObjectStore(CHAT_COLLECITON, { keyPath: ['chatId','id']});
                    chatObjectStore.createIndex('chatId', 'chatId');
                } catch (err) { }

            };
        }).then((db) => {
            this.#db = db;
            this.isOpen = true;
            this.#db.onclose = e => {
                this.isOpen = false;
            }
        })
    }

    getObjectStore(collection) {
        if (this.#db)
            return this.#db.transaction(collection, "readwrite").objectStore(collection)
    }

    addMessage(message) {
        return new Promise(async (resolve, reject) => {
            if (message) {
                let chatStore = this.getObjectStore(CHAT_COLLECITON);
                if (chatStore) {
                    message = {...message,id:message.id ? message.id : uuidv4()};
                    // uuidv4 generates random uuid like '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
                    let request = chatStore.add(message);
                    request.onsuccess = e => resolve(message)
                    // request.onerror = e => {
                    //     //onerror handles duplicate id and calles the function again (likes thats ever gonna happer :) )
                    //     if(e.target.error.name === 'ConstraintError') resolve(this.addMessage(message))
                    //     else reject();
                    // }
                } else reject()
            } else reject()
        })
    }

    // getLastChatId(chatStore,chatId) {
    //     if (!chatStore) chatStore = this.getObjectStore(CHAT_COLLECITON);
    //     return new Promise((resolve)=>{
    //         chatStore.index('chatId').openCursor(chatId, 'prev').onsuccess = function (event) {
    //             if (event.target.result) resolve(event.target.result.value.id)
    //             resolve(0)
    //         };
    //     })
    // }

    getMessagesByChatId(chatId,skip,take) {
        let chatStore = this.getObjectStore(CHAT_COLLECITON);
        return new Promise((resolve,reject)=>{
            let messages = [];
            let cursorInstance = chatStore.index('chatId').openCursor(
                IDBKeyRange.bound(
                    [chatId,skip*take],
                    [chatId,(skip*take) + take]
                )
            )
            cursorInstance.onsuccess = e => {
                let cursor = e.target.result;
                if(cursor){
                    messages.push(cursor.value);
                    cursor.continue();
                }
                else resolve(messages)
            }
            cursorInstance.onerror = e => reject(e)
        })
    }


    get DB() {
        return this.#db
    }
}