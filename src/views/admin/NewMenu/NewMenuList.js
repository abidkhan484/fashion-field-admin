import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { permission } from "helper/permission";

import { SortableItem, swapArrayPositions } from "react-sort-list";

const NewMenuList = () => {
    const { token, user } = useSelector((state) => state.auth);
    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "menu_management", "access") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const [menus, setMenus] = React.useState([]);

    const swap = (dragIndex, dropIndex) => {
        let swappedMenus = swapArrayPositions(menus, dragIndex, dropIndex);

        setMenus([...swappedMenus]);
    };

    const fetchNewMenu = () => {
        axios
            .get("getmenus", {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                console.log("🐱‍🏍", response.data);
                setMenus(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const deleteMenuItem = (menuid) => {
        if (!window.confirm("Are you want to do it?")) return false;
        axios
            .delete(`/menus/${menuid}`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                console.log(response.data);
                fetchNewMenu();
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    React.useEffect(() => {
        if (token != "") {
            fetchNewMenu();
        }
    }, [token]);
    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Menu Management</h1>
                <div className="flex"></div>
            </div>
            <div className="flex flex-wrap">
                {menus?.map((item, index) => (
                    <div key={index} className="w-1/3 p-2">
                        <div className="card">
                            <div className="border-b">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">
                                            {item.title
                                                ? item.title
                                                : item.name}
                                        </h4>
                                    </div>

                                    <div>
                                        {/* {user?.permissions &&
                      (permission(user.permissions, "navigation", "create") ||
                        user.user_type_id == 1) ? (
                        <Link
                          to={`/admin/manumanage/${item.id}/item`}
                          className="text-sm bg-blue-400 text-white px-2 py-2 rounded"
                        >
                          Add Menu Item
                        </Link>
                      ) : (
                        ""
                      )} */}
                                        <Link
                                            to={`/admin/manumanage/${item.id}/item`}
                                            className="text-sm bg-blue-400 text-white px-2 py-2 rounded"
                                        >
                                            Add Menu Item
                                        </Link>

                                        {/* {user?.permissions &&
                      (permission(user.permissions, "navigation", "update") ||
                        user.user_type_id == 1) ? (
                        <Link
                          to={`/admin/manumanage/${item.id}/edit`}
                          className="text-sm ml-4"
                        >
                          <i className="far fa-edit"></i>
                        </Link>
                      ) : (
                        ""
                      )} */}

                                        <Link
                                            to={`/admin/manumanage/${item.id}/edit`}
                                            className="text-sm ml-4"
                                        >
                                            <i className="far fa-edit"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body overflow-x-auto">
                                {item.items.map((head, index) => (
                                    <div className="pb-4">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b-1 border-gray-300">
                                                    <th>
                                                        <p className="font-bold text-lg">
                                                            {head.name}
                                                        </p>
                                                    </th>

                                                    <th className="w-12">
                                                        {/* {user?.permissions &&
                              (permission(
                                user.permissions,
                                "navigation",
                                "delete"
                              ) ||
                                user.user_type_id == 1) ? (
                                <button
                                 onClick={() => deleteMenuItem(head.id)}
                                 >
                                  <i className="fas fa-trash text-red-400"></i>
                                </button>
                              ) : (
                                ""
                              )} */}
                                                        <button
                                                            onClick={() =>
                                                                deleteMenuItem(
                                                                    head.id
                                                                )
                                                            }
                                                        >
                                                            <i className="fas fa-trash text-red-400"></i>
                                                        </button>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* {head.sub_items.map((sub, index) => (
                            <tr className="border-b-1 border-gray-400">
                              <td>
                                <p className="text-sm mb-2">{sub.name}</p>
                              </td>
                              <td className="text-sm">
                                {user?.permissions &&
                                (permission(
                                  user.permissions,
                                  "navigation",
                                  "delete"
                                ) ||
                                  user.user_type_id == 1) ? (
                                  <button
                                    // onClick={() => deleteMenuItem(sub.id)}
                                  >
                                    <i className="fas fa-trash text-red-400"></i>
                                  </button>
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                          ))} */}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewMenuList;
