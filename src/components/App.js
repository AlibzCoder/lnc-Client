import {Route, Switch , useLocation} from 'react-router-dom';
import { connect } from 'react-redux';
import history from '../history';
import { Logout } from '../redux/actions';
import { useEvent, usePrevious } from '../utills';
import Index from './Index';
import Login from './Login';
import Main from './Main';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';

import innitSocket, { SocketIoContext } from '../api/socket-io'

const App = (props) => {

    const [socketIO,setSocketIO] = useState(null);



    const {pathname} = useLocation();
    const prevPathname = usePrevious(pathname)

    const [cookies, setCookie, removeCookie] = useCookies();
    

    
    useEffect(()=>{history.replace("Authorization" in cookies?'/Main':prevPathname==='/Login'?'/Signup':'/Login')},[pathname])
    useEvent(props.Logout, 'CALL_LOGOUT')


    useEvent(()=>{if(!socketIO&&"Authorization" in cookies) setSocketIO(innitSocket(cookies.Authorization))},'SOCKET_IO_CONNECT')



    return (
        <SocketIoContext.Provider value={socketIO}>
            <Switch>
                <Route path="/" exact component={Index} />
                <Route path={["/Login", "/Signup"]} exact component={Login} />
                <Route path="/Main" exact component={Main} />
            </Switch>
        </SocketIoContext.Provider>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        Logout: () => dispatch(Logout())
    }
}
const mapStateToProps = (state) => {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
