import React,{useState,useEffect} from 'react'
import axios from "axios"
import {Link, useHistory} from "react-router-dom"
import { useSelector } from 'react-redux'
import { permission } from 'helper/permission'
const PayoutHistoryPending = () => {

    const { token, user } = useSelector(state => state.auth)
    const [payoutHistories,setPayoutHistory]=useState([]);

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'payouts', 'access')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const fetchPayoutPendingHistory = () => {
        axios.get('/payout', {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            setPayoutHistory(response.data.payoutHistories);
        }).catch(error => {
            console.log(error.response);
        })
    }

    useEffect(()=>{
        if(token != '')
        {
            fetchPayoutPendingHistory();
        }
      
    },[token])

   console.log("payoutHistories",payoutHistories);
    
    return (
        <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">Pending Payout</h1>
                    <div className="flex">
                       
                    </div>
                </div>

                <div className="w-full">
                    <div className="card">
                        <div className="border-b">
                            <div className="card-header">
                                <div>
                                    <h4 className="pageHeading">Payout History List</h4>
                                </div>
                             
                            </div>
                        </div>
                        <div className="card-body overflow-x-auto">
                            <div className="w-full overflow-x-scroll">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b h-12">
                                            <th>Store Id</th>
                                            <th>Total Amount</th>
                                            <th>Payment Method</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payoutHistories?.map((item, index) => (
                                            <tr key={index} className="h-12 border-b">
                                                
                                                <td><p className="">{item.store.name}</p></td>
                                                <td><p className="">{item.total_amount}</p></td>
                                                <td><p className="">{item.payoutmethod.bank_name}</p></td>
                                                <td>
                                                  
                                                    <p className="">{item.status}</p>
                                                </td>
                                                <td>
                                                {user?.permissions && (permission(user.permissions, 'payouts', 'update') || (user.user_type_id == 1)) ? (
                                                        <Link to={`/admin/payouthistory/${item.id}/edit`} className="text-sm bg-green-600 text-white mx-2 px-2 py-1 rounded"><i className="fas fa-edit"></i></Link>
                                                    ) : '' }
                                                    
                                                </td>
                                                
                                            </tr>
                                        ))}

                                        
                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer">
                        {/* <div className="flex flex-col justify-between md:flex-row items-center w-full">
                            {reviews && <p className="font-Poppins font-normal text-sm">Showing <b>{reviews.from}-{reviews.to}</b> from <b>{reviews.total}</b> data</p>}
                           

                            <div className="flex items-center">
                                {reviews && <Pagination sellers={reviews} setUpdate={updatePage} />}
                            </div>
                        </div> */}
                    </div>
                    </div>
                </div>
            </div>
    )
}

export default PayoutHistoryPending
