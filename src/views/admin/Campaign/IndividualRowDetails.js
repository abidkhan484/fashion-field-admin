import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";

const IndividualRowDetails = (props) => {
    const { token, user } = useSelector((state) => state.auth);

    const id = props.location.state?.id;
    const campaign_id = props.location.state?.campaign_id;
    const type = props.location.state?.type;

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "campaigns", "read") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    useEffect(() => {
        if (id && campaign_id && type) {
            fetchProducts();
            fetchSlider();
        }
    }, [id, type, campaign_id]);

    const [searchValue, setSearchValue] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const [productList, setProductList] = useState([]);

    const [link, setLink] = useState("");
    const [silderImage, setSilderImage] = useState("");
    const [sliders, setSliders] = React.useState([]);

    const fetchSlider = () => {
        axios
            .get(`/campaign/${campaign_id}/banner/${id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                console.log(response);
                setSliders(response.data?.campaign_banners);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const uploadSliderHandler = () => {
        const formData = new FormData();
        formData.append("image", silderImage);
        formData.append("link", link);
        formData.append("campaign_id", campaign_id);

        axios
            .post(`/campaign/banner/${id}`, formData, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((res) => {
                console.log("Successfully uploaded");
                fetchSlider();
                setSilderImage("");
                setLink("");
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const handleSliderDelete = (id) => {
        console.log(id);
        if (!window.confirm("Are you want to do it?")) return false;
        if (token != "") {
            axios
                .delete(`/campaign/banner/${id}`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    fetchSlider();
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    };

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
        console.log(product);
        axios
            .post(
                `/campaign/${campaign_id}/products/${id}/store`,
                {
                    product_id: product.id,
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
                fetchProducts();
            })
            .catch((errors) => {
                console.log(errors);
            });
    };

    const fetchProducts = () => {
        axios
            .get(`/campaign/${campaign_id}/products/${id}`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                console.log(response);
                setProductList(response.data?.campaign_products);
            })
            .catch((errors) => {
                console.log(errors);
            });
    };

    const deleteProduct = (id) => {
        axios
            .delete(`/campaign/products/${id}`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                fetchProducts();
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    return (
        <>
            {type == "product" ? (
                <div className="px-8 mt-8 mb-8">
                    <div className="page-heading">
                        <h1 className="pageHeading">{`${type} Type Row`}</h1>
                        <div className="flex"></div>
                    </div>

                    <div className="card mb-5" style={{ minHeight: 700 }}>
                        <div className="border-b">
                            <div className="card-header">
                                <div>
                                    <h4 className="pageHeading">
                                        Add Products for this row
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className="w-2/3 mt-4">
                            <div className="grid grid-cols-12">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="findProduct"
                                        className="createFromInputLabel"
                                    >
                                        Find Product *
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <div className="flex flex-col relative">
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
                                            className={`container mx-auto px-4 bg-white h-80 overflow-y-auto shadow-lg absolute top-12 ${
                                                searchValue.length > 2
                                                    ? "visible"
                                                    : "hidden"
                                            }`}
                                        >
                                            {searchResult.map(
                                                (product, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex h-32 mt-6 mb-6 cursor-pointer"
                                                        onClick={() =>
                                                            handleSelectingProduct(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src={
                                                                product.thumbnail
                                                            }
                                                            className="h-full w-32"
                                                            alt="product"
                                                        />
                                                        <div className="ml-8">
                                                            <p>
                                                                {product.name}
                                                            </p>
                                                            <p>
                                                                SKU:{" "}
                                                                {product.SKU}
                                                            </p>
                                                            <p>
                                                                Price:{" "}
                                                                {
                                                                    product.selling_price
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-b mt-48">
                            <div className="card-header">
                                <div>
                                    <h4 className="pageHeading">
                                        Selected Products
                                    </h4>
                                </div>
                            </div>
                        </div>

                        {productList?.map((item, index) => (
                            <div className="card" key={index}>
                                <div className="border-b">
                                    <div className="card-header">
                                        <div className="flex h-32 mt-6 mb-6 cursor-pointer">
                                            <img
                                                src={item.product.thumbnail}
                                                className="h-full w-32"
                                                alt="product"
                                            />
                                            <div className="ml-8">
                                                <p>{item.product.name}</p>
                                                <p>SKU: {item.product.SKU}</p>
                                                <p>
                                                    Price:{" "}
                                                    {item.product.selling_price}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            {/* <button
                                                        // to={{ pathname: `/admin/campaign/${item.campaign_type}/${item.name}`, state: { type: item.campaign_type, id: item.id, campaign_id: item.campaign_id } }}
                                                        className="text-sm mr-4"
                                                    >
                                                        <i className="far fa-eye" style={{ color: "green" }}></i>
                                                    </button> */}

                                            {/* <Link
                                                    // to={`/admin/navigation/${item.id}/edit`}
                                                    className="text-sm ml-4"
                                                >
                                                    <i className="far fa-edit"></i>
                                                </Link> */}

                                            <button
                                                onClick={() =>
                                                    deleteProduct(item.id)
                                                }
                                                className="text-sm text-red-400 ml-4"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="px-8 mt-8 mb-8">
                    <div className="page-heading">
                        <h1 className="pageHeading">{`${type} Type Row`}</h1>
                        <div className="flex"></div>
                    </div>

                    <div className="flex-col">
                        <h1 className="pageHeading">
                            1. For 1 banner, Image Size: 1170 x 200
                        </h1>
                        <h1 className="pageHeading">
                            2. For 2 banner, Every Image Size: 570 x 200
                        </h1>
                        <h1 className="pageHeading">
                            3. For 3 banner, Every Image Size: 370 x 200
                        </h1>
                        <h1 className="pageHeading">
                            4. For 5 banner, First & Second Image Size: 370 x
                            200, Third Image Size: 562 x 454, Forth & Fifth
                            Image Size: 370 x 200
                        </h1>
                        <h1
                            className="pageHeading mt-8"
                            style={{ color: "red" }}
                        >
                            PlEASE FOLLOW THE ABOVE INSTRUCTION
                        </h1>
                    </div>

                    <div className="card-body mt-20">
                        <div className="w-full ">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="w-1/6">Banner</td>
                                        <td className="">
                                            <p className="text-sm">Link</p>
                                            <input
                                                type="text"
                                                name="link"
                                                id="link"
                                                value={link}
                                                onChange={(e) => {
                                                    setLink(e.target.value);
                                                }}
                                            />
                                        </td>
                                        <td className>
                                            <input
                                                type="file"
                                                name="image"
                                                id="image"
                                                className="mt-6"
                                                onChange={(e) => {
                                                    setSilderImage(
                                                        e.target.files[0]
                                                    );
                                                }}
                                            />
                                            {/* <p className="text-sm">Image size: 1920x580</p> */}
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap">
                                                {sliders?.map(
                                                    (slider, index) => (
                                                        <div
                                                            key={index}
                                                            className="w-40 mr-8"
                                                        >
                                                            <img
                                                                src={
                                                                    slider.image
                                                                }
                                                                alt={slider.id}
                                                            />
                                                            <div
                                                                onClick={() =>
                                                                    handleSliderDelete(
                                                                        slider.id
                                                                    )
                                                                }
                                                            >
                                                                <i
                                                                    className="fas fa-trash ml-4 cursor-pointer"
                                                                    style={{
                                                                        color: "red",
                                                                    }}
                                                                ></i>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    <div
                                        className="button button-outline-primary w-1/3 px-4 mt-6"
                                        onClick={uploadSliderHandler}
                                    >
                                        Add
                                    </div>
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer"></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default IndividualRowDetails;
