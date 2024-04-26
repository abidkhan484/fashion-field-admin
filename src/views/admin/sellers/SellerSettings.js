import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { LoaderContext } from "context/LoaderContext";
import { FaTrashAlt, FaPen } from "react-icons/fa";
import { permission } from "helper/permission";

const SellerSettings = () => {
    const { token, user } = useSelector((state) => state.auth);

    const { loading, setLoading } = React.useContext(LoaderContext);

    const [allSettings, setAllSettings] = useState([]);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "seller_management", "read") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    useEffect(() => {
        if (token != null && token != "") {
            setLoading(true);
            axios
                .get("/sellers-verify-items", {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    console.log(response);
                    setAllSettings(response.data);
                    setLoading(false);
                })
                .catch((errors) => {
                    console.log(errors.response);
                    setLoading(false);
                });
        }
    }, [token]);

    const handleDeletingSettings = (id) => {
        setLoading(true);
        axios
            .delete(`/sellers-verify-items/${id}`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                console.log(response);
                axios
                    .get("/sellers-verify-items", {
                        headers: {
                            Authorization: token,
                            Accept: "application/json",
                        },
                    })
                    .then((response) => {
                        console.log(response);
                        setAllSettings(response.data);
                        setLoading(false);
                    })
                    .catch((errors) => {
                        console.log(errors.response);
                        setLoading(false);
                    });
            })
            .catch((errors) => {
                console.log(errors.response);
                setLoading(false);
            });
    };

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Seller Settings Requirments</h1>
                <div className="flex">
                    <Link
                        to="/admin/seller-add-settings"
                        className="button button-outline-primary w-44"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="ml-2 buttonText">
                            Add a New Settings
                        </span>
                    </Link>
                </div>
            </div>

            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">All Settings</h4>
                        </div>
                    </div>
                </div>

                <div className="card-body overflow-x-auto">
                    <table className="w-350 2xl:w-full table-fixed">
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader w-1/4">Name</th>
                                <th className="tableHeader w-1/4">
                                    Input Type
                                </th>
                                <th className="tableHeader w-1/4">
                                    Description
                                </th>
                                <th className="tableHeader w-1/4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {allSettings.map((item, index) => (
                                <tr className="border-b py-4 h-20" key={index}>
                                    <td>
                                        <p className="tableData">
                                            {item?.name}
                                        </p>
                                    </td>

                                    <td>
                                        <p className="tableData">
                                            {item?.input_type}
                                        </p>
                                    </td>

                                    <td>
                                        <p className="tableData">
                                            {item?.description}
                                        </p>
                                    </td>

                                    <td>
                                        <div className="flex">
                                            <FaTrashAlt
                                                size={20}
                                                color="red"
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleDeletingSettings(
                                                        item?.id
                                                    )
                                                }
                                            />
                                            <Link
                                                to={{
                                                    pathname:
                                                        "/admin/seller-add-settings",
                                                    state: item?.id,
                                                }}
                                            >
                                                <FaPen
                                                    size={20}
                                                    className="cursor-pointer ml-6"
                                                />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerSettings;
