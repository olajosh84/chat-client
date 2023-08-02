import { Routes, Route } from "react-router-dom";
import { NavBar, ScrollToTop } from "./components";
import { 
  ConversationList, ContactList, MessageList, Register, Login, Logout, Profile, Settings, VerifyUser, ResetPassword, NotFound 
} from "./pages";
import { useEffect, useState } from "react";
import { useGlobalContext } from "./context";
import socketio from "socket.io-client";
const socket = socketio.connect(process.env.REACT_APP_SOCKET_SERVER_URI);

const App = () => {
  //console.log(process.env.REACT_APP_SERVER_URI)
  const { user, isDarkMode, setShowUserMenu } = useGlobalContext();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const body = document.querySelector("body");
    if(isDarkMode){
      body.classList.add('dark-mode');
      //body.style.backgroundColor = "rgb(33, 37, 41)";
    }else{
      body.classList.remove('dark-mode');
      //body.style.backgroundColor = "#f1f5f8"
    }
  },[isDarkMode])
  useEffect(() => {
    if(user.userId){
      socket.emit("addUser", user?.userId);
      socket.on("onlineUsers", (data) => {
        setOnlineUsers(data);
      })
    }
  },[user.userId])
  
  /** click on any part the body except user avatar makes drop down disappear */
  useEffect(() => {
    const removeDropdown = (e) => {
      if(e.target.dataset.id !== "user-avatar"){
        setShowUserMenu(false)
      }
    }
    document.addEventListener("click", removeDropdown);
    /**taking care side effects */
    return () => document.removeEventListener("click", removeDropdown);
  })
  return (
    <>
      <NavBar />  
      <Routes>
        <Route path="/" index element={<ConversationList socket={socket} onlineUsers={onlineUsers} />} />
        <Route path="contact" element={<ContactList socket={socket} onlineUsers={onlineUsers} />} />
        {/*<Route path="chat" element={<MessageList />} />*/}
        <Route path="chat/:receiverId" element={<MessageList socket={socket} />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="verifyUser/:username" element={<VerifyUser />} />
        <Route path="resetPassword/:userId" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/*<Footer />*/}
      <ScrollToTop />
    </>
  )
}
export default App;