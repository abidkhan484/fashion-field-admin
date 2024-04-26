import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { permission } from 'helper/permission';

export default function AddCities() {
    let {id} = useParams();

    const { token, user } = useSelector(state => state.auth)

    const [className, setClassName] = React.useState('');
    const [cities, setCities] = React.useState([]);
    const [allCities, setAllCites] = React.useState([]);
    const [classCharge, setClassCharge] = React.useState('');
    const [classDefault, setClassDefault] = React.useState('');
    const [selectedCity, setSelectedCity] = React.useState('');
    const [classErrors, setClassErrors] = React.useState([]);

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'shipping_management', 'update')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const fetchClass = (id) => {
        axios.get(`/shipping-classes/${id}`, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            // console.log(response);
            setClassName(response.data.name)
            setClassCharge(response.data.charge)
            setClassDefault(response.data.default)
            setCities(response.data.cities)
        }).catch(errors => {
            console.log(errors.response);
        })
    }

    const fetchAllCites = () => {
        setAllCites([]);

        axios.get('/cites', {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            response.data.map(item => {
                setAllCites(prevState => [...prevState, {value: item.id, label: item.name}])
            })
        }).catch(errors => {
            console.log(errors.response);
        })
    }

    React.useEffect(() => {
        if(token != '')
        {
            fetchClass(id);
            fetchAllCites();
        }
    }, [token]);

    const removeCity = (id, city_id) => {
        axios.get(`/shipping-classes/${id}/remove/${city_id}`, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            fetchClass(id)
        }).catch(errors => {
            console.log(errors.response);
        })
    }

    const addCity = () => {
        axios.post(`/shipping-classes/${id}/city`, {
            city_id: selectedCity.value
        }, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            fetchClass(id);
        }).catch(errors => {
            console.log(errors.response);
        })
    }

    const updateClass = () => {
        axios.post(`/shipping-classes/${id}`, {
            _method: 'PUT',
            name: className,
            charge: classCharge,
            default: classDefault
        }, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            fetchClass(id);
        }).catch(errors => {
            console.log(errors.response);
            if(errors.response.status == 422)
            {
                setClassErrors(errors.response.data.errors)
            }
        })
    }

    return (
        <>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">Update Class and Add cities</h1>
                    <div className="flex">
                        {/* <button className="button button-outline-primary px-4" onClick={() => setModal(!modal)}>Add Shipping Class</button> */}
                    </div>
                </div>
                <div className="w-full -mx-1 flex">
                    <div className="w-1/2 mx-1">
                        <div className="card">
                            <div className="border-b">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">Update Shipping Classes</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="w-full flex -mx-1 mb-2">
                                    <div className="w-1/2 mx-1">
                                        <label>Name</label>
                                        <input type="text" value={className} onChange={(e) => setClassName(e.target.value)} className="w-full" />
                                        <p className="text-red-600">{classErrors.name}</p>
                                    </div>
                                    <div className="w-1/2 mx-1">
                                        <label>Charge</label>
                                        <input type="text" value={classCharge} onChange={(e) => setClassCharge(e.target.value)} className="w-full" />
                                        <p className="text-red-600">{classErrors.charge}</p>
                                    </div>
                                </div>
                                <div className="w-full flex -mx-1">
                                    <div className="w-full mx-1">
                                        <label><input type="checkbox" value={classDefault} checked={classDefault ? true : false} onChange={() => setClassDefault(!classDefault)} /> Default?</label>
                                        <p className="text-red-600">{classErrors.default}</p>
                                    </div>
                                </div>
                                <div className="w-full pb-4 -mx-1">
                                    <button className="text-white bg-blue-400 px-4 py-2 rounded float-right" onClick={() => updateClass()}>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 mx-1">
                        <div className="card">
                            <div className="border-b">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">Add and Remove Cities</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                            {user?.permissions && (permission(user.permissions, 'shipping_management', 'create') || (user.user_type_id == 1)) ? (
                                <>
                                <div className="w-full -mx-1">
                                    <label>Add City</label>
                                    <Select
                                        options={allCities}
                                        onChange={(option) => setSelectedCity(option)}
                                        />
                                </div>
                                <div className="w-full float-right mb-8">
                                    <button className="float-right bg-blue-400 text-white px-4 py-2 rounded mt-4" onClick={() => addCity()}>Add</button>
                                </div>
                                </>
                            ) : '' }
                                
                                <div className="mt-4">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b h-12">
                                                <th  className="tableHeader">Name</th>
                                                <th className="float-right w-16">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cities?.map((item, index) => (
                                                <tr key={index} className="border-b h-12">
                                                    <td className="tableData"><p>{item.city.name}</p></td>
                                                    <td className="float-right h-12 w-16 flex items-center justify-center">
                                                        
                                                        {user?.permissions && (permission(user.permissions, 'shipping_management', 'delete') || (user.user_type_id == 1)) ? (
                                                            <button className="text-center" onClick={() => removeCity(id, item.city.id)}> X</button>
                                                        ) : '' }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    )
}
