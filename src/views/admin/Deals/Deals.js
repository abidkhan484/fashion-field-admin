import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { permission } from 'helper/permission'

const Deals = () => {

    const { token, user } = useSelector(state => state.auth);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (!(permission(user.permissions, 'products_deals_of_the_day', 'access')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const [deals, setDeals] = useState([]);

    const fetchDeal = () => {
        axios.get("/deals", {
            headers: {
                Authorization: token,
                Accept: 'application/json',
            }
        }).then(response => {
            console.log(response)
            setDeals(response.data)
        }).catch(errors => {
            console.log(errors.response)
        })
    }

    useEffect(() => {
        if (token != '') {
            fetchDeal();
        }

    }, [token])


    const deletetDeals = (id) => {
        if (!window.confirm('Are you want to do it?'))
            return false;
        axios.post(`/deals/${id}`, {
            '_method': 'DELETE'
        }, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            fetchDeal();
        }).catch(error => {
            console.log(error.response);
        })
    }

    const addtoHomePage = (id) => {
        axios.post(`/add-to-homepage/${id}`, {}, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then((res) => {
            fetchDeal();
        }).catch((err) => {
            console.log(err.response);
        })
    }

    const removeFromPage = (id) => {
        axios.post(`/remove-from-homepage/${id}`, {}, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then((res) => {
            fetchDeal();
        }).catch((err) => {
            console.log(err.response);
        })
    }
    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Deals of the Day</h1>
                <div className="flex">

                </div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Deals of the Day</h4>
                        </div>

                    </div>
                </div>

                <div className="card-body overflow-x-auto">
                    <table className="w-350 2xl:w-full table-fixed">

                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader">Sl No.</th>
                                <th className="tableHeader">SKU</th>
                                <th className="tableHeader">Style Number</th>
                                <th className="tableHeader">Product Image</th>
                                <th className="tableHeader w-1/9">Product Name</th>
                                <th className="tableHeader w-1/9 text-center">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {deals?.map((item, index) => (
                                <tr className="border-b py-4 h-20" key={index}>
                                    <td>
                                        <p className="tableData">{index + 1}</p>
                                    </td>
                                    <td>
                                        <p className="tableData">{item?.product?.SKU}</p>
                                    </td>

                                    <td>
                                        <p className="tableData">{item?.product?.style_no}</p>
                                    </td>

                                    <td>
                                        <img src={item?.product?.thumbnail} alt='product' height={200} width={200} />
                                    </td>

                                    <td>
                                        <p className="tableData">{item?.product?.name}</p>
                                    </td>



                                    <td className="text-center">


                                        <div className='h-full flex items-center justify-between'>
                                            {(item?.homepage == true) ?
                                                (<button className='button button-danger ' onClick={() => { removeFromPage(item?.product?.id) }} >Remove From Homepage</button>
                                                ) : (
                                                    <button className='button button-success ' onClick={() => { addtoHomePage(item?.product?.id) }} >Add to Homepage</button>
                                                )}
                                            {user?.permissions && (permission(user.permissions, 'products_deals_of_the_day', 'delete') || (user.user_type_id == 1)) ? (
                                                <Link to="/admin/deals" onClick={() => { deletetDeals(item?.id) }} ><i className="fas fa-trash" style={{ color: 'red' }}></i></Link>
                                            ) : ''}

                                        </div>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Deals
