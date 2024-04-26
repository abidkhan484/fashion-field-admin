import axios from 'axios'
import Pagination from 'core/Pagination';
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router';
import { permission } from 'helper/permission';

export default function ProductReviews() {

    const { token, user } = useSelector(state => state.auth)

    const [reviews, setReviews] = React.useState([]);

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'product_reviews', 'access')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const fetchRreviews = () => {
        axios.get('/reviews', {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            // console.log(response);
            setReviews(response.data);
        }).catch(error => {
            console.log(error.response);
        })
    }

    React.useEffect(() => {
        if(token != '')
        {
            fetchRreviews();
        }
    }, [token]);

    const updatePage = (url) => {
        axios.get(url, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            setReviews(response.data);
        })
    }

    const acceptReview = (id) => {
        axios.post(`/reviews/${id}`, {
            status: 1
        }, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            fetchRreviews();
        }).catch(error => {
            console.log(error.response);
        })
    }


    const deletetReview = (id) => {
        if(!window.confirm('Are you want to do it?'))
            return false;
        axios.post(`/reviews/${id}`, {
            '_method': 'DELETE'
        }, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            fetchRreviews();
        }).catch(error => {
            console.log(error.response);
        })
    }

    return (
        <>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">Manage Reviews</h1>
                    <div className="flex">

                    </div>
                </div>

                <div className="w-full">
                    <div className="card">
                        <div className="border-b">
                            <div className="card-header">
                                <div>
                                    <h4 className="pageHeading">Review List</h4>
                                </div>
                                {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                                {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                            </div>
                        </div>
                        <div className="card-body overflow-x-auto">
                            <div className="w-full overflow-x-scroll">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b h-12">
                                            <th>Thumbnail</th>
                                            <th>Product</th>
                                            <th>Rating</th>
                                            <th>Review</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reviews?.data?.map((item, index) => (
                                            <tr key={index} className="h-12 border-b">
                                                <td><img alt="item image" className="w-10 h-auto" src={item?.product?.thumbnail} /></td>
                                                <td><p className="">{item?.product?.name}</p></td>
                                                <td><p className="">{item?.rating}</p></td>
                                                <td><p className="">{item?.review}</p></td>
                                                <td>
                                                    {item.status ? (
                                                        <span className="text-sm bg-green-300 px-1 rounded-full">Approved</span>
                                                    ) : (
                                                        <span className="text-sm bg-red-300 px-1 rounded-full">Pending</span>
                                                    )}
                                                </td>
                                                <td>
                                                <>
                                                        {user?.permissions && (permission(user.permissions, 'product_reviews', 'delete') || (user.user_type_id == 1)) ? (
                                                            <button onClick={() => {deletetReview(item.id)}} className="text-sm bg-red-600 text-white mx-2 px-2 py-1 rounded"><span classNames="fas fa-trash"></span> DELETE</button>
                                                        ) : '' }
                                                    </>
                                                    
                                                    
                                                    {item.status == false ? (
                                                        <>
                                                        {user?.permissions && (permission(user.permissions, 'product_reviews', 'update') || (user.user_type_id == 1)) ? (
                                                            <button onClick={() => acceptReview(item.id)} className="text-sm bg-green-600 text-white mx-2 px-2 py-1 rounded"><i classNames="fas fa-check-square"></i> ACCEPT</button>
                                                        ) : '' }
                                                        </>
                                                        
                                                    ) : ''}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer">
                        <div className="flex flex-col justify-between md:flex-row items-center w-full">
                            {reviews && <p className="font-Poppins font-normal text-sm">Showing <b>{reviews.from}-{reviews.to}</b> from <b>{reviews.total}</b> data</p>}
                            {/* <p>Showing <b>{supplierData.from}-{supplierData.to}</b> from <b>{supplierData.total}</b> data</p> */}

                            <div className="flex items-center">
                                {reviews && <Pagination sellers={reviews} setUpdate={updatePage} />}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}
