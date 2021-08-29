import { Route, Switch, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import history from '../history';
import { Logout, Profile } from '../redux/actions';
import { useEvent, usePrevious } from '../utills';
import Index from './Index';
import Login from './Login';
import Main from './Main';
import { withCookies } from 'react-cookie';
import { useEffect, useState } from 'react';

import innitSocket, { SocketIoContext } from '../api/socket-io'
import PeerConnectionsProvider from '../utills/Peers/PeerConnectionsProvider';
import IDBProvider from '../utills/DBHelper/DBProvider';

const App = (props) => {

    const { cookies } = props;

    const [socketIO, setSocketIO] = useState(null);


    const { pathname } = useLocation();
    const prevPathname = usePrevious(pathname)

    useEffect(() => { history.replace(cookies.get("Authorization") ? '/Main' : prevPathname === '/Login' ? '/Signup' : '/Login') }, [pathname])
    useEffect(() => {
        if (props.Profile.state === 0 && cookies.get("Authorization")) {
            props.getProfile().then(() => {
                if (!socketIO) setSocketIO(innitSocket(cookies.get("Authorization"), props.dispatch))
            })
        }
    }, [props.Profile, pathname])
    useEvent(props.Logout, 'CALL_LOGOUT')







    return (
        <IDBProvider>
            <SocketIoContext.Provider value={socketIO}>
                <PeerConnectionsProvider>
                    <Switch>
                        <Route path="/" exact component={Index} />
                        <Route path={["/Login", "/Signup"]} exact component={Login} />
                        <Route path="/Main" exact component={Main} />
                    </Switch>
                </PeerConnectionsProvider>
            </SocketIoContext.Provider>
        </IDBProvider>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        Logout: () => dispatch(Logout()),
        getProfile: () => dispatch(Profile())
    }
}
const mapStateToProps = (state) => {
    return {
        Profile: state.Profile
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withCookies(App));
