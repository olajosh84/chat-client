import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import chatImg from "../assets/images/chat.png";
import { Alert } from "../components";
import { useGlobalContext } from "../context";
import axios from "axios";

const ResetPassword = () => {
    const { user, SERVER_URI, alert, setAlert, hideAlert } = useGlobalContext();
    const [ showSpinner, setShowSpinner ] = useState(false);
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const navigate = useNavigate();
    const {userId} = useParams();

    const resetPassword = async (e) => {
        e.preventDefault();
        setShowSpinner(true);
        try {
            const { data } = await axios.patch(`${SERVER_URI}/auth/passwordReset/${userId}`, { password, confirmPassword });
            setAlert(prevAlert => {
                return {...prevAlert, show: true, icon: 'check', message: data.msg};
            });
            setShowSpinner(false);
            setPassword(""); 
            setConfirmPassword("");
            navigate('/login');
            
        } catch (error) {
            setShowSpinner(false);
            setAlert(prevAlert => {
                return {...prevAlert, show: true, icon: 'ban', message: error.response.data.msg};
            });
        }
    }
    /**if the user has logged in, redirect to home page */
    useEffect(() => {
        const redirect = () => {
            if(user?.userId){
                navigate('/');
            }
        }
        redirect();
    },[user?.userId, navigate])
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
                    <div className="reset-password rounded-4 p-3 shadow">
                        <h4>Password Reset</h4>
                        <form>
                            <div className="input-group mt-3 mb-3">
                                <span className="input-group-text"><i className="fas fa-lock"></i></span>
                                <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Password" />
                            </div>
                            <div className="input-group mt-3 mb-3">
                                <span className="input-group-text"><i className="fas fa-lock"></i></span>
                                <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" placeholder="Retype Password" />
                            </div>
                            <button className="btn btn-primary mb-3 me-2" disabled={showSpinner ? 'disabled' : ''} onClick={resetPassword}>
                                {showSpinner && <span className="spinner-border spinner-border-sm me-2"></span>}
                                {showSpinner ? 'Please wait...' : 'Submit'}
                            </button>
                            <Link to="/login" className="btn btn-danger mb-3">
                               Cancel
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResetPassword;