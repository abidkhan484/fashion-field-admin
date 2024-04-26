import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";
import { permission } from "helper/permission";
import collect from "collect.js";

import Select from "react-select";
import AttributeList from "../Attribute/AttributeList";

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
                // console.log(error.response);
            });
    };

    React.useEffect(() => {
        if (token != "") {
            fetchOptions();
            // getVariation();
        }
    }, [id, token]);

    // React.useEffect(() => {
    //     if(items.length == 0)
    //     {
    //         // setItems()
    //     }
    //     console.log('😒😒😒😒', options);
    // }, [options])

    const handleOptionSelect = (option, itemIndex) => {
        const getAttributes = options.findIndex((item) => item === option);

        // console.log(options[getAttributes]);

        const itemsOf = [];

        options[getAttributes]?.values.map((item) => {
            itemsOf.push({ label: item.value, value: item.value });
            // console.log(item);
        });

        const attributeItem = {
            [itemIndex]: itemsOf,
        };

        // console.log(attributeItem);

        setAttributes(attributeItem);
    };

    const handleAddMoreItem = () => {
        setItems([...items, items.length]);
    };

    const handleAttributeChange = (options) => {
        // console.log(options);
        const crossItem = crossAttributes.filter(
            (item) => item.itemIndex != options.itemIndex
        );

        // console.log(crossAttributes);

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

    React.useEffect(() => {
        console.log("imran", crossData);
    }, [crossData]);

    const handleVariationSubmit = (e) => {
        e.preventDefault();
        // console.log(formValue);

        let formData = new FormData();

        formValue.map((item) => {
            formData.append("image[]", item.image);
            formData.append("stock[]", item.stock);
            formData.append("variable[]", item.variable);
        });

        axios
            .post(`/products/${id}/cross`, formValue, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                // console.log(response);
            })
            .catch((error) => {
                // console.log(error.response);
            });
    };

    const changingStock = (e, index) => {
        const getData = formValue.filter((item) => item.itemIndex != index);
        const getIndex = formValue.findIndex((item) => item.itemIndex == index);

        if (getIndex != -1) {
            const item = formValue[getIndex];
            const newData = {
                itemIndex: index,
                stock: e.target.value,
                variable: crossData[index],
                image: item.image,
            };
            setFormValue([...getData, newData]);
        } else {
            const newData = {
                itemIndex: index,
                stock: e.target.value,
                variable: crossData[index],
                image: "",
            };
            setFormValue([...getData, newData]);
        }
    };

    const handFileUpload = (e, index) => {
        // console.log(e.target.files[0]);
        const getData = formValue.filter((item) => item.itemIndex != index);
        const getIndex = formValue.findIndex((item) => item.itemIndex == index);

        if (getIndex != -1) {
            const item = formValue[getIndex];
            const newData = {
                itemIndex: index,
                stock: item.stock,
                variable: crossData[index],
                image: e.target.files[0],
            };
            setFormValue([...getData, newData]);
        } else {
            const newData = {
                itemIndex: index,
                stock: null,
                variable: crossData[index],
                image: e.target.files[0],
            };
            setFormValue([...getData, newData]);
        }
    };

    return (
        <>
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
                    <div className="w-1/2 h-screen mx-1">
                        <div className="card">
                            <div className="border-b">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">
                                            Add Option
                                        </h4>
                                    </div>
                                    {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                                    {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
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
                                                    <label>Select Option</label>
                                                </div>
                                                <div className="w-full mt-2">
                                                    <Select
                                                        className="top-auto bottom-full"
                                                        onChange={(option) => [
                                                            handleOptionSelect(
                                                                option,
                                                                index
                                                            ),
                                                        ]}
                                                        maxMenuHeight={250}
                                                        options={options}
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
                                                        onChange={(option) => [
                                                            handleAttributeChange(
                                                                {
                                                                    itemIndex:
                                                                        index,
                                                                    options:
                                                                        option,
                                                                }
                                                            ),
                                                        ]}
                                                        maxMenuHeight={250}
                                                        options={
                                                            attributes[index]
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
                                    onSubmit={(e) => handleVariationSubmit(e)}
                                >
                                    <div className="card-body py-4 w-full">
                                        {crossData.map((item, index) => (
                                            <div className="w-full mt-2">
                                                <label className="w-full">
                                                    {item.map((data) => (
                                                        <span>{data}/</span>
                                                    ))}
                                                </label>
                                                <div className="w-full mt-2">
                                                    <input
                                                        type="file"
                                                        className="w-1/2"
                                                        placeholder="select image"
                                                        onChange={(e) =>
                                                            handFileUpload(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                    />
                                                    <input
                                                        type="number"
                                                        className="w-1/2"
                                                        placeholder="set quantity"
                                                        onChange={(e) =>
                                                            changingStock(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {crossData.length > 0 ? (
                                        <>
                                            <div className="w-full flex justify-end">
                                                <button className="bg-blue-600 text-white py-2 px-4 rounded">
                                                    Submit
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
