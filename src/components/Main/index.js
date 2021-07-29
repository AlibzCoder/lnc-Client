import {ChevronLeft,Search} from '@material-ui/icons';
import userImage from '../../assets/images/45936439.jpg'
import Input from '../../utills/Input';
import './style.scss'

const Main = props =>{
    return <div className="page main-page">
        <div className="main-chats-list">
            <div className="d-flex ai-center">
                <ChevronLeft fontSize="large" />
                <h2 style={{paddingTop:5}}>Peaple nearby</h2>
            </div>
            <hr/>

            <div className="main-user-profile">

                <div className="profile-image flat-neumorphic-shadow">
                    <img src={userImage}/>
                </div>
                <h3>Ali Banai</h3>

            </div>
            <hr/>
            
            <div className="main-chat-list-box">
                <Input
                    icon={<i class="fal fa-search"></i>}
                    neumorphic={true} type="text" placeholder="Find"
                />
            </div>


        </div>
        <div className="main-chat-box">

        </div>
        <div className="main-current-chat-info">

        </div>
    </div>
}
export default Main;