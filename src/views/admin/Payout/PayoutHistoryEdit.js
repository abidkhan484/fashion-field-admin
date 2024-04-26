import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { permission } from 'helper/permission';
const PayoutHistoryEdit = () => {
    const { token, user } = useSelector(state => state.auth)
    let { id } = useParams();
    let history = useHistory();

    const [loading, setLoading] = React.useState(false);
    const [status, setStatus] = React.useState('pending');
    const [details,setDetails]=React.useState([])
    const [payoutItems,setPayoutItems]=React.useState([]);

    const [errors, setErrors] = React.useState([]);

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'payouts', 'update')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const fetchPayoutHistory = (id) => {
        axios.get(`/payout/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            
            setDetails(response.data)
            setPayoutItems(response.data.map((data)=>data.items))
            
        }).catch(errors => {
            console.log(errors.response);
        })
    }


    // const fetchPayoutitems = (id)=>{
    //     axios.get(`/payout/${id}`, {
    //         headers: {
    //             Accept: 'application/json',
    //             Authorization: token
    //         }
    //     }).then(response => {
    //         // console.log(response);
    //         setDetails(response.data)
            
    //     }).catch(errors => {
    //         console.log(errors.response);
    //     })
    // }

    
    const handlePayoutHistorySubmit = () => {
        axios.put(`/payout/${id}`, {
            status: status,
        }, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            history.push('/admin/payoutpending')
        }).catch(errors => {
            console.log(errors.response);
            if(errors.response.status === 422)
            {
                setErrors(errors.response.data.errors);
            }
        })
    }


    React.useEffect(() => {
        if(token != '')
        {
            fetchPayoutHistory(id);
        }
    }, [token]);

    console.log("payoutItems",payoutItems);

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Edit PayoutHistory</h1>
                <div className="flex">
                    
                </div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Edit PayoutHistory</h4>
                        </div>
                       
                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <div className="w-full flex -mx-1">
                  {details?.map((item,index)=>(
                      <>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="name" className="createFromInputLabel">Bank Name</label>
                            {/* <input type="text"  value={name} className="createFromInputField" /> */}
                            <p>{item.payoutmethod.bank_name}</p>
                            <p className="text-red-600 text-sm">{errors.name}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="contact" className="createFromInputLabel">Bank Branch</label>
                            {/* <input type="text"  value={contact} className="createFromInputField" /> */}
                            <p>{item.payoutmethod.bank_branch}</p>
                            <p className="text-red-600 text-sm">{errors.contact}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="charge" className="createFromInputLabel">Account Number</label>
                            <p>{item.payoutmethod.account_number}</p>
                            {/* <input type="text"  value={charge} className="createFromInputField" /> */}
                            <p className="text-red-600 text-sm">{errors.charge}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="charge" className="createFromInputLabel">Account Name</label>
                            <p>{item.payoutmethod.account_name}</p>
                            {/* <input type="text"  value={charge} className="createFromInputField" /> */}
                            <p className="text-red-600 text-sm">{errors.charge}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="charge" className="createFromInputLabel">Bank Routing Number</label>
                            <p>{item.payoutmethod.bank_routing_number}</p>
                            {/* <input type="text"  value={charge} className="createFromInputField" /> */}
                            <p className="text-red-600 text-sm">{errors.charge}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="charge" className="createFromInputLabel">Total Amount</label>
                            {/* <input type="text"  value={charge} className="createFromInputField" /> */}
                            <p>{item.total_amount}</p>
                            <p className="text-red-600 text-sm">{errors.charge}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="Active" className="createFromInputLabel">Status</label>
                                <select className="createFromInputField" onChange={(e) => setStatus(e.target.value)} value={status} >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="paid">Paid</option>
                                    
                                
                                </select>
                                {/* <button onClick={() => handlePayoutHistorySubmit()} className="button button-primary w-32">Processing</button> */}
                        </div>
                        </>
                  ))}
                        
                    </div>
                </div>
            </div>
            <div className="px-8 mt-8 flex justify-end">
                {(loading) ? (
                    <>
                        <button className="button button-primary w-32" disabled> <span className="fas fa-sync-alt animate-spin"></span></button>
                    </>
                ) : (
                    <>
                        <button onClick={() => handlePayoutHistorySubmit()} className="button button-primary w-32">Update</button>
                    </>
                )}

            </div>

            <div className="card mt-5">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Payout Items</h4>
                        </div>
                       
                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <div className="w-full flex -mx-1">
                {payoutItems?.map((item,index)=>(
                    <>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="name" className="pageHeading ">Order Number</label>
                            {item.map((data,index)=>(
                                <p>{data.order.order_number}</p>
                            ))}
                      
                        
                        </div>

                        <div className="w-1/3 mx-1">
                            <label htmlFor="name" className="pageHeading ">Product Name</label>
                            {item.map((data,index)=>(
                                <p>{data.product.name}</p>
                            ))}
                      
                        
                        </div>
                     
                        <div className="w-1/3 mx-1">
                            <label htmlFor="charge" className="pageHeading">Quantity</label>
                            {item.map((data,index)=>(
                                <p>{data.quantity}</p>
                            ))}
                         
                          
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="charge" className="pageHeading">Cost Price</label>
                            
                            {item.map((data,index)=>(
                                <p>{data.cost_price}</p>
                            ))}
                            
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="charge" className="pageHeading">Line Total</label>
                            {item.map((data,index)=>(
                                <p>{data.line_total}</p>
                            ))}
             
                        </div>
                        
                    </>
                ))}
                        
                       
                      
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PayoutHistoryEdit
