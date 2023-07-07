import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import { useState, useEffect } from "react";
import axios from "axios";
const Conversation = ({conversations, userBgColor, onlineUsers}) => {
    const { user, SERVER_URI } = useGlobalContext();
    const [receiver, setReceiver] = useState([]);
    const [isOnline,setIsOnline] = useState(false);
    /**get the user initials*/
    const getInitials = () => {
        let initials = "";
        if(receiver?.firstName || receiver?.lastName){
            let nameInitials = receiver?.firstName.slice(0,1) + receiver?.lastName.slice(0,1);
            initials = nameInitials.toUpperCase()
        }else if(receiver?.username) {
            let usernameInitial = receiver?.username.slice(0,1);
            initials = usernameInitial.toUpperCase();
        }
        return initials
    }
    
    /*get the receiverId*/
    useEffect(() => {
        
        const receiverId = conversations.members.find(member => member !== user.userId);
        const getReceiverInfo = async () => {
            try {
                //const { data } = await axios.get(`http://localhost:8080/api/v1/users/fetchReceiverInfo?receiverId=${receiverId}`);
                const { data } = await axios.get(`${SERVER_URI}/users/fetchReceiver/${receiverId}`);
                setReceiver(data);
            
            } catch (error) {
                console.log(error);
            }
        }
        getReceiverInfo()
    },[user.userId, conversations.members, SERVER_URI]);
   
    /*show online users- check if the user is online*/
    useEffect(() => {
        if(receiver._id){
            setIsOnline(onlineUsers.some(user => user.userId === receiver?._id)) 
        }
    },[onlineUsers, receiver._id])

    return  <div className="conversation-item">
                <Link to={`/chat/${receiver._id}`} className="conversation px-4">
                        {receiver?.profileImg && <img src={receiver?.profileImg} className="user-avatar rounded-pill" alt="" />}
                        {!receiver?.profileImg && <div className="user-avatar-alt rounded-pill text-white d-flex align-items-center justify-content-center" style={{background: `${userBgColor}`}}>
                            <strong>{ getInitials() }</strong>
                        </div>}
                        <div className="d-flex flex-column">
                            <span>{receiver?.firstName || receiver?.lastName ? receiver?.firstName +' '+ receiver?.lastName : receiver?.username}</span>
                            {isOnline && <span className="online-status text-success">online</span>}
                        </div>
                </Link>
            </div>
}

export default Conversation;