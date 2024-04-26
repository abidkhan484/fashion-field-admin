import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { permission } from 'helper/permission';
import Select from 'react-select'

export default function AddUser() {
    const { token, user } = useSelector(state => state.auth)

    let { id } = useParams();

    const [loading, setLoading] = React.useState(false);
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState([]);

    const [userType, setUserType] = useState(null)
    const [userTypeFromAxios, setUserTypeFromAxios] = useState([])
    const [userTypeFromCustom, setUserTypeFromCustom] = useState([])

    useEffect(() => {
        if (token != "") {
            axios.get(`/usertype`, {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                console.log(response.data)
                setUserTypeFromAxios(response.data)
            }).catch(errors => {
                console.log(errors.response)
            })
        }
    }, [token])

    useEffect(() => {

        setUserTypeFromCustom([])

        if (userTypeFromAxios.length > 0) {
            userTypeFromAxios.map((item, index) => {
                setUserTypeFromCustom(prevState => [...prevState, { value: item.id, label: item.name }])
            })
        }

    }, [userTypeFromAxios])

    useEffect(() => {
        console.log(userTypeFromCustom)
    }, [userTypeFromCustom])



    let history = useHistory();
    React.useEffect(() => {
        if (user?.permissions) {
            if (!(permission(user.permissions, 'system_user', 'update')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const handleUserSubmit = () => {
        axios.post(`/users/${id}`, {
            _method: 'PUT',
            name: name,
            email: email,
            password: password,
            user_type_id: userType?.value
        }, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            history.push('/admin/users')
        }).catch(errors => {
            console.log(errors.response);
            if (errors.response.status == 422) {
                setErrors(errors.response.data.errors);
            }
        })
    }

    const fetchUser = (id) => {
        axios.get(`/users/${id}`, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            // console.log(response);
            setName(response.data.name)
            setEmail(response.data.email)
            setUserType({ value: response.data?.user_type?.id, label: response.data.user_type?.name })
        }).catch(errors => {
            console.log(errors.response);
        })
    }

    React.useEffect(() => {
        if (token != '') {
            fetchUser(id);
        }
    }, [token]);

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Add New System User</h1>
                <div className="flex">

                </div>
            </div>
            <div className="card h-screen">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Add User</h4>
                        </div>
                        {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                        {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                    </div>
                </div>
                <div className="card-body overflow-x-auto h-full">
                    <div className="w-full flex -mx-1">
                        <div className="w-1/3 mx-1">
                            <label htmlFor="name" className="createFromInputLabel">Name</label>
                            <input type="text" onChange={(e) => setName(e.target.value)} value={name} className="createFromInputField" />
                            <p className="text-red-600 text-sm">{errors.name}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="name" className="createFromInputLabel">Email</label>
                            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className="createFromInputField" />
                            <p className="text-red-600 text-sm">{errors.email}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="name" className="createFromInputLabel">Password</label>
                            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className="createFromInputField" />
                            <p className="text-red-600 text-sm">{errors.password}</p>
                        </div>



                        <div className='w-1/3 mx-1'>
                            <label htmlFor="userType" className="createFromInputLabel">User Type</label>
                            <Select
                                value={userType}
                                onChange={option => setUserType(option)}
                                options={userTypeFromCustom}
                                className="w-full selectTag font-Poppins font-normal text-sm1 mt-1 mb-1"
                                placeholder="Select User Type"
                                isClearable={true}
                                isSearchable={true}
                                id="userType"
                                maxMenuHeight={155}
                            />
                            {/* {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus?.region}</p>} */}
                        </div>




                    </div>
                    <div className="px-8 mt-8 flex justify-end">
                        {(loading) ? (
                            <>
                                <button className="button button-primary w-32 mt-24" disabled> <span className="fas fa-sync-alt animate-spin"></span></button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleUserSubmit()} className="button button-primary w-32 mt-24">Create User</button>
                            </>
                        )}

                    </div>
                </div>
            </div>

        </div>
    )
}
