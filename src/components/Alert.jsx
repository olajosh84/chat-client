
const Alert = ({icon, message, hideAlert}) => {
    return (
        <div className="form-alert toast show my-3">
            <div className="toast-header">
                <strong className={`me-auto ${icon === 'ban' ? 'text-danger' : 'text-success'}`}><i className={`me-2 fas fa-${icon}`}></i>{message}</strong>
                <button className="btn-close" onClick={hideAlert}></button>
            </div>
          
        </div>
    )
}

export default Alert;