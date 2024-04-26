import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import axios from "axios";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import { Link, useHistory } from "react-router-dom";
import { permission } from "helper/permission";

const ShowCampaigns = () => {
    const { token, user } = useSelector((state) => state.auth);

    const [addCampaignModal, setAddCampaignModal] = useState(false);
    const [modalOpeningForUpdate, setModalOpeningForUpdate] = useState(false);
    const [loading, setLoading] = useState(false);

    const [campaignName, setCampaignName] = useState("");
    const [campaginDescription, setCampaignDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [campaignList, setCampaignList] = useState([]);
    const [campaing, setCampaign] = useState(null);

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

    const handleModalOnClose = () => {
        setAddCampaignModal(false);
        setCampaignName("");
        setCampaignDescription("");
        setStartDate("");
        setEndDate("");
        setModalOpeningForUpdate(false);
        setCampaign(null);
    };

    const fetchCampaign = () => {
        axios
            .get("/campaign", {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                console.log(response);
                setCampaignList(response.data);
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    const deleteCampaign = (id) => {
        axios
            .delete(`/campaign/${id}`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                // console.log(response)
                fetchCampaign();
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    const updateCampaign = (id) => {
        const filteredCampaignArray = campaignList.filter(
            (individualCampaing) => individualCampaing.id === id
        );

        const campaign = filteredCampaignArray[0];
        setCampaign(campaign);

        setCampaignName(campaign.name);
        setCampaignDescription(campaign.description);
        setStartDate(campaign.start_date);
        setEndDate(campaign.end_date);
        setModalOpeningForUpdate(true);

        setAddCampaignModal(true);
    };

    const handleUpdatingCampaign = () => {
        if (campaing) {
            setLoading(true);
            axios
                .post(
                    `/campaign/${campaing.id}`,
                    {
                        name: campaignName,
                        description: campaginDescription,
                        start_date: startDate,
                        end_date: endDate,
                    },
                    {
                        headers: {
                            Authorization: token,
                            Accept: "application/json",
                        },
                    }
                )
                .then((response) => {
                    // console.log(response)
                    setLoading(false);
                    handleModalOnClose();
                    fetchCampaign();
                })
                .catch((errors) => {
                    console.log(errors.response);
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        if (token != "") {
            fetchCampaign();
        }
    }, [token]);

    const handleAddingCampaign = () => {
        setLoading(true);

        axios
            .post(
                "/campaign",
                {
                    name: campaignName,
                    description: campaginDescription,
                    start_date: startDate,
                    end_date: endDate,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                // console.log(response)
                setLoading(false);
                setCampaignName("");
                setCampaignDescription("");
                setStartDate("");
                setEndDate("");
                setAddCampaignModal(false);
                fetchCampaign();
            })
            .catch((errors) => {
                console.log(errors.response);
                setLoading(false);
            });
    };

    return (
        <>
            <Modal
                open={addCampaignModal}
                onClose={handleModalOnClose}
                blockScroll={false}
            >
                <div style={{ width: 500 }}>
                    <p className="pageHeading mt-4">Enter Campaign Name: </p>
                    <input
                        type="text"
                        className="createFromInputField mt-2"
                        placeholder="Campaign Name"
                        onChange={(e) => setCampaignName(e.target.value)}
                        value={campaignName}
                    />

                    <p className="pageHeading mt-4">
                        Enter Campaign Description:{" "}
                    </p>
                    <textarea
                        className="createFromInputField mt-2"
                        rows="3"
                        placeholder="Enter the description for the Campaign"
                        value={campaginDescription}
                        onChange={(e) => setCampaignDescription(e.target.value)}
                    />

                    <p className="pageHeading mt-4">Enter Start Date: </p>
                    <input
                        type="date"
                        className="createFromInputField"
                        placeholder="Select Start Date of the Campaign"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />

                    <p className="pageHeading mt-4">Enter End Date: </p>
                    <input
                        type="date"
                        className="createFromInputField"
                        placeholder="Select End Date of the Campaign"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />

                    {modalOpeningForUpdate ? (
                        <>
                            {loading ? (
                                <button
                                    className="button button-primary flex items-center mt-4 w-28"
                                    disabled
                                    style={{ marginLeft: 0 }}
                                >
                                    {" "}
                                    <span className="fas fa-sync-alt animate-spin"></span>
                                </button>
                            ) : (
                                <button
                                    className="button button-primary mt-4 w-28"
                                    style={{ marginLeft: 0 }}
                                    onClick={handleUpdatingCampaign}
                                >
                                    Update
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {loading ? (
                                <button
                                    className="button button-primary flex items-center mt-4 w-20"
                                    disabled
                                    style={{ marginLeft: 0 }}
                                >
                                    {" "}
                                    <span className="fas fa-sync-alt animate-spin"></span>
                                </button>
                            ) : (
                                <button
                                    className="button button-primary mt-4 w-20"
                                    style={{ marginLeft: 0 }}
                                    onClick={handleAddingCampaign}
                                >
                                    Add
                                </button>
                            )}
                        </>
                    )}

                    {/* <Alert status={status?.type} type={status?.type} changeStatus={() => setStatus()} message={status?.message} margin="mt-4" /> */}
                </div>
            </Modal>
            <div className="mt-8 px-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">All Campaigns</h1>
                    <div className="flex">
                        <button
                            onClick={() => setAddCampaignModal(true)}
                            className="button button-outline-primary px-4"
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
                            Add New Campaign
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div className="border-b">
                        <div className="card-header">
                            <div>
                                <h4 className="pageHeading">Campaign List</h4>
                            </div>
                        </div>
                    </div>

                    <div className="card-body overflow-x-auto">
                        <table className="w-350 2xl:w-full table-fixed">
                            <thead>
                                <tr className="border-b h-12">
                                    <th className="tableHeader w-1/6">Name</th>
                                    <th className="tableHeader w-1/6">Slug</th>
                                    <th className="tableHeader w-1/6">
                                        Description
                                    </th>
                                    <th className="tableHeader w-1/6">
                                        Start Date
                                    </th>
                                    <th className="tableHeader w-1/6">
                                        End Date
                                    </th>
                                    <th className="tableHeader w-1/6">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {campaignList.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b py-4 h-20"
                                    >
                                        <td>
                                            <p className="tableData">
                                                {item.name}
                                            </p>
                                        </td>
                                        <td>
                                            <Link
                                                to={{
                                                    pathname: `/admin/campaign/${item.name}`,
                                                    state: { id: item.id },
                                                }}
                                                className="tableData"
                                            >
                                                {item.slug}
                                            </Link>
                                        </td>
                                        <td>
                                            <p className="tableData">
                                                {item.description}
                                            </p>
                                        </td>
                                        <td>
                                            <Moment format="D/MM/YYYY">
                                                {item.start_date}
                                            </Moment>
                                        </td>
                                        <td>
                                            <Moment format="D/MM/YYYY">
                                                {item.end_date}
                                            </Moment>
                                        </td>
                                        <td className="h-full">
                                            <div className="flex h-full">
                                                <div
                                                    onClick={() =>
                                                        updateCampaign(item.id)
                                                    }
                                                >
                                                    <i className="fas fa-pen"></i>
                                                </div>
                                                <div
                                                    onClick={() =>
                                                        deleteCampaign(item.id)
                                                    }
                                                >
                                                    <i
                                                        className="fas fa-trash ml-4 cursor-pointer"
                                                        style={{ color: "red" }}
                                                    ></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShowCampaigns;
