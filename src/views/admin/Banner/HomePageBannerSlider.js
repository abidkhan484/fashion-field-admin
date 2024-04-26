import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { permission } from "helper/permission";
const HomePageBannerSlider = () => {
  const { token, user } = useSelector((state) => state.auth);

  let history = useHistory();

  const [sliders, setSliders] = React.useState([]);
  const [banners, setBanners] = React.useState([]);
  const [link, setLink] = React.useState("")

  const [bannerSecOneImage, setBannerSecOneImage] = useState("");
  const [bannerSecTwoImage1Lg, setbannerSecTwoImage1Lg] = useState("");
  const [bannerSecTwoImage2sm, setbannerSecTwoImage2sm] = useState("");
  const [bannerSecTwoImage3sm, setbannerSecTwoImage3sm] = useState("");
  const [bannerSecTwoImage4sm, setbannerSecTwoImage4sm] = useState("");
  const [bannerSecTwoImage5sm, setbannerSecTwoImage5sm] = useState("");
  const [bannerSecThreeImage1, setbannerSecThreeImage1] = useState("");
  const [bannerSecThreeImage2, setbannerSecThreeImage2] = useState("");
  const [bannerSecThreeImage3, setbannerSecThreeImage3] = useState("");
  const [silderImage, setSilderImage] = useState("");

  const [bannerseconelink, setBannerseconelink] = useState("")
  const [bannersectwo1lglink, setBannersectwo1lglink] = useState("")
  const [bannersectwo2smlink, setBannersectwo2smlink] = useState("")
  const [bannersectwo3smlink, setBannersectwo3smlink] = useState("")
  const [bannersectwo4smlink, setBannersectwo4smlink] = useState("")
  const [bannersectwo5smlink, setBannersectwo5smlink] = useState("")
  const [bannersecthree1link, setBannersecthree1link] = useState("")
  const [bannersecthree2link, setBannersecthree2link] = useState("")
  const [bannersecthree3link, setBannersecthree3link] = useState("")

  const [sectionOneImage, setSectionOneImage] = useState("");

  const [mobileSliderLink, setMobileSliderLink] = useState("")
  const [mobileSliderImage, setMobileSliderImage] = useState("")
  const [mobileSliders, setMobileSliders] = useState([])

  const fetchMobileSliderData = () => {
    axios
      .get("/homepageMobileSlider", {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        setMobileSliders(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  const handleMobileSliderDelete = id => {
    console.log(id);
    if (!window.confirm('Are you want to do it?'))
      return false;
    if (token != "") {
      axios
        .delete(`/homepageMobileSlider/${id}`, {
          headers: {
            Authorization: token,
            Accept: "application/json",
          },
        })
        .then((response) => {
          fetchMobileSliderData();
        })
        .catch((errors) => {
          console.log(errors.response);
        });
    }
  }

  const handleMobileSliderUpload = () => {
    const formData = new FormData();
    formData.append("image", mobileSliderImage);
    formData.append("link", mobileSliderLink);

    axios
      .post("homepageMobileSlider", formData, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((res) => {
        console.log("Successfully uploaded");
        fetchMobileSliderData();
        setMobileSliderImage("");
        setMobileSliderLink("");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const [mobileTopSliderLink, setMobileTopSliderLink] = useState("")
  const [mobileTopSliderImage, setMobileTopSliderImage] = useState("")
  const [mobileTopSliders, setMobileTopSliders] = useState([])

  const fetchMobileTopSliders = () => {
    axios
      .get("/homepageTopSlider", {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        setMobileTopSliders(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  const handleMobileTopSliderDelete = id => {
    console.log(id);
    if (!window.confirm('Are you want to do it?'))
      return false;
    if (token != "") {
      axios
        .delete(`/homepageTopSlider/${id}`, {
          headers: {
            Authorization: token,
            Accept: "application/json",
          },
        })
        .then((response) => {
          fetchMobileTopSliders();
        })
        .catch((errors) => {
          console.log(errors.response);
        });
    }
  }

  const handleMobileTopSliderUpload = () => {
    const formData = new FormData();
    formData.append("image", mobileTopSliderImage);
    formData.append("link", mobileTopSliderLink);

    axios
      .post("homepageTopSlider", formData, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((res) => {
        console.log("Successfully uploaded");
        fetchMobileTopSliders();
        setMobileTopSliderImage("");
        setMobileTopSliderLink("");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const [mobileViewMainBannerLink, setMobileViewMainBannerLink] = useState("")
  const [mobileViewMainBannerImage, setMobileViewMainBannerImage] = useState("")
  const [mobileViewMainBanners, setMobileViewMainBanners] = useState([])

  const fetchMobileViewMainBanner = () => {
    axios
      .get("/homepageMainBanner", {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        setMobileViewMainBanners(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  const handleMobileViewMainBannerDelete = id => {
    console.log(id);
    if (!window.confirm('Are you want to do it?'))
      return false;
    if (token != "") {
      axios
        .delete(`/homepageMainBanner/${id}`, {
          headers: {
            Authorization: token,
            Accept: "application/json",
          },
        })
        .then((response) => {
          fetchMobileViewMainBanner();
        })
        .catch((errors) => {
          console.log(errors.response);
        });
    }
  }

  const handleMobileViewMainBannerUpload = () => {
    const formData = new FormData();
    formData.append("image", mobileViewMainBannerImage);
    formData.append("link", mobileViewMainBannerLink);

    axios
      .post("homepageMainBanner", formData, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((res) => {
        console.log("Successfully uploaded");
        fetchMobileViewMainBanner();
        setMobileViewMainBannerImage("");
        setMobileViewMainBannerLink("");
      })
      .catch((err) => {
        console.log(err.message);
      });

  }

  React.useEffect(() => {
    if (user?.permissions) {
      if (
        !permission(user.permissions, "banner_homepage", "access") &&
        user.user_type_id != 1
      )
        history.push("/admin");
    }
  }, [user]);

  const fetchSlider = () => {
    axios
      .get("/homePageSlider", {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        setSliders(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const fetchBanner = () => {
    axios
      .get("/homePageBanner", {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        console.log("🍂", response.data);
        setBanners(response.data);
        setBannerseconelink(response.data[0].bannerseconelink);
        setBannersectwo1lglink(response.data[0].bannersectwo1lglink);
        setBannersectwo2smlink(response.data[0].bannersectwo2smlink);
        setBannersectwo3smlink(response.data[0].bannersectwo3smlink);
        setBannersectwo4smlink(response.data[0].bannersectwo4smlink);
        setBannersectwo5smlink(response.data[0].bannersectwo5smlink);
        setBannersecthree1link(response.data[0].bannersecthree1link);
        setBannersecthree2link(response.data[0].bannersecthree2link);
        setBannersecthree3link(response.data[0].bannersecthree3link);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleBannerDelete = (id) => {
    console.log(id);
    if (!window.confirm('Are you want to do it?'))
      return false;
    if (token != "") {
      axios
        .delete(`/homePageBanner/${id}`, {
          headers: {
            Authorization: token,
            Accept: "application/json",
          },
        })
        .then((response) => {
          fetchBanner();
        })
        .catch((errors) => {
          console.log(errors.response);
        });
    }
  };
  const handleSliderDelete = (id) => {
    console.log(id);
    if (!window.confirm('Are you want to do it?'))
      return false;
    if (token != "") {
      axios
        .delete(`/homePageSlider/${id}`, {
          headers: {
            Authorization: token,
            Accept: "application/json",
          },
        })
        .then((response) => {
          fetchSlider();
        })
        .catch((errors) => {
          console.log(errors.response);
        });
    }
  };

  const uploadHandler = () => {
    const formData = new FormData();

    formData.append("bannerSecOneImage", bannerSecOneImage);
    formData.append("bannerSecTwoImage1Lg", bannerSecTwoImage1Lg);
    formData.append("bannerSecTwoImage2sm", bannerSecTwoImage2sm);
    formData.append("bannerSecTwoImage3sm", bannerSecTwoImage3sm);
    formData.append("bannerSecTwoImage4sm", bannerSecTwoImage4sm);
    formData.append("bannerSecTwoImage5sm", bannerSecTwoImage5sm);
    formData.append("bannerSecThreeImage1", bannerSecThreeImage1);
    formData.append("bannerSecThreeImage2", bannerSecThreeImage2);
    formData.append("bannerSecThreeImage3", bannerSecThreeImage3);
    formData.append("bannerseconelink", bannerseconelink);
    formData.append("bannersectwo1lglink", bannersectwo1lglink);
    formData.append("bannersectwo2smlink", bannersectwo2smlink);
    formData.append("bannersectwo3smlink", bannersectwo3smlink);
    formData.append("bannersectwo4smlink", bannersectwo4smlink);
    formData.append("bannersectwo5smlink", bannersectwo5smlink);
    formData.append("bannersecthree1link", bannersecthree1link);
    formData.append("bannersecthree2link", bannersecthree2link);
    formData.append("bannersecthree3link", bannersecthree3link);


    axios
      .post("homePageBanner", formData, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((res) => {
        setBannerSecOneImage("");
        setbannerSecTwoImage1Lg("");
        setbannerSecTwoImage2sm("");
        setbannerSecTwoImage3sm("");
        setbannerSecTwoImage4sm("");
        setbannerSecTwoImage5sm("");
        setbannerSecThreeImage1("");
        setbannerSecThreeImage2("");
        setbannerSecThreeImage3("");
        console.log("Successfully uploaded");
        fetchBanner();
      })
      .catch((err) => {
        console.log(err.message);
      });
    console.log("new");
  };

  const uploadSliderHandler = () => {
    const formData = new FormData();
    formData.append("image", silderImage);
    formData.append("link", link);

    axios
      .post("homePageSlider", formData, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((res) => {
        console.log("Successfully uploaded");
        fetchSlider();
        setSilderImage("");
        setLink("");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const sectionOne = () => {
    axios
      .get(`homePageBanner/section-one`, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response);
        setSectionOneImage(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  React.useEffect(() => {
    if (token != "") {
      fetchSlider();
      fetchBanner();
      sectionOne();
      fetchMobileSliderData()
      fetchMobileTopSliders()
      fetchMobileViewMainBanner()
    }
  }, [token]);

  const removeItem = (column) => {
    // console.log(column);

    if (!window.confirm('Are you want to do it?'))
      return false;
    axios
      .delete(`homePageBanner/${column}`, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <>
      <div className="px-8 mt-8 mb-8">
        <div className="page-heading">
          <h1 className="pageHeading">HomePage Banners and Sliders</h1>
          <div className="flex"></div>
        </div>

        <div className="w-full">
          <div className="card mb-5">
            <div className="border-b">
              <div className="card-header">
                <div>
                  <h4 className="pageHeading">Sliders</h4>
                </div>
              </div>
            </div>
            <div className="card-body ">
              <div className="w-full ">
                <table className="w-full">
                  {/* <thead>
                                  <tr className="border-b h-12">
                                      <th>Id</th>
                                      <th>image</th>
                                      <th>Action</th>
                                  </tr>
                              </thead> */}
                  <tbody>
                    {/* {sliders?.map((slider, index) => (
                                      <tr key={index} className="h-12 border-b">
                                          
                                          <td><p className="">{slider.id}</p></td>
                                          <td><img src={slider.image} alt={slider.id} className='w-1/6'/></td>
                                         
                                          <td>
                                            
                                              <button  onClick={()=>handleSliderDelete(slider.id)}> <i className="fas fa-trash ml-4 cursor-pointer" style={{ color: "red" }}></i></button>
                                          </td>
                                      </tr>
                                  ))}
                                   */}
                    <tr>
                      <td className="w-1/6">HomePage Slider</td>
                      <td className="">
                        <p className="text-sm">Link</p>
                        <input
                          type="text"
                          name="link"
                          id="link"
                          value={link}
                          onChange={(e) => {
                            setLink(e.target.value)
                          }}
                        />

                      </td>
                      <td className>
                        <input
                          type="file"
                          name="image"
                          id="image"
                          className="mt-6"

                          onChange={(e) => {
                            setSilderImage(e.target.files[0]);
                          }}
                        />
                        <p className="text-sm">Image size: 1920x580</p>
                      </td>
                      <td>
                        <div className="flex flex-wrap">
                          {sliders?.map((slider, index) => (
                            <div key={index} className="w-40 mr-8">
                              <img src={slider.image} alt={slider.id} />
                              <div
                                onClick={() => handleSliderDelete(slider.id)}
                              >
                                <i
                                  className="fas fa-trash ml-4 cursor-pointer"
                                  style={{ color: "red" }}
                                ></i>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                    {user?.permissions &&
                      (permission(
                        user.permissions,
                        "banner_homepage",
                        "create"
                      ) ||
                        user.user_type_id == 1) ? (
                      <Link
                        className="button button-outline-primary w-1/3 px-4 mt-6"
                        onClick={uploadSliderHandler}
                      >
                        Update
                      </Link>
                    ) : (
                      ""
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer"></div>
          </div>



          <div className="card mb-5">
            <div className="border-b">
              <div className="card-header">
                <div>
                  <h4 className="pageHeading">Home Page Mobile View (Top Slider)</h4>
                </div>
              </div>
            </div>
            <div className="card-body ">
              <div className="w-full ">
                <table className="w-full">
                  <tbody>

                    <tr>
                      <td className="w-1/6">Mobile View Sliders</td>
                      <td className="">
                        <p className="text-sm">Link</p>
                        <input
                          type="text"
                          name="link"
                          id="link"
                          value={mobileSliderLink}
                          onChange={(e) => {
                            setMobileSliderLink(e.target.value)
                          }}
                        />

                      </td>
                      <td className>
                        <input
                          type="file"
                          name="image"
                          id="image"
                          className="mt-6"

                          onChange={(e) => {
                            setMobileSliderImage(e.target.files[0]);
                          }}
                        />
                        <p className="text-sm">Image size: 375x653</p>
                      </td>
                      <td>
                        <div className="flex flex-wrap">
                          {mobileSliders?.map((slider, index) => (
                            <div key={index} className="w-40 mr-8">
                              <img src={slider.image} alt={slider.id} />
                              <div
                                onClick={() => handleMobileSliderDelete(slider.id)}
                              >
                                <i
                                  className="fas fa-trash ml-4 cursor-pointer"
                                  style={{ color: "red" }}
                                ></i>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                    {user?.permissions &&
                      (permission(
                        user.permissions,
                        "banner_homepage",
                        "create"
                      ) ||
                        user.user_type_id == 1) ? (
                      <Link
                        className="button button-outline-primary w-1/3 px-4 mt-6"
                        onClick={handleMobileSliderUpload}
                      >
                        Update
                      </Link>
                    ) : (
                      ""
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer"></div>
          </div>




          <div className="card mb-5">
            <div className="border-b">
              <div className="card-header">
                <div>
                  <h4 className="pageHeading">Home Page Mobile View (Category Banner)</h4>
                </div>
              </div>
            </div>
            <div className="card-body ">
              <div className="w-full ">
                <table className="w-full">
                  <tbody>

                    <tr>
                      <td className="w-1/6">Mobile View Top Sliders</td>
                      <td className="">
                        <p className="text-sm">Link</p>
                        <input
                          type="text"
                          name="link"
                          id="link"
                          value={mobileTopSliderLink}
                          onChange={(e) => {
                            setMobileTopSliderLink(e.target.value)
                          }}
                        />

                      </td>
                      <td className>
                        <input
                          type="file"
                          name="image"
                          id="image"
                          className="mt-6"

                          onChange={(e) => {
                            setMobileTopSliderImage(e.target.files[0]);
                          }}
                        />
                        <p className="text-sm">Image size: 108x127</p>
                      </td>
                      <td>
                        <div className="flex flex-wrap">
                          {mobileTopSliders?.map((slider, index) => (
                            <div key={index} className="w-40 mr-8">
                              <img src={slider.image} alt={slider.id} />
                              <div
                                onClick={() => handleMobileTopSliderDelete(slider.id)}
                              >
                                <i
                                  className="fas fa-trash ml-4 cursor-pointer"
                                  style={{ color: "red" }}
                                ></i>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                    {user?.permissions &&
                      (permission(
                        user.permissions,
                        "banner_homepage",
                        "create"
                      ) ||
                        user.user_type_id == 1) ? (
                      <Link
                        className="button button-outline-primary w-1/3 px-4 mt-6"
                        onClick={handleMobileTopSliderUpload}
                      >
                        Update
                      </Link>
                    ) : (
                      ""
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer"></div>
          </div>



          <div className="card mb-5">
            <div className="border-b">
              <div className="card-header">
                <div>
                  <h4 className="pageHeading">Home Page Mobile View (Offer Zone)</h4>
                </div>
              </div>
            </div>
            <div className="card-body ">
              <div className="w-full ">
                <table className="w-full">
                  <tbody>

                    <tr>
                      <td className="w-1/6">Mobile View Main Banners</td>
                      <td className="">
                        <p className="text-sm">Link</p>
                        <input
                          type="text"
                          name="link"
                          id="link"
                          value={mobileViewMainBannerLink}
                          onChange={(e) => {
                            setMobileViewMainBannerLink(e.target.value)
                          }}
                        />

                      </td>
                      <td className>
                        <input
                          type="file"
                          name="image"
                          id="image"
                          className="mt-6"

                          onChange={(e) => {
                            setMobileViewMainBannerImage(e.target.files[0]);
                          }}
                        />
                        <p className="text-sm">Image size: 375x340</p>
                      </td>
                      <td>
                        <div className="flex flex-wrap">
                          {mobileViewMainBanners?.map((slider, index) => (
                            <div key={index} className="w-40 mr-8">
                              <img src={slider.image} alt={slider.id} />
                              <div
                                onClick={() => handleMobileViewMainBannerDelete(slider.id)}
                              >
                                <i
                                  className="fas fa-trash ml-4 cursor-pointer"
                                  style={{ color: "red" }}
                                ></i>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                    {user?.permissions &&
                      (permission(
                        user.permissions,
                        "banner_homepage",
                        "create"
                      ) ||
                        user.user_type_id == 1) ? (
                      <Link
                        className="button button-outline-primary w-1/3 px-4 mt-6"
                        onClick={handleMobileViewMainBannerUpload}
                      >
                        Update
                      </Link>
                    ) : (
                      ""
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer"></div>
          </div>







          <div className="card mt-5">
            <div className="border-b">
              <div className="card-header">
                <div>
                  <h4 className="pageHeading">Banners</h4>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3  gap-6">
              <div className="mt-5">
                <div className="h-32 flex items-center">
                  <p className="mb-1 ">Banner Section One</p>
                </div>
                <p className="mb-1 h-32 flex items-center">
                  Banner Section Two (Large)
                </p>
                <p className="mb-1 h-32 flex items-center">
                  Banner Section Two (Small)
                </p>
                <p className="mb-1 h-32 flex items-center">
                  Banner Section Two (Small)
                </p>
                <p className="mb-1 h-32 flex items-center">
                  Banner Section Two (Small)
                </p>
                <p className="mb-1 h-32 flex items-center">
                  Banner Section Two (Small)
                </p>
                <p className="mb-1 h-32 flex items-center">
                  Banner Section Three
                </p>
                <p className="mb-1 h-32 flex items-center">
                  Banner Section Three
                </p>
                <p className="mb-1 h-32 flex items-center">
                  Banner Section Three
                </p>
              </div>

              <div className="mt-5">
                <div className="h-32 flex-wrap items-center">
                  <input
                    type="file"
                    name="bannerSecOneImage"
                    id="bannerSecOneImage"
                    onChange={(e) => {
                      setBannerSecOneImage(e.target.files[0]);
                    }}
                  />
                  <p className="text-sm">Image size: 1170x200</p>
                  <div className="">

                    <input
                      type="text"
                      name="bannerseconelink"
                      id="bannerseconelink"
                      className="ml-2 mt-2"
                      value={bannerseconelink}
                      onChange={(e) => {
                        setBannerseconelink(e.target.value);
                      }}
                    />
                    <label htmlFor="bannerseconelink">(Link)</label>
                  </div>
                </div>
                <div className="mb-1 h-32 flex-wrap items-center">
                  <input
                    type="file"
                    name="bannerSecTwoImage1Lg"
                    id="bannerSecTwoImage1Lg"
                    onChange={(e) => {
                      setbannerSecTwoImage1Lg(e.target.files[0]);
                    }}
                  />
                  <p className="text-sm">Image size: 562x454</p>
                  <div className="">
                    <input
                      type="text"
                      name="bannersectwo1lglink"
                      id="bannersectwo1lglink"
                      className="ml-2 mt-2"
                      value={bannersectwo1lglink}
                      onChange={(e) => {
                        setBannersectwo1lglink(e.target.value);
                      }}
                    />
                    <label htmlFor="bannersectwo1lglink">(Link)</label>
                  </div>
                </div>

                <div className="mb-1 h-32 flex-wrap items-center">
                  <input
                    type="file"
                    name="bannerSecTwoImage2sm"
                    id="bannerSecTwoImage2sm"

                    onChange={(e) => {
                      setbannerSecTwoImage2sm(e.target.files[0]);
                    }}
                  />
                  <p className="text-sm">Image size: 281x215</p>

                  <div className="">

                    <input
                      type="text"
                      name="bannersectwo2smlink"
                      id="bannersectwo2smlink"
                      className="ml-2 mt-2"
                      value={bannersectwo2smlink}
                      onChange={(e) => {
                        setBannersectwo2smlink(e.target.value);
                      }}
                    />
                    <label htmlFor="bannersectwo2smlink">(Link)</label>
                  </div>
                </div>
                <div className="mb-1 h-32 flex-wrap items-center">
                  <input
                    type="file"
                    name="bannerSecTwoImage3sm"
                    id="bannerSecTwoImage3sm"
                    onChange={(e) => {
                      setbannerSecTwoImage3sm(e.target.files[0]);
                    }}
                  />
                  <p className="text-sm">Image size: 281x215</p>
                  <div className="">

                    <input
                      type="text"
                      name="bannersectwo3smlink"
                      id="bannersectwo3smlink"
                      className="ml-2 mt-2"
                      value={bannersectwo3smlink}
                      onChange={(e) => {
                        setBannersectwo3smlink(e.target.value);
                      }}
                    />
                    <label htmlFor="bannersectwo3smlink">(Link)</label>
                  </div>
                </div>

                <div className="mb-1 h-32 flex-wrap items-center">
                  <input
                    type="file"
                    name="bannerSecTwoImage4sm"
                    id="bannerSecTwoImage4sm"
                    onChange={(e) => {
                      setbannerSecTwoImage4sm(e.target.files[0]);
                    }}
                  />
                  <p className="text-sm">Image size: 281x215</p>

                  <div className="">
                    <input
                      type="text"
                      name="bannersectwo4smlink"
                      id="bannersectwo4smlink"
                      className="ml-2 mt-2"
                      value={bannersectwo4smlink}
                      onChange={(e) => {
                        setBannersectwo4smlink(e.target.value);
                      }}
                    />
                  </div>
                  <label htmlFor="bannersectwo4smlink">(Link)</label>
                </div>

                <div className="mb-1 h-32 flex-wrap items-center">
                  <input
                    type="file"
                    name="bannerSecTwoImage5sm"
                    id="bannerSecTwoImage5sm"
                    onChange={(e) => {
                      setbannerSecTwoImage5sm(e.target.files[0]);
                    }}
                  />
                  <p className="text-sm">Image size: 281x215</p>

                  <div className="">

                    <input
                      type="text"
                      name="bannersectwo5smlink"
                      id="bannersectwo5smlink"
                      className="ml-2 mt-2"
                      value={bannersectwo5smlink}
                      onChange={(e) => {
                        setBannersectwo5smlink(e.target.value);
                      }}
                    />
                    <label htmlFor="bannersectwo5smlink">(Link)</label>
                  </div>
                </div>
                <div className="mb-1 h-32 flex-wrap items-center">
                  <input
                    type="file"
                    name="bannerSecThreeImage1"
                    id="bannerSecThreeImage1"
                    onChange={(e) => {
                      setbannerSecThreeImage1(e.target.files[0]);
                    }}
                  />
                  <p className="text-sm">Image size: 370x200</p>
                  <div className="">

                    <input
                      type="text"
                      name="bannersecthree1link"
                      id="bannersecthree1link"
                      className="ml-2 mt-2"
                      value={bannersecthree1link}
                      onChange={(e) => {
                        setBannersecthree1link(e.target.value);
                      }}
                    />
                    <label htmlFor="bannersecthree1link">(Link)</label>
                  </div>
                </div>
                <div className="mb-1 h-32 flex-wrap items-center">
                  <input
                    type="file"
                    name="bannerSecThreeImage2"
                    id="bannerSecThreeImage2"
                    onChange={(e) => {
                      setbannerSecThreeImage2(e.target.files[0]);
                    }}
                  />
                  <p className="text-sm">Image size: 370x200</p>

                  <div className="">

                    <input
                      type="text"
                      name="bannersecthree2link"
                      id="bannersecthree2link"
                      className="ml-2 mt-2"
                      value={bannersecthree2link}
                      onChange={(e) => {
                        setBannersecthree2link(e.target.value);
                      }}
                    />
                    <label htmlFor="bannersecthree2link">(Link)</label>
                  </div>
                </div>

                <div className="mb-1 h-32 flex-wrap items-center">
                  <input
                    type="file"
                    name="bannerSecThreeImage3"
                    id="bannerSecThreeImage3"

                    onChange={(e) => {
                      setbannerSecThreeImage3(e.target.files[0]);
                    }}
                  />
                  <p className="text-sm">Image size: 370x200</p>
                  <div className="">
                    <input
                      type="text"
                      name="bannersecthree3link"
                      id="bannersecthree3link"
                      className="ml-2 mt-2"
                      value={bannersecthree3link}
                      onChange={(e) => {
                        setBannersecthree3link(e.target.value);
                      }}
                    />
                    <label htmlFor="bannersecthree3link">(Link)</label>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                {/* {
                                        banners[0] && Object.values(banners[0]).map((item, index)=>(
                                            <div className='mb-1 h-32 flex items-center'>
                                                <p key={index}><img src={item} alt={item.id} className='w-1/2'/></p>
                                                <button onClick={() => removeItem(item)}>Remove</button> 
                                            </div>
                                        ))
                                } */}
                <div className="mb-1 h-32 flex items-center">
                  {/* {sectionOneImage != '' ? (
                                    <>
                                    <p><img src={sectionOneImage.bannerSecOneImage} alt={sectionOneImage.bannerSecOneImage} className='w-1/2'/></p>
                                    <button onClick={() => removeItem('bannerSecOneImage')}>Remove</button> 
                                    </>
                                ) : ''} */}
                  {banners &&
                    banners.map((item, index) => (
                      <div className="mb-1 h-32 flex items-center">
                        <p key={index}>
                          <img
                            src={item.bannerSecOneImage}
                            alt={item.id}
                            className="w-1/2"
                          />
                        </p>
                        {user?.permissions &&
                          (permission(
                            user.permissions,
                            "banner_homepage",
                            "delete"
                          ) ||
                            user.user_type_id == 1) ? (
                          <button
                            onClick={() => removeItem("bannerSecOneImage")}
                          >
                            <i
                              className="fas fa-trash ml-4 cursor-pointer"
                              style={{ color: "red" }}
                            ></i>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
                <div className="mb-1 h-32 flex items-center">
                  {banners &&
                    banners.map((item, index) => (
                      <div className="mb-1 h-32 flex items-center">
                        <p key={index}>
                          <img
                            src={item.bannerSecTwoImage1Lg}
                            alt={item.id}
                            className="w-1/2"
                          />
                        </p>
                        {user?.permissions &&
                          (permission(
                            user.permissions,
                            "banner_homepage",
                            "delete"
                          ) ||
                            user.user_type_id == 1) ? (
                          <button
                            onClick={() => removeItem("bannerSecTwoImage1Lg")}
                          >
                            <i
                              className="fas fa-trash ml-4 cursor-pointer"
                              style={{ color: "red" }}
                            ></i>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
                <div className="mb-1 h-32 flex items-center">
                  {banners &&
                    banners.map((item, index) => (
                      <div className="mb-1 h-32 flex items-center">
                        <p key={index}>
                          <img
                            src={item.bannerSecTwoImage2sm}
                            alt={item.id}
                            className="w-1/2"
                          />
                        </p>
                        {user?.permissions &&
                          (permission(
                            user.permissions,
                            "banner_homepage",
                            "delete"
                          ) ||
                            user.user_type_id == 1) ? (
                          <button
                            onClick={() => removeItem("bannerSecTwoImage2sm")}
                          >
                            <i
                              className="fas fa-trash ml-4 cursor-pointer"
                              style={{ color: "red" }}
                            ></i>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
                <div className="mb-1 h-32 flex items-center">
                  {banners &&
                    banners.map((item, index) => (
                      <div className="mb-1 h-32 flex items-center">
                        <p key={index}>
                          <img
                            src={item.bannerSecTwoImage3sm}
                            alt={item.id}
                            className="w-1/2"
                          />
                        </p>
                        {user?.permissions &&
                          (permission(
                            user.permissions,
                            "banner_homepage",
                            "delete"
                          ) ||
                            user.user_type_id == 1) ? (
                          <button
                            onClick={() => removeItem("bannerSecTwoImage3sm")}
                          >
                            <i
                              className="fas fa-trash ml-4 cursor-pointer"
                              style={{ color: "red" }}
                            ></i>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
                <div className="mb-1 h-32 flex items-center">
                  {banners &&
                    banners.map((item, index) => (
                      <div className="mb-1 h-32 flex items-center">
                        <p key={index}>
                          <img
                            src={item.bannerSecTwoImage4sm}
                            alt={item.id}
                            className="w-1/2"
                          />
                        </p>
                        {user?.permissions &&
                          (permission(
                            user.permissions,
                            "banner_homepage",
                            "delete"
                          ) ||
                            user.user_type_id == 1) ? (
                          <button
                            onClick={() => removeItem("bannerSecTwoImage4sm")}
                          >
                            <i
                              className="fas fa-trash ml-4 cursor-pointer"
                              style={{ color: "red" }}
                            ></i>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
                <div className="mb-1 h-32 flex items-center">
                  {banners &&
                    banners.map((item, index) => (
                      <div className="mb-1 h-32 flex items-center">
                        <p key={index}>
                          <img
                            src={item.bannerSecTwoImage5sm}
                            alt={item.id}
                            className="w-1/2"
                          />
                        </p>
                        {user?.permissions &&
                          (permission(
                            user.permissions,
                            "banner_homepage",
                            "delete"
                          ) ||
                            user.user_type_id == 1) ? (
                          <button
                            onClick={() => removeItem("bannerSecTwoImage5sm")}
                          >
                            <i
                              className="fas fa-trash ml-4 cursor-pointer"
                              style={{ color: "red" }}
                            ></i>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
                <div className="mb-1 h-32 flex items-center">
                  {banners &&
                    banners.map((item, index) => (
                      <div className="mb-1 h-32 flex items-center">
                        <p key={index}>
                          <img
                            src={item.bannerSecThreeImage1}
                            alt={item.id}
                            className="w-1/2"
                          />
                        </p>
                        {user?.permissions &&
                          (permission(
                            user.permissions,
                            "banner_homepage",
                            "delete"
                          ) ||
                            user.user_type_id == 1) ? (
                          <button
                            onClick={() => removeItem("bannerSecThreeImage1")}
                          >
                            <i
                              className="fas fa-trash ml-4 cursor-pointer"
                              style={{ color: "red" }}
                            ></i>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>

                <div className="mb-1 h-32 flex items-center">
                  {banners &&
                    banners.map((item, index) => (
                      <div className="mb-1 h-32 flex items-center">
                        <p key={index}>
                          <img
                            src={item.bannerSecThreeImage2}
                            alt={item.id}
                            className="w-1/2"
                          />
                        </p>
                        {user?.permissions &&
                          (permission(
                            user.permissions,
                            "banner_homepage",
                            "delete"
                          ) ||
                            user.user_type_id == 1) ? (
                          <button
                            onClick={() => removeItem("bannerSecThreeImage2")}
                          >
                            <i
                              className="fas fa-trash ml-4 cursor-pointer"
                              style={{ color: "red" }}
                            ></i>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
                <div className="mb-1 h-32 flex items-center">
                  {banners &&
                    banners.map((item, index) => (
                      <div className="mb-1 h-32 flex items-center">
                        <p key={index}>
                          <img
                            src={item.bannerSecThreeImage3}
                            alt={item.id}
                            className="w-1/2 h-1/2"
                          />
                        </p>
                        {user?.permissions &&
                          (permission(
                            user.permissions,
                            "banner_homepage",
                            "delete"
                          ) ||
                            user.user_type_id == 1) ? (
                          <button
                            onClick={() => removeItem("bannerSecThreeImage3")}
                            className={
                              item.bannerSecThreeImage3 ? "" : "hidden"
                            }
                          >
                            <i
                              className="fas fa-trash ml-4 cursor-pointer"
                              style={{ color: "red" }}
                            ></i>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {user?.permissions &&
              (permission(user.permissions, "banner_homepage", "create") ||
                user.user_type_id == 1) ? (
              <Link
                className="button button-outline-primary w-1/3 px-4 mt-4"
                onClick={uploadHandler}
              >
                Update
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePageBannerSlider;
