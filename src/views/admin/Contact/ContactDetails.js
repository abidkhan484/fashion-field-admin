import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ContactDetails = () => {
    const { token } = useSelector((state) => state.auth);
  let { id } = useParams();

  let history = useHistory();

  const [contact,setContact] = useState({})

  const fetchContact = (id) => {
    axios
      .get(`/contacts/${id}`, {
        headers: {
            Accept:"application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        setContact(response.data);
        // console.log(response.data);
      })
      .catch((errors) => {
        console.log(errors.response);
      });
  };


  React.useEffect(() => {
    if (token != "") {
        fetchContact(id);
    }
  }, [token]);

  console.log("🏆",contact);

    return (
        <div className="px-8 mt-8 mb-8">
      <div className="page-heading">
        <h1 className="pageHeading">Contact Details</h1>
        <div className="flex"></div>
      </div>
      <div className="card">
        <div className="border-b">
          <div className="card-header">
            <div>
                <h4 className="pageHeading">Contact Details</h4>
            </div>
          </div>
        </div>
        <div className="card-body overflow-x-auto">
          <div className="grid grid-cols-12">
            <div className="col-span-4 flex items-center">
              <label htmlFor="name" className="font-bold" >
                Name
              </label>
            </div>
            <div className="col-span-8">
                <p className="">{contact.name}</p>
            </div>
          </div>
          <div className="grid grid-cols-12 mt-5">
            <div className="col-span-4 flex items-center">
              <label htmlFor="name" className="font-bold">
                Email
              </label>
            </div>
            <div className="col-span-8">
                <p className="">{contact.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-12 mt-5">
            <div className="col-span-4 flex items-center">
              <label htmlFor="name" className="font-bold">
                Phone
              </label>
            </div>
            <div className="col-span-8">
                <p className="">{contact.phone}</p>
            </div>
          </div>

       

          <div className="grid grid-cols-12 mt-5">
            <div className="col-span-4 flex items-center">
              <label htmlFor="description" className="font-bold">
                Subject
              </label>
            </div>
            <div className="col-span-8">
            <p className="">{contact.subject}</p>
            </div>
          </div>

          <div className="grid grid-cols-12 mt-5">
            <div className="col-span-4 flex items-center">
              <label htmlFor="description" className="font-bold">
                Details
              </label>
            </div>
            <div className="col-span-8">
            <p className="">{contact.details}</p>
            </div>
          </div>
        </div>
      </div>
 
    </div>
    )
}

export default ContactDetails
