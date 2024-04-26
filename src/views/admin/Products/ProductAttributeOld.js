import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
import { permission } from 'helper/permission';

import Select from 'react-select';

export default function ProductAttribute() {

    const {id} = useParams();
    const { token, user } = useSelector(state => state.auth);
    const [options, setOptions] = React.useState([]);
    const [selectedOption, setSelectedOption] = React.useState('');
    const [attributes, setAttributes] = React.useState([]);
    const [selectedAttribute, setSelectedAttribute] = React.useState('');
    const [variation, setVariation] = React.useState([]);
    const [imageable, setImageable] = React.useState(false);
    const [image, setImage] = React.useState('');
    const [stock, setStock] = React.useState('');
    const [variations, setVariations] = React.useState([]);

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'products_manage_product', 'update') || permission(user.permissions, 'products_manage_product', 'create')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    // React.useEffect(() => {
    //     // console.log(listOption);
    // }, [listOption])

    const fetchOptions = () => {
        axios.get(`/attributes`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
            setOptions([]);

            response?.data?.map((item, index) => {
                // console.log(item.imageable);
                setOptions(prevState => [...prevState, {label: item.name, value: item.id, imageable: item.imageable}])           
            })
            
            
        }).catch(error => {
            console.log(error.response);
        })
    }

    const getAttributes = (id) => {
        axios.get(`/attributes/${id}/values`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
            setAttributes([]);
            response?.data?.values?.map((item, index) => {
                setAttributes(prevState => [...prevState, {label: item.value, value: item.id}])
            })
        })
    }

    React.useEffect(() => {
        if(token != '')
        {
            fetchOptions();
            getVariation();
        }
    }, [id, token]); 


    const handleAddOption = () => {
        if(selectedOption.imageable === true)
            setImageable(true);
            // console.log(selectedOption.imageable);
        if(variation.findIndex(item => item.option == selectedOption.value) != -1)
            return

        setVariation(prevState => [...prevState, {label: selectedAttribute.label, value: selectedAttribute.value, option: selectedOption.value}])
    }

    React.useState(() => {
        console.log(image);
    }, [image])

    const saveVariation = () => {
        // console.log(variation);
        const formData = new FormData();

        variation.map(item => {
            formData.append('attribute_id[]', item.value)
        })

        formData.append('stock', stock);
        formData.append('image', image);

        axios.post(`/products/${id}/add-attribute`, formData, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            // console.log(response);
            if(response.status == 200)
                getVariation();
            
        }).catch(error => {
            console.log(error.response);
        })
    }


    const getVariation = () => {
        axios.get(`products/${id}/add-attribute`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
            setVariations(response.data);
        }).catch(error => {
            console.log(error.response);
        })
    }


    const deleteVariation = (id) => {
        axios.get(`products/group/${id}/delete`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
            getVariation();
        }).catch(error => {
            console.log(error);
        })
    }

    const updateStock = (e, id) => {
        let stock = e.target.value
        axios.post(`products/group/${id}/update`, {
            stock: stock
        }, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error.response);
        })
    }

    return (
        <>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">Add Attribute To Product</h1>
                    <div className="flex">
                        <Link to="/admin/all-products" className="button button-success px-2">Back To Products</Link>
                    </div>
                </div>
                <div className="w-full flex wrap -mx-1">
                    <div className="w-1/2 h-screen mx-1">
                        <div className="card">
                            <div className="border-b">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">Add Option</h4>
                                    </div>
                                    {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                                    {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                                </div>
                            </div>
                            <div className="card-body overflow-auto" style={{minHeight: '350px'}}>
                                <div className="w-full flex my-2">
                                    <div className="w-1/3">
                                        <label>Select Option</label>
                                    </div>
                                    <div className="w-2/3 mt-8">
                                        <Select className="top-auto bottom-full" onChange={option => [getAttributes(option.value), setSelectedOption(option), console.log(option)]} maxMenuHeight={250} options={options} />
                                    </div>
                                </div>
                                <div className="w-full flex my-2">
                                    <div className="w-1/3">
                                        <label>Select Attribute</label>
                                    </div>
                                    <div className="w-2/3 mt-8">
                                        <Select className="top-auto bottom-full" onChange={option => setSelectedAttribute(option)} maxMenuHeight={250} options={attributes} />
                                    </div>
                                </div>
                                <div className="w-full flex my-2">
                                    <div className="w-full">
                                        {selectedAttribute != '' ? (<button onClick={handleAddOption} className="bg-blue-500 text-white py-1 px-4 rounded float-right">Add</button>) : '' }
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="w-1/2 mx-1">
                        <div className="w-full">
                            <div className="card pb-4">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">Add Variation</h4>
                                    </div>
                                </div>
                                <div className="card-body py-4 w-full">
                                    {variation.length > 0 ? (
                                        <div className="w-full py-4">
                                            <button className="float-right" onClick={() => [setVariation([]), setImageable(false), setImage('')]}>X</button>
                                            <div className="w-full">
                                                {variation?.map((item, index) => (
                                                    <>
                                                        <span key={index} className="font-bold">{item.label}</span>{index != (variation.length-1) ? '/' : ''}
                                                    </>
                                                ))}
                                            </div>
                                            <div className="w-full flex">
                                                {imageable ? (
                                                    <div className="w-1/2 flex wrap">
                                                        <label className="w-full text-sm">Select Image</label>
                                                        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full" />
                                                        <p className='text-sm'>Image size: 600x740</p>
                                                    </div>
                                                ) : ''}
                                                <div className="w-1/2 flex">
                                                    <label className="w-full text-sm">Stock</label>
                                                    <input type="number" onChange={(e) => setStock(e.target.value)} className="w-full" />
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <button onClick={saveVariation} className="float-right bg-blue-600 text-white px-2 py-1 my-2 rounded">Save</button>
                                            </div>
                                        </div>
                                    ) : ''}
                                    
                                </div>
                            </div>
                        </div>
                        <div className="w-full mt-4">
                            <div className="card">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">Variations</h4>
                                    </div>
                                </div>
                                <div className="card-body py-4 w-full">
                                    {variations?.map((item, index) => (
                                        <div key={index} className="w-full flex items-center border-b pb-4">
                                            <button onClick={() => deleteVariation(item.id)} className="text-red-600 mr-6">
                                                <i class="far fa-times-circle"></i>
                                            </button>
                                            {item.thumbnail != null ? (
                                                <div className="mr-4">
                                                    <img className="w-20" src={item.thumbnail} alt="Product Image" />
                                                </div>
                                            ) : ''}
                                            <div className="mr-4">
                                                <input type="text" defaultValue={item.stock} onBlur={(e) => updateStock(e, item.id)} />
                                            </div>
                                            <div className="w-full mt-4">
                                                {item?.attributes?.map((attr, index) => (
                                                    <span className="bg-gray-600 px-4 py-2 text-white mr-4">{attr.value}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
