import {Route, Switch , useLocation} from 'react-router-dom';
import { connect } from 'react-redux';
import history from '../history';
import { Logout } from '../redux/actions';
import { useEvent } from '../utills';
import Index from './Index';
import Login from './Login';
import Main from './Main';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';



const App = (props) => {

    const {pathname} = useLocation();

    const [cookies, setCookie, removeCookie] = useCookies();
    useEffect(()=>{history.replace("Authorization" in cookies?'/Main':'/Login')},[pathname])


    useEvent(() => props.Logout(), 'CALL_LOGOUT')



    return (
        <Switch>
            <Route path="/" exact component={Index} />
            <Route path={["/Login", "/Signup"]} exact component={Login} />
            <Route path="/Main" exact component={Main} />
        </Switch>
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
