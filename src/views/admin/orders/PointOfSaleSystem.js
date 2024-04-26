import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BiPlus, BiMinus } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import Select from "react-select";
import { CgProfile } from "react-icons/cg";
import { RiAddBoxFill } from "react-icons/ri";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";

const shippingOptions = [
    { value: "home", label: "Home" },
    { value: "office", label: "Office" },
    { value: "gift", label: "Gift" },
];

const orderViaOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "mobile", label: "Mobile Call" },
    { value: "website", label: "Website" },
];

const PointOfSaleSystem = () => {
    const { token, user } = useSelector((state) => state.auth);

    const [openAddAreaModal, setOpenAddAreaModal] = useState(false);
    const [newArea, setNewArea] = useState("");

    const [customerSearch, setCustomerSearch] = useState("");
    const [customerSearchResult, setCustomerSearchResult] = useState([]);

    const [searchValue, setSearchValue] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const [specficProduct, setSpecficProduct] = useState(null);
    const [specficProductVariation, setSpecficProductVariation] =
        useState(null);

    const [walletBallance, setWalletBallance] = useState(null);
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [customerNote, setCustomerNote] = useState("");
    const [shippingType, setShippingType] = useState(null);
    const [orderVia, setOrderVia] = useState(null);

    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);

    const [districtOptionsAxios, setDistrictOptionsAxios] = useState([]);
    const [districtOptionsCustom, setDistrictOptionsCustom] = useState([]);

    const [citiesOptionsAxios, setCitiesOptionsAxios] = useState([]);
    const [citiesOptionsCustom, setCitiesOptionsCustom] = useState([]);

    const [areaOptionsAxios, setAreaOptionsAxios] = useState([]);
    const [areaOptionCustom, setAreaOptionCustom] = useState([]);

    const [companyName, setCompanyName] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");

    const [senderName, setSenderName] = useState("");
    const [senderMobileNumber, setSenderMobileNumber] = useState("");

    const [shippingCharge, setShippingCharge] = useState(0);
    const [shippingArea, setShippingArea] = useState(null);
    const [discount, setDiscount] = useState("0");
    const [discountError, setDiscountError] = useState(null);

    const [cartArray, setCartArray] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [orderTotal, setOrderTotal] = useState(0);

    const [errorStatus, setErrorStatus] = useState(null);

    const [loading, setLoading] = useState(false);
    const [whenSomeProductIsOutOfStock, setWhenSomeProductIsOutOfStock] =
        useState(false);

    const handleWhenSomeProductIsOutOfStock = () => {
        setWhenSomeProductIsOutOfStock(false);
    };

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "order_pos_system", "create") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    useEffect(() => {
        if (token != "" && customerSearch && customerSearch.length > 2) {
            axios
                .get(`/customers/search?q=${customerSearch}`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    setCustomerSearchResult(response?.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    }, [customerSearch, token]);

    useEffect(() => {
        if (token != "" && searchValue) {
            axios
                .get(`/order-create/products?search=${searchValue}`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    setSearchResult(response?.data?.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    }, [searchValue, token]);

    const handleSelectingProduct = (product) => {
        setSearchValue("");
        setSpecficProduct(product);
        if (product["is_variable"]) {
            axios
                .get(`/order-create/group/${product["id"]}`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    setSpecficProductVariation(response.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    };

    const addingProductToCart = (item) => {
        let tempCartArray = [...cartArray];

        let data;

        if (specficProduct.is_variable) {
            data = {
                id: specficProduct.id,
                quantity: 1,
                unit_price: specficProduct.selling_price,
                line_total: specficProduct.selling_price,
                group_id: item.id,
                attributes: item.attributes,
                image: item.thumbnail,
                name: specficProduct.name,
                stock: item.stock,
                productOutOfStock: false,
            };
        } else {
            data = {
                id: specficProduct.id,
                quantity: 1,
                unit_price: specficProduct.selling_price,
                line_total: specficProduct.selling_price,
                attributes: null,
                image: specficProduct.thumbnail,
                name: specficProduct.name,
                stock: item.stock,
                productOutOfStock: false,
            };
        }

        let alreadyInCart = tempCartArray.findIndex(
            (item) => item.id == data.id
        );

        if (alreadyInCart == -1) {
            tempCartArray = [...tempCartArray, data];
        } else {
            if (data.attributes == null) {
                if (tempCartArray[alreadyInCart].quantity < item.stock) {
                    tempCartArray[alreadyInCart].quantity += 1;
                    tempCartArray[alreadyInCart].line_total =
                        tempCartArray[alreadyInCart].quantity *
                        tempCartArray[alreadyInCart].unit_price;
                } else {
                    toast.error(<b>No more Stock Available</b>, {
                        autoClose: 1500,
                    });
                }
            } else {
                let sameVarient = tempCartArray.findIndex(
                    (item) => item.group_id == data.group_id
                );
                if (sameVarient == -1) {
                    tempCartArray = [...tempCartArray, data];
                } else {
                    if (tempCartArray[sameVarient].quantity < item.stock) {
                        tempCartArray[sameVarient].quantity += 1;
                        tempCartArray[sameVarient].line_total =
                            tempCartArray[sameVarient].quantity *
                            tempCartArray[sameVarient].unit_price;
                    } else {
                        toast.error(<b>No more Stock Available</b>, {
                            autoClose: 1500,
                        });
                    }
                }
            }
        }

        setCartArray(tempCartArray);
    };

    const removingProductFromCart = (value) => {
        let tempCartArray = [...cartArray];

        if (value.attributes == null) {
            tempCartArray = tempCartArray.filter((item) => item.id != value.id);
        } else {
            tempCartArray = tempCartArray.filter(
                (item) => item.group_id != value.group_id
            );
        }

        setCartArray(tempCartArray);
    };

    const increasingProductQuantity = (value) => {
        let tempCartArray = [...cartArray];

        let specificProduct = tempCartArray.findIndex(
            (item) => item.id == value.id
        );

        if (value.attributes == null) {
            if (value.quantity < value.stock) {
                tempCartArray[specificProduct].quantity += 1;
                tempCartArray[specificProduct].line_total =
                    tempCartArray[specificProduct].quantity *
                    tempCartArray[specificProduct].unit_price;
            } else {
                toast.error(<b>No more Stock Available</b>, {
                    autoClose: 1500,
                });
            }
        } else {
            let sameVarient = tempCartArray.findIndex(
                (item) => item.group_id == value.group_id
            );
            if (value.quantity < value.stock) {
                tempCartArray[sameVarient].quantity += 1;
                tempCartArray[sameVarient].line_total =
                    tempCartArray[sameVarient].quantity *
                    tempCartArray[sameVarient].unit_price;
            } else {
                toast.error(<b>No more Stock Available</b>, {
                    autoClose: 1500,
                });
            }
        }

        setCartArray(tempCartArray);
    };

    const decreasingProductQuantity = (value) => {
        if (value.quantity > 1) {
            let tempCartArray = [...cartArray];
            let specificProduct = tempCartArray.findIndex(
                (item) => item.id == value.id
            );

            if (value.attributes == null) {
                tempCartArray[specificProduct].quantity -= 1;
                tempCartArray[specificProduct].line_total =
                    tempCartArray[specificProduct].quantity *
                    tempCartArray[specificProduct].unit_price;
            } else {
                let sameVarient = tempCartArray.findIndex(
                    (item) => item.group_id == value.group_id
                );
                tempCartArray[sameVarient].quantity -= 1;
                tempCartArray[sameVarient].line_total =
                    tempCartArray[sameVarient].quantity *
                    tempCartArray[sameVarient].unit_price;
            }

            setCartArray(tempCartArray);
        } else {
            toast.error(<b>Product cannot be less than 1</b>, {
                autoClose: 1500,
            });
        }
    };

    useEffect(() => {
        let tempCartTotal = 0;
        cartArray.map((item) => {
            tempCartTotal += item.line_total;
        });

        setCartTotal(tempCartTotal);
    }, [cartArray]);

    // getting and making the options list for district
    useEffect(() => {
        if (token != "") {
            axios
                .get("/address/regions", {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    setDistrictOptionsAxios(response.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    }, [token]);

    useEffect(() => {
        setDistrictOptionsCustom([]);
        if (districtOptionsAxios.length > 0) {
            districtOptionsAxios.map((item, index) => {
                setDistrictOptionsCustom((prevState) => [
                    ...prevState,
                    { value: item.id, label: item.name },
                ]);
            });
        }
    }, [districtOptionsAxios]);

    //getting and making the options list for cities
    useEffect(() => {
        if (token != "" && selectedDistrict?.value) {
            axios
                .get(`/address/${selectedDistrict?.value}/cities`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    setCitiesOptionsAxios(response.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    }, [selectedDistrict, token]);

    useEffect(() => {
        setCitiesOptionsCustom([]);
        if (citiesOptionsAxios.length > 0) {
            citiesOptionsAxios.map((item, index) => {
                setCitiesOptionsCustom((prevState) => [
                    ...prevState,
                    { value: item.id, label: item.name },
                ]);
            });
        }
    }, [citiesOptionsAxios]);

    //getting and making options list for areas
    useEffect(() => {
        if (token != "" && selectedCity?.value) {
            axios
                .get(`/address/${selectedCity?.value}/areas`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    setAreaOptionsAxios(response.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    }, [selectedCity, token]);

    useEffect(() => {
        setAreaOptionCustom([]);

        if (areaOptionsAxios.length > 0) {
            areaOptionsAxios.map((item, index) => {
                setAreaOptionCustom((prevState) => [
                    ...prevState,
                    { value: item.id, label: item.name },
                ]);
            });
        }
    }, [areaOptionsAxios]);

    useEffect(() => {
        if (token != "" && selectedCity != null) {
            axios
                .get(`/order-create/charges/${selectedCity?.value}`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    setShippingCharge(response.data[0]?.charge);
                    setShippingArea(response.data[0]?.id);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        } else {
            setShippingCharge(0);
            setShippingArea(null);
        }
    }, [selectedCity, token]);

    useEffect(() => {
        if (parseInt(discount) != NaN) {
            if (
                cartTotal + shippingCharge > parseInt(discount) &&
                parseInt(discount) > 0
            ) {
                setOrderTotal(cartTotal + shippingCharge - parseInt(discount));
                setDiscountError(null);
            } else {
                setOrderTotal(cartTotal + shippingCharge);
                setDiscountError("Discount Amount is Invalid");
            }
        } else {
            setOrderTotal(cartTotal + shippingCharge);
            setDiscountError("Discount Amount is Invalid");
        }
    }, [discount, shippingCharge, cartTotal]);

    useEffect(() => {}, [senderMobileNumber]);

    const handlePlacingOrder = () => {
        setLoading(true);
        let tempDiscount;
        if (discount == "") {
            tempDiscount = 0;
        } else {
            if (cartTotal + shippingCharge > parseInt(discount)) {
                tempDiscount = parseInt(discount);
            } else {
                tempDiscount = 0;
            }
        }

        const data = {
            shipping_type:
                shippingType?.value == undefined ? "" : shippingType?.value,
            sub_total: cartTotal,
            shipping_total: shippingCharge,
            discount_total: tempDiscount,
            total: orderTotal,
            order_via: orderVia?.value == undefined ? "" : orderVia?.value,
            name: name,
            phone: mobile.length == 11 ? mobile : "",
            region:
                selectedDistrict?.label == undefined
                    ? ""
                    : selectedDistrict?.label,
            city: selectedCity?.label == undefined ? "" : selectedCity?.label,
            area: selectedArea?.label == undefined ? "" : selectedArea?.label,
            address: address,
            items: cartArray,
            customer_note: customerNote,
            company_name: companyName,
            department: department,
            designation: designation,
            sender_name: senderName,
            sender_number:
                senderMobileNumber.length == 11 ? senderMobileNumber : "",
            shipping_class_id: shippingArea,
        };

        axios
            .post("/order-create", data, {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                setLoading(false);
                setShippingType(null);
                setCartTotal(0);
                setShippingCharge(0);
                setDiscount("");
                setOrderTotal(0);
                setOrderVia(null);
                setName("");
                setWalletBallance(null);
                setMobile("");
                setSelectedDistrict(null);
                setSelectedArea(null);
                setSelectedCity(null);
                setAddress("");
                setCustomerNote("");
                setCartArray([]);
                setCompanyName("");
                setDepartment("");
                setDesignation("");
                setSenderMobileNumber("");
                setSenderName("");
                setErrorStatus(null);
                setSpecficProduct(null);
                setSpecficProductVariation(null);
                setDiscountError(null);
            })
            .catch((errors) => {
                setErrorStatus(errors.response?.data?.errors);

                if (errors.response?.data?.data) {
                    let indexOfOutOfStockProduct = Object.keys(
                        errors.response?.data?.data
                    );
                    let demoCartArray = [...cartArray];
                    indexOfOutOfStockProduct.map((value) => {
                        demoCartArray[value].productOutOfStock = true;
                    });
                    setCartArray(demoCartArray);
                    setWhenSomeProductIsOutOfStock(true);
                }
                setLoading(false);
            });
    };

    const handleSelectingCustomer = (customer) => {
        setCustomerSearch("");
        setName(customer["name"]);
        setMobile(customer["phone"]);
        setWalletBallance(customer["amount"]);
    };

    useEffect(() => {}, [selectedCity]);

    const handleCloseModal = () => {
        setOpenAddAreaModal(false);
        setNewArea("");
        setAddAreaError(null);
    };

    const [addAreaError, setAddAreaError] = useState(null);

    const handleAddingArea = () => {
        setLoading(true);
        axios
            .post(
                "/areas",
                {
                    city_id: selectedCity?.value,
                    name: newArea,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                setOpenAddAreaModal(false);
                setNewArea("");
                setLoading(false);
                setAddAreaError(null);
                axios
                    .get(`/address/${selectedCity?.value}/areas`, {
                        headers: {
                            Authorization: token,
                            Accept: "application/json",
                        },
                    })
                    .then((response) => {
                        setAreaOptionsAxios(response.data);
                    })
                    .catch((errors) => {
                        console.log(errors.response);
                    });
            })
            .catch((errors) => {
                console.log(errors.response);
                setAddAreaError(errors.response?.data?.error);
                setLoading(false);
            });
    };

    return (
        <div className="px-8 mt-8 mb-8">
            <Modal
                open={openAddAreaModal}
                onClose={handleCloseModal}
                center
                blockScroll
            >
                <div className="py-6 px-4">
                    <div className="grid grid-cols-12 mb-6">
                        <div className="col-span-4 flex items-center">
                            <label
                                htmlFor="newArea"
                                className="createFromInputLabel"
                            >
                                New Area
                            </label>
                        </div>
                        <div className="col-span-8">
                            <input
                                type="text"
                                id="newArea"
                                className="createFromInputField"
                                placeholder="New Area"
                                value={newArea}
                                onChange={(e) => setNewArea(e.target.value)}
                            />
                            {addAreaError && (
                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                    {addAreaError.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <>
                            <button
                                className="text-sm rounded-md shadow-lg font-Poppins flex justify-center items-center bg-buttonColor border-2 border-buttonColor text-white  hover:bg-buttonHoverColor hover:border-buttonHoverColor focus:outline-none h-10 cursor-pointer w-full mt-8"
                                disabled
                            >
                                {" "}
                                <span className="fas fa-sync-alt animate-spin"></span>
                            </button>
                        </>
                    ) : (
                        <div
                            className="text-sm rounded-md shadow-lg font-Poppins flex justify-center items-center bg-buttonColor border-2 border-buttonColor text-white  hover:bg-buttonHoverColor hover:border-buttonHoverColor focus:outline-none h-10 cursor-pointer mt-8"
                            onClick={handleAddingArea}
                        >
                            <p>Submit</p>
                        </div>
                    )}
                </div>
            </Modal>
            <Modal
                open={whenSomeProductIsOutOfStock}
                onClose={handleWhenSomeProductIsOutOfStock}
                blockScroll={false}
                center={true}
            >
                <div className="flex flex-col px-20">
                    <p className="font-Poppins font-medium text-2xl">
                        Some Products Have gone out of Stock!!!
                    </p>
                </div>
            </Modal>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                    <div className="grid grid-cols-2 mb-8">
                        <div className="flex flex-col relative">
                            <input
                                type="text"
                                placeholder="Search Customer...."
                                className="h-12 w-full px-7 border-2 focus:outline-none rounded"
                                value={customerSearch}
                                onChange={(e) =>
                                    setCustomerSearch(e.target.value)
                                }
                            />
                            <div
                                className={`w-full px-4 bg-white h-80 overflow-y-auto shadow-lg absolute top-12 ${
                                    customerSearch.length > 2
                                        ? "visible"
                                        : "hidden"
                                }`}
                            >
                                {customerSearchResult.map((customer, index) => (
                                    <div
                                        key={index}
                                        className="flex h-12 mt-6 mb-6 cursor-pointer"
                                        onClick={() =>
                                            handleSelectingCustomer(customer)
                                        }
                                    >
                                        <div className="flex items-center">
                                            <CgProfile size={30} />
                                        </div>
                                        <div className="ml-4">
                                            <p>{customer.name}</p>
                                            <p>Mobile: {customer.phone}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div></div>
                    </div>
                    <p className="font-bold mb-6">Customer Details</p>

                    <div className="grid grid-cols-2 gap-4 mb-16">
                        <div>
                            {walletBallance != null && (
                                <div className="grid grid-cols-12 mb-3">
                                    <div className="col-span-4 flex items-center">
                                        <labe className="createFromInputLabel">
                                            Customer Balance
                                        </labe>
                                    </div>
                                    <div className="col-span-8">
                                        <labe className="font-bold">
                                            {walletBallance} Tk
                                        </labe>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-12">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="name"
                                        className="createFromInputLabel"
                                    >
                                        Customer Name
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="name"
                                        className="createFromInputField"
                                        placeholder="Customer Name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="mobile"
                                        className="createFromInputLabel"
                                    >
                                        Mobile Number
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="number"
                                        id="mobile"
                                        className="createFromInputField"
                                        placeholder="Mobile Number"
                                        value={mobile}
                                        onChange={(e) =>
                                            setMobile(e.target.value)
                                        }
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        className="font-DMSans text-sm1"
                                        htmlFor="customerNote"
                                    >
                                        Special note
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <textarea
                                        id="customerNote"
                                        className="border-1 block w-full focus:outline-none px-4 py-4 mt-2 rounded font-DMSans text-sm1"
                                        rows="5"
                                        value={customerNote}
                                        onChange={(e) =>
                                            setCustomerNote(e.target.value)
                                        }
                                    ></textarea>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <p>Shipping Type:</p>
                                </div>
                                <div className="col-span-8">
                                    <Select
                                        value={shippingType}
                                        onChange={(option) => {
                                            setShippingType(option);
                                        }}
                                        options={shippingOptions}
                                        className="w-full selectTag font-Poppins font-normal text-sm1 mt-2 mb-1"
                                        placeholder="Select Shipping Type"
                                        isClearable={true}
                                        isSearchable={true}
                                        id="shipping-type"
                                        maxMenuHeight={155}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus?.shipping_type}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {shippingType?.value == "office" && (
                                <div>
                                    <div className="grid grid-cols-12 mt-4">
                                        <div className="col-span-4 flex items-center">
                                            <p>Company Name:</p>
                                        </div>
                                        <div className="col-span-8">
                                            <input
                                                type="text"
                                                className="createFromInputField"
                                                value={companyName}
                                                onChange={(e) =>
                                                    setCompanyName(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {errorStatus && (
                                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                                    {errorStatus?.company_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 mt-4">
                                        <div className="col-span-4 flex items-center">
                                            <p>Department:</p>
                                        </div>
                                        <div className="col-span-8">
                                            <input
                                                type="text"
                                                className="createFromInputField"
                                                value={department}
                                                onChange={(e) =>
                                                    setDepartment(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {errorStatus && (
                                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                                    {errorStatus?.department}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 mt-4">
                                        <div className="col-span-4 flex items-center">
                                            <p>Designation:</p>
                                        </div>
                                        <div className="col-span-8">
                                            <input
                                                type="text"
                                                className="createFromInputField"
                                                value={designation}
                                                onChange={(e) =>
                                                    setDesignation(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {errorStatus && (
                                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                                    {errorStatus?.designation}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {shippingType?.value == "gift" && (
                                <div>
                                    <div className="grid grid-cols-12 mt-4">
                                        <div className="col-span-4 flex items-center">
                                            <p>Sender Name:</p>
                                        </div>
                                        <div className="col-span-8">
                                            <input
                                                type="text"
                                                className="createFromInputField"
                                                value={senderName}
                                                onChange={(e) =>
                                                    setSenderName(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {errorStatus && (
                                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                                    {errorStatus?.sender_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 mt-4">
                                        <div className="col-span-4 flex items-center">
                                            <p>Sender Mobile Number:</p>
                                        </div>
                                        <div className="col-span-8">
                                            <input
                                                type="number"
                                                className="createFromInputField"
                                                value={senderMobileNumber}
                                                onChange={(e) =>
                                                    setSenderMobileNumber(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {errorStatus && (
                                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                                    {errorStatus?.sender_number}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="grid grid-cols-12">
                                <div className="col-span-3 flex items-center">
                                    <p>Region:</p>
                                </div>
                                <div className="col-span-9">
                                    <Select
                                        value={selectedDistrict}
                                        onChange={(option) => {
                                            setSelectedDistrict(option);
                                            setSelectedCity(null);
                                            setSelectedArea(null);
                                        }}
                                        options={districtOptionsCustom}
                                        className="w-full selectTag font-Poppins font-normal text-sm1 mt-2 mb-1"
                                        placeholder="Select Division"
                                        isClearable={true}
                                        isSearchable={true}
                                        id="district"
                                        maxMenuHeight={155}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus?.region}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-3 flex items-center">
                                    <p>City:</p>
                                </div>
                                <div className="col-span-9">
                                    <Select
                                        value={selectedCity}
                                        onChange={(option) => {
                                            setSelectedCity(option);
                                            setSelectedArea(null);
                                        }}
                                        options={citiesOptionsCustom}
                                        className="w-full selectTag font-Poppins font-normal text-sm1 mt-2 mb-1"
                                        placeholder="Select City"
                                        isClearable={true}
                                        isSearchable={true}
                                        id="city"
                                        maxMenuHeight={155}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus?.city}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-3 flex items-center">
                                    <p>Area:</p>
                                </div>
                                <div className="col-span-9">
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-10">
                                            <Select
                                                value={selectedArea}
                                                onChange={(option) => {
                                                    setSelectedArea(option);
                                                }}
                                                options={areaOptionCustom}
                                                className="w-full selectTag font-Poppins font-normal text-sm1 mt-2 mb-1"
                                                placeholder="Select Area"
                                                isClearable={true}
                                                isSearchable={true}
                                                id="area"
                                                maxMenuHeight={155}
                                            />
                                            {errorStatus && (
                                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                                    {errorStatus?.area}
                                                </p>
                                            )}
                                        </div>

                                        <div className="col-span-2">
                                            {selectedCity && (
                                                <div className="h-full flex items-center justify-center">
                                                    <RiAddBoxFill
                                                        size={45}
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            setOpenAddAreaModal(
                                                                true
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-3 flex items-center">
                                    <label
                                        htmlFor="address"
                                        className="createFromInputLabel"
                                    >
                                        Address
                                    </label>
                                </div>
                                <div className="col-span-9">
                                    <input
                                        type="text"
                                        id="address"
                                        className="createFromInputField"
                                        placeholder="Address"
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.address}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-3 flex items-center">
                                    <p>Order Via:</p>
                                </div>
                                <div className="col-span-9">
                                    <Select
                                        value={orderVia}
                                        onChange={(option) => {
                                            setOrderVia(option);
                                        }}
                                        options={orderViaOptions}
                                        className="w-full selectTag font-Poppins font-normal text-sm1 mt-2 mb-1"
                                        placeholder="Select Order Via Type"
                                        isClearable={true}
                                        isSearchable={true}
                                        id="Order-Via"
                                        maxMenuHeight={155}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus?.order_via}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="font-bold mb-10">Customer Cart</p>

                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader">Image</th>
                                <th className="tableHeader">Name</th>
                                <th className="tableHeader">Variation</th>
                                <th className="tableHeader">Quantity</th>
                                <th className="tableHeader">Price</th>
                                <th className="tableHeader">Total</th>
                                <th className="tableHeader">
                                    Quantity Inc/Dec
                                </th>
                                <th className="tableHeader">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cartArray.map((item, index) => (
                                <tr key={index} className="border-b py-4 h-20">
                                    <td>
                                        <img
                                            src={item.image}
                                            className="h-full w-20"
                                        />
                                    </td>

                                    <td>
                                        <p>{item.name}</p>
                                    </td>

                                    <td>
                                        {item?.attributes?.map(
                                            (value, index) => (
                                                <span>{value.value}/</span>
                                            )
                                        )}
                                    </td>

                                    <td>
                                        <p>{item.quantity}</p>
                                    </td>

                                    <td>
                                        <p>{item.unit_price}</p>
                                    </td>

                                    <td>
                                        <p>{item.line_total}</p>
                                    </td>

                                    <td>
                                        {item.productOutOfStock ? (
                                            <p>Out of Stock</p>
                                        ) : (
                                            <div className="w-1/2 h-10 border-1 flex justify-between items-center">
                                                <div
                                                    className="w-2/4  flex justify-center items-center cursor-pointer border-r-1"
                                                    onClick={() =>
                                                        decreasingProductQuantity(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <BiMinus />
                                                </div>
                                                <div className="w-2/4  flex justify-center items-center">
                                                    <p className="font-DMSans font-normal text-xs">
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                                <div
                                                    className="w-2/4  flex justify-center items-center cursor-pointer border-l-1"
                                                    onClick={() =>
                                                        increasingProductQuantity(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <BiPlus />
                                                </div>
                                            </div>
                                        )}
                                    </td>

                                    <td>
                                        <BsTrash
                                            size={30}
                                            color="red"
                                            onClick={() =>
                                                removingProductFromCart(item)
                                            }
                                            className="cursor-pointer"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {cartArray.length > 0 && (
                        <div className="mt-20">
                            <p className="font-bold mb-6">Billing Details</p>
                            <div className="grid grid-cols-2">
                                <div>
                                    <div className="grid grid-cols-12 mt-4">
                                        <div className="col-span-4 flex items-center">
                                            <p>Product Total</p>
                                        </div>
                                        <div className="col-span-8">
                                            <p>{cartTotal}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 mt-4">
                                        <div className="col-span-4 flex items-center">
                                            <p>Shipping Charge</p>
                                        </div>
                                        <div className="col-span-8">
                                            <p>{shippingCharge}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 mt-4">
                                        <div className="col-span-4 flex items-center">
                                            <p>Discount</p>
                                        </div>
                                        <div className="col-span-8">
                                            {discountError ? (
                                                <p>No Discount Applied</p>
                                            ) : (
                                                <p>{discount}</p>
                                            )}
                                        </div>
                                    </div>

                                    <hr className="mt-2 mb-2" />

                                    <div className="grid grid-cols-12 mt-4">
                                        <div className="col-span-4 flex items-center">
                                            <p>Order Total</p>
                                        </div>
                                        <div className="col-span-8">
                                            <p>{orderTotal}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-4 flex items-center">
                                            <label
                                                htmlFor="discount"
                                                className="createFromInputLabel"
                                            >
                                                Discount
                                            </label>
                                        </div>
                                        <div className="col-span-8">
                                            <input
                                                type="number"
                                                id="discount"
                                                className="createFromInputField"
                                                placeholder="Discount Value"
                                                value={discount}
                                                onChange={(e) =>
                                                    setDiscount(e.target.value)
                                                }
                                            />
                                            {discountError && (
                                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                                    {discountError}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                {loading ? (
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
                                            onClick={handlePlacingOrder}
                                            className="button button-primary px-4"
                                        >
                                            Place Order
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-span-4">
                    <p className="font-bold mb-6">Find Products</p>
                    <div className="flex flex-col relative">
                        <input
                            type="text"
                            placeholder="Search Product...."
                            className="h-12 w-full px-7 border-2 focus:outline-none rounded"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <div
                            className={`container mx-auto px-4 bg-white h-80 overflow-y-auto shadow-lg absolute top-12 ${
                                searchValue.length > 2 ? "visible" : "hidden"
                            }`}
                        >
                            {searchResult.map((product, index) => (
                                <div
                                    key={index}
                                    className="flex h-32 mt-6 mb-6 cursor-pointer"
                                    onClick={() =>
                                        handleSelectingProduct(product)
                                    }
                                >
                                    <img
                                        src={product.thumbnail}
                                        className="h-full w-32"
                                        alt="product"
                                    />
                                    <div className="ml-8">
                                        <p>{product.name}</p>
                                        <p>SKU: {product.SKU}</p>
                                        <p>Price: {product.selling_price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="">
                        <p className="font-bold mt-10">Product Details: </p>
                        {specficProduct && (
                            <div className="flex h-32 mt-6 mb-6">
                                <img
                                    src={specficProduct.thumbnail}
                                    className="h-full w-32"
                                />
                                <div className="ml-8">
                                    <p>{specficProduct.name}</p>
                                    <p>SKU: {specficProduct.SKU}</p>
                                    <p>Price: {specficProduct.selling_price}</p>
                                    <p>Stock: {specficProduct.stock}</p>
                                    {specficProduct.is_variable == false && (
                                        <div>
                                            {specficProduct.stock > 0 ? (
                                                <button
                                                    className="button button-primary px-4"
                                                    onClick={() =>
                                                        addingProductToCart(
                                                            specficProduct
                                                        )
                                                    }
                                                >
                                                    Add to Cart
                                                </button>
                                            ) : (
                                                <p>No Stock Available</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {specficProduct?.is_variable == true && (
                            <div>
                                <p className="mb-4 font-bold">
                                    Product Variation:
                                </p>
                                <table className="w-full table-fixed">
                                    <thead>
                                        <tr className="border-b h-12">
                                            <th className="tableHeader">
                                                Variation
                                            </th>
                                            <th className="tableHeader">
                                                Stock
                                            </th>
                                            <th className="tableHeader">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {specficProductVariation &&
                                            specficProductVariation.map(
                                                (item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-b py-4 h-20"
                                                    >
                                                        <td>
                                                            {item?.attributes?.map(
                                                                (
                                                                    value,
                                                                    index
                                                                ) => (
                                                                    <span>
                                                                        {
                                                                            value.value
                                                                        }
                                                                        /
                                                                    </span>
                                                                )
                                                            )}
                                                        </td>

                                                        <td>
                                                            <p className="">
                                                                {item.stock}
                                                            </p>
                                                        </td>

                                                        <td>
                                                            {parseInt(
                                                                item.stock
                                                            ) <= 0 ? (
                                                                <p>
                                                                    No Stock
                                                                    Available
                                                                </p>
                                                            ) : (
                                                                <button
                                                                    className="button button-primary px-4"
                                                                    onClick={() =>
                                                                        addingProductToCart(
                                                                            item
                                                                        )
                                                                    }
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PointOfSaleSystem;
