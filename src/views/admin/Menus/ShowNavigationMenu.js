import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { permission } from "helper/permission";
import { SortableItem, swapArrayPositions } from "react-sort-list";
const ShowNavigationMenu = () => {
  const { id } = useParams();
  const { token, user } = useSelector((state) => state.auth);
  const [menuItems, setMenuItems] = useState([]);

  const history = useHistory();

  const fetchMenuItem = (id) => {
    axios
      .get(`menu-item/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((res) => {
        setMenuItems(res.data);
        console.log("💦", res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const swap = (dragIndex, dropIndex) => {
    let swappedMenus = swapArrayPositions(menuItems, dragIndex, dropIndex);

    setMenuItems([...swappedMenus]);
  };

  const deleteMenuItem = (menuid) => {
    if (!window.confirm("Are you want to do it?")) return false;
    axios
      .delete(`/navigation/${menuid}`, {
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        fetchMenuItem(id);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  useEffect(() => {
    if (token != "") {
      fetchMenuItem(id);
    }
  }, [token, id]);

  React.useEffect(() => {
    let sortable = [...menuItems]
    axios.post('menus/items/order', {
      sortable
    }, {
        headers: {
          Accept: 'application/json',
          Authorization: token
        }
    }).then(response => {
        console.log("💥",response.data);
    }).catch(error => {
        console.log(error.response);
    })
}, [menuItems])

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
               to={`/admin/navigation/${id}/item`}
                className="button button-primary px-4"
              >
                Add Menu
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex flex-wrap">
          {menuItems?.map((item, index) => (
            <div key={index} className="w-full p-2">
              <SortableItem
                items={menuItems}
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
                        {item.childrens_count != 0 ? (
                          <Link
                            to={`/admin/navigation/${item.id}/show`}
                            className="text-sm mr-4"
                          >
                            <i
                              className="far fa-eye"
                              style={{ color: "green" }}
                            ></i>
                          </Link>
                        ) : (
                          ""
                        )}

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
        <Link to="#" onClick={history.goBack} className="button button-primary px-4 w-1/6 mt-5">
          Go back
        </Link>
      </div>
    </>
  );
};

export default ShowNavigationMenu;
