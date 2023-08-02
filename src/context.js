import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SERVER_URI = process.env.REACT_APP_SERVER_URI;
const token = localStorage.getItem('token');
const darkMode = localStorage.getItem('darkMode');
const userWallpaper = {backgroundImage: "", backgroundRepeat:"no-repeat", backgroundSize: "cover", backgroundPosition: "center"};

const AppContext = createContext();
const AppProvider = ({children}) => {
    const [isDarkMode, setIsDarkMode] = useState(darkMode === 'true' ? true : false);
    const [userToken, setUserToken] = useState(token);
    const [ alert, setAlert ] = useState({show: false, icon: "", message: ""});
    const [ user, setUser ] = useState({username:"", userId: "", email: "", firstName: "", lastName: ""});
    const [wallpaper, setWallpaper] = useState(JSON.parse(localStorage.getItem('wallpaper')) || userWallpaper);
    const [ showUserMenu, setShowUserMenu ] = useState(false);
    
    const hideAlert = () => {
        setAlert(prevAlert => {
            return {...prevAlert, show: false}
        })
    }
    /*get the user initials*/
    const getInitials = (firstName="", lastName="", username) => {
        let initials = "";
        if(firstName || lastName){
            let nameInitials = firstName.slice(0,1) + lastName.slice(0,1);
            initials = nameInitials.toUpperCase()
        }else {
            let usernameInitial = username.slice(0,1);
            initials = usernameInitial.toUpperCase();
        }
        return initials
    }
    /** if user changes, check if he is authenticated. if yes, get his info */
    /*const changeUser = async () => {
        try {
            const {data} = await axios.get(`${SERVER_URI}/v1/users/fetchUser`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
           
            setUser(prevState => {
                return {
                    ...prevState,
                    username: data.user.username,
                    userId: data.user._id,
                    email: data.user.email,
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                    profileImg: data.user.profileImg
                }
            });
            
        } catch (error) {
            console.log(error.response.data.msg);
        }
       
    }*/
    useEffect(() => {
        const getUserData = async () => {
            try {
                const {data} = await axios.get(`${SERVER_URI}/users/fetchUser`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });
               
                setUser(prevState => {
                    return {
                        ...prevState,
                        username: data.user.username,
                        userId: data.user._id,
                        email: data.user.email,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        profileImg: data.user.profileImg
                    }
                });
                
            } catch (error) {
                console.log(error.response.data.msg);
            }
        }
        getUserData()
    }, [userToken])

    /*hide alert after 3 seconds*/
    useEffect(() => {
        let hide = setTimeout(() => {
            hideAlert();
        }, 3000);
        return () => {
            clearTimeout(hide);
        }
    },[alert])
  
    return  <AppContext.Provider value=
                {
                    {
                        SERVER_URI,
                        alert,
                        setAlert,
                        hideAlert,
                        userToken,
                        setUserToken,
                        user,
                        setUser,
                        isDarkMode,
                        setIsDarkMode,
                        wallpaper,
                        setWallpaper,
                        getInitials,
                        showUserMenu,
                        setShowUserMenu
                    }
                }
            >
                {children}
            </AppContext.Provider>
}
/** Custom Hook */
const useGlobalContext = () => {
    return useContext(AppContext);
}

export { AppProvider,useGlobalContext };