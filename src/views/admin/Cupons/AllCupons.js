import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import Moment from 'react-moment';
import { permission } from 'helper/permission';

const AllCupons = props => {

    const { token, user } = useSelector(state => state.auth);

    const [cuponData, setCuponData] = useState([])

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (!(permission(user.permissions, 'offers_coupon', 'access')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const getCuponFunc = () => {
        axios.get("/coupons", {
            headers: {
                Authorization: token,
                Accept: 'application/json',
            }
        }).then(response => {
            console.log(response)
            setCuponData(response.data)
        }).catch(errors => {
            console.log(errors.response)
        })
    }


    useEffect(() => {
        if (token != "") {
            getCuponFunc()
        }

    }, [token])

    const handleCuponDelete = (id) => {
        console.log(id)
        if (!window.confirm('Are you want to do it?'))
            return false;


        if (token != "") {
            axios.delete(`/coupons/${id}`, {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                console.log(response)
                getCuponFunc()
            }).catch(errors => {
                console.log(errors.response)
            })
        }
    }


    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">All Cupons</h1>
                <div className="flex">


                    {user?.permissions && (permission(user.permissions, 'offers_coupon', 'create') || (user.user_type_id == 1)) ? (
                        <Link to="/admin/cupon" className="button button-outline-primary w-48">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 buttonText">Add a New Cupon</span>
                        </Link>
                    ) : ''}
                </div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Cupons</h4>
                        </div>
                        <input className="inputBox" placeholder="Search" />
                    </div>
                </div>

                <div className="card-body overflow-x-auto">
                    <table className="w-350 2xl:w-full table-fixed">

                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader w-1/9">Cupon Name</th>
                                <th className="tableHeader w-1/9">Cupon Code</th>
                                <th className="tableHeader w-1/9">Cupon Description</th>
                                <th className="tableHeader w-1/9">Start Date</th>
                                <th className="tableHeader w-1/9">End Date</th>
                                <th className="tableHeader w-1/9">Cupon Type</th>
                                <th className="tableHeader w-1/9">Cupon Value</th>
                                <th className="tableHeader w-1/9">Is cupon limited</th>
                                <th className="tableHeader w-1/9">Max use</th>

                                <th className="tableHeader w-1/9 text-center">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {cuponData?.map((item, index) => (
                                <tr className="border-b py-4 h-20" key={index}>
                                    <td>
                                        <p className="tableData">{item.name}</p>
                                    </td>
                                    <td>
                                        <p className="tableData">{item.code}</p>
                                    </td>
                                    <td>
                                        <p className="tableData">{item.description}</p>
                                    </td>
                                    <td>
                                        <p className="tableData"><Moment format="D/MM/YYYY">{item.start_date}</Moment></p>
                                    </td>
                                    <td>
                                        <p className="tableData"><Moment format="D/MM/YYYY">{item.end_date}</Moment></p>
                                    </td>
                                    <td>
                                        <p className="tableData">{item.type}</p>
                                    </td>
                                    <td>
                                        <p className="tableData">{item.value}</p>
                                    </td>
                                    <td>
                                        <p className="tableData">{item.is_limited ? "Yes" : "No"}</p>
                                    </td>
                                    <td>
                                        <p className="tableData">{item.max_use}</p>
                                    </td>

                                    <td className="">
                                        <div className="flex items-center h-full justify-center">

                                            {user?.permissions && (permission(user.permissions, 'offers_coupon', 'update') || (user.user_type_id == 1)) ? (
                                                <Link to={`/admin/cupon/edit/${item.id}`}><i className="fas fa-pen"></i></Link>
                                            ) : ''}

                                            {user?.permissions && (permission(user.permissions, 'offers_coupon', 'delete') || (user.user_type_id == 1)) ? (
                                                <div onClick={() => handleCuponDelete(item.id)}><i className="fas fa-trash ml-4 cursor-pointer" style={{ color: "red" }}></i></div>
                                            ) : ''}

                                        </div>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* <div className="card-footer">
                        <div className="flex flex-col justify-between md:flex-row items-center w-full">
                            {allProducts && <p className="font-Poppins font-normal text-sm">Showing <b>{allProducts.from}-{allProducts.to}</b> from <b>{allProducts.total}</b> data</p>}
                            <p>Showing <b>{supplierData.from}-{supplierData.to}</b> from <b>{supplierData.total}</b> data</p>

                            <div className="flex items-center">
                                {allProducts && <Pagination sellers={allProducts} setUpdate={updatePage} />}
                            </div>
                        </div>
                    </div> */}
            </div>
        </div>
    )
}

export default AllCupons
