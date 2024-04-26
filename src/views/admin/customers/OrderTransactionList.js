import axios from 'axios';
import Pagination from 'core/Pagination';
import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

export default function OrderTransactions() {

    const { customerId } = useParams();

    const [orderTransactions, setOrderTransactions] = useState([]);
    const [searchRecord, setsearchRecord] = useState('');
    const { token } = useSelector(state => state.auth)

    const fetchOrderTransactions = (search) => {
        axios.get(`/customers/${customerId}/order-transaction-list?search=${search}`, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            setOrderTransactions(response.data);
        }).catch(errors => {
            console.log(errors.response);
        })
    }

    const updatePage = (url) => {
        axios.get(url.concat(`&search=${searchRecord}`), {
            headers: {
                Authorization: token
            }
        }).then(response => {
            setOrderTransactions(response.data)
        })
    }


    useEffect(() => {
        if(token != '')
        {
            fetchOrderTransactions(searchRecord);
        }
    }, [token, searchRecord]);

    return (
        <>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">Customer Order Transctions</h1>
                    <div className="flex">
                        
                    </div>
                </div>
    
                <div className="card">
                <div className="border-b">
                    <div className="card-header flex flex-row">
                    <div className="w-full mb-2">
                        <h4 className="pageHeading">Order Transctions List</h4>
                    </div>
                    <input
                        className="inputBox ml-5"
                        placeholder="Search"
                        onChange={(e) => setsearchRecord(e.target.value)}
                    />
                    </div>
                </div>
                <div className="card-body">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader">Serial</th>
                                <th className="tableHeader">Customer Name</th>
                                <th className="tableHeader">Customer Phone</th>
                                <th className="tableHeader">Customer Email</th>
                                <th className="tableHeader">Order Number</th>
                                <th className="tableHeader">Payment Type</th>
                                <th className="tableHeader">Transaction Id</th>
                                <th className="tableHeader">amount</th>
                                <th className="tableHeader">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderTransactions.data?.map((walletTransaction, index) => (
                                <tr className="border-b py-4 h-20">
                                    <td className="tableData">{index + 1}</td>
                                    <td className="tableData">{walletTransaction.customer['name']}</td>
                                    <td className="tableData">{walletTransaction.customer['phone']}</td>
                                    <td className="tableData">{walletTransaction.customer['email']}</td>
                                    <td className="tableData">{walletTransaction.order_number}</td>
                                    <td className="tableData">{walletTransaction.payment_type}</td>
                                    <td className="tableData">{walletTransaction.transection_id}</td>
                                    <td className="tableData">{walletTransaction.amount}</td>
                                    <td className="tableData">{walletTransaction.created_at}</td>
                                </tr>
                            ))}
                        
                        </tbody>
                    </table>
                    </div>
                    <div className="card-footer">
                        <div className="flex flex-col justify-between md:flex-row items-center w-full">
                            {orderTransactions && orderTransactions.meta && <p className="font-Poppins font-normal text-sm">Showing <b>{orderTransactions.meta.from} - {orderTransactions.meta.to}</b> from <b>{orderTransactions.meta.total}</b> data</p>}

                            <div className="flex items-center">
                                {orderTransactions && orderTransactions.meta && <Pagination sellers={orderTransactions.meta} setUpdate={updatePage} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
