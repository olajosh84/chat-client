import {Contact, Loading} from "../components";
import chatImg from "../assets/images/chat.png";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import colors from "../assets/js/colors";

const ContactList = ({onlineUsers}) => {
    const { user, isDarkMode, SERVER_URI } = useGlobalContext();
    const [contacts, setContacts] = useState([]);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [searchIcons, setSearchIcons] = useState({search: true, reset: false});
    const navigate = useNavigate();
   
    const filteredContacts = contacts.filter(contact => {
        const {username, firstName, lastName} = contact;
        return  username.toLowerCase().includes(search.toLowerCase()) ||
                firstName?.toLowerCase().includes(search.toLowerCase()) ||
                lastName?.toLowerCase().includes(search.toLowerCase())
    })
    /*handle search input change*/
    const handleSearch = (e) => {
        const value = e.target.value;
        if(value){
            setSearchIcons(prevState => {
                return {
                    ...prevState,
                    search: false,
                    reset: true
                }
            })
        }else{
            setSearchIcons(prevState => {
                return {
                    ...prevState,
                    reset: false,
                    search: true
                }
            })
        }
        setSearch(value)
    }
    /*reset search form*/
    const resetSearchForm = () => {
        setSearchIcons(prevState => {
            return {search: true, reset: false}
        })
        setSearch("");
    }
    /**redirect to login page if authentication fails */
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
    }, [user.username, navigate]);

    /** fetch all users of the app except the user who's logged in */
    useEffect(() => {
        setIsLoading(true);
        const fetchContact = async () => {
            try {
                const { data } = await axios.get(`${SERVER_URI}/users`);
                //fetch all users except the logged in user
                const newData = await data.filter(d => d._id !== user.userId);
                setContacts(newData);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
            
        }
        fetchContact();
    },[user.userId, SERVER_URI])
    //show loader when when authenticating user
    if(isAuthenticating){
        return  <section className="container my-4 contact-container">
                    <Loading text="Authenticating..." />
                </section>
        
    }
    return  <section className="container my-4 contact-container">
                <div className="row">
                    <div className="col-md-5">
                        <div className="contact-list rounded-4 shadow py-4">
                            <h4 className={`px-4 mb-4 ${isDarkMode ? 'text-white' : 'text-dark' }`}>{`Hi, ${user?.username}`}</h4>
                            <form>
                                <div className="input-group px-4 mb-4">
                                    <input type="text" className="form-control" name="search" value={search} onChange={handleSearch} placeholder="Search Contact" autoComplete="off" />
                                    <button className="btn btn-sm btn-outline-primary" onClick={(e) => e.preventDefault()}>
                                        <span>
                                            {searchIcons.search && <i className="fa-solid fa-search"></i>}
                                            {searchIcons.reset && <i className="fa-solid fa-times" onClick={resetSearchForm}></i>}
                                        </span>
                                    </button>
                                </div>
                            </form>
                            {
                                isLoading ? <Loading /> :
                                filteredContacts.map(contact => {
                                    let bgColor = Math.floor(Math.random() * colors.length);
                                    return  <Contact {...contact} key={contact._id} userBgColor={colors[bgColor]} isDarkMode={isDarkMode} onlineUsers={onlineUsers} />
                                })
                            }
                            {
                                filteredContacts.length < 1 && !isLoading &&  <p className={`px-4 ${isDarkMode ? 'text-white' : ''}`}>No record found</p>
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

export default ContactList;