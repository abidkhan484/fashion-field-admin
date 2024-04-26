import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";
import { permission } from "helper/permission";
import collect from "collect.js";

import Select from "react-select";
import AttributeList from "../Attribute/AttributeList";
import { toast } from "react-toastify";
import ReactDOM from "react-dom";
import ProductLogActivity from "./ProductLogActivity";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

export default function ProductAttribute() {
    const { id } = useParams();
    const { token, user } = useSelector((state) => state.auth);
    const [options, setOptions] = React.useState([]);
    const [selectedOption, setSelectedOption] = React.useState("");
    const [items, setItems] = React.useState([0]);
    const [attributes, setAttributes] = React.useState([]);
    const [crossAttributes, setCrossAttributes] = React.useState([]);
    const [crossData, setCrossData] = React.useState([]);
    const [formValue, setFormValue] = React.useState([]);
    const [variations, setVariations] = React.useState([]);
    const [galleryItems, setGalleryItems] = React.useState([]);

    const [stockOutModal, setStockOutModal] = useState(false);
    const [stockOutIndex, setStockOutIndex] = useState(null);

    const [productLogActivity, setProductLogActivity] = useState(null);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !(
                    permission(
                        user.permissions,
                        "products_manage_product",
                        "update"
                    ) ||
                    permission(
                        user.permissions,
                        "products_manage_product",
                        "create"
                    )
                ) &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const getActivityLog = () => {
        axios
            .get(`/products/log-activity/${id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                setProductLogActivity(response.data);
            })
            .catch((error) => {
                //
            });
    };

    const fetchOptions = () => {
        axios
            .get(`/attributes`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                setOptions([]);

                response?.data?.map((item, index) => {
                    setOptions((prevState) => [
                        ...prevState,
                        {
                            label: item.name,
                            value: item.id,
                            imageable: item.imageable,
                            values: item.values,
                        },
                    ]);
                });
            })
            .catch((error) => {
                //
            });
    };

    React.useEffect(() => {
        if (token !== "") {
            fetchOptions();
            getVariation();
            getGallery();
            availableAttribute();
            getActivityLog();
        }
    }, [id, token]);

    const availableAttribute = () => {
        axios
            .get(`products/available/attributes/${id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                setItems([]);

                response.data.map((item) => {
                    setItems((prevState) => [
                        ...prevState,
                        {
                            label: item.name,
                            value: item.id,
                            imageable: item.imageable,
                            values: item.values,
                        },
                    ]);
                });
            })
            .catch((error) => {
                //
            });
    };

    const getGallery = () => {
        axios
            .get(`products/attributes/gallery/${id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                setGalleryItems(response.data);
            })
            .catch((error) => {
                //
            });
    };

    const getVariation = () => {
        axios
            .get(`products/${id}/add-attribute`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                setVariations(response.data);
            })
            .catch((error) => {
                //
            });
    };

    const handleOptionSelect = (option, itemIndex) => {
        const getAttributes = options.findIndex((item) => item === option);
        const itemsOf = [];

        options[getAttributes]?.values.map((item) => {
            itemsOf.push({ label: item.value, value: item.value });
        });

        const attributeItem = {
            [itemIndex]: itemsOf,
        };
        setAttributes(attributeItem);
    };

    const handleAddMoreItem = () => {
        setItems([...items, items.length]);
    };

    const handleAttributeChange = (options) => {
        const crossItem = crossAttributes.filter(
            (item) => item.itemIndex != options.itemIndex
        );
        const data = options;
        crossItem.push(data);
        setCrossAttributes(crossItem);
        const crossData = [];
        let rowData = [];

        crossItem.map((item) => {
            rowData = [];
            item.options.map((data) => {
                rowData.push(data.value);
            });
            crossData.push(rowData);
        });

        const collection = collect(crossData[0]);
        const crossTwo = [];

        crossData.map((item, index) => {
            if (index != 0) crossTwo.push(item);
        });

        const joined = collection.crossJoin(...crossTwo).all();
        setCrossData(joined);
    };

    const handleVariationSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();

        formValue.map((item, index) => {
            formData.append(
                "stock[]",
                item.stock && item.stock >= 0 ? item.stock : null
            );
            formData.append("variable[]", item.variable ? item.variable : null);
        });

        axios
            .post(`/products/${id}/cross`, formData, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                getVariation();
                getGallery();
            })
            .catch((error) => {
                toast.error(<b>Some Stocks are Negative</b>, {
                    autoClose: 2000,
                });
            });
    };

    const changingStock = (e, index) => {
        let items = [...formValue];
        let item = { ...items[index] };
        item.stock = e.target.value;
        items[index] = item;
        setFormValue(items);
    };

    const updateStock = (e, index) => {
        let items = [...variations];
        let item = { ...items[index] };
        let stock = item.stock;

        if (stock >= 0) {
            axios
                .post(
                    `products/group/${item.id}/update`,
                    {
                        stock: stock,
                    },
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: token,
                        },
                    }
                )
                .then((response) => {
                    let prop = e.target.previousSibling;
                    prop.previousSibling.disabled =
                        !prop.previousSibling.disabled;
                    let text = prop.innerText === "Cancel" ? "Edit" : "Cancel";
                    e.target.classList.toggle("hidden");
                    ReactDOM.render(text, prop);
                    getActivityLog();
                })
                .catch((error) => {
                    //
                });
        } else {
            toast.error(<b>Stocks cannot be Negative</b>, {
                autoClose: 1500,
            });
            getVariation();
        }
    };

    React.useEffect(() => {
        setFormValue([]);
        if (crossData.length > 0) {
            crossData.map((item, index) => {
                const newData = { itemIndex: index, stock: 0, variable: item };
                setFormValue((prevState) => [...prevState, newData]);
            });
        }
    }, [crossData]);

    const changingUpdateStock = (e, index) => {
        let items = [...variations];
        let item = { ...items[index] };
        item.stock = e.target.value;
        items[index] = item;
        setVariations(items);
    };

    const removeGalleryImage = (id) => {
        axios
            .delete(`products/attributes/gallery/${id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                getGallery();
            })
            .catch((error) => {
                //
            });
    };

    const uploadValueImage = (e, value) => {
        let formData = new FormData();
        formData.append("value", value);
        formData.append("thumbnail", e.target.files[0]);

        axios
            .post(`/products/attributes/gallery/${id}`, formData, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                getGallery();
            })
            .catch((error) => {
                //
            });
    };

    const allowEdit = (e) => {
        let prop = e.target;
        prop.previousSibling.disabled = !prop.previousSibling.disabled;
        let text = e.target.innerText === "Cancel" ? "Edit" : "Cancel";
        prop.nextSibling.classList.toggle("hidden");
        ReactDOM.render(text, prop);
    };

    const handleStockOut = () => {
        if (stockOutIndex != null) {
            let items = [...variations];
            let item = { ...items[stockOutIndex] };
            item.stock = 0;
            items[stockOutIndex] = item;
            setVariations(items);

            axios
                .post(
                    `products/group/${item.id}/update`,
                    {
                        stock: 0,
                    },
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: token,
                        },
                    }
                )
                .then((response) => {
                    setStockOutIndex(null);
                    setStockOutModal(false);
                    getActivityLog();
                })
                .catch((error) => {
                    //
                });
        }
    };

    const handleStockOutModal = (index) => {
        setStockOutModal(true);
        setStockOutIndex(index);
    };

    const handleCloseStockOutModal = () => {
        setStockOutModal(false);
        setStockOutIndex(null);
    };

    return (
        <>
            <Modal
                open={stockOutModal}
                onClose={handleCloseStockOutModal}
                center={true}
                blockScroll={false}
            >
                <div className="py-4 px-4" style={{ width: 500 }}>
                    <p className="font-Poppins font-bold text-center mb-4">
                        Are you Sure to make the variant Stock Out
                    </p>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            onClick={handleStockOut}
                            className="bg-green-500 hover:bg-green-400 font-semibold text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                        >
                            Confirm
                        </button>
                        <button
                            type="submit"
                            onClick={handleCloseStockOutModal}
                            className="bg-red-500 hover:bg-red-400 font-semibold text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">Add Attribute To Product</h1>
                    <div className="flex">
                        <Link
                            to="/admin/all-products"
                            className="button button-success px-2"
                        >
                            Back To Products
                        </Link>
                    </div>
                </div>

                <div className="w-full flex wrap -mx-1">
                    {variations.length > 0 ? (
                        <>
                            <div className="w-1/2 mx-1">
                                <div className="w-full mt-4">
                                    <div className="card">
                                        <div className="card-header">
                                            <div>
                                                <h4 className="pageHeading">
                                                    Variations
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="card-body py-4 w-full">
                                            {variations.map((item, index) => (
                                                <div className="w-full mt-2">
                                                    <label className="w-full">
                                                        {item?.attributes?.map(
                                                            (data) => (
                                                                <span>
                                                                    {
                                                                        data?.value
                                                                    }
                                                                    /
                                                                </span>
                                                            )
                                                        )}
                                                    </label>
                                                    <div className="w-full mt-2">
                                                        <input
                                                            type="number"
                                                            className="w-1/2"
                                                            placeholder="set quantity"
                                                            value={item.stock}
                                                            onChange={(e) =>
                                                                changingUpdateStock(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            required
                                                            disabled
                                                        />
                                                        <button
                                                            className="bg-blue-500 text-white py-2.5 px-4 ml-2 edit"
                                                            onClick={(e) =>
                                                                allowEdit(e)
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="bg-blue-500 text-white py-2.5 px-4 ml-2 hidden"
                                                            onClick={(e) =>
                                                                updateStock(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            className="bg-red-500 text-white py-2.5 px-4 ml-2"
                                                            onClick={(e) =>
                                                                handleStockOutModal(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            Stock Out
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full mt-4 mb-4">
                                    <div className="h-screen mx-1">
                                        <div className="card">
                                            <div className="border-b">
                                                <div className="card-header">
                                                    <div>
                                                        <h4 className="pageHeading">
                                                            Add Option
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="card-body overflow-auto"
                                                style={{ minHeight: "350px" }}
                                            >
                                                {items.map((number, index) => (
                                                    <>
                                                        <div className="w-full flex my-2">
                                                            <div className="w-1/3">
                                                                <div className="w-full">
                                                                    <label>
                                                                        Select
                                                                        Option
                                                                    </label>
                                                                </div>
                                                                <div className="w-full mt-2">
                                                                    <Select
                                                                        className="top-auto bottom-full"
                                                                        onChange={(
                                                                            option
                                                                        ) => [
                                                                            handleOptionSelect(
                                                                                option,
                                                                                index
                                                                            ),
                                                                        ]}
                                                                        maxMenuHeight={
                                                                            250
                                                                        }
                                                                        options={
                                                                            options
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="w-2/3 mx-2">
                                                                <div className="w-full">
                                                                    <label>
                                                                        Select
                                                                        Attribute
                                                                    </label>
                                                                </div>
                                                                <div className="w-full mt-2">
                                                                    <Select
                                                                        className="top-auto bottom-full"
                                                                        onChange={(
                                                                            option
                                                                        ) => [
                                                                            handleAttributeChange(
                                                                                {
                                                                                    itemIndex:
                                                                                        index,
                                                                                    options:
                                                                                        option,
                                                                                }
                                                                            ),
                                                                        ]}
                                                                        maxMenuHeight={
                                                                            250
                                                                        }
                                                                        options={
                                                                            attributes[
                                                                                index
                                                                            ]
                                                                        }
                                                                        isMulti={
                                                                            true
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ))}

                                                <div className="w-full flex my-2">
                                                    {items.length <
                                                    options.length ? (
                                                        <button
                                                            className="bg-blue-600 text-white px-2 rounded mt-2"
                                                            onClick={
                                                                handleAddMoreItem
                                                            }
                                                        >
                                                            Add More
                                                        </button>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 mx-1">
                                <div className="w-full mt-4">
                                    <div className="card">
                                        <div className="card-header">
                                            <div>
                                                <h4 className="pageHeading">
                                                    Gallery Image
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="card-body py-4 w-full">
                                            {galleryItems.map((item, index) => (
                                                <div
                                                    className="w-full mb-2"
                                                    key={index}
                                                >
                                                    <div className="font-bold mb-4 mt-6">
                                                        {item.value}
                                                    </div>
                                                    <div className="w-full flex flex-wrap">
                                                        {item?.thumbnails?.map(
                                                            (thumbnail) => (
                                                                <div className="w-18 h-18 border mr-4">
                                                                    <button
                                                                        className="text-red-600 cursor-pointer absolute w-6 h-6 bg-white border flex justify-center items-center rounded-full -mt-2 -ml-2"
                                                                        onClick={() =>
                                                                            removeGalleryImage(
                                                                                thumbnail.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <i class="fa fa-times"></i>
                                                                    </button>
                                                                    <img
                                                                        className="h-full w-auto"
                                                                        src={
                                                                            thumbnail.thumbnail
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                        <div className="w-18 h-18 border flex justify-center items-center">
                                                            <label
                                                                htmlFor={`selectImage${index}`}
                                                                className="text-3xl cursor-pointer"
                                                            >
                                                                +
                                                            </label>
                                                            <input
                                                                type="file"
                                                                id={`selectImage${index}`}
                                                                onChange={(e) =>
                                                                    uploadValueImage(
                                                                        e,
                                                                        item.value
                                                                    )
                                                                }
                                                                accept="image/*"
                                                                className="hidden"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {productLogActivity && (
                                    <ProductLogActivity
                                        logActivity={productLogActivity}
                                        setProductLogActivity={
                                            setProductLogActivity
                                        }
                                        token={token}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-1/2 h-screen mx-1">
                                <div className="card">
                                    <div className="border-b">
                                        <div className="card-header">
                                            <div>
                                                <h4 className="pageHeading">
                                                    Add Option
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="card-body overflow-auto"
                                        style={{ minHeight: "350px" }}
                                    >
                                        {items.map((number, index) => (
                                            <>
                                                <div className="w-full flex my-2">
                                                    <div className="w-1/3">
                                                        <div className="w-full">
                                                            <label>
                                                                Select Option
                                                            </label>
                                                        </div>
                                                        <div className="w-full mt-2">
                                                            <Select
                                                                className="top-auto bottom-full"
                                                                onChange={(
                                                                    option
                                                                ) => [
                                                                    handleOptionSelect(
                                                                        option,
                                                                        index
                                                                    ),
                                                                ]}
                                                                maxMenuHeight={
                                                                    250
                                                                }
                                                                options={
                                                                    options
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="w-2/3 mx-2">
                                                        <div className="w-full">
                                                            <label>
                                                                Select Attribute
                                                            </label>
                                                        </div>
                                                        <div className="w-full mt-2">
                                                            <Select
                                                                className="top-auto bottom-full"
                                                                onChange={(
                                                                    option
                                                                ) => [
                                                                    handleAttributeChange(
                                                                        {
                                                                            itemIndex:
                                                                                index,
                                                                            options:
                                                                                option,
                                                                        }
                                                                    ),
                                                                ]}
                                                                maxMenuHeight={
                                                                    250
                                                                }
                                                                options={
                                                                    attributes[
                                                                        index
                                                                    ]
                                                                }
                                                                isMulti={true}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ))}

                                        <div className="w-full flex my-2">
                                            {items.length < options.length ? (
                                                <button
                                                    className="bg-blue-600 text-white px-2 rounded mt-2"
                                                    onClick={handleAddMoreItem}
                                                >
                                                    Add More
                                                </button>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 mx-1">
                                <div className="w-full mt-4">
                                    <div className="card">
                                        <div className="card-header">
                                            <div>
                                                <h4 className="pageHeading">
                                                    Variations
                                                </h4>
                                            </div>
                                        </div>
                                        <form
                                            onSubmit={(e) =>
                                                handleVariationSubmit(e)
                                            }
                                        >
                                            <div className="card-body py-4 w-full">
                                                {crossData.map(
                                                    (item, index) => (
                                                        <div className="w-full mt-2">
                                                            <label className="w-full">
                                                                {item.map(
                                                                    (data) => (
                                                                        <span>
                                                                            {
                                                                                data
                                                                            }
                                                                            /
                                                                        </span>
                                                                    )
                                                                )}
                                                            </label>
                                                            <div className="w-full mt-2">
                                                                <input
                                                                    type="number"
                                                                    className="w-1/2"
                                                                    placeholder="set stock"
                                                                    value={
                                                                        item.stock
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        changingStock(
                                                                            e,
                                                                            index
                                                                        )
                                                                    }
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            {crossData.length && (
                                                <div className="w-full flex justify-end">
                                                    <button className="bg-blue-600 text-white py-2 px-4 rounded">
                                                        Submit
                                                    </button>
                                                </div>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
