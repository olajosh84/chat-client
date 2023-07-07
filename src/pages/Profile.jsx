import avatar from "../assets/images/user.jpg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "../components";
import { useGlobalContext } from "../context";
import axios from "axios";

const Profile = () => {
    const { user, hideAlert, alert, setAlert, isDarkMode, SERVER_URI } = useGlobalContext();
    const [ showSpinner, setShowSpinner ] = useState(false);
    const [firstName, setFirstName] = useState(user?.firstName);
    const [lastName, setLastName] = useState(user?.lastName);
    const [profileImg, setProfileImg] = useState(user?.profileImg);
    const navigate = useNavigate();
   
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
    };
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setProfileImg(base64);
    };
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setShowSpinner(true);
        try {
            const {data} = await axios.patch(`${SERVER_URI}/users/${user.userId}`, {firstName, lastName, profileImg});
            setShowSpinner(false);
            setAlert({show: true, icon: 'check', message: data.msg});
            navigate(0)
        } catch (error) {
            setShowSpinner(false);
            if(error.response.data.msg){
                setAlert({show: true, icon: 'ban', message: error.response.data.msg});
            } else {
                setAlert({show: true, icon: 'ban', message: "Something went wrong. File may be too large"});
            }
            
        }

    }

    useEffect(() => {
        const redirect = () => {
            if(!user.username){
                navigate('/login');
            } 
        }
        redirect()
    },[user.username, navigate]);
    
    return  (
        <section className="container mt-5 mb-3">
            {alert.show && <Alert icon={alert.icon} message={alert.message} hideAlert={hideAlert} />}
            <div className="card">
                <div className={`card-header bg-gradient ${isDarkMode ? 'text-bg-success' : 'text-bg-primary'} `}>Profile</div>
                <div className="card-body profile-body" >
                    <div className="row">
                        <div className="col-md-4">
                            <div className="profile-img-container d-grid">
                                <img className="img-fluid rounded-pill" src={profileImg || avatar} alt="avatar" style={{width:"250px", height: "250px"}} />
                                <label htmlFor="profileImg" className="profile-img-label pt-2">Upload Image<i className="fa-solid fa-upload ms-2"></i></label>
                            </div>
                            <input type="file" id="profileImg" style={{display: "none"}} onChange={handleFileChange} name="profileImg" accept=".jpg, .jpeg, .png"  />
                        </div>
                        <div className="col-md-8">
                            <div className="input-group mt-3 mb-3">
                                <span className="input-group-text">@</span>
                                <input type="text" className="form-control" defaultValue={user.username} disabled />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                                <input type="text" className="form-control" defaultValue={user.email} disabled />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fas fa-user"></i></span>
                                <input type="text" className="form-control" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fas fa-user"></i></span>
                                <input type="text" className="form-control" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
                            </div>
                            <button className="btn btn-primary" disabled={showSpinner ? 'disabled' : ''} onClick={handleProfileUpdate}>
                                {showSpinner && <span className="spinner-border spinner-border-sm me-1" ></span>}
                                {showSpinner ? 'Please wait' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Profile;