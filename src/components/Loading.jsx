import { useGlobalContext } from "../context";

const Loading = ({text}) => {
    const {isDarkMode} = useGlobalContext();

    return (
        <div className="loading mt-5" style={{textAlign: "center"}}>
            <div>
                <span className={`spinner-border ${isDarkMode ? 'text-white' : 'text-dark'}`}></span>
            </div>
            <div className="badge bg-primary">{text}</div>
        </div>
    )
}

export default Loading;