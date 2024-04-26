import axios from "axios";
import React from "react";
import Select from "react-select";

import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { permission } from "helper/permission";

const NewMenuAdd = () => {
    const { id } = useParams();
    const { token, user } = useSelector((state) => state.auth);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "menu_management", "create") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const [types, setTypes] = React.useState([]);
    const [selectedType, setSelectedType] = React.useState("");
    const [typeItems, setTypeItems] = React.useState([]);
    const [typeEdit, setTypeEdit] = React.useState(false);
    const [name, setName] = React.useState("");
    const [slug, setSlug] = React.useState("");

    const fetchMenuTypes = () => {
        axios
            .get("/menus/items/type", {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                console.log(response);
                setTypes(response.data);
                // response.data.map((item, index) => {
                //     setTypes(...prevState, [...prevState, {label: item}])
                // })
            })
            .catch((error) => {
                console.log(error);
            });
    };

    React.useEffect(() => {
        if (token != "") {
            fetchMenuTypes();
        }
    }, [token]);

    React.useEffect(() => {
        if (selectedType != "") {
            // console.log(selectedType);
            axios
                .get(`/menus/items/type/${selectedType.value}`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: token,
                    },
                })
                .then((response) => {
                    // console.log(response);
                    setTypeItems([]);
                    setTypeEdit(response.edit);
                    setTypeEdit(response.data.edit);
                    response?.data?.items.map((item, index) => {
                        setTypeItems((prevState) => [
                            ...prevState,
                            { label: item.name, value: item.slug },
                        ]);
                    });
                })
                .catch((error) => {
                    console.log(error.response);
                });
        }
    }, [selectedType]);

    React.useState(() => {
        console.log(typeItems);
    }, [typeItems]);

    const handleAddItem = (id) => {
        console.log("id", id);

        axios
            .post(
                `menus/${id}/add`,
                {
                    name: name,
                    slug: slug,
                    type: selectedType.value,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                // console.log(response);
                history.push("/admin/manumanage");
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    return (
        <div>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">Add Item</h1>
                    <div className="flex"></div>
                </div>
                <div className="w-1/3">
                    <div className="card">
                        <div className="border-b">
                            <div className="card-header">
                                <div>
                                    <h4 className="pageHeading">Menu Items</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body overflow-x-auto">
                            <div className="w-full">
                                <div className="w-full my-2">
                                    <label
                                        htmlFor="name"
                                        className="createFromInputLabel"
                                    >
                                        Menu Type
                                    </label>

                                    <Select
                                        options={types}
                                        onChange={(option) => [
                                            setSelectedType(option),
                                            setName(""),
                                        ]}
                                    />
                                </div>
                                {selectedType != "" && typeEdit == false ? (
                                    <div className="w-full my-2">
                                        <label
                                            htmlFor="name"
                                            className="createFromInputLabel"
                                        >
                                            Select {selectedType.label}
                                        </label>

                                        <Select
                                            options={typeItems}
                                            onChange={(option) => [
                                                setName(option.label),
                                                setSlug(option.value),
                                            ]}
                                        />
                                    </div>
                                ) : (
                                    ""
                                )}

                                <div className="w-full my-2">
                                    <label
                                        htmlFor="name"
                                        className="createFromInputLabel"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="createFromInputField"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>

                                {typeEdit ? (
                                    <div className="w-full my-2">
                                        <label
                                            htmlFor="slug"
                                            className="createFromInputLabel"
                                        >
                                            Slug
                                        </label>
                                        <input
                                            type="text"
                                            id="slug"
                                            className="createFromInputField"
                                            placeholder="Slug"
                                            value={slug}
                                            onChange={(e) =>
                                                setSlug(e.target.value)
                                            }
                                        />
                                    </div>
                                ) : (
                                    ""
                                )}

                                <div className="w-full my-2">
                                    <button
                                        onClick={() => handleAddItem(id)}
                                        className="bg-blue-400 text-white px-4 py-2 rounded float-right"
                                    >
                                        Add Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewMenuAdd;
