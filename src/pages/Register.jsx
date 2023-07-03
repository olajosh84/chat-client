import { Link, useNavigate } from "react-router-dom";
import chatImg from "../assets/images/chat.png";
import { Alert } from "../components";
import { useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../context";

const Register = () => {
    const navigate = useNavigate();
    const { SERVER_URI } = useGlobalContext();
    const { alert, setAlert, hideAlert } = useGlobalContext();
    const [ showSpinner, setShowSpinner ] = useState(false);
    const [ formData, setFormData ] = useState(
        {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    );
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => {
            return {...prevFormData, [name]: value}
        })
    } 
    const submitFormData = async (e) => {
        e.preventDefault();
        setShowSpinner(true);
        try {
            const { data } = await axios.post(`${SERVER_URI}/auth/register`, { username:formData.username, email:formData.email, password:formData.password, confirmPassword:formData.confirmPassword });
            setAlert(prevAlert => {
                return {...prevAlert, show: true, icon: 'check', message: data.msg}
            })
            setShowSpinner(false);
            //clear form
            setFormData(prevData => {
                return {username:"",email:"",password:"",confirmPassword:""}
            })
            //redirect to login page
            navigate('/login');
        } catch (error) {
            setShowSpinner(false);
            setAlert(prevAlert => {
                return {...prevAlert, show: true, icon: 'ban', message: error.response.data.msg}
            })
        }
    }
    
    return (
        <section className="container mt-5 mb-3">
            <div className="row">
                <div className="col-md-6 chat-img">
                    <img src={chatImg} alt="chat img" className="img-fluid" />
                </div>
                <div className="col-md-6">
                    {alert.show && <Alert icon={alert.icon} message={alert.message} hideAlert={hideAlert} />}
                    <div className="chat-register p-3 shadow rounded-4">
                        <h4>Sign Up</h4>
                        <form>
                            <div className="input-group mt-3 mb-3">
                                <span className="input-group-text text-secondary">@</span>
                                <input type="text" name="username" className="form-control" value={formData.username} onChange={handleInputChange} placeholder="Username" autoComplete="off" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text text-secondary"><i className="fa fa-envelope"></i></span>
                                <input type="text" name="email" className="form-control" value={formData.email} onChange={handleInputChange} placeholder="Email" autoComplete="off"  />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text text-secondary"><i className="fas fa-lock"></i></span>
                                <input type="password" name="password" className="form-control" value={formData.password} onChange={handleInputChange} placeholder="Password" autoComplete="off"  />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text text-secondary"><i className="fas fa-lock"></i></span>
                                <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Retype Password" autoComplete="off"  />
                            </div>
                            <button className="btn btn-primary mb-3" disabled={`${showSpinner ? 'disabled' : ''}`} onClick={submitFormData}>
                                {showSpinner && <span className="spinner-border spinner-border-sm" style={{marginRight: "0.3rem"}}></span>}
                                {showSpinner ? 'Please wait...' : 'Submit'}
                            </button>
                            <p>Signed up already? Please <Link to="/login">Login</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register;