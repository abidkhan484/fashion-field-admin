import axios from "axios";
import { LoaderContext } from "context/LoaderContext";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Moment from "react-moment";
import "moment-timezone";
import { Link, useHistory } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import CreateCategoryModal from "./CreateCategoryModal";
import Pagination from "core/Pagination";

import UpdateCategoryModal from "./UpdateCategoryModal";
import { permission } from "helper/permission";

export default function Category() {
  const { loading, setLoading } = React.useContext(LoaderContext);

  const { token, user } = useSelector((state) => state.auth);

  const [open, setOpen] = React.useState(false);
  const [updateModal, setUpdateModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = React.useState([]);

  

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const onOpenDeleteModal = ()=> setDeleteModal(true);
  const onCloseDeleteModal = ()=> setDeleteModal(false);

  let history = useHistory();

  React.useEffect(() => {
    if (user?.permissions) {
      if (
        !permission(user.permissions, "products_category", "access") &&
        user.user_type_id != 1
      )
        history.push("/admin");
    }
  }, [user]);

  const updatePage = (url) => {
    setLoading(true);
    axios
      .get(url, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    setLoading(true);
    axios
      .get("/categories", { headers: { Authorization: token } })
      .then((response) => {
        console.log(response);
        setCategories(response.data);
        console.log(categories);
        setLoading(false);
      })
      .catch((errors) => {
        console.log(errors.response);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    if (updateModal == false) {
      if (token !== "") {
        fetchCategories();
      }
    }
  }, [token, open, updateModal]);

  // useEffect(() => {
  //     console.log(categories)
  // }, [categories])

  const deleteCategory = (id) => {
    
    if(!window.confirm('Are you want to do it?'))
        return false;

    axios
      .delete(`/categories/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        fetchCategories();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <>
      <div className="mt-8 px-8 mb-8">
        <div className="page-heading">
          <h1 className="pageHeading">All Categories</h1>
          <div className="flex">
            {user?.permissions &&
            (permission(user.permissions, "products_category", "create") ||
              user.user_type_id == 1) ? (
              <button
                onClick={onOpenModal}
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
                Add New Category
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="card">
          <div className="border-b">
            <div className="card-header">
              <div>
                <h4 className="pageHeading">Categories</h4>
              </div>
              <input className="inputBox" placeholder="Search" />
            </div>
          </div>
          <div className="card-body overflow-x-auto">
            <table className="w-350 2xl:w-full table-fixed">
              <thead>
                <tr className="border-b h-12">
                  <th className="tableHeader w-1/6">Name</th>
                  <th className="tableHeader w-1/6">Slug</th>
                  <th className="tableHeader w-1/6">Sub Categories</th>
                  <th className="tableHeader w-1/6">Date</th>
                  <th className="tableHeader w-1/6">Status</th>
                  <th className="tableHeader w-1/6">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((item, index) => (
                  <tr key={index} className="border-b py-4 h-20">
                    <td className="tableData">{item.name}</td>

                    <td className="tableData">
                      <Link to={`categories/${item.id}`}>{item.slug}</Link>
                    </td>

                    <td className="tableData">{item.sub_category.length}</td>

                    <td className="tableData">
                      <Moment format="MMM, D YYYY">{item.created_at}</Moment>
                    </td>

                    <td>
                      {item.active ? (
                        <span className="activeButtonView">Active</span>
                      ) : (
                        <span className="text-xs font-semibold bg-red-400 text-white px-3 py-1 rounded-full font-Poppins">
                          Deactive
                        </span>
                      )}
                    </td>

                    <td className="">
                      {user?.permissions &&
                      (permission(
                        user.permissions,
                        "products_category",
                        "update"
                      ) ||
                        user.user_type_id == 1) ? (
                        <i
                          className="fas fa-pen cursor-pointer"
                          onClick={() => {
                            setUpdateModal((prevState) => !prevState);
                            setCategoryId(item.id);
                          }}
                        ></i>
                      ) : (
                        ""
                      )}

                      {user?.permissions &&
                      (permission(
                        user.permissions,
                        "products_category",
                        "delete"
                      ) ||
                        user.user_type_id == 1) ? (
                        <i
                          className="fas fa-trash cursor-pointer ml-2 text-red-600"
                          onClick={() => deleteCategory(item.id)}
                        ></i>
                      ) : (
                        ""
                      )}

                      {/* {user?.permissions &&
                      (permission(
                        user.permissions,
                        "products_category",
                        "delete"
                      ) ||
                        user.user_type_id == 1) ? (
                        <>
                          <i
                            className="fas fa-trash cursor-pointer ml-2 text-red-600"
                            // onClick={onOpenDeleteModal}
                            onClick={() => {
                            deleteCategory(item.id);
                          }}
                          ></i>

                           
                        </>
                      ) : (
                        ""
                      )} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <div className="card-footer">
                        <div className="flex flex-col justify-between md:flex-row items-center w-full">
                            <p>Showing <b>{categories.from} - {categories.to}</b> from <b>{categories.total}</b> data</p>

                            <div className="flex items-center">
                                <Pagination sellers={categories} setUpdate={updatePage} />
                            </div>
                        </div>
                    </div> */}
        </div>
      </div>

      {/* <Modal open={open} onClose={onCloseModal} center>
                <h2>Simple centered modal</h2>
            </Modal> */}
      <CreateCategoryModal open={open} setOpen={setOpen} />
      <UpdateCategoryModal
        updateModal={updateModal}
        setUpdateModal={setUpdateModal}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
      />

    </>
  );
}
