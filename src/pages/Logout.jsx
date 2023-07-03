import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";

const Logout = () => {
    const { setUser } = useGlobalContext();
    const navigate = useNavigate();
    useEffect(() => {
        const logOut = async () => {
            await localStorage.removeItem('token');
            setUser({username: "", userId: ""});
            navigate('/login');
        }
        logOut();
    })
    
}

export default Logout;