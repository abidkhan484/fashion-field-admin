import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { permission } from "helper/permission";
import { SortableItem, swapArrayPositions } from 'react-sort-list';

export default function NavigationMenu() {
  const { token, user } = useSelector((state) => state.auth);

  const [menus, setMenus] = React.useState([]);
  const [mainMenus, setMainMenus] = React.useState([]);


  let history = useHistory();

  React.useEffect(() => {
    if (user?.permissions) {
      if (
        !permission(user.permissions, "navigation", "access") &&
        user.user_type_id != 1
      )
        history.push("/admin");
    }
  }, [user]);

  const swap = (dragIndex, dropIndex) => {
    let swappedMenus = swapArrayPositions(menus, dragIndex, dropIndex);

    setMenus([...swappedMenus]);
  }

  const fetchNavigation = () => {
    axios
      .get(`main-menu-item`, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setMenus(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const fetchMainMenu = () => {
    axios
      .get(`main-menu-item`, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setMainMenus(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  React.useEffect(() => {
    let sortable = [...menus]
    axios.post('menus/items/order', {
      sortable
    }, {
      headers: {
        Accept: 'application/json',
        Authorization: token
      }
    }).then(response => {
      console.log("💥", response.data);
    }).catch(error => {
      console.log(error.response);
    })
  }, [menus])



  React.useEffect(() => {
    if (token != "") {
      fetchNavigation();
      fetchMainMenu();
    }
  }, [token]);

  const deleteMenuItem = (menuid) => {
    if (!window.confirm('Are you want to do it?'))
      return false;
    axios
      .delete(`/navigation/${menuid}`, {
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        fetchNavigation();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <>
      <div className="px-8 mt-8 mb-8">
        <div className="page-heading">
          <h1 className="pageHeading">Navigation Menu</h1>
          <div className="flex">
            {user?.permissions &&
              (permission(user.permissions, "navigation", "create") ||
                user.user_type_id == 1) ? (
              <Link
                to={"/admin/navigation/add"}
                className="button button-primary px-4"
              >
                Add Main Menu
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex flex-wrap">
          {menus?.map((item, index) => (
            <div key={index} className="w-full p-2">


              <SortableItem
                items={menus}
                id={item.id}
                key={item.id}
                swap={swap}
              >
                <div className="card">
                  <div className="border-b">
                    <div className="card-header">
                      <div>
                        <h4 className="pageHeading">{item.name} ({item.childrens_count})</h4>
                      </div>

                      <div>
                        <Link
                          to={`/admin/navigation/${item.id}/show`}
                          className="text-sm mr-4"
                        >
                          <i className="far fa-eye" style={{ color: "green" }}></i>
                        </Link>
                        {/* {user?.permissions &&
                        (permission(user.permissions, "navigation", "create") ||
                          user.user_type_id == 1) ? (
                          <Link
                            to={`/admin/navigation/${item.id}/item`}
                            className="text-sm bg-blue-400 text-white px-2 py-2 rounded"
                          >
                            Add Menu Item
                          </Link>
                        ) : (
                          ""
                        )} */}

                        {user?.permissions &&
                          (permission(user.permissions, "navigation", "update") ||
                            user.user_type_id == 1) ? (
                          <Link
                            to={`/admin/navigation/${item.id}/edit`}
                            className="text-sm ml-4"
                          >
                            <i className="far fa-edit"></i>
                          </Link>
                        ) : (
                          ""
                        )}

                        {user?.permissions &&
                          (permission(user.permissions, "navigation", "delete") ||
                            user.user_type_id == 1) ? (
                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="text-sm text-red-400 ml-4"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SortableItem>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
