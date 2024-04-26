import React from "react";
import config from 'config';
import axios from "axios";

export const AuthContext = React.createContext();

export const AuthProvider = props => {

    const [auth, setAuth] = React.useState(false);
    const [token, setToken] = React.useState(null);
    const [user, setUser] = React.useState({});

    // const getToken = () => {
    //     return Promise.resolve().then(function() {
    //         setToken(localStorage.getItem('token'))
    //     })
    // }

    React.useEffect(() => {
        async function getToken() {
            let token = await localStorage.getItem('token');
            setToken(token);
        }

        getToken();

    }, [token])

    // React.useEffect(() => {


        
        
    //     let token = localStorage.getItem('token');

    //     if(token !== null)
    //     {
    //         axios.get(`${config.SERVER_URL}/profile`, {headers: {Authorization: token}}).then(response => {
    //             if(response.status === 200)
    //             {
    //                 setToken(token);
    //                 setAuth(true);
    //                 setUser(response.data);
    //             }
    //         }).catch(error => {
    //             if(error.response.status === 401)
    //             {
    //                 setToken(null);
    //                 setAuth(false);
    //                 localStorage.removeItem('token');
    //             }
    //         })
    //     }else{
    //         setAuth(false);
    //     }

    // }, []);

    return <AuthContext.Provider value={{auth, setAuth, token, setToken}}>{props.children}</AuthContext.Provider>

}