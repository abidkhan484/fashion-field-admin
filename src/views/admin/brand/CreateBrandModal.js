import React, { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import axios from 'axios'
import { useSelector } from "react-redux"
import Alert from 'core/Alert'

const CreateBrandModal = props => {

    const { open, setOpen } = props
    const [brandName, setBrandName] = useState("")
    const [logo,setLogo] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({})
    const { token } = useSelector(state => state.auth);

    const onClose = () => {
        setOpen(prevState => !prevState)
        setStatus({})
        setBrandName("")
    }

    const handleAddingBrand = () => {
        setLoading(true)
        let formdata = new FormData();
        formdata.append('name', brandName)
        formdata.append('logo', logo)
        axios.post("/brands",formdata,
            
            {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            })
            .then(response => {
                console.log(response)
                setStatus({
                    type: 'SUCCESS',
                    message: "Value is Added in Brand List.",
                })
                setBrandName("")
                setLoading(false)
            })
            .catch(errors => {
                setStatus({
                    type: 'DANGER',
                    message: "Please Try again. Network issue has occoured"
                })
                setLoading(false)
            })
    }

    const handleAddingThumbnail = (e)=>{
        const [file] = e.target.files

        if (file) {
            setLogo(file)   
        }
    }

    return (
      <Modal open={open} onClose={onClose} blockScroll={false}>
        <div style={{ width: 500 }}>
          <p className="pageHeading mt-4">Enter Brand Name: </p>
          <input
            type="text"
            className="createFromInputField mt-4"
            onChange={(e) => setBrandName(e.target.value)}
            value={brandName}
          />
          <div className='mt-5'>
            <label
              htmlFor="thumbnail"
              className="w-full h-10 flex items-center border-1 rounded-tl rounded-bl"
            >
              <div className="px-6 h-full bg-browseBG createFromInputLabel flex items-center">
                Browse
              </div>
            
                <p className="createFromInputLabel ml-10">Image Selected</p>
             
            </label>
            <input
              id="thumbnail"
              onChange={(e) => handleAddingThumbnail(e)}
              type="file"
              className="hidden"
            />
            <p className="text-sm">Image size: 1200x1480</p>
          </div>
          {/* <div className="w-full mt-4">
              <div className="relative w-28 h-28 border-1 p-2">
                <button
                //   onClick={removeThumbnail}
                  className="bg-red-600 text-white p-1 rounded-full absolute -right-3 -top-3 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <img
                  className="w-full h-full"
                //   src={thumbnailPreview}
                  alt="..."
                />
              </div>
            </div> */}
          {/* {errorStatus && (
            <p className="text-red-500 font-Poppins font-medium text-xs">
              {errorStatus.thumbnail}
            </p>
          )} */}

          {loading ? (
            <button
              className="button button-primary flex items-center mt-4 w-20"
              disabled
              style={{ marginLeft: 0 }}
            >
              {" "}
              <span className="fas fa-sync-alt mr-2 py-1 animate-spin"></span>
            </button>
          ) : (
            <button
              className="button button-primary mt-4 w-20"
              style={{ marginLeft: 0 }}
              onClick={handleAddingBrand}
            >
              Add
            </button>
          )}
          <Alert
            status={status?.type}
            type={status?.type}
            changeStatus={() => setStatus()}
            message={status?.message}
            margin="mt-4"
          />
        </div>
      </Modal>
    );
}

export default CreateBrandModal
