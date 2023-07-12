import avatar from "../assets/images/user.jpg";
import TimeAgo from "timeago-react"; 
import { useGlobalContext } from "../context";

const Message = ({mine, text, createdAt, receiverImg}) => {
    const {isDarkMode, user} = useGlobalContext();
    let bgColor='';
    let userImg="";
    if(mine && isDarkMode){
        bgColor = 'bg-dark text-white'
    }else if(mine && !isDarkMode){
        bgColor = 'text-bg-secondary'
    }else if(isDarkMode && !mine){
        bgColor = 'text-bg-success'
    }else{
        bgColor = 'text-bg-primary'
    }
    if(mine && user?.profileImg){
        userImg = user?.profileImg
    }else if(!mine && receiverImg){
        userImg = receiverImg
    }else{
        userImg = avatar;
    }
    return (
        <div className= {`user-message-container ${mine ? 'own-message': ''}`}>
            <div className="user-message-info">
                <img src={userImg} className="user-avatar message-avatar rounded-pill" alt="" />
                <div className={`message-sent rounded-2 ${bgColor}`} >
                    <div className="px-2 py-1 fs-5">{text}</div>
                    <div className="px-2" style={{backgroundColor: "rgba(0,0,0,0.1)"}}>
                        <small className="time-sent" style={{fontSize: "0.7rem",}}>
                            <TimeAgo datetime={createdAt} />
                        </small> 
                    </div>
                    
                </div>
            </div>
            
        </div>
    )
}

export default Message;