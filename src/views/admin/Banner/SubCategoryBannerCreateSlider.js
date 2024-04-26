import React from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { permission } from 'helper/permission';
const SubCategoryBannerCreateSlider = () => {
    const { token, user } = useSelector(state => state.auth)
    const [loading, setLoading] = React.useState(false);
    const [image, setImage] = React.useState('');
    const [subcategory, setsubCategory] = React.useState('');
    const [errors, setErrors] = React.useState([]);
    const [subcategories,setsubCategories] = React.useState([]);
    const [type,setType] = React.useState("");
    const [link,setLink] = React.useState("");
    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'banner_sub_category', 'create')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const fetchSlider = () => {
        axios.get('/subCategorySlider', {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log("💥🔥",response.data.subcategories);
            setsubCategories(response.data.subcategories);
        }).catch(error => {
            console.log(error.response);
        })
    }

    
    const uploadSliderHandler = ()=>{
        const formData = new FormData();
        formData.append('image',image);
        formData.append('subcategory_id',subcategory);
        formData.append('link',link);
        

        axios.post('subCategorySlider',formData,{ headers: {
            'Accept': 'application/json',
            'Authorization': token
        }})
        .then((res)=>{
            console.log("Successfully uploaded");
            history.push("/admin/subcategoryBanner");
            setImage("");
            fetchSlider();
        })
        .catch((err)=>{
            console.log(err.message);
        })
       
    }

    useEffect(()=>{
        fetchSlider();
    },[])
    console.log('🎡',subcategory);
    return (
      <div className="px-8 mt-8 mb-8">
        <div className="page-heading">
          <h1 className="pageHeading">Add New Slider</h1>
          <div className="flex"></div>
        </div>
        <div className="card">
          <div className="border-b">
            <div className="card-header">
              <div>
                <h4 className="pageHeading">Add Slider</h4>
              </div>
            </div>
          </div>
          <div className="card-body overflow-x-auto">
            <div className="w-full flex -mx-1">
              <div className="w-1/3 mx-1">
                <label htmlFor="category_id" className="createFromInputLabel">
                  Sub Category
                </label>

                <select
                  className="createFromInputField"
                  onChange={(e) => setsubCategory(e.target.value)}
                  name="subcategory_id"
                >
                  <option className="disabled">Select</option>
                  {subcategories?.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <p className="text-red-600 text-sm">{errors.subcategory}</p>
              </div>
              {/* <div className="w-1/3 mx-1">
                        <label htmlFor="contact" className="createFromInputLabel">Type</label>
                        <input type="text" onChange={(e) => setType(e.target.value)}  className="createFromInputField" name="type"/>
                        <p className="text-red-600 text-sm">{errors.contact}</p>
                    </div> */}
              <div className="w-1/3 mx-1">
                <label htmlFor="charge" className="createFromInputLabel">
                  Image
                </label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="createFromInputField"
                  name="image"
                />
                <p className="text-red-600 text-sm">{errors.image}</p>
                <p className="text-sm">Image size: 1920x430</p>
              </div>

              <div className="w-1/3 mx-1">
                <label htmlFor="link" className="createFromInputLabel">
                  Link
                </label>
                <input
                  type="text"
                  onChange={(e) => setLink(e.target.value)}
                  className="createFromInputField"
                  name="link"
                  id="link"
                />
                <p className="text-red-600 text-sm">{errors.link}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-8 mt-8 flex justify-end">
          {loading ? (
            <>
              <button className="button button-primary w-32" disabled>
                {" "}
                <span className="fas fa-sync-alt animate-spin"></span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={uploadSliderHandler}
                className="button button-primary w-32"
              >
                Create Slider
              </button>
            </>
          )}
        </div>
      </div>
    );
}

export default SubCategoryBannerCreateSlider
