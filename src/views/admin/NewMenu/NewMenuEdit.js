import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useHistory, useParams, Link } from "react-router-dom";
import Select from "react-select";
import { permission } from "helper/permission";

const NewMenuEdit = () => {
    const { token, user } = useSelector((state) => state.auth);
    const { id } = useParams();

    let history = useHistory();

    const [item, setItem] = useState([]);
    const [title, setTitle] = useState("");

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "menu_management", "update") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const fetchMenuItem = () => {
        axios
            .get(`/menusitem/${id}`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                // console.log("🎃",response.data);
                setItem(response.data);
                setTitle(response.data.title);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const handleUpdate = () => {
        axios
            .post(
                `/menuitem/${id}`,
                {
                    title: title,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                // console.log(response.data);
                history.push("/admin/manumanage");
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    React.useEffect(() => {
        if (token != "") {
            fetchMenuItem();
        }
    }, [token]);

    return (
        <div className="w-1/3 p-5">
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Edit menu</h4>
                        </div>

                        <div></div>
                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <div className="pb-4">
                        <p className="font-bold text-lg">Title</p>
                        <input
                            type="text"
                            id="name"
                            className="createFromInputField mb-5"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <Link
                            onClick={handleUpdate}
                            className="text-sm bg-blue-400 text-white px-2 py-2 rounded "
                        >
                            update
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewMenuEdit;
