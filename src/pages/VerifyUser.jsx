import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import chatImg from "../assets/images/chat.png";
import { Alert } from "../components";
import { useGlobalContext } from "../context";
import axios from "axios";

const VerifyUser = () => {
    const { user, SERVER_URI, alert, setAlert, hideAlert } = useGlobalContext();
    const [ showSpinner, setShowSpinner ] = useState(false);
    const [ email, setEmail ] = useState("");
    const navigate = useNavigate();
    const { username } = useParams();

    const verifyEmail = async (e) => {
        e.preventDefault();
        setShowSpinner(true);
        try{
            const { data } = await axios.post(`${SERVER_URI}/auth/verifyUser/${username}`, { email });
            navigate(`/resetPassword/${data.userId}`);
            setShowSpinner(false);
            setEmail("")
        } catch(error){
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
                    <div className="verify-user p-3 rounded-4 shadow">
                        <h4>Email Verification</h4>
                        <form>
                            <div className="input-group mt-3 mb-3">
                                <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                                <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" className="form-control" placeholder="Email" />
                            </div>
                            <button className="btn btn-primary mb-3 me-2" disabled={`${showSpinner ? 'disabled' : ''}`} onClick={verifyEmail}>
                                {showSpinner && <span className="spinner-border spinner-border-sm me-2"></span>}
                                {showSpinner ? 'Please wait...' : 'Submit'}
                            </button>
                            <Link to="/login" className="btn btn-danger mb-3">
                               Back
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VerifyUser;