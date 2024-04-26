import axios from 'axios';
import React from 'react'
import Select from 'react-select'
import { useSelector } from 'react-redux';
import { permission } from 'helper/permission';

export default function SubCategoryOffers({ categories }) {
    const { token, user } = useSelector(state => state.auth);
    const [subCategories, setSubCategories] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [selectedSubCategory, setSelectedSubCategory] = React.useState('');
    const [discount, setDiscount] = React.useState('');
    const [maxAmount, setMaxAmount] = React.useState('');

    const [offers, setOffers] = React.useState([]);

    const fetchSubCategory = (id) => {
        axios.get(`/categories/sub-categories/single/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            setSubCategories([]);
            response.data.map((item, index) => {
                setSubCategories(prevState => [...prevState, { label: item.name, value: item.id }])
            })
        }).catch(error => {
            console.log(error.response);
        })
    }

    const handleSaveButton = () => {
        axios.post(`offers/sub-category`, {
            sub_category_id: (selectedSubCategory?.value) ? selectedSubCategory?.value : '',
            discount: discount,
            max: maxAmount
        }, {
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

    const fetchOffers = () => {
        axios.get(`offers/sub-category`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
            setOffers(response.data);
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

    React.useEffect(() => {
        // fetchCategory();
        if (selectedCategory.value)
            fetchSubCategory(selectedCategory.value);

    }, [selectedCategory]);


    React.useEffect(() => {
        fetchOffers();
    }, [token])

    return (
        <div className="card mt-8 relative">
            <div className="border-b">
                <div className="card-header">
                    <div>
                        <h4 className="pageHeading">Add Offer for Sub Category</h4>
                    </div>
                    {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                    {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                </div>
            </div>
            <div className="card-body overflow-x-auto" style={{ height: 400 }}>
                {user?.permissions && (permission(user.permissions, 'offers_manage_offer', 'create') || (user.user_type_id == 1)) ? (
                    <div className="w-full -mx-1 flex flex-wrap -mx-2">
                        <div className='w-1/6 mx-1 h-48'>
                            <label>Select Category *</label>
                            <Select options={categories} onChange={option => setSelectedCategory(option)} />
                        </div>
                        <div className='w-1/6 mx-1 h-48'>
                            <label>Select Sub Category *</label>
                            <Select options={subCategories} onChange={option => setSelectedSubCategory(option)} />
                        </div>
                        <div className='w-1/6 mx-1'>
                            <label>Discount in Percentage *</label>
                            <input type="number" min="0" className="createFromInputField" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                        </div>
                        <div className='w-1/6 mx-1'>
                            <label>Max Discount Amount</label>
                            <input className="createFromInputField" type='number' min='0' value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />
                        </div>
                        <div className="w-1/5 mx-1">
                            {selectedSubCategory.value && <button onClick={handleSaveButton} className="bg-blue-600 text-white px-4 py-2 rounded mt-6">Save</button>}
                        </div>
                    </div>
                ) : ''}

                <div className='w-full py-2 border-b mt-2 mb-4'></div>
                <div className='w-full'>
                    <table className='w-full'>
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader">Sub Category Name</th>
                                <th className="tableHeader">Discount</th>
                                <th className="tableHeader">Max Amount</th>
                                <th className="tableHeader">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers?.map((item, index) => (
                                <tr key={index} className="border-b py-4 h-12">
                                    <td><p className="tableData">{item.sub_category.name}</p></td>
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
