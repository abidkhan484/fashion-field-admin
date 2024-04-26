import React from 'react'
import Select from 'react-select'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { permission } from 'helper/permission';

export default function BrandOffers() {

    const { token, user } = useSelector(state => state.auth);
    const [brands, setBrands] = React.useState([]);
    const [selectedBrand, setSelectedBrand] = React.useState('');
    const [discount, setDiscount] = React.useState('');
    const [maxAmount, setMaxAmount] = React.useState('');

    const [offers, setOffers] = React.useState([]);

    const fetchOffers = () => {
        axios.get(`offers/brand`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            setOffers(response.data);
        }).catch(error => {
            console.log(error.response);
        })
    }

    const fetchBrands = () => {
        axios.get(`brands/all`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            // setBrands(response.data);
            setBrands([]);

            response.data.map((item, index) => {
                setBrands(prevState => [...prevState, { label: item.name, value: item.id }]);
            })
        }).catch(error => {
            console.log(error.response);
        })
    }

    const deleteOffer = (id) => {
        axios.delete(`offers/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            fetchOffers();
        }).catch(error => {
            console.log(error.response);
        })
    }

    const handleSaveButton = () => {
        axios.post(`offers/brand`, {
            type: 'brand',
            brand_id: (selectedBrand?.value) ? selectedBrand.value : '',
            discount: discount,
            max: maxAmount
        }, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
            fetchOffers();
        }).catch(error => {
            console.log(error.response);
        })
    }


    React.useEffect(() => {
        // fetchCategory();
        fetchOffers();
        fetchBrands();
    }, [token]);

    return (
        <div className="card mt-8 relative">
            <div className="border-b">
                <div className="card-header">
                    <div>
                        <h4 className="pageHeading">Add Offer for Brand</h4>
                    </div>
                    {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                    {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                </div>
            </div>
            <div className="card-body overflow-x-auto" style={{ height: 400 }}>
                {user?.permissions && (permission(user.permissions, 'offers_manage_offer', 'create') || (user.user_type_id == 1)) ? (
                    <div className="w-full -mx-1 flex flex-wrap -mx-2">
                        <div className='w-1/4 mx-1 h-48'>
                            <label>Select Brand *</label>
                            <Select options={brands} onChange={option => setSelectedBrand(option)} />
                        </div>
                        <div className='w-1/4 mx-1'>
                            <label>Discount in Percentage *</label>
                            <input type="number" min="0" className="createFromInputField" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                        </div>
                        <div className='w-1/4 mx-1'>
                            <label>Max Discount Amount</label>
                            <input className="createFromInputField" type='number' min='0' value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />
                        </div>
                        <div className="w-1/5 mx-1">
                            {selectedBrand.value && <button onClick={handleSaveButton} className="bg-blue-600 text-white px-4 py-2 rounded mt-6">Save</button>}
                        </div>
                    </div>
                ) : ''}

                <div className='w-full py-2 border-b mt-2 mb-4'></div>
                <div className='w-full'>
                    <table className='w-full'>
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader">Brand Name</th>
                                <th className="tableHeader">Discount</th>
                                <th className="tableHeader">Max Amount</th>
                                <th className="tableHeader">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers?.map((item, index) => (
                                <tr key={index} className="border-b py-4 h-12">
                                    <td><p className="tableData">{item.brand.name}</p></td>
                                    <td><p className="tableData">{item.discount} %</p></td>
                                    <td><p className="tableData">{item.max} TK.</p></td>
                                    <td>
                                        {user?.permissions && (permission(user.permissions, 'offers_manage_offer', 'delete') || (user.user_type_id == 1)) ? (
                                            <button onClick={() => deleteOffer(item.id)} className='bg-red-600 px-2 py-1 rounded text-white'>DEL</button>
                                        ) : ''}

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
