import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";
import Select from "react-select";
import { Link, useHistory } from "react-router-dom";
import { permission } from "helper/permission";
import { SortableItem, swapArrayPositions } from "react-sort-list";

const Campaign = (props) => {
    const { token, user } = useSelector((state) => state.auth);

    const id = props.location.state?.id;

    const [link, setLink] = useState("");
    const [silderImage, setSilderImage] = useState("");
    const [sliders, setSliders] = React.useState([]);

    const [rowName, setRowName] = useState("");
    const [rowType, setRowType] = useState(null);
    const rowTypeOptions = [
        { value: "banner", label: "Banner" },
        { value: "product", label: "Product" },
    ];

    const [rowList, setRowList] = useState([]);

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

    const fetchCampaignInformation = (id) => {
        axios
            .get(`/campaign/${id}`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                setSliders(response?.data?.campaign_sliders);
                setRowList(response?.data?.campaign_rows);
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    const fetchSlider = () => {
        axios
            .get(`/campaign/slider/${id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                setSliders(response.data?.campaign_sliders);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const uploadSliderHandler = () => {
        const formData = new FormData();
        formData.append("image", silderImage);
        formData.append("link", link);

        axios
            .post(`/campaign/slider/${id}`, formData, {
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
                .delete(`/campaign/slider/${id}`, {
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
        if (id) {
            fetchCampaignInformation(id);
            // fetchSlider()
        }
    }, [id]);

    const { campaign_name } = useParams();

    const fetchRowList = () => {
        axios
            .get(`/campaign-row/${id}/show`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                console.log(response);
                setRowList(response.data);
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    const handleAddRowType = () => {
        axios
            .post(
                `/campaign-row/${id}`,
                {
                    name: rowName,
                    campaign_type: rowType?.value,
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
                setRowName("");
                setRowType(null);
                fetchRowList();
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    const deleteRow = (id) => {
        axios
            .delete(`/campaign-row/${id}`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                console.log(response);
                fetchRowList();
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    const swap = (dragIndex, dropIndex) => {
        let swappedMenus = swapArrayPositions(rowList, dragIndex, dropIndex);

        console.log(swappedMenus);

        axios
            .post(
                "/campaign/row/order",
                {
                    sortable: swappedMenus,
                },
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: token,
                    },
                }
            )
            .then((response) => {
                console.log("💥", response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });

        setRowList([...swappedMenus]);
    };

    // React.useEffect(() => {
    //     let sortable = [...rowList]

    // }, [rowList])

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">{`${campaign_name} Campaing`}</h1>
                <div className="flex"></div>
            </div>

            <div className="card mb-5">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Campaign Sliders</h4>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div className="w-full ">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="w-1/6">Slider</td>
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
                                        <p className="text-sm">
                                            Image size: 1920x580
                                        </p>
                                    </td>
                                    <td>
                                        <div className="flex flex-wrap">
                                            {sliders?.map((slider, index) => (
                                                <div
                                                    key={index}
                                                    className="w-40 mr-8"
                                                >
                                                    <img
                                                        src={slider.image}
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
                                            ))}
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

            <div className="card mb-5">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">
                                Add Row type and Row Name
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="w-2/3 mt-4">
                    <div className="grid grid-cols-12">
                        <div className="col-span-4 flex items-center">
                            <label
                                htmlFor="rowName"
                                className="createFromInputLabel"
                            >
                                Row Name *
                            </label>
                        </div>
                        <div className="col-span-8">
                            <input
                                type="text"
                                id="rowName"
                                className="createFromInputField"
                                placeholder="Enter the name of the Row"
                                value={rowName}
                                onChange={(e) => setRowName(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-2/3 mt-4">
                    <div className="grid grid-cols-12">
                        <div className="col-span-4 flex items-center">
                            <label
                                htmlFor="rowType"
                                className="createFromInputLabel"
                            >
                                Row Type *
                            </label>
                        </div>
                        <div className="col-span-8">
                            <Select
                                value={rowType}
                                onChange={(option) => {
                                    setRowType(option);
                                }}
                                options={rowTypeOptions}
                                className="w-full createFromInputLabel selectTag"
                                placeholder="Select Row Type"
                                isClearable={true}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="button button-outline-primary w-28 px-4 mt-6"
                    onClick={handleAddRowType}
                >
                    Add
                </div>
            </div>

            <div className="card mb-5">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">
                                Campaign Page Layout
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap">
                    {rowList?.map((item, index) => (
                        <div key={index} className="w-full p-2">
                            <SortableItem
                                items={rowList}
                                id={item.id}
                                key={item.id}
                                swap={swap}
                            >
                                <div className="card">
                                    <div className="border-b">
                                        <div className="card-header">
                                            <div>
                                                <h4 className="pageHeading">{`${item.name} (${item.campaign_type} Type)`}</h4>
                                            </div>

                                            <div>
                                                <Link
                                                    to={{
                                                        pathname: `/admin/campaign/${item.campaign_type}/${item.name}`,
                                                        state: {
                                                            type: item.campaign_type,
                                                            id: item.id,
                                                            campaign_id:
                                                                item.campaign_id,
                                                        },
                                                    }}
                                                    className="text-sm mr-4"
                                                >
                                                    <i
                                                        className="far fa-eye"
                                                        style={{
                                                            color: "green",
                                                        }}
                                                    ></i>
                                                </Link>

                                                {/* <Link
                                                        // to={`/admin/navigation/${item.id}/edit`}
                                                        className="text-sm ml-4"
                                                    >
                                                        <i className="far fa-edit"></i>
                                                    </Link> */}

                                                <button
                                                    onClick={() =>
                                                        deleteRow(item.id)
                                                    }
                                                    className="text-sm text-red-400 ml-4"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SortableItem>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Campaign;
