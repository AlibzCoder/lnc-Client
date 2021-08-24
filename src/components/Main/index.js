import { connect } from 'react-redux';
import ChatsList from './ChatsList';
import UserProfile from './UserProfile';
import './style.scss'
import { CircularProgress } from '@material-ui/core';

import ChatLayout from './ChatLayout';



const Main = props => {
    return <div className="page main-page">
        <ChatsList />
        <div className="main-page-content">
            <ChatLayout />
            <div className="main-current-chat-info">

            </div>
        </div>
    </div>
}
const mapStateToProps = state => {
    return {
        Profile: state.Profile,
        Users: state.Users,
        CurrentChat: state.CurrentChat
    }
}
const mapDispatchToProps = dispatch => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);