import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useSelector } from "react-redux";
import { LoaderContext } from "context/LoaderContext";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";

const options = [
    { value: "file", label: "File" },
    { value: "text", label: "Text" },
];

const AddSettingsRequirments = (props) => {
    const [name, setName] = useState("");
    const [inputType, setInputType] = useState(null);
    const [description, setDescription] = useState("");
    const [loadingInner, setLoadingInner] = useState(false);
    const [errorStatus, setErrorStatus] = useState(null);

    const { loading, setLoading } = React.useContext(LoaderContext);

    const { token, user } = useSelector((state) => state.auth);

    const { state } = props.location;

    const history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "seller_management", "create") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    useEffect(() => {
        if (state != undefined && token != null && token != "") {
            setLoading(true);
            axios
                .get(`/sellers-verify-items/${state}`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    console.log(response);
                    setName(response?.data?.name);
                    setInputType({
                        value: response?.data?.input_type,
                        label: response?.data?.input_type,
                    });
                    setDescription(response?.data?.description);
                    setLoading(false);
                })
                .catch((errors) => {
                    console.log(errors.response);
                    setLoading(false);
                });
        }
    }, [state, token]);

    const handleSubmitSettings = () => {
        if (token != null && token != "") {
            setLoadingInner(true);
            axios
                .post(
                    "/sellers-verify-items",
                    {
                        name: name,
                        input_type: inputType?.value,
                        description: description,
                    },
                    {
                        headers: {
                            Authorization: token,
                            Accept: "application/json",
                        },
                    }
                )
                .then((response) => {
                    console.log(response);
                    setLoadingInner(false);
                    setErrorStatus(null);
                    setName("");
                    setInputType(null);
                    setDescription("");
                    history.push("/admin/seller-settings");
                })
                .catch((errors) => {
                    console.log(errors.response);
                    setLoadingInner(false);
                    setErrorStatus(errors?.response?.data?.errors);
                });
        }
    };

    useEffect(() => {
        console.log(inputType);
    }, [inputType]);

    const handleUpdatingSettings = () => {
        if (token != null && token != "") {
            setLoadingInner(true);
            axios
                .post(
                    `/sellers-verify-items/${state}`,
                    {
                        name: name,
                        input_type: inputType?.value,
                        description: description,
                        _method: "PUT",
                    },
                    {
                        headers: {
                            Authorization: token,
                            Accept: "application/json",
                        },
                    }
                )
                .then((response) => {
                    setLoadingInner(false);
                    setErrorStatus(null);
                    setName("");
                    setInputType(null);
                    setDescription("");
                    history.push("/admin/seller-settings");
                })
                .catch((errors) => {
                    setLoadingInner(false);
                    setErrorStatus(errors?.response?.data?.errors);
                });
        }
    };

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Seller settings creation</h1>
            </div>

            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Settings</h4>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="grid grid-cols-12">
                        <div className="col-span-3">
                            <div className="flex items-center h-full">
                                <label
                                    className="font-DMSans text-sm1"
                                    htmlFor="name"
                                >
                                    Name{" "}
                                    <span className="text-logobarElementBG">
                                        *
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="col-span-9">
                            <input
                                type="text"
                                id="name"
                                className="border-1 block w-full h-9 focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <p className="font-Poppins font-medium text-xs text-red-500">
                                {errorStatus?.name}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 mt-4">
                        <div className="col-span-3">
                            <div className="flex items-center h-full">
                                <label
                                    className="font-DMSans text-sm1"
                                    htmlFor="input_type"
                                >
                                    Input Type{" "}
                                    <span className="text-logobarElementBG">
                                        *
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="col-span-9">
                            <Select
                                value={inputType}
                                onChange={(option) => {
                                    setInputType(option);
                                }}
                                options={options}
                                className="w-full createFromInputLabel selectTag"
                                placeholder="Select Input Type"
                                isClearable={true}
                                isSearchable={true}
                            />
                            <p className="font-Poppins font-medium text-xs text-red-500">
                                {errorStatus?.input_type}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 mt-4">
                        <div className="col-span-3">
                            <div className="flex items-center h-full">
                                <label
                                    className="font-DMSans text-sm1"
                                    htmlFor="description"
                                >
                                    Description
                                </label>
                            </div>
                        </div>

                        <div className="col-span-9">
                            <input
                                type="text"
                                id="description"
                                className="border-1 block w-full h-9 focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            {/* <p className="font-Poppins font-medium text-xs text-logobarElementBG">{errorStatus?.mobile}</p> */}
                        </div>
                    </div>

                    {state ? (
                        <div className="mt-8 flex justify-end">
                            {loadingInner ? (
                                <>
                                    <button
                                        className="button button-primary w-32"
                                        disabled
                                    >
                                        {" "}
                                        <span className="fas fa-sync-alt animate-spin"></span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleUpdatingSettings}
                                        className="button button-primary w-32"
                                    >
                                        Update Settings
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="mt-8 flex justify-end">
                            {loadingInner ? (
                                <>
                                    <button
                                        className="button button-primary w-32"
                                        disabled
                                    >
                                        {" "}
                                        <span className="fas fa-sync-alt animate-spin"></span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSubmitSettings}
                                        className="button button-primary w-32"
                                    >
                                        Create Settings
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddSettingsRequirments;
