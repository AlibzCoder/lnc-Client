import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import {createStore , applyMiddleware , compose} from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './redux/reducers/index';
import App from './components/App'
import './styles/index.scss';
import history from './history';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose ;
const store = createStore(reducers , composeEnhancers(applyMiddleware(reduxThunk)));


ReactDom.render(
    <Router history={history}><Provider store={store}><App/></Provider></Router>,
    document.getElementById('root')
);