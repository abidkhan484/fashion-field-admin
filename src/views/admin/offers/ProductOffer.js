import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';
import { permission } from 'helper/permission';

export default function ProductOffer() {
    const { token, user } = useSelector(state => state.auth);
    const [discount, setDiscount] = React.useState('');
    const [maxAmount, setMaxAmount] = React.useState('');

    const [productOffer, setProductOffer] = React.useState('');

    const submitOffer = () => {
        axios.post(`/offers`, {
            type: 'products',
            discount: discount,
            max: maxAmount
        }, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
            getProductOffer();
        }).catch(error => {
            console.log(error.response);
        })
    }

    const getProductOffer = () => {
        axios.get(`offers/products`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
            setProductOffer(response.data);
        }).catch(error => {
            console.log(error.response);
        })
    }


    const removeProductOffer = () => {
        axios.delete(`offers/products`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
            setProductOffer([]);
        }).catch(error => {
            console.log(error.response);
        })
    }


    React.useEffect(() => {
        getProductOffer();
    }, [token]);

    React.useEffect(() => {
        console.log(productOffer);
    }, [productOffer]);

    return (
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Add Offer for All Products</h4>
                        </div>
                        {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                        {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <div className="w-full -mx-1 flex flex-wrap">
                    {user?.permissions && (permission(user.permissions, 'offers_manage_offer', 'create') || (user.user_type_id == 1)) ? (
                        <>
                        <div className='w-1/4 mx-1'>
                            <label>Discount in Percentage *</label>
                            <input type="number" min="0" className="createFromInputField" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                        </div>
                        <div className='w-1/4 mx-1'>
                            <label>Max Discount Amount</label>
                            <input className="createFromInputField" type='number' min='0' value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />
                        </div>
                        </>
                    ) : '' }
                        
                        <div className="w-1/4 mx-1">
                            
                            {user?.permissions && (permission(user.permissions, 'offers_manage_offer', 'create') || (user.user_type_id == 1)) ? (
                                <button onClick={submitOffer} className="bg-blue-600 text-white px-4 py-2 rounded mt-6">Save</button>
                            ) : '' }

                            {user?.permissions && (permission(user.permissions, 'offers_manage_offer', 'delete') || (user.user_type_id == 1)) ? (
                                <>
                                {productOffer == '' ? '' : (
                                    <button onClick={removeProductOffer} className="bg-red-600 text-white px-4 py-2 rounded mt-6 ml-2">Remove</button>
                                )}
                                </>
                            ) : '' }
                            
                        </div>
                    </div>
                    <div className='w-full py-2 border-b mt-2 mb-4'></div>
                    <div className='w-full'>
                        {productOffer.discount && <p>Discount: <span className='font-bold'>{productOffer.discount}%</span></p>}
                        
                        {productOffer.max && <p>Max Amount: <span className='font-bold'>{productOffer.max} TK.</span></p>}
                    </div>
                </div>
            </div>
    )
}
