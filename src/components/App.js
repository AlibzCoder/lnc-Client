import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import history from '../history';
import { Logout } from '../redux/actions';
import { useEvent } from '../utills';

import Index from './Index';
import Login from './Login';



const App = (props) => {


    useEvent(() => props.Logout(), 'CALL_LOGOUT')



    return (
        <Router history={history} >
            <Switch>
                <Route path="/" exact component={Index} />
                <Route path={["/Login", "/Signup"]} exact component={Login} />
            </Switch>
        </Router>
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
