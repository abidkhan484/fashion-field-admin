import axios from 'axios';
import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import { useSelector } from 'react-redux';

const editorModules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
    ],

}

const editorFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]

export default function SendNewsletter() {

    const { token } = useSelector(state => state.auth);
    const [subject, setSubject] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [body, setBody] = React.useState('');

    const [errorStatus, setErrorStatus] = useState(null)

    const handlePageSubmit = () => {
        setLoading(true);
        axios.post(`newsletters`, {
            subject: subject,
            body: body
        }, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
            setLoading(false);
            setSubject('');
            setBody('');
            setErrorStatus(null)
        }).catch(error => {
            console.log(error.response);
            setLoading(false);
            setErrorStatus(error.response.data.errors)
        });
    }

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Send Newsletter</h1>
                <div className="flex">

                </div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Send Newsletter to Subscribers</h4>
                        </div>

                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <div className="grid grid-cols-12">
                        <div className="col-span-4 flex items-center">
                            <label htmlFor="name" className="createFromInputLabel">Subject</label>
                        </div>
                        <div className="col-span-8">
                            <input type="text" id="name" className="createFromInputField" placeholder="Subject" name="name" onChange={(e) => setSubject(e.target.value)} value={subject} />
                            <p className="font-Poppins font-medium text-xs text-red-500">{errorStatus?.subject}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 mt-4">
                        <div className="col-span-4 flex items-center">
                            <label htmlFor="description" className="createFromInputLabel">Description</label>
                        </div>
                        <div className="col-span-8">

                            <ReactQuill
                                theme="snow"
                                onChange={value => setBody(value)}
                                modules={editorModules}
                                formats={editorFormats}
                                placeholder="Email Body"

                            />

                            <p className="font-Poppins font-medium text-xs text-red-500">{errorStatus?.body}</p>

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
                        <button onClick={() => handlePageSubmit()} className="button button-primary w-32">Send</button>
                    </>
                )}

            </div>
        </div>
    )
}
