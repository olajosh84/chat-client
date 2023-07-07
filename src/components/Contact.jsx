import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import { useEffect, useState } from "react";

const Contact = ({username, _id, firstName, lastName, profileImg, userBgColor, onlineUsers}) => {
    const [isOnline,setIsOnline] = useState(false);
    const {getInitials} = useGlobalContext();
    
    useEffect(() => {
        if(_id){
            setIsOnline(onlineUsers.some(user => user.userId === _id));
        }
    },[onlineUsers, _id])
    return  <div className="contact-item">
                <Link to={`/chat/${_id}`} className="contact px-4" >
                    {profileImg && <img src={profileImg} className="user-avatar rounded-pill" alt="" />}
                    {!profileImg && <div className="user-avatar-alt rounded-pill text-white d-flex align-items-center justify-content-center" style={{background: `${userBgColor}`}}><strong>{getInitials(firstName,lastName,username)}</strong></div>}
                    <div className="d-flex flex-column">
                        <span>{firstName || lastName ? firstName +' '+lastName : username}</span>
                        {isOnline && <span className="online-status text-success">online</span>}
                    </div>
                </Link>
            </div> 
    
}

export default Contact;