import {Conversation, Loading} from "../components";
import chatImg from "../assets/images/chat.png";
import { useGlobalContext } from "../context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import colors from "../assets/js/colors";

const ConversationList = ({socket,onlineUsers}) => {
    const {user, isDarkMode, SERVER_URI} = useGlobalContext();
    const [userConversations, setUserConversations] = useState([]);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [arrivalMessageCount, setArrivalMessageCount] = useState([])
    const navigate = useNavigate();
    
    /**fetch the number of arrival messages to later show as number of unread messages */
    useEffect(() => {
        socket.on("getMessage", (data) => {
            setArrivalMessageCount(prevMessage => [...new Set([...prevMessage, data])]);;
        })
    },[socket])
    useEffect(() => {
        setIsAuthenticating(true);
        if(!user.username){
            const redirect = () => {
                return navigate('/login');
            }
            redirect()
        }else{
            setIsAuthenticating(false);
        }
    },[user.username, navigate]);

    /*fetch all of a user's active conversations*/
    useEffect(() => {
        setIsLoading(true);
        const getUserConversations = async () => {
            try {
                const {data} = await axios.get(`${SERVER_URI}/conversations/fetchConversations?userId=${user.userId}`);
                setUserConversations(data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
           
        }
        getUserConversations();
    },[user.userId, arrivalMessageCount, SERVER_URI]);
    
    /*show loader when authenticating user*/
    if(isAuthenticating){
        return  <section className="container my-4 conversation-container">
                    <Loading text="Authenticating..." />
                </section>
                    
    }
    return  <section className="container my-4 conversation-container">
                <div className="row">
                    <div className="col-md-5">
                        <div className="conversation-list shadow rounded-4 py-4">
                            <h4 className={`px-4 mb-4 ${isDarkMode ? 'text-white' : 'text-dark' }`} >{`Hi, ${user?.username}`}</h4>
                            {/*<form>
                                <div className="input-group px-4 mb-4">
                                    <input type="text" className="form-control" onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
                                    <button className="btn btn-sm btn-success">Go!</button>
                                </div>
                            </form>*/}
                            {
                                isLoading ? <Loading /> :
                                userConversations.map(conversation => {
                                    let bgColor = Math.floor(Math.random() * colors.length);
                                    return <Conversation 
                                        key={conversation._id} 
                                        conversations = {conversation} 
                                        userBgColor={colors[bgColor]} 
                                        onlineUsers={onlineUsers} 
                                    />
                                })
                                
                            }
                           
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="chat-img">
                            <img src={chatImg} alt="chat img" className="img-fluid" />
                        </div>
                    </div>
                </div>
            </section>
}

export default ConversationList;