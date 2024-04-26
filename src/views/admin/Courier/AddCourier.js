import React from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { permission } from 'helper/permission';
const AddCourier = () => {
    const { token, user } = useSelector(state => state.auth)
    const [loading, setLoading] = React.useState(false);
    const [name, setName] = React.useState('');
    const [contact, setContact] = React.useState('');
    const [charge, setCharge] = React.useState('');
    const [active, setActive] = React.useState(true);
    const [errors, setErrors] = React.useState([]);

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'couriers', 'create')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const handleCourierSubmit = () => {
        axios.post('/couriers', {
            name: name,
            contact: contact,
            charge: charge,
            active:true
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

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Add New Courier</h1>
                <div className="flex">
                    
                </div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Add Courier</h4>
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
                        <button onClick={() => handleCourierSubmit()} className="button button-primary w-32">Create Courier</button>
                    </>
                )}

            </div>
        </div>
    )
}

export default AddCourier
