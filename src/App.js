import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// layouts

import Admin from "./layouts/Admin.js";
import Auth from "./layouts/Auth.js";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Stores

import { store } from 'redux/store.js';
import { Provider } from 'react-redux';

import { AuthProvider } from './context/AuthContext';
import { LoaderProvider } from 'context/LoaderContext.js';
import axios from 'axios';

// axios.defaults.baseURL = 'http://fashionfield.test/api/admin'
//axios.defaults.baseURL = 'http://fashion-field.test/api/admin'
// axios.defaults.baseURL = 'https://api.fashionfield-primary.viserx.net/api/admin'
// axios.defaults.baseURL = 'https://live.fashionfield.viserx.net/api/admin'
// axios.defaults.baseURL = 'https://api.fashionfield.com.bd/api/admin'
axios.defaults.baseURL = `${process.env.REACT_APP_ADMINDURL}`

toast.configure()
export default function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AuthProvider>
                    <LoaderProvider>
                        <Switch>
                            {/* add routes with layouts */}
                            <Route path="/admin" component={Admin} />
                            {/* <Route path="/auth" component={Auth} /> */}
                            {/* add routes without layouts */}
                            {/* <Redirect from="/" exact to="/auth/login" /> */}
                            {/* add redirect for first page */}
                            <Redirect from="*" to="/admin/dashboard" />
                        </Switch>
                    </LoaderProvider>
                </AuthProvider>
            </BrowserRouter>
        </Provider>
    )
}
