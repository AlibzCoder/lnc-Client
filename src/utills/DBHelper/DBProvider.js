import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { DBHelper } from ".";

export const DBcontext = React.createContext(null);
export const DB_VERSION = 1;

export const useIDB = () => useContext(DBcontext)

const IDBProviderComponent = ({ children }) => {

    const [dbHelper, setDBHelper] = useState(null);
    const [isDBOpen, setIsDBOpen] = useState(false);

    useEffect(() => {
        if (dbHelper) dbHelper.open().then(db => setIsDBOpen(true))
        else setDBHelper(new DBHelper(DB_VERSION))
    }, [dbHelper])


    console.log(dbHelper);

    return <DBcontext.Provider value={dbHelper}>{children}</DBcontext.Provider>
}
const IDBProvider = connect(state => { return { Users: state.Users } })(IDBProviderComponent)
export default IDBProvider;