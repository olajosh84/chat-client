import { useRef, useEffect, useState } from "react";
import avatar from "../assets/images/avatar.png";
import avatar2 from "../assets/images/avatar2.png";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import { Alert } from "../components";


const Settings = () => {
    const { user, isDarkMode, setIsDarkMode, alert, setAlert, hideAlert, wallpaper, setWallpaper } = useGlobalContext();
    const [ showSpinner, setShowSpinner ] = useState(false);
    const switchBtnRef = useRef(null);
    const navigate = useNavigate();

    const handleSwitch = () => {
        switchBtnRef.current.classList.toggle('active');
        setIsDarkMode(prevState => !prevState);
        if(isDarkMode){
            localStorage.setItem('darkMode', false);
        }else{
            localStorage.setItem('darkMode', true);
        }
    }
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
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setWallpaper(prevState => {
            return {
                ...prevState,
                backgroundImage: `url(${base64})`
            }
        })
    };
    const handleSaveWallpaper = async (e) => {
        e.preventDefault();
        setShowSpinner(true);
        try {
            await localStorage.setItem('wallpaper', JSON.stringify(wallpaper));
            setShowSpinner(false);
            setAlert(prevAlert => {
                return {...prevAlert, show: true, icon: 'check', message: "Wallpaper set successfully"};
            });
            
        } catch (error) {
            setShowSpinner(false);
            console.log(error)
            /*setAlert(prevAlert => {
                return {...prevAlert, show: true, icon: 'ban', message: "Could not set wallpaper. Clear storage and try again."};
            });*/
        }
        
    }
    const handleRemoveWallpaper = async (e) => {
        e.preventDefault();
        setShowSpinner(true);
        try {
            setWallpaper(prevState => {
                return {
                    ...prevState,
                    backgroundImage: ""
                }
            })
            await localStorage.getItem("wallpaper") && localStorage.removeItem('wallpaper');
            setShowSpinner(false);
            setAlert(prevAlert => {
                return {...prevAlert, show: true, icon: 'check', message: "Wallpaper removed successfully"};
            });
        } catch (error) {
            setShowSpinner(false);
            console.log(error);
        }
    }
    //check if user has logged in
    useEffect(() => {
        const redirect = () => {
            if(!user.username){
                navigate('/login');
            } 
        }
        redirect()
    },[user.username, navigate]);

    
    return  (
        <section className="container" style={{maxWidth: "800px"}}>
            {/*show alert if show=true */}
            {alert.show && <Alert icon={alert.icon} message={alert.message} hideAlert={hideAlert} />}
            <div className="card my-4">
                <div className={`card-header bg-gradient ${isDarkMode ? 'text-bg-dark' : 'text-bg-primary'}`}>Settings</div>
                <div className="card-body settings-container-body">
                    <div className="card-title mb-3">Wallpaper</div>
                    <div className="card mb-5">
                        <div className={`card-header bg-gradient ${isDarkMode ? 'bg-success text-white' : ''}`}>
                            <img src={avatar} className="user-avatar rounded-pill me-3" alt="" />
                            <span>John Doe</span>
                        </div>
                        <div className="card-body settings-wallpaper-body" style={wallpaper}>
                            <div className="receiver-message-container mb-3" >
                                <div className="message-left">
                                    <img src={avatar} className="user-avatar rounded-pill me-2" alt="" />
                                    <div className={`receiver-message ${isDarkMode ? 'bg-success bg-gradient' : 'bg-primary bg-gradient'}`}></div>
                                </div>
                            </div>
                            <div className="sender-message-container mb-3">
                                <div className="message-right">
                                    <div className={`sender-message ${isDarkMode ? 'bg-dark bg-gradient' : 'bg-secondary bg-gradient'}`}></div>
                                    <img src={avatar2} className="user-avatar rounded-pill ms-2" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="card-footer settings-wallpaper-footer">
                            <div className="settings-message-footer mb-3">
                                <span className="message-icon" style={{color: "darkorange"}}><i className="fa fa-smile"></i></span>
                                <textarea name="message" className="form-control text-box" disabled placeholder="Enter message..." />
                                <button className="btn btn-sm btn-outline btn-outline-primary">
                                    <span className="send-message-icon"><i className="fa-solid fa-paper-plane"></i></span>
                                </button>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex">
                                    <label htmlFor="wallpaperImg" className="change-wallpaper-label bg-warning py-1 px-2 me-2 rounded-2" style={{cursor:"pointer"}}>
                                    Change
                                    </label>
                                    <input type="file" id="wallpaperImg" onChange={handleFileUpload} style={{display: "none"}} accept=".png, .jpeg, .jpg"/>
                                    <button className="btn btn-sm btn-primary" disabled = {showSpinner ? 'disabled' : ''} onClick={handleSaveWallpaper}>
                                    {showSpinner && <span className="spinner-border spinner-border-sm me-2"></span>}
                                    {showSpinner ? 'Please wait' : 'Set wallpaper'}
                                    </button>
                                </div>
                                {wallpaper.backgroundImage && <button className="btn btn-sm btn-danger" disabled = {showSpinner ? 'disabled' : ''} onClick={handleRemoveWallpaper}>
                                    {showSpinner && <span className="spinner-border spinner-border-sm me-2"></span>}
                                    {showSpinner ? 'Please wait' : 'Remove'}
                                </button>}
                            </div>
                        </div>
                    </div>
                    <div className="dark-mode-container">
                        <div className="card-title">Dark Mode</div>
                        <div className={`switch-button-container ${isDarkMode ? 'active' : ''}`} ref={switchBtnRef} onClick={handleSwitch}>
                            <span></span>
                            <span></span>
                            <span className="toggle-btn"></span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    )
}

export default Settings;