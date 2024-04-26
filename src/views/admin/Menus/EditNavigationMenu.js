import axios from 'axios';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { permission } from 'helper/permission';



export default function EditNavigationMenu() {
    const { token, user } = useSelector(state => state.auth)

    const [types, setTypes] = React.useState([]);
    const [selectedType, setSelectedType] = React.useState('');
    const [typeItems, setTypeItems] = React.useState([]);
    const [typeEdit, setTypeEdit] = React.useState(false);
    const [name, setName] = React.useState('');
    const [slug, setSlug] = React.useState('');
    const [type, setType] = React.useState('');
    const [typeLabel, setTypeLabel] = React.useState('');
    const [parentId, setParentId] = React.useState('');

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (!(permission(user.permissions, 'navigation', 'update')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const { id } = useParams();

    const fetchMenuTypes = () => {
        axios.get('/menus/items/type', {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log("🚗", response.data);
            setTypes(response.data);
            setType([])
            // response.data.map((item, index) => {
            //     setTypes(...prevState => [prevState, {label: item}])
            // })
        }).catch(error => {
            console.log(error);
        })


    }

    const fetchMenu = () => {
        axios.get(`navigation/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
            setName(response.data.name)
            setSlug(response.data.slug)
            setType(response.data.type)
            setParentId(response.data.parent_id)
            // setSelectedType({lable: response.data.type, value: response.data.type})
            // const res = types?.filter((item)=>item?.value == response.data.type)


        }).catch(error => {
            console.log(error.response);
        })
    }

    React.useEffect(() => {
        if (selectedType != '') {
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
                    setTypeItems(prevState => [...prevState, { label: item.name, value: item.slug }])
                })
            }).catch(error => {
                console.log(error.response);
            })
        }

    }, [selectedType])

    React.useEffect(() => {
        if (token != '' && id != null) {
            fetchMenuTypes();

        }
    }, [token]);


    React.useEffect(() => {
        if (token != '' && id != null) {
            fetchMenu();

        }
    }, [token, id]);





    const addMainItem = () => {
        axios.post(`/navigation/${id}`, {
            name: name,
            slug: slug,
            type: selectedType.value
        }, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            // console.log(id);
            history.push(`/admin/navigation/${parentId}/show`);
        }).catch(error => {
            console.log(error.response);
        })
    }

    return (
        <>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">Edit Navigation Main Menu</h1>
                    <div className="flex">
                        {/* <Link to={'/admin/navigation/add'} className="button button-primary px-4">Add Main Menu</Link> */}
                    </div>
                </div>
                <div className="w-1/3 h-full">
                    <div className="card">
                        <div className="border-b">
                            <div className="card-header">
                                <div>
                                    <h4 className="pageHeading">Edit Menu</h4>
                                </div>
                                {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                                {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                            </div>
                        </div>
                        <div className="card-body overflow-x-auto" style={{ height: 600 }}>
                            <div className="w-full my-2">
                                <label htmlFor="name" className="createFromInputLabel">Menu Type </label>
                                {/* <input type="text" onChange={(e) => setName(e.target.value)} value={name} className="createFromInputField" /> */}

                                <Select
                                    options={types}
                                    onChange={option => [setSelectedType({ label: option.label, value: option.value }), setSlug(''), console.log(option)]}
                                    // value={types.filter((item)=>item.value == types)[0]}
                                    value={selectedType}

                                />
                            </div>
                            {(selectedType != '' && typeEdit == false) ? (
                                <div className="w-full my-2">
                                    <label htmlFor="name" className="createFromInputLabel">Select {selectedType.label}</label>
                                    {/* <input type="text" onChange={(e) => setName(e.target.value)} value={name} className="createFromInputField" /> */}

                                    <Select
                                        options={typeItems}
                                        onChange={option => [setSlug(option.value)]}
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
                            <div className="w-full py-2 flex justify-end">
                                <button onClick={addMainItem} className="button button-primary px-4 block relative">Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
