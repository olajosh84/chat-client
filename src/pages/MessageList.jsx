import Message from "../components/Message";
import avatar from "../assets/images/user.jpg";
import { useGlobalContext } from "../context";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loading } from "../components";
import EmojiPicker, {
    EmojiStyle,
    Theme,
    
} from "emoji-picker-react";
import axios from "axios";

const MessageList = ({socket}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const { user, SERVER_URI, isDarkMode, wallpaper } = useGlobalContext();
    const [receiver, setReceiver] = useState(null);
    const [conversationId, setConversationId] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [arrivalMessage,setArrivalMessage] = useState(null);
    const [messageError, setMessageError] = useState("");
    const [lastMessageId, setLastMessageId] =useState("");
    //const [searchParams] = useSearchParams();
    //const receiverId = searchParams.get('receiverId');
    const {receiverId} = useParams();
    //const conversationId = searchParams.get('conversationId');
    const navigate = useNavigate();
    const messageRef = useRef(null);

    const selectEmoji = (emojiData, event) => {
        setText(prevText => {
            return prevText + emojiData.emoji;
        })
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowEmoji(false);
        setIsSending(true);
        let newId = "";
        const convoData = {senderId: user.userId, receiverId}
        /**if there's no active conversation between them, first save a conversation
         * and then get the last conversation id and set the conversation id state to the new id
         */
        if(!conversationId){
            try {
                await axios.post(`${SERVER_URI}/conversations`, convoData);
                //console.log('new convo created')
                const lastId = await axios.get(`${SERVER_URI}/conversations/lastId`);
                setConversationId(lastId.data);
                newId = lastId.data;
            } catch (error) {
                console.log(error)
            }
        }
        try {
            const textData = {conversationId: conversationId ? conversationId : newId, senderId: user.userId, receiverId, text}
            await axios.post(`${SERVER_URI}/messages`, textData);
            setMessages(prevmessages => {
                return [...prevmessages, textData];
            })
        } catch (error) {
            setMessageError(error.response.data.msg);
        }
        /**get the last message id*/
        try {
            const lastId = await axios.get(`${SERVER_URI}/messages/lastId`);
            setLastMessageId(lastId.data)
            //console.log(lastMessageId)
        } catch (error) {
            console.log(error);
        }
        /**send message to socket server*/
        socket.emit("sendMessage", {conversationId, senderId: user?.userId, receiverId, text});
        setText("");
        setIsSending(false);
    }
    /**get arrival message*/
    useEffect(() => {
        try {
            socket.on("getMessage", (data) => {
                setArrivalMessage({conversationId: data?.conversationId, senderId: data?.senderId, text: data?.text})
            })
        } catch (error) {
            console.log(error)
        }
        
    },[socket])
    /**update messages if there is an arrivalmessage and if a conversationid exists and the id is the onecoming from socket server*/
    useEffect(() => {
        if(arrivalMessage && conversationId && arrivalMessage.conversationId === conversationId){
            setMessages(prevMessages => {
                return [
                    ...prevMessages,
                    arrivalMessage
                ]
            })
        }
    },[arrivalMessage, conversationId]);
    /*redirect to login page if username does not exist*/
    useEffect(() => {
        const redirect = () => {
            if(!user.username){
                navigate("/login");
            } 
        }
        redirect()
    }, [user.username, navigate])
    /**fetch the receiverinfo and update the receiver state */
    useEffect(() => {
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
    }, [receiverId, SERVER_URI]);
    /*get the current conversation id: ignore the undefined if it exists*/
    useEffect(() => {
        const getUserConversationId = async () => {
            try {
                let {data} = await axios.get(`${SERVER_URI}/conversations/fetchConversations?userId=${user.userId}`);
                let newData = data.map(converse => {
                    if (converse.members.find(m => m === receiverId)){
                        return converse?._id;
                    }else{
                        return undefined;
                    }
                }).filter(id => id !== undefined);
                setConversationId(...newData);
                //console.log(conversationId)
            } catch (error) {
                console.log(error)
            }
        }
        getUserConversationId();
        
    },[user.userId, receiverId, SERVER_URI]);
    
    /*get all messages for the current conversation*/
    useEffect(() => {
        setIsLoading(true);
        const getUserMessages = async () => {
            try {
                const {data} = await axios.get(`${SERVER_URI}/messages/${conversationId}`);
                setIsLoading(false);
                setMessages(data); 
            } catch (error) {
                setIsLoading(false);
                console.log(error)
            }
        }
        getUserMessages();
    },[conversationId, SERVER_URI])

    /**
     * Update conversation document with the lastest message id;
     * */
    useEffect(() => {
        const updateConversation = async () => {
            try {
                await axios.patch(`${SERVER_URI}/conversations/updateConversation?conversationId=${conversationId}&messageId=${lastMessageId}`);
            } catch (error) {
                console.log(error)
            }
            
        }
        if(lastMessageId && conversationId){
            updateConversation();
        }
        
    }, [lastMessageId, conversationId, SERVER_URI])
    
    /* scrolls the latest message into view automatically */
    useEffect(() => {
        messageRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages])
    //dismiss message error after 3 seconds
    useEffect(() => {
        const err = setTimeout(() => {
            setMessageError("");
        }, 3000);
        //clear side effect
        return () => {
            clearTimeout(err);
        }
    },[messageError])
    //show spinner instead while messages load
    if(isLoading){
        return (
            <section className="container message-list mt-3 mb-3">
                <div className="card ">
                    <div className={`card-header bg-gradient ${isDarkMode ? 'text-bg-success ' : 'text-bg-primary '}`}>
                        <img src={receiver?.profileImg || avatar} className="user-avatar rounded-pill me-2" alt="" />
                        <span>{receiver?.username}</span>
                    </div>
                    <div className="card-body message-body" style={wallpaper}>
                        {/*Loading image*/} 
                        <Loading text="Loading..."/>
                        {/*Emoji icons*/} 
                        {showEmoji && <div className="emoji-container">
                            <EmojiPicker 
                                onEmojiClick={selectEmoji}
                                autoFocusSearch={false}
                                emojiStyle={EmojiStyle.NATIVE}
                                theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
                            /> 
                        </div>}
                    </div>
                    <div className={`card-footer message-footer ${isDarkMode ? 'text-bg-dark' : ''}`}>
                        <span className="message-icon"><i className={`fa ${showEmoji ? 'fa-solid fa-keyboard' : 'fa fa-smile' }`}></i></span>
                        <textarea name="text" className="form-control text-box" placeholder="Enter message..." />
                        <button className="btn btn-sm btn-outline-primary" title="Send message">
                            <span className="send-message-icon"><i className="fa-solid fa-paper-plane"></i></span>
                        </button>
                    </div>
            </div>
            </section>
        )
    }
    return (
        <section className="container message-list mt-3 mb-3">
            <div className="card ">
                <div className={`card-header bg-gradient ${isDarkMode ? 'text-bg-success ' : 'text-bg-primary '}`}>
                    <img src={receiver?.profileImg || avatar} className="user-avatar rounded-pill me-2" alt="" />
                    <span>{receiver?.username}</span>
                </div>
                <div className="card-body message-body" style={wallpaper}>
                    
                    {
                        messages.map((message, index) => {
                            return  <div key={index} ref={messageRef}>
                                        <Message mine={message.senderId === user.userId ? true : ""} {...message} receiverImg={receiver?.profileImg} />
                                    </div>
                        })
                    }
                    {/*Emoji icons*/} 
                    {showEmoji && <div className="emoji-container">
                        <EmojiPicker 
                            onEmojiClick={selectEmoji}
                            autoFocusSearch={false}
                            emojiStyle={EmojiStyle.NATIVE}
                            theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
                            width={320}
                            height={420}
                        /> 
                    </div>}
                </div>
                <div className="card-footer message-footer">
                    <span className="message-icon" onClick={() => setShowEmoji(prevState => !prevState)}><i className={`fa ${showEmoji ? 'fa-solid fa-keyboard' : 'fa fa-smile' }`}></i></span>
                    <textarea name="text" value={text} onClick={() => setShowEmoji(false)} onChange={(e) => setText(e.target.value)} className="form-control text-box" placeholder="Enter message..." />
                    {messageError && <small className="text-danger">{messageError}</small>}
                    <button className="btn btn-sm btn-outline-primary" title="Send message" onClick={handleSubmit} disabled={isSending ? 'disabled' : ''}>
                        {isSending && <span className="spinner-border spinner-border-sm"></span>}
                        {!isSending && <span className="send-message-icon"><i className="fa-solid fa-paper-plane"></i></span>}
                    </button>
                </div>
           </div>
        </section>
    )
}

export default MessageList;