import React from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { permission } from 'helper/permission';

const AddSocialMenu = () => {

    const { token, user } = useSelector(state => state.auth)
    const [loading, setLoading] = React.useState(false);
    const [key, setKey] = React.useState('');
    const [value, setValue] = React.useState('');
    const [errors, setErrors] = React.useState([]);

    let history = useHistory();

    const handleSocialSubmit = () => {
        axios.post('/appearance', {
            key: key,
            value: value,
        }, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            history.push('/admin/socialmenu')
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
            <h1 className="pageHeading">Add New </h1>
            <div className="flex">
                
            </div>
        </div>
        <div className="card">
            <div className="border-b">
                <div className="card-header">
                    <div>
                        <h4 className="pageHeading">Add Social Link</h4>
                    </div>
                   
                </div>
            </div>
            <div className="card-body overflow-x-auto">
                <div className="w-full flex -mx-1">
                    <div className="w-1/2 mx-1">
                        <label htmlFor="name" className="createFromInputLabel">Key</label>
                        {/* <input type="text" onChange={(e) => setKey(e.target.value)} value={key} className="createFromInputField" /> */}

                        <label htmlFor="Active" className="createFromInputLabel">Active</label>
                            <select className="createFromInputField" onChange={(e) => setKey(e.target.value)} value={key} >
                                <option value="">Select One</option>
                                <option value="facebook">Facebook</option>
                                <option value="instagram">Instagram</option>
                                <option value="twitter">Twitter</option>
                                <option value="linkedin">Linkedin</option>
                                <option value="skype">Skype</option>
                            </select>
                        <p className="text-red-600 text-sm">{errors.name}</p>
                    </div>
                    <div className="w-1/2 mx-1">
                        <label htmlFor="contact" className="createFromInputLabel">Value</label>
                        <input type="text" onChange={(e) => setValue(e.target.value)} value={value} className="createFromInputField" />
                        <p className="text-red-600 text-sm">{errors.contact}</p>
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
                    <button onClick={() => handleSocialSubmit()} className="button button-primary w-32">Create </button>
                </>
            )}

        </div>
    </div>
    )
}

export default AddSocialMenu
