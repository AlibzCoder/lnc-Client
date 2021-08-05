import { connect } from 'react-redux';
import ChatsList from './ChatsList';
import UserProfile from './UserProfile';
import './style.scss'




const Main = props => {
    return <div className="page main-page">
        <div className="main-chats-list">
            <UserProfile/>
            <ChatsList/>
        </div>
        <div className="main-chat-box">

        </div>
        <div className="main-current-chat-info">

        </div>
    </div>
}
const mapStateToProps = state => {
    return {
        Profile: state.Profile,
        Users: state.Users
    }
}
const mapDispatchToProps = dispatch => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);