import axios from "axios";
import React from "react";

import config from 'config.json';
import { LoaderContext } from "./LoaderContext";

export const SellerContext = React.createContext();

export const SellerProvider = ({children}) => {

    const {setLoading} = React.useContext(LoaderContext);

    const [search, setSearch] = React.useState('');
    const [loader, setLoader] = React.useState(false);

    const [sellers, setSellers] = React.useState({
        data: []
    });

    React.useEffect(() => {


        if(sellers.data.length === 0)
        {
            
            setLoading(true);
            let token = localStorage.getItem('token');
    
            axios.get('/sellers', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': token
                }
            }).then(response => {
                setLoading(false);
                setSellers(response.data)
            })

        }



    }, [sellers]);


    React.useEffect(() => {
        // if(search)
        // {
        //     let token = localStorage.getItem('token');
        //     axios.get(`${config.SERVER_URL}/sellers/search?terms=${search}`, {headers: {Authorization: token}})
        //             .then(response => {
        //                 console.log(response);
        //                 setSellers(response.data.sellers)
        //             })
        // }else{
        //     let token = localStorage.getItem('token');
        //     axios.get(`${config.SERVER_URL}/sellers`, {headers: {Authorization: token}})
        //             .then(response => {
        //                 setSellers(response.data.sellers);
        //                 setLoading(false);
        //             })
        //             .catch(errors => {
        //                 console.log(errors.response);
        //                 setLoading(false);
        //             })
        // }
    }, [search])

    // const fetchSellers = (url) => {
            
    //         setLoading(true);
    
    //         let token = localStorage.getItem('token');
    //         axios.get(url, {headers: {Authorization: token}})
    //                 .then(response => {
    //                     setSellers(response.data.sellers);
    //                     setLoading(false);
    //                 })
    //                 .catch(errors => {
    //                     console.log(errors.response);
    //                     setLoading(false);
    //                 })
    // }

    const searchSellers = (terms) => {
        setSearch(terms);
    }
    
    return <SellerContext.Provider value={{sellers, setSellers, searchSellers, search}}>{children}</SellerContext.Provider>

}