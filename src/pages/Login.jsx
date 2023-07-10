import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import chatImg from "../assets/images/chat.png";
import { Alert, Loading } from "../components";
import { useGlobalContext } from "../context";
import axios from "axios";

const Login = () => {
    const { SERVER_URI, alert, setAlert, user, hideAlert, setUserToken } = useGlobalContext();
    const [ showSpinner, setShowSpinner ] = useState(false);
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ isLoading, setIsLoading ] = useState(true);
    const navigate = useNavigate();
    
    const submitFormData = async (e) => {
        e.preventDefault();
        setShowSpinner(true);
        try {
            const { data } = await axios.post(`${SERVER_URI}/auth/login`, { username, password });
            localStorage.setItem("token", data.token);
            setUserToken(data.token);
            setShowSpinner(false);
            setAlert(prevAlert => {
                return {...prevAlert, show: true, icon: 'check', message: data.msg};
            });
            //setUser({username: username})
            setUsername(""); 
            setPassword("");
            /*redirect to chat page*/
            navigate('/');
           
        } catch (error) {
            setShowSpinner(false);
            setAlert(prevAlert => {
                return {...prevAlert, show: true, icon: 'ban', message: error.response.data.msg};
            });
        }
    }
    //redirect to home page if already logged in
    useEffect(() => {
        setIsLoading(true);
        if(user.username){
            setIsLoading(false);
            const redirect = () => {
                return navigate('/');
            }
            redirect()
        }else{
            return setIsLoading(false);
        }
    },[user.username, navigate])

    /**show loader while checking if user has logged in or not */
    if(isLoading){
        return  <section className="container mt-5 mb-3">
                    <Loading text="Authenticating..." />
                </section>
    }
    return (
        <section className="container mt-5 mb-3">
            <div className="row">
                <div className="col-md-6">
                    <div className="chat-img">
                        <img src={chatImg} alt="chat img" className="img-fluid" />
                    </div>
                </div>
                <div className="col-md-6">
                    {alert.show && <Alert icon={alert.icon} message={alert.message} hideAlert={hideAlert} />}
                    <div className="chat-login shadow p-3 rounded-4">
                        <h4>Login</h4>
                        <form>
                            <div className="input-group mt-3 mb-3">
                                <span className="input-group-text text-secondary">@</span>
                                <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" autoComplete="off" placeholder="Username" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text text-secondary"><i className="fa fa-lock"></i></span>
                                <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" autoComplete="off" placeholder="Password" />
                            </div>
                            <button className="btn btn-primary mb-3" disabled={showSpinner ? 'disabled' : ''} onClick={submitFormData}>
                                {showSpinner && <span className="spinner-border spinner-border-sm me-2"></span>}
                                {showSpinner ? 'Please wait...' : 'Login'}
                            </button>
                            {username && username.length >= 4 && <div>Forgot password? <Link to={`/verifyUser/${username}`}>Reset password</Link></div>}
                            <div>Don't have an account? Please <Link to="/register">Sign up</Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login;