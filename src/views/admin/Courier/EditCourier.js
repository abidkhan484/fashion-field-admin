import React from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { permission } from 'helper/permission';
const EditCourier = () => {
    const { token, user } = useSelector(state => state.auth)
    let { id } = useParams();

    const [loading, setLoading] = React.useState(false);
    const [name, setName] = React.useState('');
    const [contact, setContact] = React.useState('');
    const [charge, setCharge] = React.useState('');
    const [active, setActive] = React.useState(true);
    const [errors, setErrors] = React.useState([]);

    const [checked,setChecked] = React.useState(false)

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'couriers', 'update')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const handleCourierSubmit = () => {
        axios.post(`/couriers/${id}`, {
           
            name: name,
            contact: contact,
            charge: charge,
            active:active
        }, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            history.push('/admin/couriers')
        }).catch(errors => {
            console.log(errors.response);
            if(errors.response.status === 422)
            {
                setErrors(errors.response.data.errors);
            }
        })
    }
    const fetchCourier = (id) => {
        axios.get(`/couriers/${id}`, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            // console.log(response);
            setName(response.data.name)
            setContact(response.data.contact)
            setCharge(response.data.charge)
            setActive(response.data.active)
        }).catch(errors => {
            console.log(errors.response);
        })
    }

    React.useEffect(() => {
        if(token != '')
        {
            fetchCourier(id);
        }
    }, [token]);

    const onChangeValue = (e)=>{
        console.log(e.target.value);
        setChecked(true);
    }
    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Edit Courier</h1>
                <div className="flex">
                    
                </div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Edit Courier</h4>
                        </div>
                       
                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <div className="w-full flex -mx-1">
                        <div className="w-1/3 mx-1">
                            <label htmlFor="name" className="createFromInputLabel">Name</label>
                            <input type="text" onChange={(e) => setName(e.target.value)} value={name} className="createFromInputField" />
                            <p className="text-red-600 text-sm">{errors.name}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="contact" className="createFromInputLabel">Contact</label>
                            <input type="text" onChange={(e) => setContact(e.target.value)} value={contact} className="createFromInputField" />
                            <p className="text-red-600 text-sm">{errors.contact}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="charge" className="createFromInputLabel">Charge</label>
                            <input type="text" onChange={(e) => setCharge(e.target.value)} value={charge} className="createFromInputField" />
                            <p className="text-red-600 text-sm">{errors.charge}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                        <label htmlFor="Active" className="createFromInputLabel">Active</label>
                            <select className="createFromInputField" onChange={(e) => setActive(e.target.value)} value={active} >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-8 mt-8 flex justify-end">
                {(loading) ? (
                    <>
                        <button className="button button-primary w-32" disabled> <span className="fas fa-sync-alt animate-spin"></span></button>
                    </>
                ) : (
                    <>
                        <button onClick={() => handleCourierSubmit()} className="button button-primary w-32">Update Courier</button>
                    </>
                )}

            </div>
        </div>
    )
}

export default EditCourier
