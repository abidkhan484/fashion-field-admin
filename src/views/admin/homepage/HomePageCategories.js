import axios from "axios";
import { SortableItem, swapArrayPositions } from "react-sort-list";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import HomePageCategoryModal from "./HomePageCategoryModal";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function HomePageCategories() {
  const { token, user } = useSelector((state) => state.auth);

  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = useState(false);

  let history = useHistory();

  const [open, setOpen] = React.useState(false);
  const [alias, setAlias] = React.useState("");
  const [isHomePage, setIsHomePage] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState(null);
  const [category, setCategory] = React.useState({});
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  React.useEffect(() => {
    if (user?.permissions) {
      if (
        !permission(user.permissions, "homepage_categories", "access") &&
        user.user_type_id != 1
      )
        history.push("/admin");
    }
  }, [user]);

  const fetchCategories = () => {
    axios
      .get("/homepage/categories", {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        // console.log(response);
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const fetchCategory = (categoryId) => {
    axios
      .get(`/homepage/categories/${categoryId}`, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((res) => {
        setCategory(res.data);
        setAlias(res.data.alias);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  React.useEffect(() => {
    if (token != "") {
      fetchCategories();
      fetchCategory(categoryId);
    }
  }, [token, open]);

  const swap = (dragIndex, dropIndex) => {
    let swappedTodos = swapArrayPositions(categories, dragIndex, dropIndex);

    setCategories([...swappedTodos]);
  };

  React.useEffect(() => {
    axios
      .post(
        "/homepage/categories",
        {
          categories,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: token,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, [categories]);

  const removeFromHomePage = (id) => {
    axios
      .post(
        `homepage/categories/remove-from-homepage/${id}`,
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
        // fetchCategories();
        fetchCategory(categoryId)
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const addtoHomePage = (id) => {
    axios
      .post(
        `homepage/categories/add-to-homepage/${id}`,
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
        // fetchCategories();
        fetchCategory(categoryId)
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleUpdateAlias = (id)=>{
    axios
      .post(
        `homepage/categories/${id}`,
        {
            alias:alias
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        fetchCategories();
        fetchCategory(categoryId);
        onCloseModal();
        
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  return (
    <>
      <div className="px-8 mt-8 mb-8">
        <div className="page-heading">
          <h1 className="pageHeading">Home Page categories</h1>
          <div className="flex"></div>
        </div>
        <div className="w-1/3">
          <div className="card">
            <div className="border-b">
              <div className="card-header">
                <div>
                  <h4 className="pageHeading">Sort Homepage categories</h4>
                </div>
              </div>
            </div>
            <div className="card-body overflow-x-auto">
              <ul className="w-full">
                {categories.map((item, index) => (
                  <SortableItem
                    items={categories}
                    id={item.id}
                    key={item.id}
                    swap={swap}
                  >
                    <div className="flex">
                      <li className="border-2 mb-1 p-2 cursor-move w-full">
                        {item.name}{" "}
                      </li>
                      <li
                        className="ml-5 mt-2"
                        onClick={() => {
                          onOpenModal();
                          setCategoryId(item?.id);
                        }}
                      >
                        <i className="fas fa-cog"></i>{" "}
                      </li>
                    </div>
                  </SortableItem>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* <HomePageCategoryModal  open={open} setOpen={setOpen}/> */}

      <Modal open={open} onClose={onCloseModal} blockScroll={false}>
        <div style={{ width: 500 }}>
          <p className="pageHeading mt-4">Enter Alias Name: {alias}</p>
          <input
            type="text"
            className="createFromInputField mt-4"
            onChange={(e) => setAlias(e.target.value)}
            value={alias ? alias : category.name}
          />
          {category?.ishomepage==true ? (
            <button
              className="button button-danger mt-5"
              onClick={() => {
                removeFromHomePage(categoryId);
              }}
            >
              InActive in Homepage
            </button>
          ) : (
            <button
              className="button button-success mt-5"
              onClick={() => {
                addtoHomePage(categoryId);
              }}
            >
              Active in Homepage
            </button>
          )}
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
                onClick={()=>handleUpdateAlias(categoryId)}
            >
              Update
            </button>
          )}
          {/* <Alert status={status?.type} type={status?.type} changeStatus={() => setStatus()} message={status?.message} margin="mt-4" /> */}
        </div>
      </Modal>
    </>
  );
}
