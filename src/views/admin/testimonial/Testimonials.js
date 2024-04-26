import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";

export default function Testimonials() {
    const [name, setName] = React.useState("");
    const [designation, setDesignation] = React.useState("");
    const [comment, setComment] = React.useState("");
    const [testimonials, setTestimonials] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const [errorStatus, setErrorStatus] = useState(null);

    const { token, user } = useSelector((state) => state.auth);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "testimonial", "access") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const hanldeSubmit = () => {
        setLoading(true);
        axios
            .post(
                `testimonials`,
                {
                    name: name,
                    designation: designation,
                    comment: comment,
                },
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: token,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                setLoading(false);
                setName("");
                setDesignation("");
                setComment("");
                fetchTestimonials();
                setErrorStatus(null);
            })
            .catch((error) => {
                console.log(error.response);
                setLoading(false);
                setErrorStatus(error.response.data.errors);
            });
    };

    const deleteItem = (id) => {
        axios
            .delete(`testimonials/${id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                console.log(response);
                // setTestimonials(response.data);
                fetchTestimonials();
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const fetchTestimonials = () => {
        axios
            .get(`testimonials`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                console.log(response);
                setTestimonials(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    React.useEffect(() => {
        if (token != "") {
            fetchTestimonials();
        }
    }, [token]);

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Testimonial</h1>
                <div className="flex"></div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Manage Testimonial</h4>
                        </div>
                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <div className="grid grid-cols-12">
                        <div className="col-span-4 flex items-center">
                            <label
                                htmlFor="name"
                                className="createFromInputLabel"
                            >
                                Name
                            </label>
                        </div>
                        <div className="col-span-8">
                            <input
                                type="text"
                                id="name"
                                className="createFromInputField"
                                placeholder="Name"
                                name="name"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                            <p className="font-Poppins font-medium text-xs text-red-500">
                                {errorStatus?.name}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 mt-2">
                        <div className="col-span-4 flex items-center">
                            <label
                                htmlFor="name"
                                className="createFromInputLabel"
                            >
                                Designation
                            </label>
                        </div>
                        <div className="col-span-8">
                            <input
                                type="text"
                                id="name"
                                className="createFromInputField"
                                placeholder="Designation"
                                name="name"
                                onChange={(e) => setDesignation(e.target.value)}
                                value={designation}
                            />
                            <p className="font-Poppins font-medium text-xs text-red-500">
                                {errorStatus?.designation}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 mt-2">
                        <div className="col-span-4 flex items-center">
                            <label
                                htmlFor="name"
                                className="createFromInputLabel"
                            >
                                Comment
                            </label>
                        </div>
                        <div className="col-span-8">
                            <input
                                type="text"
                                id="name"
                                className="createFromInputField"
                                placeholder="Comment"
                                name="name"
                                onChange={(e) => setComment(e.target.value)}
                                value={comment}
                            />
                            <p className="font-Poppins font-medium text-xs text-red-500">
                                {errorStatus?.comment}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-8 mt-8 flex justify-end">
                {loading ? (
                    <>
                        <button className="button button-primary w-32" disabled>
                            {" "}
                            <span className="fas fa-sync-alt animate-spin"></span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => hanldeSubmit()}
                            className="button button-primary w-32"
                        >
                            Save
                        </button>
                    </>
                )}
            </div>

            <div className="card mt-12">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Testimonial</h4>
                        </div>
                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader">Name</th>
                                <th className="tableHeader">Designation</th>
                                <th className="tableHeader">Comment</th>
                                <th className="tableHeader float-right">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {testimonials?.map((item, index) => (
                                <tr className="border-b py-4 h-20">
                                    <td className="tableData">{item.name}</td>
                                    <td className="tableData">
                                        {item.designation}
                                    </td>
                                    <td className="tableData">
                                        {item.comment}
                                    </td>
                                    <td className="tableData float-right mt-8">
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="bg-red-600 text-white px-2 py-1 rounded"
                                        >
                                            DEL
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
