import { Link } from "react-router-dom";
import avatar from "../assets/images/user.jpg";
import { useEffect } from "react";
import { useGlobalContext } from "../context";

const Navbar = () => {
    const { user, isDarkMode, showUserMenu, setShowUserMenu } = useGlobalContext();
    
    /*show/hide user dropdown menu*/
    const handleShowUserMenu = () => {
        if(!user.username){
            return alert("Please log in")
        }
        setShowUserMenu(prevState => !prevState);
    }
    /*handle active class*/
    useEffect(() => {
        const chatLinks = Array.from(document.querySelectorAll('.chat-link'));
        chatLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                chatLinks.forEach(link => {
                    link.classList.remove('active');
                })
                link.classList.add('active');
            })
        })
    })
   
    return (
        <>
            <nav className={`navbar navbar-expand-sm sticky-top bg-gradient ${isDarkMode ? 'bg-success' : 'bg-primary'}`}>
                <div className="container-fluid">
                    <div className="navbar-left">
                        <div className="chat-logo">Olajeks</div>  
                        <div className="nav-links" >
                            <span>
                                <Link to="/" className="chat-link active" >chat</Link>
                            </span>  
                            <span>
                                <Link className="chat-link" to="/contact" >contact</Link>
                            </span>
                        </div>
                    </div>
                    <div className="navbar-right" onClick={handleShowUserMenu}>
                        <img src={user?.profileImg || avatar} data-id="user-avatar" className="rounded-pill user-avatar" alt="User Avatar"/>
                        {/*<button className="menu-icon">
                            <i className="fa-solid fa-bars"></i>
                        </button>*/}
                    </div>
                </div>
            </nav>
            {/* drop-down menu for user */}
            {showUserMenu && <div className="user-dropdown-menu shadow ">
                <div className="user-menu-item">
                    <Link to="/profile" className="user-menu-link" onClick={handleShowUserMenu}>Profile</Link>
                </div>
                <div className="user-menu-item">
                    <Link to="/settings" className="user-menu-link" onClick={handleShowUserMenu}>Settings</Link> 
                </div>
                <div className="user-menu-item">
                    <Link to="/logout" className="user-menu-link" onClick={handleShowUserMenu}>Log out</Link>
                </div>
            </div>}
        </>
    )
}

export default Navbar;