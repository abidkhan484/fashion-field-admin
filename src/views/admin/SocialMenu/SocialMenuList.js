import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { permission } from "helper/permission";
import { appearance } from "helper/appearanace";

const SocialMenuList = () => {
    const { token, user } = useSelector((state) => state.auth);

    const [appearances, setAppearances] = React.useState([]);
    const [key, setKey] = React.useState("");
    const [value, setValue] = React.useState("");
    const [errors, setErrors] = React.useState("");

    let history = useHistory();

    const fetchApperances = () => {
        axios
            .get("/appearance", {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                console.log(response.data);
                setAppearances(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "settings", "access") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const deleteMenuItem = (menuid) => {
        axios
            .delete(`/appearance/${menuid}`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                console.log(response.data);
                fetchApperances();
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    React.useEffect(() => {
        if (token != "") {
            fetchApperances();
        }
    }, [token]);

    const handleSaveBtn = (e) => {
        let btn = e.target;
        let key = btn.parentElement.parentElement
            .getElementsByClassName("w-3/5")[0]
            .getElementsByClassName("key")[0].value;
        let value = btn.parentElement.parentElement
            .getElementsByClassName("w-3/5")[0]
            .getElementsByClassName("value")[0].value;
        console.log(key, value);
        axios
            .post(
                "/appearance",
                {
                    key: key,
                    value: value,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                history.push("/admin/socialmenu");
            })
            .catch((errors) => {
                console.log(errors.response);
                if (errors.response.status === 422) {
                    setErrors(errors.response.data.errors);
                }
            });
    };

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Manage Social Links</h1>
                <div className="flex">
                    {/* {user?.permissions && (permission(user.permissions, 'couriers', 'create') || (user.user_type_id == 1)) ? (
                    <Link to='/admin/couriers/add' className="button button-outline-primary px-4">Add New</Link>
                ) : '' } */}

                    {/* <Link
            to="/admin/socialmenu/add"
            className="button button-outline-primary px-4"
          >
            Add New
          </Link> */}
                </div>
            </div>

            <div className="page-heading mt-5">
                <div className="flex">
                    {/* {user?.permissions && (permission(user.permissions, 'couriers', 'create') || (user.user_type_id == 1)) ? (
                    <Link to='/admin/couriers/add' className="button button-outline-primary px-4">Add New</Link>
                ) : '' } */}
                    {/* 
          <Link
            to="/admin/socialmenu/add"
            className="button button-outline-primary px-4"
          >
            Add New
          </Link> */}
                </div>
            </div>

            <div className="w-full mt-5">
                <div className="card">
                    <div className="border-b">
                        <div className="card-header">
                            <div>
                                <h4 className="pageHeading">Address List</h4>
                            </div>
                        </div>
                    </div>
                    <div className="card-body overflow-x-auto">
                        <div className=" flex">
                            <div className="w-1/4 flex items-center">
                                <p>Contact Phone</p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="contact"
                                    className="key"
                                />
                                <input
                                    className="w-full border value createFromInputField"
                                    defaultValue={appearance(
                                        appearances,
                                        "contact"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>Contact Address</p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="address"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "address"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>Contact Email</p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="email"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "email"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>Social Facebook </p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="facebook"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "facebook"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>Social Twitter </p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="twitter"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "twitter"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>Social Youtube </p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="youtube"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "youtube"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>Social Instagram </p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="instagram"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "instagram"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>Social Pinterest </p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="pinterest"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "pinterest"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>Registered Name </p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="registered_name"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "registered_name"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>Incorporation No </p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="incorporation_no"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "incorporation_no"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>Trade License Number </p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="trade_license_number"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "trade_license_number"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>Vat Registration Number </p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="vat_registration_number"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "vat_registration_number"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>E-TIN </p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="e_tin_number"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "e_tin_number"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>E-Cab Membership No </p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="e-cab_membership_no"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "e-cab_membership_no"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className=" flex mt-5">
                            <div className="w-1/4 flex items-center">
                                <p>BASIS Membership </p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="BASIS_membership"
                                    className="key"
                                />
                                <input
                                    className=" createFromInputField w-full border value"
                                    defaultValue={appearance(
                                        appearances,
                                        "BASIS_membership"
                                    )}
                                />
                            </div>
                            <div className="w-1/5 ml-4">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer"></div>
                </div>

                <div className="card mt-5">
                    <div className="border-b">
                        <div className="card-header">
                            <div>
                                <h4 className="pageHeading">
                                    {" "}
                                    Manage single Product sidebar
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="card-body overflow-x-auto">
                        <div className=" flex">
                            <div className="w-1/4">
                                <p>Sidebar Content</p>
                            </div>
                            <div className="w-3/5">
                                <input
                                    type="hidden"
                                    value="sidebar"
                                    className="key"
                                />
                                <textarea
                                    className="w-full border value createFromInputField"
                                    defaultValue={appearance(
                                        appearances,
                                        "sidebar"
                                    )}
                                />
                            </div>
                            <div className="w-1/5">
                                <button
                                    onClick={(e) => handleSaveBtn(e)}
                                    className="button button-outline-primary px-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer"></div>
                </div>
            </div>
        </div>
    );
};

export default SocialMenuList;
