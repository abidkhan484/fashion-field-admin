import axios from 'axios'
import { Link, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

import Moment from 'react-moment';
import 'moment-timezone';

import config from 'config.json';
import Status from 'core/Status';
import Pagination from 'core/Pagination';
import { useSelector, useDispatch } from 'react-redux';
import { setSellers } from 'redux/sellers';
import { LoaderContext } from 'context/LoaderContext';

import { permission } from 'helper/permission';

export default function Sellers() {

    let history = useHistory();

    // const { sellers } = useSelector((state) => state.sellers)
    const [sellers, setSellers] = useState(null)
    const { token, user } = useSelector((state) => state.auth)

    const { loading, setLoading } = React.useContext(LoaderContext);

    const [search, setSearch] = React.useState(null);

    const dispatch = useDispatch();

    const updatePage = (url) => {
        setLoading(true);
        axios.get(url, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            dispatch(setSellers(response.data))
            setLoading(false);
        })
    }

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'seller_management', 'access')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    useEffect(() => {
        if (token != null && token != "") {

            // if(user.permissions)
            // {
            //     // console.log(user.permissions);
            //     // if(!permission(user.permissions, 'seller_management', 'access'))
            //     //     history.goBack();
                
            // }

            

            // console.log(token)
            setLoading(true);
            axios.get("/sellers", { headers: { Authorization: token } })
                .then(response => {
                    setSellers(response.data)

                    setLoading(false);
                })
                .catch(errors => {
                    console.log(errors)
                })
                
        }
    }, [token])

    // React.useEffect(() => {
    //     console.log(search)
    //     console.log(token)
    //     if (search != null) {
    //         axios.get(`/sellers/search/${search}`, { headers: { Authorization: token } })
    //             .then(response => {
    //                 // dispatch(setSellers(response.data))
    //                 console.log(response.data);
    //             })
    //     } else {

    //         if (sellers?.data?.length === 0 && search === '') {
    //             axios.get(`/sellers`, { headers: { Authorization: token } })
    //                 .then(response => {
    //                     dispatch(setSellers(response.data));
    //                 })
    //         }
    //     }
    // }, [search])

    useEffect(() => {
        if (search != null) {
            axios.get(`/sellers/search?terms=${search}`, { headers: { Authorization: token } })
                .then(response => {
                    console.log(response)
                    setSellers(response.data)
                })
                .catch(errors => {
                    console.log(errors)
                })
        }
    }, [search])

    // console.log(sellers.data)

    return (
        <>
            <div className="px-8 mt-8 mb-8">

                <div className="page-heading">
                    <h1 className="pageHeading">All Seller</h1>
                    <div className="flex">
                    {user?.permissions && (permission(user.permissions, 'seller_management', 'create') || (user.user_type_id == 1)) ? (                            
                        <Link to="/admin/sellers/create" className="button button-outline-primary w-44">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 buttonText">Add a New Seller</span>
                        </Link>
                        ) : ''}
                    </div>
                </div>

                <div className="card">
                    <div className="border-b">
                        <div className="card-header">
                            <div>
                                <h4 className="pageHeading">Sellers</h4>
                            </div>
                            <input className="inputBox" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className='card-body overflow-x-auto'>
                        <table className="w-350 2xl:w-full table-fixed">
                            <thead>
                                <tr className="border-b h-12">
                                    <th className="tableHeader w-2/7">Store</th>
                                    <th className="tableHeader w-1/7">Mobile</th>
                                    <th className="tableHeader w-2/7">Email</th>
                                    <th className="tableHeader w-1/7">Date</th>
                                    <th className="tableHeader w-1/7">Status</th>
                                    <th className="tableHeader w-1/7">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellers?.data?.map((item, index) => (
                                    <tr className="border-b py-4 h-20" key={index}>
                                        <td>
                                            <div className="flex items-center">
                                                {(item.store?.logo) ? (
                                                    <>
                                                        <img className="w-10 h-auto" alt="..." src={`${item.store.logo}`} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="w-10 h-10 bg-gray-200 rounded-full"></span>
                                                    </>
                                                )}

                                                <div className="ml-2">
                                                    <h3 className="tableData">{item?.store?.name}</h3>
                                                    {/* <p className="text-xs text-gray-400">{item?.email}</p> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="tableData">{item.mobile}</p>
                                        </td>
                                        <td>
                                            <p className="tableData">{item.email}</p>
                                        </td>
                                        <td>
                                            <p className="tableData"><Moment format="MMM, D YYYY">{item.created_at}</Moment></p>
                                        </td>
                                        <td>
                                            {/* <Status status={item.store?.status} /> */}
                                            {
                                                item.store?.status ? <span className="activeButtonView">Active</span> : <span className="deActiveButtonView">Deactive</span>
                                            }
                                        </td>
                                        <td>
                                        {user?.permissions && (permission(user.permissions, 'seller_management', 'update') || (user.user_type_id == 1)) ? (
                                            <Link to={`/admin/sellers/${item.id}/edit`} className="focus:outline-none">
                                                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                                                </svg> */}
                                                <i class="fas fa-pen"></i>
                                            </Link>
                                            ) : '' }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer">
                        <div className="flex flex-col justify-between md:flex-row items-center w-full">
                            {sellers && <p className="font-Poppins font-normal text-sm">Showing <b>{sellers.from} - {sellers.to}</b> from <b>{sellers.total}</b> data</p>}

                            <div className="flex items-center">
                                {sellers && <Pagination sellers={sellers} setUpdate={updatePage} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

// w-350 2xl: