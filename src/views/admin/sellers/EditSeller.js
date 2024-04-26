import axios from "axios";
import { AuthContext } from "context/AuthContext";
import slugify from "react-slugify";
import { SellerContext } from "context/SellerContext";
import { StyleContext } from "context/StyleContext";
import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import config from "config.json";
import { LoaderContext } from "context/LoaderContext";
import Alert from "core/Alert";
import { useSelector, useDispatch } from "react-redux";
import { setSellers } from "redux/sellers";
import { permission } from "helper/permission";
import Select from "react-select";

export default function EditSeller() {
    const dispatch = useDispatch();

    const [preivew, setPreview] = React.useState("");

    const [name, setName] = React.useState("");
    const [mobile, setMobile] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [logo, setLogo] = React.useState("");

    const [storeName, setStoreName] = React.useState("");
    const [storeCode, setStoreCode] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [description, setDescriptoin] = React.useState("");

    const [errors, setErrors] = React.useState({});

    const [loader, setloader] = React.useState(false);

    const [status, setStatus] = React.useState({});

    const [seller, setSeller] = React.useState({});

    const { sellers } = useSelector((state) => state.sellers);

    const [store, setStore] = React.useState({});

    const [checkSlug, setCheckSlug] = React.useState(false);
    const [slugStatus, setSlugStatus] = React.useState(true);

    const [registeredName, setRegisteredName] = useState("");
    const [registeredNameDoc, setRegisteredNameDoc] = useState(null);
    const [currentRegisteredNameDoc, setCurrentRegisteredNameDoc] =
        useState(null);

    const [incorporationNo, setIncorporationNo] = useState("");
    const [incorporationNoDoc, setIncorporationNoDoc] = useState(null);
    const [currentIncorporationNoDoc, setCurrentIncorporationNoDoc] =
        useState(null);

    const [tradeLicenseNumber, setTradeLicenseNumber] = useState("");
    const [tradeLicenseNumberDoc, setTradeLicenseNumberDoc] = useState(null);
    const [currentTradeLicenseNumberDoc, setCurrentTradeLicenseNumberDoc] =
        useState(null);

    const [vatRegistrationNumber, setVatRegistrationNumber] = useState("");
    const [vatRegistrationNumberDoc, setVatRegistrationNumberDoc] =
        useState(null);
    const [
        currentVatRegistrationNumberDoc,
        setCurrentVatRegistrationNumberDoc,
    ] = useState(null);

    const [eTin, setETin] = useState("");
    const [eTinDoc, setETinDoc] = useState(null);
    const [currentETinDoc, setCurrentETinDoc] = useState(null);

    const [eCabMembership, setECabMembership] = useState("");
    const [eCabMembershipDoc, setECabMembershipDoc] = useState(null);
    const [currentECabMembershipDoc, setCurrentECabMembershipDoc] =
        useState(null);

    const [basisMembership, setBasisMembership] = useState("");
    const [basisMembershipDoc, setBasisMembershipDoc] = useState(null);
    const [currentBasisMembershipDoc, setCurrentBasisMembershipDoc] =
        useState(null);

    const [bankInfo, setBankInfo] = useState("");
    const [address, setAddress] = useState("");
    const [purchaseMethod, setPurchaseMethod] = useState(null);

    const { token, user } = useSelector((state) => state.auth);

    const purchaseMethodOptions = [
        { value: "cash", label: "Cash" },
        { value: "credit", label: "Credit" },
    ];

    const { loading, setLoading } = React.useContext(LoaderContext);

    const history = useHistory();

    const { id } = useParams();

    React.useEffect(() => {
        if (user?.permissions) {
            // console.log(permission(user.permissions, 'seller_management', 'access'));
            if (
                !permission(user.permissions, "seller_management", "update") &&
                user.user_type_id != 1
            )
                history.push("/admin");
            // console.log('Not working');
        }
    }, [user]);

    const fetchSeller = () => {
        setLoading(true);

        if (token !== "") {
            axios
                .get(`/sellers/${id}`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    console.log(response);
                    setSeller(response.data);
                    setMobile(response.data.mobile);
                    setName(response.data.name);
                    setEmail(response.data.email);
                    // setPassword(response.data.password);
                    setStore(response.data?.store);
                    setStoreName(response.data.store?.name);
                    setStoreCode(response.data.store?.code);
                    setSlug(response.data.store?.slug);
                    setDescriptoin(response.data.store?.description);
                    setPreview(response.data.store?.logo);
                    setLogo(response.data.store?.logo);

                    setAddress(response.data.store?.address);
                    setBankInfo(response.data.store?.bank_info);
                    response.data.store?.purchase_method
                        ? setPurchaseMethod({
                              value: response.data.store?.purchase_method,
                              label: response.data.store?.purchase_method,
                          })
                        : setPurchaseMethod(null);

                    setBasisMembership(response.data?.basis_membership_no);
                    setECabMembership(response.data?.ecab_membership_no);
                    setETin(response.data?.etin_no);
                    setIncorporationNo(response.data?.incorporate_no);
                    setRegisteredName(response.data?.registered_name);
                    setTradeLicenseNumber(response.data?.trade_license_no);
                    setVatRegistrationNumber(
                        response.data?.vat_registration_no
                    );

                    setCurrentBasisMembershipDoc(response.data?.basis_docu);
                    setCurrentECabMembershipDoc(response.data?.ecab_docu);
                    setCurrentETinDoc(response.data?.etin_docu);
                    setCurrentIncorporationNoDoc(
                        response.data?.incorporate_docu
                    );
                    setCurrentRegisteredNameDoc(response.data?.registered_docu);
                    setCurrentTradeLicenseNumberDoc(
                        response.data?.trade_license_docu
                    );
                    setCurrentVatRegistrationNumberDoc(
                        response.data?.vat_reg_docu
                    );

                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error.response);
                    setLoading(false);
                    if (error.response.status === 404) {
                        history.push("/admin/sellers");
                    }
                });

            // if (sellers.data === undefined) {
            //     if (token !== '') {
            //         axios.get('/sellers', { headers: { Authorization: token } })
            //             .then(response => {
            //                 dispatch(setSellers(response.data))
            //             })
            //     }
            // }
        }
    };

    // React.u

    React.useEffect(() => {
        fetchSeller();
    }, [token]);

    React.useEffect(() => {}, [id]);

    React.useEffect(() => {
        setSlug(slugify(slug));
    }, [slug]);

    React.useEffect(() => {
        setSlug(slugify(storeName));
    }, [storeName]);

    const setImage = (e) => {
        const [file] = e.target.files;

        if (file) {
            setPreview(URL.createObjectURL(file));
            setLogo(file);
        } else {
            setLogo("");
        }
    };

    const removeImage = () => {
        setLogo("");
        setPreview("");
    };

    const getSlugResult = () => {
        if (slug !== "") {
            setCheckSlug(true);

            axios
                .get(`/sellers/check/${store?.id}/${slug}`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    setSlugStatus(response.data);
                    setCheckSlug(false);
                })
                .catch((error) => {
                    console.log(error.response);
                    setCheckSlug(false);
                });
        } else {
            setSlugStatus(false);
        }
    };

    const changeActication = () => {
        setLoading(true);

        axios
            .post(
                `/sellers/store/${store.id}/activation`,
                {
                    status: !store.status,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((response) => {
                console.log(store);
                setStore(response.data);
                console.log(response.data);

                // const letSeller = seller;
                // letSeller.store = response.data;

                // // console.log(letSeller);

                // let allSeller = { ...sellers };

                // console.log(allSeller);

                // allSeller = { name: false };

                // const index = allSeller.data.findIndex(item => item.id == id)

                // // console.log(letSeller);
                // // allSeller.data.splice(index, 0, letSeller);
                // // allSeller.data[index] = letSeller;

                // dispatch(setSellers(allSeller));

                setLoading(false);
            });
    };

    const updateSeller = (e) => {
        e.preventDefault();
        setLoading(true);
        setloader(true);
        const data = new FormData();

        data.append("name", name);
        data.append("mobile", mobile);
        data.append("email", email);
        data.append("password", password);

        data.append("logo", logo);
        data.append("store_name", storeName);
        data.append("code", storeCode);
        data.append("store_id", store.id);
        data.append("slug", slug);
        data.append("description", description);

        data.append("registered_name", registeredName);
        data.append("registered_docu", registeredNameDoc);

        data.append("incorporate_no", incorporationNo);
        data.append("incorporate_docu", incorporationNoDoc);

        data.append("trade_license_no", tradeLicenseNumber);
        data.append("trade_license_docu", tradeLicenseNumberDoc);

        data.append("vat_registration_no", vatRegistrationNumber);
        data.append("vat_reg_docu", vatRegistrationNumberDoc);

        data.append("etin_no", eTin);
        data.append("etin_docu", eTinDoc);

        data.append("ecab_membership_no", eCabMembership);
        data.append("ecab_docu", eCabMembershipDoc);

        data.append("basis_membership_no", basisMembership);
        data.append("basis_docu", basisMembershipDoc);

        data.append("address", address);
        data.append("bank_info", bankInfo);
        data.append("purchase_method", purchaseMethod?.value);

        data.append("_method", "put");

        axios
            .post(`/sellers/${id}`, data, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                console.log(response);
                // let newSeller = response.data;

                // const obj = sellers.data.findIndex(item => item.id == id);

                // const oldSellers = sellers;

                // oldSellers.data[obj] = newSeller;

                // setSellers(oldSellers);

                setStatus({
                    message: "Seller Updated Successfully!",
                    type: "SUCCESS",
                });

                setName("");
                setMobile("");
                setEmail("");
                setPassword("");
                setLogo("");
                setStoreName("");
                setSlug("");
                setDescriptoin("");
                setPreview("");
                // setSlugStatus(false);
                history.push("/admin/sellers");

                setLoading(false);
                setloader(false);
            })
            .catch((error) => {
                console.log(error);

                if (error.response?.status === 422) {
                    setStatus({
                        message: error.response.data.message,
                        type: "DANGER",
                    });
                    setErrors(error?.response?.data?.errors);
                }

                setLoading(false);
                setloader(false);
            });
    };

    useEffect(() => {
        console.log(status);
    }, [status]);

    // console.log(store.status)

    return (
        <div className="mb-8">
            <div className="px-8 mt-8 mb-4 flex justify-between">
                <p className="font-Poppins font-medium text-base text-pageHeading">
                    Update Seller
                </p>
                {store ? (
                    <>
                        {store?.status == true ? (
                            <button
                                onClick={() => changeActication()}
                                className="button button-danger w-36 font-semibold font-Poppins"
                            >
                                DEACTIVE STORE
                            </button>
                        ) : (
                            <button
                                onClick={() => changeActication()}
                                className="button button-success w-36 font-semibold font-Poppins"
                            >
                                ACTIVE STORE
                            </button>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </div>
            <Alert
                status={status?.type}
                type={status?.type}
                changeStatus={() => setStatus()}
                message={status?.message}
                width="w-1/2"
                margin="ml-8"
            />
            <div className="grid grid-cols-12 px-8 gap-8">
                <div className="col-span-8">
                    <div className="bg-white w-full shadow-md rounded-md">
                        <p className="py-4 border-b pl-8 font-Poppins font-medium text-base text-pageHeading">
                            Seller Information
                        </p>
                        <div className="pl-8 pr-20 pt-8 pb-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="name"
                                        className="createFromInputLabel"
                                    >
                                        Name
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="name"
                                        className="createFromInputField"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Name"
                                    />
                                    <p className="text-red-500 font-Poppins font-medium text-xs">
                                        {errors.name}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="mobile"
                                        className="createFromInputLabel"
                                    >
                                        Mobile Number
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="mobile"
                                        className="createFromInputField"
                                        value={mobile}
                                        onChange={(e) =>
                                            setMobile(e.target.value)
                                        }
                                        placeholder="Mobile Number"
                                    />
                                    <p className="text-red-500 font-Poppins font-medium text-xs">
                                        {errors.mobile}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="email"
                                        className="createFromInputLabel"
                                    >
                                        Email
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="email"
                                        id="email"
                                        className="createFromInputField"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Email"
                                    />
                                    <p className="text-red-500 font-Poppins font-medium text-xs">
                                        {errors.email}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="password"
                                        className="createFromInputLabel"
                                    >
                                        Password
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="password"
                                        id="password"
                                        className="createFromInputField"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Password"
                                    />
                                    <p className="text-red-500 font-Poppins font-medium text-xs">
                                        {errors.password}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="registered_name"
                                        className="createFromInputLabel"
                                    >
                                        Registered Name
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="registered_name"
                                        className="createFromInputField"
                                        value={registeredName}
                                        onChange={(e) =>
                                            setRegisteredName(e.target.value)
                                        }
                                        placeholder="Registered Name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="registered_name_document"
                                        className="createFromInputLabel"
                                    >
                                        Registered Name Document
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-8">
                                            <input
                                                type="file"
                                                id="registered_name_document"
                                                className="createFromInputField"
                                                onChange={(e) =>
                                                    setRegisteredNameDoc(
                                                        e.target.files[0]
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="col-span-4">
                                            <div className="flex justify-center items-center h-full">
                                                {currentRegisteredNameDoc ? (
                                                    <a
                                                        href={
                                                            currentRegisteredNameDoc
                                                        }
                                                        target="_blank"
                                                    >
                                                        Existing Document
                                                    </a>
                                                ) : (
                                                    <p>
                                                        No Documents Available
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="incorporation_no"
                                        className="createFromInputLabel"
                                    >
                                        Incorporation No
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="incorporation_no"
                                        className="createFromInputField"
                                        value={incorporationNo}
                                        onChange={(e) =>
                                            setIncorporationNo(e.target.value)
                                        }
                                        placeholder="Incorporation No"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="incorporation_no_document"
                                        className="createFromInputLabel"
                                    >
                                        Incorporation No Document
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-8">
                                            <input
                                                type="file"
                                                id="incorporation_no_document"
                                                className="createFromInputField"
                                                onChange={(e) =>
                                                    setIncorporationNoDoc(
                                                        e.target.files[0]
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="col-span-4">
                                            <div className="flex justify-center items-center h-full">
                                                {currentIncorporationNoDoc ? (
                                                    <a
                                                        href={
                                                            currentIncorporationNoDoc
                                                        }
                                                        target="_blank"
                                                    >
                                                        Existing Document
                                                    </a>
                                                ) : (
                                                    <p>
                                                        No Documents Available
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="trade_license_number"
                                        className="createFromInputLabel"
                                    >
                                        Trade License Number
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="trade_license_number"
                                        className="createFromInputField"
                                        value={tradeLicenseNumber}
                                        onChange={(e) =>
                                            setTradeLicenseNumber(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Trade License Number"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="trade_license_number_document"
                                        className="createFromInputLabel"
                                    >
                                        Trade License Number Document
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-8">
                                            <input
                                                type="file"
                                                id="trade_license_number_document"
                                                className="createFromInputField"
                                                onChange={(e) =>
                                                    setTradeLicenseNumberDoc(
                                                        e.target.files[0]
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="col-span-4">
                                            <div className="flex justify-center items-center h-full">
                                                {currentTradeLicenseNumberDoc ? (
                                                    <a
                                                        href={
                                                            currentTradeLicenseNumberDoc
                                                        }
                                                        target="_blank"
                                                    >
                                                        Existing Document
                                                    </a>
                                                ) : (
                                                    <p>
                                                        No Documents Available
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="vat_registration_number"
                                        className="createFromInputLabel"
                                    >
                                        Vat Registration Number
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="vat_registration_number"
                                        className="createFromInputField"
                                        value={vatRegistrationNumber}
                                        onChange={(e) =>
                                            setVatRegistrationNumber(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Vat Registration Number"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="vat_registration_number_document"
                                        className="createFromInputLabel"
                                    >
                                        Vat Registration Number Document
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-8">
                                            <input
                                                type="file"
                                                id="vat_registration_number_document"
                                                className="createFromInputField"
                                                onChange={(e) =>
                                                    setVatRegistrationNumberDoc(
                                                        e.target.files[0]
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="col-span-4">
                                            <div className="flex justify-center items-center h-full">
                                                {currentVatRegistrationNumberDoc ? (
                                                    <a
                                                        href={
                                                            currentVatRegistrationNumberDoc
                                                        }
                                                        target="_blank"
                                                    >
                                                        Existing Document
                                                    </a>
                                                ) : (
                                                    <p>
                                                        No Documents Available
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="e_tIN_number"
                                        className="createFromInputLabel"
                                    >
                                        E-TIN Number
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="e_tIN_number"
                                        className="createFromInputField"
                                        value={eTin}
                                        onChange={(e) =>
                                            setETin(e.target.value)
                                        }
                                        placeholder="E-TIN Number"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="e_tIN_number_document"
                                        className="createFromInputLabel"
                                    >
                                        E-TIN Number Document
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-8">
                                            <input
                                                type="file"
                                                id="e_tIN_number_document"
                                                className="createFromInputField"
                                                onChange={(e) =>
                                                    setETinDoc(
                                                        e.target.files[0]
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="col-span-4">
                                            <div className="flex justify-center items-center h-full">
                                                {currentETinDoc ? (
                                                    <a
                                                        href={currentETinDoc}
                                                        target="_blank"
                                                    >
                                                        Existing Document
                                                    </a>
                                                ) : (
                                                    <p>
                                                        No Documents Available
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="e_cab_number"
                                        className="createFromInputLabel"
                                    >
                                        E-Cab Membership No
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="e_cab_number"
                                        className="createFromInputField"
                                        value={eCabMembership}
                                        onChange={(e) =>
                                            setECabMembership(e.target.value)
                                        }
                                        placeholder="E-Cab Membership No"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="e_cab_number_document"
                                        className="createFromInputLabel"
                                    >
                                        E-Cab Membership No Document
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-8">
                                            <input
                                                type="file"
                                                id="e_cab_number_document"
                                                className="createFromInputField"
                                                onChange={(e) =>
                                                    setECabMembershipDoc(
                                                        e.target.files[0]
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="col-span-4">
                                            <div className="flex justify-center items-center h-full">
                                                {currentECabMembershipDoc ? (
                                                    <a
                                                        href={
                                                            currentECabMembershipDoc
                                                        }
                                                        target="_blank"
                                                    >
                                                        Existing Document
                                                    </a>
                                                ) : (
                                                    <p>
                                                        No Documents Available
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="BASIS_Membership"
                                        className="createFromInputLabel"
                                    >
                                        BASIS Membership No
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="BASIS_Membership"
                                        className="createFromInputField"
                                        value={basisMembership}
                                        onChange={(e) =>
                                            setBasisMembership(e.target.value)
                                        }
                                        placeholder="BASIS Membership No"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="BASIS_Membership_document"
                                        className="createFromInputLabel"
                                    >
                                        BASIS Membership Document
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-8">
                                            <input
                                                type="file"
                                                id="BASIS_Membership_document"
                                                className="createFromInputField"
                                                onChange={(e) =>
                                                    setBasisMembershipDoc(
                                                        e.target.files[0]
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="col-span-4">
                                            <div className="flex justify-center items-center h-full">
                                                {currentBasisMembershipDoc ? (
                                                    <a
                                                        href={
                                                            currentBasisMembershipDoc
                                                        }
                                                        target="_blank"
                                                    >
                                                        Existing Document
                                                    </a>
                                                ) : (
                                                    <p>
                                                        No Documents Available
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white w-full shadow-md rounded-md mt-8">
                        <p className="py-4 border-b pl-8 font-Poppins font-medium text-base text-pageHeading">
                            Seller Store Information
                        </p>
                        <div className="pl-8 pr-20 pt-8 pb-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="store_name"
                                        className="createFromInputLabel"
                                    >
                                        Store Name
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="store_name"
                                        onBlur={() => getSlugResult()}
                                        className="createFromInputField"
                                        value={storeName}
                                        onChange={(e) =>
                                            setStoreName(e.target.value)
                                        }
                                        placeholder="Store Name"
                                    />
                                    <p className="text-red-500 font-Poppins font-medium text-xs">
                                        {errors.store_name}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="store_code"
                                        className="createFromInputLabel"
                                    >
                                        Store Code
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="store_code"
                                        className="createFromInputField"
                                        value={storeCode}
                                        onChange={(e) =>
                                            setStoreCode(e.target.value)
                                        }
                                        placeholder="Store Code"
                                    />
                                    <p className="text-red-500 font-Poppins font-medium text-xs">
                                        {errors.code}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="address"
                                        className="createFromInputLabel"
                                    >
                                        Address
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="address"
                                        className="createFromInputField"
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                        placeholder="Address"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="bankInfo"
                                        className="createFromInputLabel"
                                    >
                                        Bank Info
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="bankInfo"
                                        className="createFromInputField"
                                        value={bankInfo}
                                        onChange={(e) =>
                                            setBankInfo(e.target.value)
                                        }
                                        placeholder="Bank Info"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="purchaseMethod"
                                        className="createFromInputLabel"
                                    >
                                        Purchase Method
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <Select
                                        options={purchaseMethodOptions}
                                        onChange={(option) =>
                                            setPurchaseMethod(option)
                                        }
                                        value={purchaseMethod}
                                        isClearable={true}
                                        placeholder="Select Purchase Method"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="store_description"
                                        className="createFromInputLabel"
                                    >
                                        Store Description
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <textarea
                                        id="store_description"
                                        className="createFromInputField"
                                        value={description}
                                        onChange={(e) =>
                                            setDescriptoin(e.target.value)
                                        }
                                        rows="6"
                                        placeholder="Store Description"
                                    ></textarea>
                                    <p className="text-red-500 font-Poppins font-medium text-xs">
                                        {errors.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-4">
                    <div className="bg-white w-full shadow-md rounded-md">
                        <p className="py-4 border-b pl-8 font-Poppins font-medium text-base text-pageHeading">
                            Seller Image
                        </p>
                        {preivew ? (
                            <>
                                <div className="relative w-full h-72.25 flex justify-center items-center">
                                    <button
                                        onClick={() => removeImage()}
                                        className="bg-red-600 text-white p-1 rounded-full absolute right-24 top-0 mr-2 mt-2"
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
                                        className="w-60 h-60"
                                        src={preivew}
                                        alt="..."
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-8 ">
                                    <label
                                        htmlFor="file_upload"
                                        className="w-full h-54 flex justify-center items-center border-2 border-dashed"
                                    >
                                        Select Logo
                                    </label>
                                    <input
                                        id="file_upload"
                                        onChange={(e) => setImage(e)}
                                        type="file"
                                        className="hidden"
                                    />
                                </div>
                            </>
                        )}
                        <p className="text-red-500 font-Poppins font-medium text-xs pl-8">
                            {errors.logo}
                        </p>
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
                            onClick={updateSeller}
                            className="button button-primary w-32"
                        >
                            Update Seller
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
