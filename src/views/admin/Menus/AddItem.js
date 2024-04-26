import axios from 'axios';
import React from 'react'
import Select from 'react-select';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router'

export default function AddItem() {

    const {id} = useParams();
    const { token } = useSelector(state => state.auth)

    const [types, setTypes] = React.useState([]);
    const [selectedType, setSelectedType] = React.useState('');
    const [typeItems, setTypeItems] = React.useState([]);
    const [typeEdit, setTypeEdit] = React.useState(false);
    const [name, setName] = React.useState('');
    const [slug, setSlug] = React.useState('');

    const [heading, setHeading] = React.useState(0);
    const [parent, setParent] = React.useState(0);

    const fetchMenuTypes = () => {
        axios.get('/menus/items/type', {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
            setTypes(response.data);
            // response.data.map((item, index) => {
            //     setTypes(...prevState, [...prevState, {label: item}])
            // })
        }).catch(error => {
            console.log(error);
        })
    }

    React.useEffect(() => {
        if(token != '')
        {
            fetchMenuTypes();
        }
    }, [token]);

    React.useEffect(() => {
        if(selectedType != '')
        {
            // console.log(selectedType);
            axios.get(`/menus/items/type/${selectedType.value}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: token
                }
            }).then(response => {
                // console.log(response);
                setTypeItems([]);
                setTypeEdit(response.edit);
                setTypeEdit(response.data.edit);
                response?.data?.items.map((item, index) => {
                    setTypeItems(prevState => [...prevState, {label: item.name, value: item.slug}])
                })
            }).catch(error => {
                console.log(error.response);
            })
        }
    }, [selectedType])

    React.useState(() => {
        console.log(typeItems);
    }, [typeItems])

    const handleAddItem = () => {
        axios.post(`/menus/${id}/items`, {
            name: name,
            slug: slug,
            type: selectedType.value,
            parent_id: parent,
            heading: heading
        }, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
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
                    <h1 className="pageHeading">Add Item</h1>
                    <div className="flex">

                    </div>
                </div>
                <div className="w-1/3">
                    <div className="card">
                        <div className="border-b">
                            <div className="card-header">
                                <div>
                                    <h4 className="pageHeading">Menu Items</h4>
                                </div>
                                {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                                {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                            </div>
                        </div>
                        <div className="card-body overflow-x-auto">
                            <div className="w-full">
                                <div className="w-full my-2">
                                    <label htmlFor="name" className="createFromInputLabel">Menu Type</label>
                                    {/* <input type="text" onChange={(e) => setName(e.target.value)} value={name} className="createFromInputField" /> */}
                                    
                                    <Select
                                        options={types}
                                        onChange={option => [setSelectedType(option), setName('')]}
                                    />
                                </div>
                                {selectedType != '' ? (
                                    <div className="w-full my-2">
                                        <label htmlFor="name" className="createFromInputLabel">Select {selectedType.label}</label>
                                        {/* <input type="text" onChange={(e) => setName(e.target.value)} value={name} className="createFromInputField" /> */}
                                        
                                        <Select
                                            options={typeItems}
                                            onChange={option => [setName(option.label), setSlug(option.value)]}
                                        />
                                    </div>
                                ) : ''}

                                <div className="w-full my-2">
                                    <label htmlFor="name" className="createFromInputLabel">Name</label>
                                    <input type="text" id="name" className="createFromInputField" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                                </div>

                            {typeEdit ? (
                                <div className="w-full my-2">
                                    <label htmlFor="slug" className="createFromInputLabel">Slug</label>
                                    <input type="text" id="slug" className="createFromInputField" placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} />
                                </div>
                            ) : ''}

                                <div className="w-full my-2">
                                    <label htmlFor="heading" className="createFromInputLabel"><input id="heading" type="checkbox" onChange={() => setHeading(!heading)} checked={heading ? 'checked' : ''} /> Heading</label>
                                </div>

                                {heading ? '' : (
                                    <div className="w-full my-2">
                                        <label htmlFor="parent" className="createFromInputLabel">Select Parent</label>
                                        <Select />
                                    </div>
                                )}

                                <div className="w-full my-2">
                                    <button onClick={handleAddItem} className="bg-blue-400 text-white px-4 py-2 rounded float-right">Add Item</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
