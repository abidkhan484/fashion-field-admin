import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { SellerContext } from 'context/SellerContext';
import Moment from 'react-moment';
import 'moment-timezone';

import config from 'config.json';
import Status from 'core/Status';
import Pagination from 'core/Pagination';
import axios from 'axios';
import { AuthContext } from 'context/AuthContext';

export default function SellerList() {
    const { sellers, setSellers } = React.useContext(SellerContext);

    console.log(sellers)

    const { token } = React.useContext(AuthContext);


    const updatePage = (url) => {
        axios.get(url, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            setSellers(response.data)
        })
    }

    useEffect(() => {
        console.log(sellers)

    }, [sellers])

    return (
        <>
            <div className="flex flex-wrap px-3">

                <div className="page-heading">
                    <h1 className="page-heading-title">Seller List</h1>
                    <div className="flex">
                        <Link to="/admin/sellers/create" className="button button-outline-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Create Seller
                        </Link>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div>
                            <h6 className="card-header-subtitle">Create New Seller, Edit seller from this list.</h6>
                            <h4 className="card-header-title">List of Seller</h4>
                        </div>
                        <input className="border-2 border-gray-200 rounded-full px-4 py-1 focus:outline-none focus:border-purple-500" placeholder="Search" />
                    </div>
                    <div className='card-body overflow-x-scroll'>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b py-4 h-20">
                                    <th>Recipent</th>
                                    <th>Mobile</th>
                                    <th>Amount</th>
                                    <th>Location</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellers.data.map((item, index) => (
                                    <tr className="border-b py-4 h-20" key={index}>
                                        <td>
                                            <div className="flex items-center">
                                                {(item.store?.logo) ? (
                                                    <>
                                                        <img className="w-10 h-auto" alt="..." src={`${config.SITE_LINK}${item.store.logo}`} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="w-10 h-10 bg-gray-200 rounded-full"></span>
                                                    </>
                                                )}
                                                {/* <span className="w-10 h-10 bg-gray-200 rounded-full"></span> */}

                                                <div className="ml-2">
                                                    <h3 className="font-semibold">{item.store.name}</h3>
                                                    <p className="text-xs text-gray-400">{item.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="font-semibold uppercase text-gray-700">{item.mobile}</p>
                                        </td>
                                        <td>
                                            <p className="font-semibold uppercase text-gray-700">$ 500</p>
                                        </td>
                                        <td>
                                            <p className="font-semibold uppercase text-gray-700">USA</p>
                                        </td>
                                        <td>
                                            <p className="text-gray-400 text-sm"><Moment format="MMM, D YYYY">{item.created_at}</Moment></p>
                                        </td>
                                        <td>
                                            <Status status={item.store.status} />
                                        </td>
                                        <td>
                                            <Link to={`/admin/sellers/${item.id}/edit`} className="focus:outline-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                                                </svg>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer">
                        <div className="flex flex-col justify-between md:flex-row items-center w-full">
                            <p>Showing <b>{sellers.from}-{sellers.to}</b> from <b>{sellers.total}</b> data</p>

                            <div className="flex items-center">
                                <Pagination sellers={sellers} setUpdate={updatePage} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
