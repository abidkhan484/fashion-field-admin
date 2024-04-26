import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { LoaderContext } from "context/LoaderContext";
import Pagination from "core/Pagination";
// import toast from "react-hot-toast";
import { permission } from "helper/permission";
import { toast } from "react-toastify";
import Select from "react-select";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

import "react-toastify/dist/ReactToastify.css";

toast.configure();

const ProductList = () => {
    const [allProducts, setAllProducts] = useState(null);
    const { loading, setLoading } = React.useContext(LoaderContext);
    const [searchValue, setSearchValue] = useState("");
    const { token, user } = useSelector((state) => state.auth);

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [productCategories, setProductCategories] = useState([]);

    const [stores, setStores] = useState([]);
    const [storeId, setStoreId] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [productCategory, setProductCategory] = useState("");

    const [categoryId, setCategoryId] = useState(null);
    const [url, setUrl] = useState("/products/filter-all?");

    const [errors, setErrors] = React.useState([]);
    const [queries, setQueries] = React.useState({
        category_id: "",
        sub_category_id: "",
        product_category_id: "",
        store_id: "",
        status: "",
    });

    const [openDownload, setOpenDownload] = useState(false);

    const statusOptions = [
        { value: "draft", label: "Draft" },
        { value: "publish", label: "Published" },
        { value: "unpublish", label: "Unpublished" },
    ];
    const [statusValue, setStatusValue] = useState(null);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(
                    user.permissions,
                    "products_manage_product",
                    "access"
                ) &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const fetchProducts = () => {
        console.log("Product working!!!");
        setLoading(true);
        axios
            .get(url, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                setAllProducts(response.data);
                console.log("💥", response);
                setLoading(false);
            })
            .catch((errors) => {
                console.log(errors);
            });
    };

    useEffect(() => {
        if (token != null && token != "") {
            console.log(token);
            fetchProducts();

            axios
                .get("/categories", {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    // setCategories(response.data);
                    setCategories([{ value: "", label: "All Categories" }]);
                    response?.data?.map((item) => {
                        setCategories((prevState) => [
                            ...prevState,
                            { value: item.id, label: item.name },
                        ]);
                    });
                })
                .catch((errors) => {
                    console.log(errors);
                });

            axios
                .get("stores/all", {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    setStores([]);
                    setStores((prevState) => [
                        ...prevState,
                        { value: "", label: "All Stores" },
                    ]);

                    response?.data?.map((item) => {
                        setStores((prevState) => [
                            ...prevState,
                            { value: item.id, label: item.name },
                        ]);
                    });
                });
        }
    }, [token]);

    useEffect(() => {
        if (token != null && token != "") {
            if (searchValue.length > 3) {
                setUrl("/products/search?terms=" + searchValue);
            }
        }
    }, [searchValue]);

    useEffect(() => {
        if (token != null && token != "") {
            // if(categoryId?.value == '' || categoryId == '')
            // {
            //   setUrl('/products');
            //   setSubCategories([]);
            //   setSubCategory('');
            // }else{
            //   setUrl(`products/filter/${categoryId?.value}`);
            //   axios.get(`/products/sub-categories/${categoryId?.value}`, {
            //     headers: { Authorization: token, Accept: "application/json" },
            //   }).then(response => {
            //     setSubCategories([]);
            //     response?.data?.map(item => {
            //       setSubCategories(prevState => [...prevState, {value: item.id, label: item.name}]);
            //     })
            //   })
            // }

            if (categoryId?.value) {
                let querie = { ...queries };
                querie.category_id = categoryId.value;
                setQueries(querie);

                axios
                    .get(`/products/sub-categories/${categoryId?.value}`, {
                        headers: {
                            Authorization: token,
                            Accept: "application/json",
                        },
                    })
                    .then((response) => {
                        setSubCategories([]);
                        response?.data?.map((item) => {
                            setSubCategories((prevState) => [
                                ...prevState,
                                { value: item.id, label: item.name },
                            ]);
                        });
                    });
            } else {
                setUrl("/products");
                setSubCategories([]);
                setProductCategories([]);
            }
        }
    }, [categoryId]);

    const updatePage = (pageurl) => {
        setUrl(pageurl);
    };

    React.useEffect(() => {
        setLoading(true);
        if (token != "") {
            axios
                .get(url, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    console.log(response);
                    setAllProducts(response.data);
                    setLoading(false);
                });
        }
    }, [url]);

    const handleAddingNewDeal = (id) => {
        axios
            .post(
                `/deals`,
                {
                    product_id: id,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                console.log("successfully Added");
                // toast.success(response);
                fetchProducts();
            })
            .catch((errors) => {
                console.log(errors.response);
                if (errors.response.status === 422) {
                    setErrors(errors.response.data.errors);
                }
            });
    };

    const handleAddingBestSeller = (id) => {
        axios
            .post(
                `/bestseller`,
                {
                    product_id: id,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                console.log("successfully Added");
                fetchProducts();
            })
            .catch((errors) => {
                console.log(errors.response);
                if (errors.response.status === 422) {
                    setErrors(errors.response.data.errors);
                }
            });
    };

    useEffect(() => {
        if (token != "") {
        }
    }, [token]);

    const addtoHomePage = (id) => {
        axios
            .post(
                `product/${id}/add-homepage`,
                {},
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: token,
                    },
                }
            )
            .then((res) => {
                console.log(res.data);
                fetchProducts();
                toast.success(res);
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    const removeFromHomePage = (id) => {
        axios
            .post(
                `product/${id}/remove-homepage`,
                {},
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: token,
                    },
                }
            )
            .then((res) => {
                console.log(res.data);
                toast.success(res);
                fetchProducts();
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    useEffect(() => {
        if (token != "") {
            // if(storeId.value == '')
            // {
            //   setUrl('/products');
            // }else{
            //   setCategoryId('');
            //   setUrl(`/products/filter-store/${storeId.value}`);
            // }

            if (storeId?.value) {
                let querie = { ...queries };
                querie.store_id = storeId?.value;
                setQueries(querie);
            } else {
                setUrl("/products");
            }
        }
    }, [storeId]);

    useEffect(() => {
        if (token != "") {
            // if(subCategory?.value == '' || subCategory == '')
            // {
            //   setUrl('/products');
            //   setProductCategories([]);
            //   setProductCategory('');
            // }else{
            //   setUrl(`products/filter-sub-category/${subCategory?.value}`)
            //   axios.get(`products/product-categories/${subCategory?.value}`, {
            //     headers: {
            //       Accept: "application/json",
            //       Authorization: token,
            //     },
            //   }).then(response => {
            //     setProductCategories([]);
            //     response?.data?.map(item => {
            //       setProductCategories(prevState => [...prevState, {value: item.id, label: item.name}]);
            //     })
            //   })
            // }

            if (subCategory?.value) {
                let querie = { ...queries };
                querie.sub_category_id = subCategory?.value;
                setQueries(querie);

                axios
                    .get(`products/product-categories/${subCategory?.value}`, {
                        headers: {
                            Accept: "application/json",
                            Authorization: token,
                        },
                    })
                    .then((response) => {
                        setProductCategories([]);
                        response?.data?.map((item) => {
                            setProductCategories((prevState) => [
                                ...prevState,
                                { value: item.id, label: item.name },
                            ]);
                        });
                    });
            } else {
                setUrl("/products");
                setProductCategories([]);
            }
        }
    }, [subCategory]);

    useEffect(() => {
        if (token != "") {
            // if(productCategory.value == '' || productCategory == '')
            // {
            //   setUrl('/products');
            // }else{
            //   setUrl(`/products/filter-product-category/${productCategory?.value}`)
            // }

            if (productCategory?.value) {
                let querie = { ...queries };
                querie.product_category_id = productCategory?.value;
                setQueries(querie);
            } else {
                setUrl("/products/filter-all?");
            }
        }
    }, [productCategory]);

    useEffect(() => {
        if (token != "") {
            if (statusValue?.value) {
                let querie = { ...queries };
                querie.status = statusValue?.value;
                setQueries(querie);
            } else {
                setUrl("/products/filter-all?");
            }
        }
    }, [statusValue]);

    useEffect(() => {
        if (token != "") {
            setUrl(
                `/products/filter-all?category_id=${queries.category_id}&sub_category_id=${queries.sub_category_id}&product_category_id=${queries.product_category_id}&store_id=${queries.store_id}&status=${queries.status}`
            );
        }
    }, [queries]);

    const handleCloseModal = () => {
        setOpenDownload(false);
        setDownloadData({});
    };

    const [downloadData, setDownloadData] = useState({});

    const handleCheckboxChange = (e) => {
        const tempData = { ...downloadData };
        const value = e.target.name;
        // console.log(tempData[value])
        tempData[value] = !tempData[value];
        setDownloadData(tempData);
    };

    useEffect(() => {
        console.log(downloadData);
    }, [downloadData]);

    const [downloadLoading, setDownloadLoading] = useState(false);

    const handleDownloadButton = () => {
        setDownloadLoading(true);
        let tempArray = [];
        Object.entries(downloadData).map(([key, value]) => {
            if (value == true) {
                tempArray.push(key);
            }
        });

        const columns = `columns[]=${tempArray.join("&columns[]=")}`;

        axios
            .get(`/exports${url}&${columns}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
                // responseType: 'arraybuffer',
            })
            .then((response) => {
                setDownloadLoading(false);
                console.log(response);
                window.location.replace(response.data.url);
                setOpenDownload(false);
                setDownloadData({});
            })
            .catch((errors) => {
                console.log(errors);
                setDownloadLoading(false);
                setDownloadData({});
            });

        // console.log(`columns[]=${tempArray.join("&columns[]=")}`)
    };

    return (
        <>
            <Modal
                open={openDownload}
                onClose={handleCloseModal}
                center
                blockScroll
            >
                <div className="py-4 px-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            style={{ width: 20, height: 20 }}
                            onChange={(e) => handleCheckboxChange(e)}
                            name="name"
                            id="name"
                        />
                        <label htmlFor="name" className="ml-4">
                            Name
                        </label>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            style={{ width: 20, height: 20 }}
                            onChange={(e) => handleCheckboxChange(e)}
                            name="category_name"
                            id="category_name"
                        />
                        <label htmlFor="category_name" className="ml-4">
                            Category
                        </label>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            style={{ width: 20, height: 20 }}
                            onChange={(e) => handleCheckboxChange(e)}
                            name="sub_category_name"
                            id="sub_category_name"
                        />
                        <label htmlFor="sub_category_name" className="ml-4">
                            Sub Category
                        </label>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            style={{ width: 20, height: 20 }}
                            onChange={(e) => handleCheckboxChange(e)}
                            name="product_category_name"
                            id="product_category_name"
                        />
                        <label htmlFor="product_category_name" className="ml-4">
                            Product Category
                        </label>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            style={{ width: 20, height: 20 }}
                            onChange={(e) => handleCheckboxChange(e)}
                            name="store_name"
                            id="store_name"
                        />
                        <label htmlFor="store_name" className="ml-4">
                            Store Name
                        </label>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            style={{ width: 20, height: 20 }}
                            onChange={(e) => handleCheckboxChange(e)}
                            name="brand_name"
                            id="brand_name"
                        />
                        <label htmlFor="brand_name" className="ml-4">
                            Brand Name
                        </label>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            style={{ width: 20, height: 20 }}
                            onChange={(e) => handleCheckboxChange(e)}
                            name="price"
                            id="price"
                        />
                        <label htmlFor="price" className="ml-4">
                            Price
                        </label>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            style={{ width: 20, height: 20 }}
                            onChange={(e) => handleCheckboxChange(e)}
                            name="cost_price"
                            id="cost_price"
                        />
                        <label htmlFor="cost_price" className="ml-4">
                            Cost Price
                        </label>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            style={{ width: 20, height: 20 }}
                            onChange={(e) => handleCheckboxChange(e)}
                            name="special_price"
                            id="special_price"
                        />
                        <label htmlFor="special_price" className="ml-4">
                            Special Price
                        </label>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            style={{ width: 20, height: 20 }}
                            onChange={(e) => handleCheckboxChange(e)}
                            name="stock"
                            id="stock"
                        />
                        <label htmlFor="stock" className="ml-4">
                            Stock
                        </label>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            style={{ width: 20, height: 20 }}
                            onChange={(e) => handleCheckboxChange(e)}
                            name="style_no"
                            id="style_no"
                        />
                        <label htmlFor="style_no" className="ml-4">
                            Style No
                        </label>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            style={{ width: 20, height: 20 }}
                            onChange={(e) => handleCheckboxChange(e)}
                            name="SKU"
                            id="SKU"
                        />
                        <label htmlFor="SKU" className="ml-4">
                            SKU
                        </label>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            style={{ width: 20, height: 20 }}
                            onChange={(e) => handleCheckboxChange(e)}
                            name="status"
                            id="status"
                        />
                        <label htmlFor="status" className="ml-4">
                            Status
                        </label>
                    </div>

                    {downloadLoading ? (
                        <>
                            <button
                                className="button button-outline-primary w-full mt-8"
                                disabled
                            >
                                {" "}
                                <span className="fas fa-sync-alt animate-spin"></span>
                            </button>
                        </>
                    ) : (
                        <div
                            className="button button-outline-primary cursor-pointer mt-8"
                            onClick={handleDownloadButton}
                        >
                            <p>Download</p>
                        </div>
                    )}
                </div>
            </Modal>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading w-full mb-2">All Products</h1>
                    <div className="flex">
                        <div
                            className="button button-outline-primary w-48 mr-10 cursor-pointer"
                            onClick={() => setOpenDownload(true)}
                        >
                            <p>Download In Xlsx Format</p>
                        </div>
                        {user?.permissions &&
                        (permission(
                            user.permissions,
                            "products_manage_product",
                            "create"
                        ) ||
                            user.user_type_id == 1) ? (
                            <Link
                                to="/admin/products-adding"
                                className="button button-outline-primary w-48"
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
                                    Add a New Product
                                </span>
                            </Link>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
                <div className="card">
                    <div className="border-b">
                        <div className="card-header flex flex-row">
                            <div className="w-full mb-2">
                                <h4 className="pageHeading">Products</h4>
                            </div>
                            {/* <input className="inputBox" placeholder="Search" onChange={e => setSearchValue(e.target.value)} /> */}

                            <input
                                className="inputBox ml-5"
                                placeholder="Search"
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="w-full flex border-b">
                        <div className="w-1/5">
                            <label>Select Store</label>
                            <Select
                                options={stores}
                                onChange={(option) => setStoreId(option)}
                            />
                        </div>
                        <div className="w-1/5">
                            <label>Select Status</label>
                            <Select
                                options={statusOptions}
                                onChange={(option) => setStatusValue(option)}
                                value={statusValue}
                            />
                        </div>
                        <div className="w-1/5">
                            <label>Select Category</label>
                            <Select
                                options={categories}
                                onChange={(option) => setCategoryId(option)}
                            />
                        </div>
                        {subCategories.length > 0 ? (
                            <div className="w-1/5">
                                <label>Select Sub Category</label>
                                <Select
                                    options={subCategories}
                                    onChange={(option) =>
                                        setSubCategory(option)
                                    }
                                />
                            </div>
                        ) : (
                            ""
                        )}
                        {productCategories.length > 0 ? (
                            <div className="w-1/5">
                                <label>Select Product Category</label>
                                <Select
                                    options={productCategories}
                                    onChange={(option) =>
                                        setProductCategory(option)
                                    }
                                />
                            </div>
                        ) : (
                            ""
                        )}
                    </div>

                    <div className="card-body overflow-x-auto">
                        <table className="w-350 2xl:w-full table-fixed">
                            <thead>
                                <tr className="border-b h-12">
                                    <th className="tableHeader">SL</th>
                                    <th className="tableHeader">Style No</th>
                                    <th className="tableHeader">SKU</th>
                                    <th className="tableHeader">Image</th>
                                    <th className="tableHeader w-1.5/9">
                                        <p className="ml-4">Name</p>
                                    </th>
                                    <th className="tableHeader w-1/9">Price</th>
                                    <th className="tableHeader w-0.5/9">
                                        Status
                                    </th>
                                    <th className="tableHeader w-0.7/9">
                                        Store Name
                                    </th>
                                    <th className="tableHeader w-0.5/9">
                                        Stock
                                    </th>
                                    <th className="tableHeader w-1/9">
                                        Category
                                    </th>

                                    <th className="tableHeader w-2/9 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {allProducts?.data?.map((item, index) => (
                                    <tr
                                        className="border-b py-4 h-20"
                                        key={index}
                                    >
                                        <td>
                                            <p className="tableData">
                                                {item.id}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="tableData">
                                                {item?.style_no}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="tableData">
                                                {item.SKU}
                                            </p>
                                        </td>
                                        <td>
                                            <Link
                                                to={`/admin/product/${item.id}`}
                                            >
                                                <div className="flex">
                                                    <LazyLoadImage
                                                        src={item.thumbnail}
                                                        alt="product"
                                                        effect="blur"
                                                    />
                                                    {/* <img className="w-12 h-au" src={item.thumbnail} /> */}
                                                </div>
                                            </Link>
                                        </td>
                                        <td>
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <h3 className="tableData">
                                                        <Link
                                                            to={`/admin/product/${item.id}`}
                                                        >
                                                            <div className="flex">
                                                                <p>
                                                                    {item.name}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    </h3>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="tableData">
                                                <b>Price:</b> {item.price}
                                            </p>
                                            <p className="tableData">
                                                <b>Cost Price:</b>{" "}
                                                {item.cost_price}
                                            </p>
                                            <p className="tableData">
                                                <b>Special Price:</b>{" "}
                                                {item.special_price}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="tableData uppercase">
                                                {item.status}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="tableData">
                                                {item.store.name}
                                            </p>
                                        </td>
                                        <td>
                                            {item.stock ? (
                                                <p className="tableData">
                                                    {item.stock}
                                                </p>
                                            ) : (
                                                <p className="tableData">
                                                    In Stock
                                                </p>
                                            )}
                                        </td>
                                        <td>
                                            <p className="tableData">
                                                <b>Product Category:</b>{" "}
                                                {item.product_category.name}
                                            </p>
                                            <p className="tableData">
                                                <b>Sub Category:</b>{" "}
                                                {
                                                    item.product_category
                                                        ?.sub_category?.name
                                                }
                                            </p>
                                            <p className="tableData">
                                                <b>Main Category:</b>{" "}
                                                {
                                                    item?.product_category
                                                        ?.sub_category?.category
                                                        ?.name
                                                }
                                            </p>
                                        </td>

                                        <td className="text-center">
                                            <div className="flex">
                                                {user?.permissions &&
                                                (permission(
                                                    user.permissions,
                                                    "products_manage_product",
                                                    "update"
                                                ) ||
                                                    user.user_type_id == 1) ? (
                                                    <Link
                                                        to={`/admin/product/${item.id}`}
                                                        className="flex items-center"
                                                    >
                                                        <i className="fas fa-pen mr-2"></i>
                                                    </Link>
                                                ) : (
                                                    ""
                                                )}

                                                {user?.permissions &&
                                                (permission(
                                                    user.permissions,
                                                    "products_deals_of_the_day",
                                                    "create"
                                                ) ||
                                                    user.user_type_id == 1) ? (
                                                    <>
                                                        {item.deal != null ? (
                                                            <button
                                                                onClick={() => {
                                                                    handleAddingNewDeal(
                                                                        item.id
                                                                    );
                                                                }}
                                                                className="button bg-green-200 text-white w-32 mr-2"
                                                                disabled={true}
                                                                title="Remove Deals from Deal Page"
                                                            >
                                                                Added On Deals
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    handleAddingNewDeal(
                                                                        item.id
                                                                    );
                                                                }}
                                                                className="button button-success w-32 mr-2"
                                                            >
                                                                Deals of the Day
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    ""
                                                )}

                                                {user?.permissions &&
                                                (permission(
                                                    user.permissions,
                                                    "products_deals_of_the_day",
                                                    "create"
                                                ) ||
                                                    user.user_type_id == 1) ? (
                                                    item.inhomepage == false ? (
                                                        <button
                                                            onClick={() => {
                                                                addtoHomePage(
                                                                    item.id
                                                                );
                                                            }}
                                                            className="button button-success w-32 mr-2"
                                                        >
                                                            Add to Homepage
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                removeFromHomePage(
                                                                    item.id
                                                                );
                                                            }}
                                                            className="button button-danger w-32 mr-2"
                                                        >
                                                            Remove From Homepage
                                                        </button>
                                                    )
                                                ) : (
                                                    ""
                                                )}

                                                {item.bestseller != null ? (
                                                    <button
                                                        onClick={() => {
                                                            handleAddingBestSeller(
                                                                item.id
                                                            );
                                                        }}
                                                        className="button bg-green-200 text-white w-32 mr-2"
                                                    >
                                                        Added On BestSell
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            handleAddingBestSeller(
                                                                item.id
                                                            );
                                                        }}
                                                        className="button button-success w-32 mr-2"
                                                    >
                                                        Best Seller
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                        {/* <td className="text-center">
                        {user?.permissions &&
                        (permission(
                          user.permissions,
                          "products_deals_of_the_day",
                          "create"
                        ) ||
                          user.user_type_id == 1) ? (
                          <button
                            onClick={() => {
                              handleAddingNewDeal(item.id);
                            }}
                            className="button button-success w-32"
                          >
                            Add to Homepage 
                          </button>
                        ) : (
                          ""
                        )}
                      </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer">
                        <div className="flex flex-col justify-between md:flex-row items-center w-full">
                            {allProducts && (
                                <p className="font-Poppins font-normal text-sm">
                                    Showing{" "}
                                    <b>
                                        {allProducts.from}-{allProducts.to}
                                    </b>{" "}
                                    from <b>{allProducts.total}</b> data
                                </p>
                            )}
                            {/* <p>Showing <b>{supplierData.from}-{supplierData.to}</b> from <b>{supplierData.total}</b> data</p> */}

                            <div className="flex items-center">
                                {allProducts && (
                                    <Pagination
                                        sellers={allProducts}
                                        setUpdate={updatePage}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductList;
