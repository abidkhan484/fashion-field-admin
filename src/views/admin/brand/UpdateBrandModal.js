import React, { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import axios from 'axios'
import { useSelector } from "react-redux"
import Alert from 'core/Alert'
import { useHistory, useParams } from 'react-router-dom'
const UpdateBrandModal = props => {
    const { updateModal, setUpdateModal, brandId, setBrandId } = props
    let history = useHistory();

    const [brandName, setBrandName] = useState("")
    const [logo,setLogo] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({})
    const { token } = useSelector(state => state.auth);

    const onClose = () => {
        setUpdateModal(prevState => !prevState)
        setStatus({})
        setBrandName("")
        setBrandId(null)
    }

    useEffect(() => {
        console.log(brandName)
    }, [brandName])

    useEffect(() => {
        if (brandId != null) {
            axios.get(`/brands/${brandId}`, {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                console.log(response)
                setBrandName(response.data.name)
                
            }).catch(errors => {
                console.log(errors)
            })
        }
    }, [brandId])

    const handleAddingBrand = () => {
        setLoading(true)
        let formdata = new FormData();
        formdata.append('name', brandName)
        formdata.append('logo', logo)
        formdata.append('_method', 'PUT')
        axios.post(`/brands/${brandId}`,
             formdata,
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
                    message: response.data.message,
                })
                setBrandName("")
                setLoading(false)
                onClose()
            })
            .catch(errors => {
                setStatus({
                    type: 'DANGER',
                    message: errors.response?.data?.errors?.name[0]
                })
                setLoading(false)
                setBrandName("")
                console.log(errors.response)
            })
    }

    const handleAddingThumbnail = (e)=>{
        const [file] = e.target.files

        if (file) {
            setLogo(file)   
        }
    }


    return (
      <Modal open={updateModal} onClose={onClose} blockScroll={false}>
        <div style={{ width: 500 }}>
          <p className="pageHeading mt-4">Enter New Brand Name: </p>
          <input
            type="text"
            className="createFromInputField mt-4"
            onChange={(e) => setBrandName(e.target.value)}
            value={brandName}
          />
          <div className="mt-5">
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
              Update
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

export default UpdateBrandModal
