import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {useLocation} from "react-router-dom";
import {ApiLogin,SignUp} from '../../redux/actions'
import signin_vector from '../../assets/images/signin_vector.svg'
import Input from "../../utills/Input";
import './style.css'
import history from "../../history";
import { Button } from "@material-ui/core";
import { convertTypeAcquisitionFromJson } from "typescript";
import LoaderButton from "../../utills/LoaderButton";
import CustomLink from "../../utills/CustomLink";


//User Name Should Start with EN alphabet and at least be 4 characters
const usernameRegex = RegExp('');

const Login = props => {
    
    const {LoginState} = props;

    const {pathname} = useLocation();
    const [name,setName] = useState(null)
    const [userName,setUserName] = useState(null)
    const [password,setPassword] = useState(null)

    const [nameError,setNameError] = useState(null)
    const [userNameError,setUserNameError] = useState(null)
    const [passwordError,setPasswordError] = useState(null)


    const [signUpLoading,setSignUpLoading] = useState(false)
    const [loginLoading,setLoginLoading] = useState(false)



    useEffect(()=>{
        setNameError(null)
        setUserNameError(null)
        setPasswordError(null)
    },[pathname])


    useEffect(()=>{
        if(LoginState.state===4&&'err' in LoginState){
            switch(LoginState.err.errorCode){
                case 'USER_EXISTS':
                case 'USER_NOT_FOUND':
                    setUserNameError(LoginState.err.errorMessage)
                    break;
                case 'INCORRECT_PASSWORD':
                    setPasswordError(LoginState.err.errorMessage)
                    break;
            }
        }else if(LoginState.state===2)
            history.replace('/')
    },[LoginState])


    


    const Login = ()=>{
        props.ApiLogin(userName,password);
    }

    const SignUp = ()=>{
        props.SignUp(name,userName,password).then(()=>{
            Login();
        })
    }

    const validateForm = (callback)=>{
        let nameValid = true;
        let usernameValid = true;
        let passwordValid = true;

        if(!name){
            setNameError('Please Enter Your Name');
            nameValid = false;
        }

        if(!userName){
            setUserNameError('Please Enter Your User Name');
            usernameValid = false;
        }else if(callback!=="login"&&!userName.match(/^[A-Za-z][A-Za-z0-9_]{3,29}$/)){
            setUserNameError('User Name Should Start with EN alphabet and at least be 4 characters');
            usernameValid = false;
        }else{setUserNameError('')}

        if(!password){
            setPasswordError('Please Enter Your Password');
            passwordValid = false;
        }else if(callback!=="login"&&!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)){
            setPasswordError('Password should contain at least one upper case character , lower case character , a Number and be at least 8 character');
            passwordValid = false;
        }else{setPasswordError('')}
        

        if(callback==="login"?(usernameValid&&passwordValid):(nameValid&&usernameValid&&passwordValid)){
            callback==="login" ? Login() : SignUp();
        }
    }
    


    return <div className="login-page page flex-center">

        <img src={signin_vector} className="login-vector" />
        <div className={`login-form flex-center ${pathname==="/Login"?'sign-in':'sign-up'}`}>

            <div className="sign-in-form flat-neumorphic-shadow">
                <div className="flex-center" style={{justifyContent:'space-between',alignItems:'flex-start'}}>
                    <h1>Hi there!</h1>
                    <CustomLink disabled={loginLoading} to="/Signup">Sign up</CustomLink>
                </div>
                <span>Lets get Started.</span>
                <div style={{padding:'1.25em 0.25em'}}>
                    <Input
                        icon={<i className="fal fa-user"></i>}
                        neumorphic={true} type="text" placeholder="User name"
                        onChange={e=>setUserName(e.target.value.trim())}
                        error={Boolean(userNameError)}
                    />
                    <span className="error">{userNameError}</span>
                    <Input
                        icon={<i className="fal fa-lock"></i>}
                        neumorphic={true} type="password" placeholder="Password"
                        onChange={e=>setPassword(e.target.value.trim())}
                        error={Boolean(passwordError)}
                    />
                    <span className="error">{passwordError}</span>
                </div>

                <LoaderButton 
                    isLoading={loginLoading}
                    variant="contained"
                    color="primary" 
                    disableElevation={true} 
                    onClick={()=>validateForm('login')}>
                    Sign in
                </LoaderButton>
            </div>

            <div className="sign-up-form flat-neumorphic-shadow">
                <div className="flex-center" style={{justifyContent:'space-between',alignItems:'flex-start'}}>
                    <h1>Welcome</h1>
                    <CustomLink disabled={signUpLoading} to="/Login">Sign in</CustomLink>
                </div>
                <span>Lets get you Signed up.</span>
                <div style={{padding:'1.25em 0.25em'}}>
                    <Input
                        icon={<i className="fal fa-user"></i>}
                        neumorphic={true} type="text" placeholder="Name"
                        onChange={e=>setName(e.target.value.trim())}
                        error={Boolean(nameError)}
                    />
                    <span className="error">{nameError}</span>
                    <Input
                        icon={<i className="fal fa-user"></i>}
                        neumorphic={true} type="text" placeholder="User name"
                        onChange={e=>setUserName(e.target.value.trim())}
                        error={Boolean(userNameError)}
                    />
                    <span className="error">{userNameError}</span>
                    <Input
                        icon={<i className="fal fa-lock"></i>}
                        neumorphic={true} type="password" placeholder="Password"
                        onChange={e=>setPassword(e.target.value.trim())}
                        error={Boolean(passwordError)}
                    />
                    <span className="error">{passwordError}</span>
                </div>

                <LoaderButton 
                    isLoading={signUpLoading}
                    variant="contained"
                    color="primary" 
                    disableElevation={true} 
                    onClick={()=>validateForm('signup')}>
                    Sign up
                </LoaderButton>
            </div>
            
        </div>


    </div>
}


export default connect(state=>{
    return {
        LoginState:state.LoginState
    }
},dispatch=>{
    return {
        ApiLogin:(username,password)=>dispatch(ApiLogin(username,password)),
        SignUp:(name,username,password)=>dispatch(SignUp(name,username,password))
    }
})(Login);