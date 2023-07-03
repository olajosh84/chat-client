import React from "react";
import  ReactDOM  from "react-dom/client";
import { BrowserRouter } from"react-router-dom";
import { AppProvider } from "./context";
import App from "./App";
import "./assets/css/styles.css";
/*import "./assets/bootstrap-5.3.0/css/bootstrap.min.css";
import "./assets/fontawesome-free-6.4.0-web/css/all.min.css";*/


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AppProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AppProvider>
    </React.StrictMode>
);