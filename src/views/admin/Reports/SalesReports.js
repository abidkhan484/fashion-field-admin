import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Select from "react-select";
import { GiCancel } from "react-icons/gi";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";
import { ImSpinner9 } from "react-icons/im"

const SalesReports = () => {
    const { token, user } = useSelector((state) => state.auth);

    const [startingData, setStartingDate] = useState("");
    const [endingData, setEndingDate] = useState("");
    const [productName, setProductName] = useState(null);

    const [searchValue, setSearchValue] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const [categories, setCategories] = useState([]);
    const [categoryOptions, setCategroyOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [subCategory, setSubCategory] = useState([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    const [productCategory, setProductCategory] = useState([]);
    const [productCategoryOptions, setProductCategoryOptions] = useState([]);
    const [selectedProductCategory, setSelectedProductCategory] =
        useState(null);

    const [selectedShopName, setSelectedShopName] = useState(null);
    const [productBrnad, setProductBrand] = useState(null);

    const [brands, setBrands] = useState([]);
    const [shopNames, setShopNames] = useState([]);
    const [shopOptions, setShopOptions] = useState([]);

    const [statusValues, setStatusValues] = useState({});

    const [allPaymentStatus, setAllPaymentStatus] = useState(false);
    const [paid, setPaid] = useState(false);
    const [partialPaid, setPartialPaid] = useState(false);
    const [unpaid, setUnpaid] = useState(false);

    const [loading, setLoading] = useState(false);

    const [errorStatus, setErrorStatus] = useState(null);

    const [salesReportPreview, setSalesReportPreview] = useState([]);
    const [lastSalesReportPreview, setLastSalesReportPreview] = useState(null);
    const [downloadLoading, setDownloadLoading] = useState(false)

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "reports_sales_report", "read") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    useEffect(() => {
        if (salesReportPreview.length) {
            setLastSalesReportPreview(
                salesReportPreview[salesReportPreview.length - 1]
            );

            salesReportPreview.splice(-1);
            setSalesReportPreview(salesReportPreview);
        }
    }, [salesReportPreview]);

    useEffect(() => {
        console.log(selectedShopName);
        console.log(productBrnad);
    }, [selectedShopName, productBrnad]);

    useEffect(() => {
        if (token != "") {
            axios
                .get(`/order-create/products?search=${searchValue}`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    // console.log(response)
                    setSearchResult(response?.data?.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    }, [searchValue, token]);

    const handleSelectingProduct = (id) => {
        setSearchValue("");
        const product = searchResult.filter((item) => item.id == id);
        setProductName(product[0]?.name);
    };

    // GETTING THE CATEGORIES
    useEffect(() => {
        if (token != "") {
            axios
                .get("/categories", {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    // console.log(response.data)
                    setCategories(response.data);
                })
                .catch((errors) => {
                    console.log(errors);
                });
        }
    }, [token]);

    useEffect(() => {
        if (categories.length > 0) {
            setCategroyOptions([]);
            // setCategroyOptions([{ value: "all", label: "All" }])
            categories.map((item, index) => {
                setCategroyOptions((prevState) => [
                    ...prevState,
                    { value: item.id, label: item.name },
                ]);
                // console.log(categoryOptions)
            });
        }
    }, [categories]);

    // GETTING THE SUB-CATEGORIES
    useEffect(() => {
        if (selectedCategory) {
            axios
                .get(`/categories/${selectedCategory.value}`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    console.log(response.data.sub_category);
                    setSubCategory(response.data.sub_category);
                    setSubCategoryOptions([]);
                    setProductCategoryOptions([]);
                })
                .catch((errors) => {
                    console.log(errors);
                });
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (subCategory.length > 0) {
            setSubCategoryOptions([]);
            // setSubCategoryOptions([{ value: "all", label: "All" }])
            subCategory.map((item, index) => {
                setSubCategoryOptions((prevState) => [
                    ...prevState,
                    { value: item.id, label: item.name },
                ]);
            });
        }
    }, [subCategory]);

    // GETTING THE Product-CATEGORIES
    useEffect(() => {
        if (selectedSubCategory) {
            axios
                .get(
                    `/categories/sub-categories/${selectedSubCategory.value}`,
                    {
                        headers: {
                            Authorization: token,
                            Accept: "application/json",
                        },
                    }
                )
                .then((response) => {
                    console.log(response.data);
                    setProductCategory(response.data.product_category);
                    setProductCategoryOptions([]);
                })
                .catch((errors) => {
                    console.log(errors);
                });
        }
    }, [selectedSubCategory]);

    useEffect(() => {
        if (productCategory.length > 0) {
            setProductCategoryOptions([]);
            productCategory.map((item, index) => {
                setProductCategoryOptions((prevState) => [
                    ...prevState,
                    { value: item.id, label: item.name },
                ]);
            });
        }
    }, [productCategory]);

    //get shop and brand names
    useEffect(() => {
        if (token != "") {
            axios
                .get("/stores", {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    setShopNames(response.data);
                })
                .catch((errors) => {
                    console.log(errors);
                });

            axios
                .get("/brands/all", {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    let data = response.data;
                    setBrands([]);
                    setBrands([{ value: "", label: "All" }]);
                    data.map((item, index) => {
                        setBrands((prevState) => [
                            ...prevState,
                            { value: item.id, label: item.name },
                        ]);
                    });
                })
                .catch((errors) => {
                    console.log(errors);
                });
        }
    }, [token]);

    useEffect(() => {
        if (shopNames.length > 1) {
            setShopOptions([]);
            setShopOptions([{ value: "", label: "All" }]);
            shopNames.map((item, index) => {
                setShopOptions((prevState) => [
                    ...prevState,
                    { label: item.name, value: item.id },
                ]);
            });
        }
    }, [shopNames]);

    const handleCheckboxChange = (e) => {
        const tempData = { ...statusValues };
        const value = e.target.name;
        // console.log(tempData[value])
        tempData[value] = !tempData[value];
        setStatusValues(tempData);
    };

    useEffect(() => {
        console.log(statusValues);
    }, [statusValues]);

    const handleSubmit = () => {
        setLoading(true);

        let tempArray = [];
        Object.entries(statusValues).map(([key, value]) => {
            if (value == true) {
                tempArray.push(key);
            }
        });

        axios
            .post(
                "/response/sales",
                {
                    start_at: startingData,
                    end_at: endingData,
                    product_name: productName,
                    category_id: selectedCategory?.value,
                    sub_category_id: selectedSubCategory?.value,
                    product_category_id: selectedProductCategory?.value,
                    store_id: selectedShopName?.value,
                    brand_id: productBrnad?.value,
                    statuses: tempArray,
                    paid: paid,
                    unpaid: unpaid,
                    partial_paid: partialPaid,
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
                setLoading(false);
                setSalesReportPreview(response.data);
                setErrorStatus(null);
            })
            .catch((errors) => {
                console.log(errors.response);
                setErrorStatus(errors.response?.data?.errors);
                setLoading(false);
            });
    };

    const handleSalesDownloadReport = () => {
        setLoading(true);

        let tempArray = [];
        Object.entries(statusValues).map(([key, value]) => {
            if (value == true) {
                tempArray.push(key);
            }
        });

        axios
            .post(
                "/reports/sales",
                {
                    start_at: startingData,
                    end_at: endingData,
                    product_name: productName,
                    category_id: selectedCategory?.value,
                    sub_category_id: selectedSubCategory?.value,
                    product_category_id: selectedProductCategory?.value,
                    store_id: selectedShopName?.value,
                    brand_id: productBrnad?.value,
                    statuses: tempArray,
                    paid: paid,
                    unpaid: unpaid,
                    partial_paid: partialPaid,
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
                setLoading(false);
                window.location.replace(response?.data?.url);
                setStartingDate("");
                setEndingDate("");
                setProductName(null);
                setSelectedCategory(null);
                setSelectedSubCategory(null);
                setSelectedProductCategory(null);
                setSelectedShopName(null);
                setProductBrand(null);
                setStatusValues({});
                setAllPaymentStatus(false);
                setPaid(false);
                setUnpaid(false);
                setPartialPaid(false);
            })
            .catch((errors) => {
                console.log(errors.response);
                setLoading(false);
            });
    };

    return (
        <div>
            <div className="px-8 mt-8 mb-8 overflow-y-auto">
                <div className="page-heading">
                    <h1 className="pageHeading">Sales Report</h1>
                    <div className="flex"></div>
                </div>
            </div>

            <div className="flex -m-1">
                <div className="w-full mx-4">
                    <div className="card">
                        <div className="border-b">
                            <div className="card-header">
                                <div>
                                    <h4 className="pageHeading">
                                        Sales Report
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div
                            className="card-body"
                            style={{ minHeight: "900px" }}
                        >
                            <div className="grid grid-cols-2 gap-10">
                                <div>
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-4 flex items-center">
                                            <label
                                                htmlFor="startDate"
                                                className="createFromInputLabel"
                                            >
                                                Starting Date
                                            </label>
                                        </div>
                                        <div className="col-span-8">
                                            <input
                                                type="date"
                                                id="startDate"
                                                className="createFromInputField"
                                                placeholder="Starting Date"
                                                value={startingData}
                                                onChange={(e) =>
                                                    setStartingDate(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {errorStatus && (
                                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                                    {errorStatus.start_at}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 mt-6">
                                        <div className="col-span-4 flex items-center">
                                            <label
                                                htmlFor="endDate"
                                                className="createFromInputLabel"
                                            >
                                                Ending Date
                                            </label>
                                        </div>
                                        <div className="col-span-8">
                                            <input
                                                type="date"
                                                id="endDate"
                                                className="createFromInputField"
                                                placeholder="Ending Date"
                                                value={endingData}
                                                onChange={(e) =>
                                                    setEndingDate(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {errorStatus && (
                                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                                    {errorStatus.end_at}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col relative mt-6">
                                        <input
                                            type="text"
                                            placeholder="Search Product...."
                                            className="h-12 w-full px-7 border-2 focus:outline-none rounded"
                                            value={searchValue}
                                            onChange={(e) =>
                                                setSearchValue(e.target.value)
                                            }
                                        />
                                        <div
                                            className={`container mx-auto px-4 bg-white h-80 overflow-y-auto shadow-lg absolute top-12 z-10 ${searchValue.length > 2
                                                ? "visible"
                                                : "hidden"
                                                }`}
                                        >
                                            {searchResult.map((item, index) => (
                                                <div
                                                    className="flex h-32 mt-6 mb-6 cursor-pointer"
                                                    onClick={() =>
                                                        handleSelectingProduct(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    <img
                                                        src={item.thumbnail}
                                                        className="h-full w-32"
                                                    />
                                                    <div className="ml-8">
                                                        <p>{item.name}</p>
                                                        <p>SKU: {item.SKU}</p>
                                                        <p>
                                                            Price:{" "}
                                                            {item.selling_price}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 mt-6">
                                        <div className="col-span-4 flex items-center">
                                            <p className="createFromInputLabel">
                                                Product Name
                                            </p>
                                        </div>
                                        <div className="col-span-8">
                                            <div className="flex justify-between">
                                                {productName ? (
                                                    <p className="createFromInputLabel">
                                                        {productName}
                                                    </p>
                                                ) : (
                                                    <p className="createFromInputLabel">
                                                        Search to select product
                                                    </p>
                                                )}
                                                <GiCancel
                                                    size={15}
                                                    onClick={() =>
                                                        setProductName(null)
                                                    }
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {categoryOptions && (
                                        <div className="grid grid-cols-12 mt-6">
                                            <div className="col-span-4 flex items-center">
                                                <p className="createFromInputLabel">
                                                    Category
                                                </p>
                                            </div>
                                            <div className="col-span-8">
                                                <Select
                                                    value={selectedCategory}
                                                    onChange={(option) => {
                                                        setSelectedCategory(
                                                            option
                                                        );
                                                        setSubCategoryOptions(
                                                            []
                                                        );
                                                        setProductCategoryOptions(
                                                            []
                                                        );
                                                        setSelectedSubCategory(
                                                            null
                                                        );
                                                        setSelectedProductCategory(
                                                            null
                                                        );
                                                    }}
                                                    options={categoryOptions}
                                                    className="w-full createFromInputLabel selectTag"
                                                    placeholder="Select Category"
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    id="category"
                                                />
                                                {/* {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus.category_id}</p>} */}
                                            </div>
                                        </div>
                                    )}

                                    {selectedCategory && (
                                        <div className="grid grid-cols-12 mt-6">
                                            <div className="col-span-4 flex items-center">
                                                <p className="createFromInputLabel">
                                                    Sub-Category
                                                </p>
                                            </div>
                                            <div className="col-span-8">
                                                <Select
                                                    value={selectedSubCategory}
                                                    onChange={(option) => {
                                                        setSelectedSubCategory(
                                                            option
                                                        );
                                                        setSelectedProductCategory(
                                                            null
                                                        );
                                                    }}
                                                    options={subCategoryOptions}
                                                    className="w-full createFromInputLabel selectTag"
                                                    placeholder="Select Sub-Category"
                                                    isClearable={true}
                                                    isSearchable={true}
                                                />

                                                {/* <p className="text-red-500 font-Poppins font-medium text-xs">{errors.name}</p> */}
                                            </div>
                                        </div>
                                    )}

                                    {selectedCategory && selectedSubCategory && (
                                        <div className="grid grid-cols-12 mt-6">
                                            <div className="col-span-4 flex items-center">
                                                <p className="createFromInputLabel">
                                                    Product-Category
                                                </p>
                                            </div>
                                            <div className="col-span-8">
                                                <Select
                                                    value={
                                                        selectedProductCategory
                                                    }
                                                    onChange={(option) =>
                                                        setSelectedProductCategory(
                                                            option
                                                        )
                                                    }
                                                    options={
                                                        productCategoryOptions
                                                    }
                                                    className="w-full createFromInputLabel selectTag"
                                                    placeholder="Select Product-Category"
                                                    isClearable={true}
                                                    isSearchable={true}
                                                />
                                                {/* <p className="text-red-500 font-Poppins font-medium text-xs">{errors.name}</p> */}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-12 mt-6">
                                        <div className="col-span-4 flex items-center">
                                            <p className="createFromInputLabel">
                                                Select Store
                                            </p>
                                        </div>
                                        <div className="col-span-8">
                                            <Select
                                                value={selectedShopName}
                                                onChange={(option) => {
                                                    setSelectedShopName(option);
                                                }}
                                                options={shopOptions}
                                                className="w-full createFromInputLabel selectTag"
                                                placeholder="Select Store"
                                                isClearable={true}
                                                isSearchable={true}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 mt-6">
                                        <div className="col-span-4 flex items-center">
                                            <p className="createFromInputLabel">
                                                Brands
                                            </p>
                                        </div>
                                        <div className="col-span-8">
                                            <Select
                                                value={productBrnad}
                                                onChange={(option) => {
                                                    setProductBrand(option);
                                                }}
                                                options={brands}
                                                className="w-full createFromInputLabel selectTag"
                                                placeholder="Select Store"
                                                isClearable={true}
                                                isSearchable={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-4 flex items-center">
                                            <p className="createFromInputLabel">
                                                Status
                                            </p>
                                        </div>
                                        <div className="col-span-8">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        statusValues?.Approved
                                                    }
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                    }}
                                                    onChange={(e) =>
                                                        handleCheckboxChange(e)
                                                    }
                                                    name="Approved"
                                                    id="Approved"
                                                />
                                                <label
                                                    htmlFor="Approved"
                                                    className="ml-4"
                                                >
                                                    Approved
                                                </label>
                                            </div>

                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={statusValues?.Hold}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                    }}
                                                    onChange={(e) =>
                                                        handleCheckboxChange(e)
                                                    }
                                                    name="Hold"
                                                    id="Hold"
                                                />
                                                <label
                                                    htmlFor="Hold"
                                                    className="ml-4"
                                                >
                                                    Hold
                                                </label>
                                            </div>

                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        statusValues[
                                                        "On Shipping"
                                                        ]
                                                    }
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                    }}
                                                    onChange={(e) =>
                                                        handleCheckboxChange(e)
                                                    }
                                                    name="On Shipping"
                                                    id="OnShipping"
                                                />
                                                <label
                                                    htmlFor="OnShipping"
                                                    className="ml-4"
                                                >
                                                    On Shipping
                                                </label>
                                            </div>

                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        statusValues?.Cancelled
                                                    }
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                    }}
                                                    onChange={(e) =>
                                                        handleCheckboxChange(e)
                                                    }
                                                    name="Cancelled"
                                                    id="Cancelled"
                                                />
                                                <label
                                                    htmlFor="Cancelled"
                                                    className="ml-4"
                                                >
                                                    Cancelled
                                                </label>
                                            </div>

                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        statusValues?.Shipped
                                                    }
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                    }}
                                                    onChange={(e) =>
                                                        handleCheckboxChange(e)
                                                    }
                                                    name="Shipped"
                                                    id="Shipped"
                                                />
                                                <label
                                                    htmlFor="Shipped"
                                                    className="ml-4"
                                                >
                                                    Shipped
                                                </label>
                                            </div>

                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        statusValues?.Return
                                                    }
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                    }}
                                                    onChange={(e) =>
                                                        handleCheckboxChange(e)
                                                    }
                                                    name="Return"
                                                    id="Return"
                                                />
                                                <label
                                                    htmlFor="Return"
                                                    className="ml-4"
                                                >
                                                    Return
                                                </label>
                                            </div>

                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        statusValues[
                                                        "Partial Return"
                                                        ]
                                                    }
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                    }}
                                                    onChange={(e) =>
                                                        handleCheckboxChange(e)
                                                    }
                                                    name="Partial Return"
                                                    id="PartialReturn"
                                                />
                                                <label
                                                    htmlFor="PartialReturn"
                                                    className="ml-4"
                                                >
                                                    Partial Return
                                                </label>
                                            </div>

                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        statusValues?.Completed
                                                    }
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                    }}
                                                    onChange={(e) =>
                                                        handleCheckboxChange(e)
                                                    }
                                                    name="Completed"
                                                    id="Completed"
                                                />
                                                <label
                                                    htmlFor="Completed"
                                                    className="ml-4"
                                                >
                                                    Completed
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 mt-8">
                                        <div className="col-span-4 flex items-center">
                                            <p className="createFromInputLabel">
                                                Payment Status
                                            </p>
                                        </div>
                                        <div className="col-span-8">
                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={allPaymentStatus}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                    }}
                                                    onChange={(e) => {
                                                        setAllPaymentStatus(
                                                            (prevState) =>
                                                                !prevState
                                                        );
                                                        setPaid(
                                                            (prevState) =>
                                                                !prevState
                                                        );
                                                        setUnpaid(
                                                            (prevState) =>
                                                                !prevState
                                                        );
                                                        setPartialPaid(
                                                            (prevState) =>
                                                                !prevState
                                                        );
                                                    }}
                                                    id="all"
                                                />
                                                <label
                                                    htmlFor="all"
                                                    className="ml-4"
                                                >
                                                    All
                                                </label>
                                            </div>

                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={paid}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                    }}
                                                    onChange={(e) => {
                                                        setPaid(
                                                            (prevState) =>
                                                                !prevState
                                                        );
                                                    }}
                                                    id="paid"
                                                />
                                                <label
                                                    htmlFor="paid"
                                                    className="ml-4"
                                                >
                                                    Paid
                                                </label>
                                            </div>

                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={partialPaid}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                    }}
                                                    onChange={(e) => {
                                                        setPartialPaid(
                                                            (prevState) =>
                                                                !prevState
                                                        );
                                                    }}
                                                    id="partial_paid"
                                                />
                                                <label
                                                    htmlFor="partial_paid"
                                                    className="ml-4"
                                                >
                                                    Partial Paid
                                                </label>
                                            </div>

                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={unpaid}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                    }}
                                                    onChange={(e) => {
                                                        setUnpaid(
                                                            (prevState) =>
                                                                !prevState
                                                        );
                                                    }}
                                                    id="unpaid"
                                                />
                                                <label
                                                    htmlFor="unpaid"
                                                    className="ml-4"
                                                >
                                                    Unpaid
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Report Summary */}
                                    {lastSalesReportPreview && (
                                        <div className="grid grid-cols-12 mt-8">
                                            <div className="col-span-4 flex items-center">
                                                <p className="createFromInputLabel">
                                                    Summary
                                                </p>
                                            </div>
                                            <div className="col-span-8">
                                                <div className=" mt-2">
                                                    <div className="grid grid-cols-12">
                                                        <div className="col-span-4">
                                                            <h2 className="font-black text-right">
                                                                Total Order
                                                                Amount:
                                                            </h2>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <h2 className="font-normal text-center">
                                                                {
                                                                    lastSalesReportPreview.total_order_amount
                                                                }
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className=" mt-2">
                                                    <div className="grid grid-cols-12">
                                                        <div className="col-span-4">
                                                            <h2 className="font-black text-right">
                                                                Total Cost
                                                                Price:
                                                            </h2>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <h2 className="font-normal text-center">
                                                                {
                                                                    lastSalesReportPreview.total_cost_price
                                                                }
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className=" mt-2">
                                                    <div className="grid grid-cols-12">
                                                        <div className="col-span-4">
                                                            <h2 className="font-black text-right">
                                                                Profit:
                                                            </h2>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <h2 className="font-normal text-center">
                                                                {
                                                                    lastSalesReportPreview.profit
                                                                }
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className=" mt-2">
                                                    <div className="grid grid-cols-12">
                                                        <div className="col-span-4">
                                                            <h2 className="font-black text-right">
                                                                Total Order
                                                                Quantity:
                                                            </h2>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <h2 className="font-normal text-center">
                                                                {
                                                                    lastSalesReportPreview.total_order_qty
                                                                }
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className=" mt-2">
                                                    <div className="grid grid-cols-12">
                                                        <div className="col-span-4">
                                                            <h2 className="font-black text-right">
                                                                Total Product
                                                                Quantity:
                                                            </h2>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <h2 className="font-normal text-center">
                                                                {
                                                                    lastSalesReportPreview.total_product_qty
                                                                }
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-8 mt-8 flex justify-end">
                                {loading ? (
                                    <>
                                        <button
                                            className="button button-primary w-32"
                                            disabled
                                        >
                                            <span className="fas fa-sync-alt animate-spin"></span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSubmit}
                                            className="button button-primary w-32"
                                        >
                                            Submit
                                        </button>
                                    </>
                                )}
                            </div>

                            <table className="w-full table-fixed mt-10">
                                <thead>
                                    <tr className="border-b h-12">
                                        <th className="tableHeader text-center">
                                            SL. No.
                                        </th>
                                        <th className="tableHeader text-center">
                                            Image
                                        </th>
                                        <th className="tableHeader text-center">
                                            Seller/Supplier
                                        </th>
                                        <th className="tableHeader text-center">
                                            Products Name
                                        </th>
                                        <th className="tableHeader text-center">
                                            SKU
                                        </th>
                                        <th className="tableHeader text-center">
                                            Order ID
                                        </th>
                                        <th className="tableHeader text-center">
                                            Cost Price
                                        </th>
                                        <th className="tableHeader text-center">
                                            Sales Price
                                        </th>
                                        <th className="tableHeader text-center">
                                            Quantity
                                        </th>
                                        <th className="tableHeader text-center">
                                            Total Cost
                                        </th>
                                        <th className="tableHeader text-center">
                                            Total Amount
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {salesReportPreview.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="border-b py-4 h-20"
                                        >
                                            <td>
                                                <p className="text-center">
                                                    {index + 1}
                                                </p>
                                            </td>

                                            <td>
                                                <img src={item?.Image} />
                                            </td>

                                            <td>
                                                <p className="text-center">
                                                    {item?.SellerSupplier}
                                                </p>
                                            </td>

                                            <td>
                                                <p className="text-center">
                                                    {item?.Product_Name}
                                                    <br />
                                                    <small>
                                                        {item?.Variable}
                                                    </small>
                                                </p>
                                            </td>

                                            <td>
                                                <p className="text-center">
                                                    {item?.SKU}
                                                </p>
                                            </td>

                                            <td>
                                                <p className="text-center">
                                                    {item?.Order_Number}
                                                </p>
                                            </td>

                                            <td>
                                                <p className="text-center">
                                                    {item?.Cost_Price}
                                                </p>
                                            </td>

                                            <td>
                                                <p className="text-center">
                                                    {item?.Sales_Price}
                                                </p>
                                            </td>

                                            <td>
                                                <p className="text-center">
                                                    {item?.Quantity}
                                                </p>
                                            </td>

                                            <td>
                                                <p className="text-center">
                                                    {item?.Total_Cost}
                                                </p>
                                            </td>

                                            <td>
                                                <p className="text-center">
                                                    {item?.Total_Amount}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {salesReportPreview.length > 0 && (
                                <div className="w-full mx-1 pt-2 float-right mt-14 mb-20">
                                    {
                                        loading ? (
                                            <button
                                                className="float-right bg-blue-600 px-4 py-2 rounded text-white"
                                                disabled
                                            >
                                                <span className="fas fa-sync-alt animate-spin"></span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSalesDownloadReport}
                                                className="float-right bg-blue-600 px-4 py-2 rounded text-white"
                                            >
                                                Download
                                            </button>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesReports;
