import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Select from "react-select";
import { notifySuccess, Toast } from "helper/notify";
import toast from "react-hot-toast";
import Couriers from "../Courier/Couriers";
import { permission } from "helper/permission";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { BiPlus, BiMinus, BiShare } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

import UpdateShippingInfo from "./UpdateShippingInfo";

export default function UpdateOrder() {
    const { id } = useParams();

    const { token, user } = useSelector((state) => state.auth);
    const [order, setOrder] = React.useState([]);
    const [statuses, setStatuses] = React.useState([]);
    const [status, setStatus] = React.useState("");
    const [orderStatus, setOrderStatus] = React.useState({});
    const [mycourier, setMyCourier] = React.useState({});
    const [paymentStatus, setPaymentStatus] = React.useState({});
    const [boolPaymentStatus, setBoolPaymentStatus] = React.useState("");
    const [partialPaid, setPartialPaid] = React.useState(0);
    const [partialPaidNote, setPartialPaidNote] = React.useState("");
    const [myPaymentStatus, setMyPaymentStatus] = React.useState("");
    const [userLogs, setUserLogs] = React.useState([]);

    const [paymentHistoryLogs, setPaymentHistoryLogs] = React.useState([]);
    const [holdNoteLogs, setHoldNoteLogs] = React.useState([]);

    const [showInput, setShowInput] = React.useState(false);
    const [inputShipping, setInputShipping] = React.useState();

    const [couriers, setCouriers] = React.useState([]);

    const [options, setOptions] = React.useState([]);

    const TransactionOptions = [
        { value: "nagad", label: "Nagad" },
        { value: "bkash", label: "Bkash" },
    ];

    const orderViaOptions = [
        { value: "facebook", label: "Facebook" },
        { value: "mobile", label: "Mobile Call" },
        { value: "website", label: "Website" },
    ];

    const [transaction, setTransaction] = React.useState("");
    const [transactionId, setTransactionId] = React.useState("");

    const [specialDiscount, setSpecialDiscount] = React.useState(false);

    const [specialDiscountAmount, setSpecialDiscountAmount] = React.useState(0);
    const [specialDiscountNote, setSpecialDiscountNote] = React.useState("");
    const [specialDiscountNoteCheck, setspecialDiscountNoteCheck] =
        React.useState(false);

    const [updateShippingInfoModal, setUpdateShippingInfoModal] =
        useState(false);

    const [statusHoldComment, setStatusHoldComment] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusHoldNote, setStatusHoldNote] = useState("");

    const [searchValue, setSearchValue] = useState("");
    const [searchResult, setSearchProducts] = useState([]);

    const [specialNote, setSpecialNote] = useState("");
    const [specialNoteSubmitLoading, setSpecialNoteSubmitLoading] =
        useState(false);
    const [allSpecialNotes, setAllSpecialNotes] = useState([]);

    const [selectedOrderVia, setSelectedOrderVia] = useState(null);

    const [search, setSearch] = useState("");
    const [searchOrderResult, setSearchOrderResult] = useState([]);
    const [paid_amount, setPaidAmount] = useState("");
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        if (token != "" && searchValue && searchValue.length > 2) {
            axios
                .get(`/order-create/products?search=${searchValue}`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    setSearchProducts(response?.data?.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    }, [searchValue, token]);

    useEffect(() => {
        if (partialPaid == 0 || order.partial_paid == 0) {
            setOptions([
                { value: "unpaid", label: "Unpaid" },
                { value: "paid", label: "Paid" },
                { value: "partialpaid", label: "Partial Paid" },
            ]);
        } else {
            setOptions([
                { value: "unpaid", label: "Unpaid" },
                { value: "paid", label: "Paid" },
            ]);
        }
    }, [partialPaid]);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "order_history", "read") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const fetchOrder = (id) => {
        axios
            .get(`/manage-orders/${id}`, { headers: { Authorization: token } })
            .then((response) => {
                setOrder(response.data);
                setInputShipping(response.data.shipping_total);
                setStatus(response.data.status);

                setPaymentHistoryLogs(response.data.payment_histories);

                setHoldNoteLogs(response.data.hold_notes);

                setOrderStatus({
                    value: response.data.status,
                    label: response.data.status,
                });
                setSelectedOrderVia({
                    value: response.data?.order_via,
                    label: response.data?.order_via,
                });
                response.data?.courier
                    ? setMyCourier({
                          value: response.data?.courier?.id,
                          label: response.data?.courier?.name,
                      })
                    : setMyCourier({});
                setBoolPaymentStatus(response.data.set_paid);
                setPartialPaid(response.data.partial_paid);
                axios
                    .get("/statuses", { headers: { Authorization: token } })
                    .then((response) => {
                        setStatuses([]);
                        response.data.map((item) => {
                            setStatuses((prevState) => [
                                ...prevState,
                                { value: item.name, label: item.name },
                            ]);
                        });
                    })
                    .catch((errors) => {
                        console.log(errors.response);
                    });
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    const fetchCouriers = () => {
        axios
            .get("/couriers", {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                setCouriers([]);
                response.data.map((item) => {
                    setCouriers((prevState) => [
                        ...prevState,
                        { value: item.id, label: item.name },
                    ]);
                });
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const getUserLog = (id) => {
        axios
            .get(`manage-orders/logs/${id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                // console.log(response);
                setUserLogs(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const gettingSpecialNotes = () => {
        axios
            .get(`/orders/sepecial-note/${id}`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                console.log(response);
                setAllSpecialNotes(response.data);
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    React.useEffect(() => {
        if (token != "") {
            fetchOrder(id);
            fetchCouriers();
            getUserLog(id);
        }
    }, [token, updateShippingInfoModal, statusLoading]);

    React.useEffect(() => {
        if (token != "" && search == "") {
            fetchOrder(id);
            fetchCouriers();
            getUserLog(id);
            gettingSpecialNotes();
            setSpecialDiscount(false);
            setSpecialDiscountAmount(0);
            setSpecialDiscountNote("");
            setspecialDiscountNoteCheck(false);
        }
    }, [token, search]);

    // React.useEffect(() => {
    //   setOrderStatus({ value: status, label: status });
    // }, [status]);

    React.useEffect(() => {
        if (paymentStatus != null) {
            setPaymentStatus({
                value: boolPaymentStatus,
                label: boolPaymentStatus ? "Paid" : "Unpaid",
            });
        }
    }, [boolPaymentStatus]);

    const updateStatus = (option) => {
        const response = axios
            .post(
                `manage-orders/${id}`,
                {
                    _method: "PUT",
                    status: option.value,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((response) => {
                setOrderStatus(option);
                setConfirmStatusModal(false);
                getUserLog(id);
                fetchOrder(id);
                toast.success("Order Updated");
            })
            .catch((error) => {
                if (error.response?.status === 424) {
                    setPaymentModalForCallcelled_Return_CompleteReturnModal(
                        true
                    );
                    setConfirmStatusModal(false);
                } else if (
                    error.response.status === 402 ||
                    error.response.status === 503
                ) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.response?.data?.message);
                }
                // throw error;
            });

        return response;
    };

    const updateOrderVia = (option) => {
        const response = axios
            .post(
                `manage-orders/${id}/ordervia`,
                {
                    order_via: option.value,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((response) => {
                // return true;

                setSelectedOrderVia(option);

                getUserLog(id);
            })
            .catch((error) => {
                throw error;
            });

        return response;
    };

    const updateCourier = (option) => {
        const response = axios
            .post(
                `/manage-orders/${id}/courier`,
                {
                    courier_id: option.value,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((response) => {
                // return true;

                setMyCourier(option);

                getUserLog(id);
            })
            .catch((error) => {
                throw error;
            });

        return response;
    };

    const updateTransaction = () => {
        const response = axios
            .post(
                `/manage-orders/${id}/transection`,
                {
                    method: transaction,
                    transection_id: transactionId,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((response) => {
                fetchOrder(id);
                getUserLog(id);
                toast.success("Successfully updated!");
            })
            .catch((error) => {
                throw error;
            });

        return response;
    };

    const handlePartialPrice = (id) => {
        axios
            .post(
                `manage-orders/${id}/partial-paid`,
                {
                    partial_paid: partialPaid,
                    partial_paid_note: partialPaidNote,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((res) => {
                fetchOrder(id);
                getUserLog(id);
                toast.success("Successfully updated!");
            })
            .catch((err) => {
                console.log(err.response.status);

                if (err.response.status === 404) {
                    toast.error(err.response.data.message);
                }
            });
    };

    const handlePaid = (id) => {
        console.log("hello");
        axios
            .post(
                `manage-orders/${id}/update-paid`,
                {},
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((res) => {
                fetchOrder(id);

                getUserLog(id);
                toast.success("Successfully updated!");
            })
            .catch((err) => {
                console.log(err.response.status);

                if (err.response.status === 404) {
                    toast.error(err.response.data.message);
                }
            });
    };

    const updateSpecialDiscount = (id) => {
        axios
            .post(
                `manage-orders/${id}/special-discount`,
                {
                    special_discount: specialDiscountAmount,
                    special_discount_note: specialDiscountNote,
                    special_discount_note_checkbox: specialDiscountNoteCheck,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((res) => {
                fetchOrder(id);
                setSpecialDiscount(false);
                getUserLog(id);
                setErrors([]);
                toast.success("Successfully updated!");
            })
            .catch((errors) => {
                if (errors.response.status === 404) {
                    toast.error(errors.response.data.message);
                }
                if (errors.response.status === 422) {
                    setErrors(errors.response.data.errors);
                }
            });
    };

    const handleModalClose = () => {
        setStatusHoldComment(false);
        setStatusHoldNote("");
    };

    useEffect(() => {
        console.log(orderStatus);
        if (orderStatus?.value == "Hold" && order?.order_note == null) {
            setStatusHoldComment(true);
        }
    }, [orderStatus, order]);

    const submitHoldNote = () => {
        setStatusLoading(true);
        axios
            .post(
                `/manage-orders/${id}/order-note`,
                {
                    order_note: statusHoldNote,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                console.log(response);
                setStatusLoading(false);
                setStatusHoldNote("");
                setStatusHoldComment(false);
            })
            .catch((errors) => {
                console.log(errors.response);
                setStatusLoading(false);
                setStatusHoldNote("");
                setStatusHoldComment(false);
            });
    };

    const productQuantityRemove = (item) => {
        if (order.status === "Processing") {
            axios
                .post(
                    `orders/${order.id}/order-item-remove`,
                    {
                        item_id: item.id,
                    },
                    {
                        headers: {
                            Authorization: token,
                            Accept: "application/json",
                        },
                    }
                )
                .then((response) => {
                    fetchOrder(order.id);
                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                });
        }
    };

    const productQuantityIncrement = (item) => {
        if (order.status === "Processing") {
            axios
                .post(
                    `orders/${order.id}/order-item-increment`,
                    {
                        item_id: item.id,
                    },
                    {
                        headers: {
                            Authorization: token,
                            Accept: "application/json",
                        },
                    }
                )
                .then((response) => {
                    fetchOrder(order.id);
                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                });
        }
    };

    const [variableProductModal, setVariableProductModal] = useState(false);
    const [specficProduct, setSpecficProduct] = useState(null);
    const [specficProductVariation, setSpecficProductVariation] =
        useState(null);
    const [productVariationLoading, setProductVariationLoading] =
        useState(false);

    useEffect(() => {
        console.log(specficProduct);
        console.log(specficProductVariation);
    }, [specficProduct, specficProductVariation]);

    const handleSelectingProduct = (product) => {
        setSearchValue("");
        if (order.status === "Processing") {
            if (product?.is_variable) {
                setVariableProductModal(true);
                setSpecficProduct(product);
                axios
                    .get(`/order-create/group/${product.id}`, {
                        headers: {
                            Authorization: token,
                            Accept: "application/json",
                        },
                    })
                    .then((response) => {
                        console.log(response);
                        setSpecficProductVariation(response.data);
                    })
                    .catch((errors) => {
                        console.log(errors.response);
                    });
            } else {
                axios
                    .post(
                        `/orders/${order.id}/order-item-add`,
                        {
                            product_id: product?.id,
                            unit_price: product?.selling_price,
                        },
                        {
                            headers: {
                                Authorization: token,
                                Accept: "application/json",
                            },
                        }
                    )
                    .then((response) => {
                        fetchOrder(id);
                    })
                    .catch((errors) => {
                        console.log(errors.response);
                    });
            }
        }
    };

    const handleVariableProductModal = () => {
        setVariableProductModal(false);
        setSpecficProduct(null);
        setSpecficProductVariation(null);
    };

    const handleAddingVariantProductToCart = (variant) => {
        setProductVariationLoading(true);
        axios
            .post(
                `/orders/${order.id}/order-item-add`,
                {
                    product_id: specficProduct?.id,
                    unit_price: specficProduct?.selling_price,
                    product_group_id: variant.id,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                console.log(response);
                fetchOrder(id);
                setVariableProductModal(false);
                setSpecficProduct(null);
                setSpecficProductVariation(null);
                setProductVariationLoading(false);
            })
            .catch((errors) => {
                console.log(errors.response);
                setProductVariationLoading(false);
            });
    };

    const handleSubmitSpecialNote = () => {
        setSpecialNoteSubmitLoading(true);
        axios
            .post(
                `/orders/sepecial-note/${id}`,
                {
                    note: specialNote,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                console.log(response);
                setSpecialNoteSubmitLoading(false);
                setSpecialNote("");

                gettingSpecialNotes();
            })
            .catch((errors) => {
                console.log(errors.response);
                setSpecialNoteSubmitLoading(false);
                setSpecialNote("");
            });
    };

    useEffect(() => {
        if (token != "" || token != null) {
            axios
                .get(`/orders/sepecial-note/${id}`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    console.log(response);
                    setAllSpecialNotes(response.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    }, [token]);

    const updateShippingCharge = () => {
        if (inputShipping == order.shipping_total) return;

        axios
            .post(
                `/manage-orders/${id}/shipping-charge`,
                {
                    shipping_charge: inputShipping,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((response) => {
                fetchOrder(id);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const paymentOptions = [
        { value: "nagad", label: "Nagad" },
        { value: "bkash", label: "Bkash" },
        { value: "cod", label: "Cash On Delivery" },
    ];

    const partialPaidOptions = [
        { value: "nagad", label: "Nagad" },
        { value: "bkash", label: "Bkash" },
        { value: "cod", label: "Cash On Delivery" },
    ];

    const [paidModal, setPaidModal] = useState(false);
    const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
    const [transactionIdPaid, setTransactionIdPaid] = useState("");

    const [partialPaidModal, setPartialPaidModal] = useState(false);
    const [partialPaidTk, setPartialPaidTk] = useState("");
    const [partialPaidModalNote, setPartialPaidModalNote] = useState("");
    const [partialPaidPaymentMethod, setpartialPaidPaymentMethod] =
        useState(null);
    const [partialPaidTransactionId, setPartialPaidTransactionId] =
        useState("");

    const [errorStatus, setErrorStatus] = useState(null);

    useEffect(() => {
        if (myPaymentStatus?.value == "paid") {
            setPaidModal(true);
        }

        if (myPaymentStatus?.value == "partialpaid") {
            setPartialPaidModal(true);
        }
    }, [myPaymentStatus]);

    const handlePaidModal = () => {
        setPaidModal(false);
        setSelectedPaymentOption(null);
        setTransactionIdPaid("");
        setErrorStatus(null);
    };

    const paymentMethodFunction = () => {
        axios
            .post(
                `/manage-orders/${id}/update-paid`,
                {
                    payment_method: selectedPaymentOption?.value,
                    transection_id: transactionIdPaid,
                    paid_amount,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                fetchOrder(id);
                getUserLog(id);
                setErrorStatus(null);
                setSelectedPaymentOption(null);
                setTransactionIdPaid("");
                setPaidModal(false);
                setPaidAmount("");
            })
            .catch((error) => {
                if (error.response.status === 417) {
                    toast.error(error.response.data.message);
                } else {
                    setErrorStatus(error.response.data.errors);
                }
            });
    };

    const handlePaymentMethod = () => {
        if (
            selectedPaymentOption?.value == "bkash" ||
            selectedPaymentOption?.value == "nagad"
        ) {
            if (transactionIdPaid != "" && paid_amount != "") {
                paymentMethodFunction();
            } else {
                setErrorStatus({
                    transactionId: "The Transaction Id is Required",
                    paid_amount: "The Amount is Required",
                });
            }
        } else {
            if (paid_amount != "") {
                paymentMethodFunction();
            } else {
                setErrorStatus({ paid_amount: "The Amount is Required" });
            }
        }
    };

    useEffect(() => {
        setErrorStatus(null);
    }, [selectedPaymentOption]);

    const handlePartialPaidModal = () => {
        setPartialPaidModal(false);
        setPartialPaidTk("");
        setPartialPaidModalNote("");
        setpartialPaidPaymentMethod(null);
        setPartialPaidTransactionId("");
        setErrorStatus(null);
    };

    const handlePartialPaymentMethod = () => {
        if (partialPaidTransactionId != "") {
            axios
                .post(
                    `/manage-orders/${id}/partial-paid`,
                    {
                        partial_paid_amount: partialPaidTk,
                        payment_method: partialPaidPaymentMethod?.value,
                        partial_paid_note: partialPaidModalNote,
                        transection_id: partialPaidTransactionId,
                    },
                    {
                        headers: {
                            Authorization: token,
                            Accept: "application/json",
                        },
                    }
                )
                .then((response) => {
                    console.log(response);
                    fetchOrder(id);
                    getUserLog(id);
                    setOptions([
                        { value: "unpaid", label: "Unpaid" },
                        { value: "paid", label: "Paid" },
                    ]);
                    setMyPaymentStatus(null);
                    setPartialPaidModal(false);
                    setPartialPaidTk("");
                    setPartialPaidModalNote("");
                    setpartialPaidPaymentMethod(null);
                    setPartialPaidTransactionId("");
                    setErrorStatus(null);
                })
                .catch((error) => {
                    if (error.response.status === 417) {
                        toast.error(error.response.data.message);
                    } else {
                        setErrorStatus(error.response.data.errors);
                    }
                });
        } else {
            setErrorStatus({
                transactionId: "The Transaction Id is Required.",
                partial_paid_amount:
                    "The partial paid amount field is required.",
                payment_method: "The payment method field is required.",
            });
        }
    };

    const [tempStatus, setTempStatus] = useState(null);
    const [confirmStatusModal, setConfirmStatusModal] = useState(false);

    const handleConfirmationModal = () => {
        setConfirmStatusModal(false);
        setTempStatus(null);
    };

    const handleConfirmingStatus = () => {
        // toast.promise(updateStatus(tempStatus), {
        //   loading: "Updating..",
        //   success: "Updated",
        //   error: "Something wrong!",
        // });

        updateStatus(tempStatus);
    };

    useEffect(() => {
        if (
            tempStatus != null &&
            tempStatus?.value != "Partial Return" &&
            tempStatus?.value != "Complete Partial Return"
        ) {
            setConfirmStatusModal(true);
        }

        if (
            tempStatus?.value === "Partial Return" ||
            tempStatus?.value === "Complete Partial Return"
        ) {
            setPartialReturnModal(true);
            axios
                .get(`/orders/${id}/order-items`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    setItemsForPartialReturnModal(response.data?.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    }, [tempStatus]);

    useEffect(() => {
        if (search.length >= 3 && token != "") {
            axios
                .get(`/manage-orders/${search}/search`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    console.log(response);
                    setSearchOrderResult(response?.data?.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    }, [search]);

    //Codes STARTS for, when Status is changed to Return, Complete Return or Cancelled

    const [
        paymentModalForCallcelled_Return_CompleteReturnModal,
        setPaymentModalForCallcelled_Return_CompleteReturnModal,
    ] = useState(false);
    const [customerPaymentSuretyValue, setCustomerPaymentSuretyValue] =
        useState(null);
    const [
        customerPaymentSuretyStatusValue,
        setCustomerPaymentSuretyStatusValue,
    ] = useState(null);

    const [suretyPartialPaidTransctionId, setSuretyPartialPaidTransctionId] =
        useState("");
    const [suretyPartialPaidAmount, setSuretyPartialPaidAmount] = useState("");
    const [suretyPartialPaidNote, setSuretyPartialPaidNote] = useState("");
    const [suretyPartialPaidPaymentMethod, setSuretyPartialPaidPaymentMethod] =
        useState(null);
    const suretyPartialPaidOptions = [
        { value: "nagad", label: "Nagad" },
        { value: "bkash", label: "Bkash" },
    ];

    const [suretyPaidTransctionId, setSuretyPaidTransctionId] = useState("");
    const [suretyPaidAmount, setSuretyPaidAmount] = useState("");
    const [suretyPaidPaymentMethod, setSuretyPaidPaymentMethod] =
        useState(null);
    const suretyPaidPaymentMethodOptions = [
        { value: "cod", label: "Cash On Delivery" },
        { value: "nagad", label: "Nagad" },
        { value: "bkash", label: "Bkash" },
    ];

    const [errroStatusPaymentSurety, setErrorStatusPaymentSurety] = useState(
        {}
    );

    const customerPaymentSuretyOptions = [
        { value: 1, label: "Yes" },
        { value: 0, label: "No" },
    ];

    const customerPaymentSuretyStatusOptions = [
        { value: "partialpaid", label: "Partial Paid" },
        { value: "paid", label: "Full Paid" },
    ];

    const handlePaymentModalForCallcelled_Return_CompleteReturnModal = () => {
        setPaymentModalForCallcelled_Return_CompleteReturnModal(false);
        makingSuretyPaymentStatusAllValueToDefault();
        setCustomerPaymentSuretyValue(null);
        setCustomerPaymentSuretyStatusValue(null);
        setTempStatus(null);
    };

    useEffect(() => {
        console.log(customerPaymentSuretyValue);
    }, [customerPaymentSuretyValue]);

    const makingSuretyPaymentStatusAllValueToDefault = () => {
        setSuretyPartialPaidTransctionId("");
        setSuretyPartialPaidAmount("");
        setSuretyPartialPaidNote("");
        setSuretyPaidTransctionId("");
        setSuretyPaidAmount("");
        setSuretyPartialPaidPaymentMethod(null);
        setSuretyPaidPaymentMethod(null);
    };

    const handleConfirmButton = () => {
        if (customerPaymentSuretyValue != null) {
            setErrorStatusPaymentSurety({});

            if (customerPaymentSuretyValue?.value) {
                //codes when customer made payment
                if (customerPaymentSuretyStatusValue != null) {
                    if (
                        customerPaymentSuretyStatusValue?.value == "partialpaid"
                    ) {
                        if (
                            suretyPartialPaidPaymentMethod != null &&
                            suretyPartialPaidAmount != "" &&
                            suretyPartialPaidTransctionId != ""
                        ) {
                            //axios call for partial paid
                            axios
                                .post(
                                    `/manage-orders/${id}/partial-paid`,
                                    {
                                        partial_paid_amount:
                                            suretyPartialPaidAmount,
                                        payment_method:
                                            suretyPartialPaidPaymentMethod?.value,
                                        partial_paid_note:
                                            suretyPartialPaidNote,
                                        transection_id:
                                            suretyPartialPaidTransctionId,
                                    },
                                    {
                                        headers: {
                                            Authorization: token,
                                            Accept: "application/json",
                                        },
                                    }
                                )
                                .then((response) => {
                                    fetchOrder(id);
                                    getUserLog(id);
                                    if (tempStatus?.value != "Partial Return") {
                                        updateStatus(tempStatus);
                                        // toast.promise(updateStatus(tempStatus), {
                                        //   loading: "Updating..",
                                        //   success: "Updated",
                                        //   error: "Something wrong!",
                                        // });
                                    }
                                    setSuretyPartialPaidAmount("");
                                    setSuretyPartialPaidNote("");
                                    setSuretyPartialPaidPaymentMethod(null);
                                    setSuretyPartialPaidTransctionId("");
                                    setCustomerPaymentSuretyValue(null);
                                    setCustomerPaymentSuretyStatusValue(null);
                                    setPaymentModalForCallcelled_Return_CompleteReturnModal(
                                        false
                                    );
                                    setIsPaidVariable(1);
                                })
                                .catch((errors) => {
                                    console.log(errors.response);
                                    toast.error(errors.response.data?.message);
                                });
                        } else {
                            setErrorStatusPaymentSurety({
                                paymentMethodPP:
                                    "Please Select The way of Payment",
                                tId: "Give Transaction Id",
                                amount: "Give Amount",
                            });
                        }
                    }

                    if (customerPaymentSuretyStatusValue?.value == "paid") {
                        if (
                            suretyPaidPaymentMethod != null &&
                            suretyPaidAmount != "" &&
                            (suretyPaidPaymentMethod?.value == "cod" ||
                                suretyPaidTransctionId != "")
                        ) {
                            //axios call for paid
                            axios
                                .post(
                                    `/manage-orders/${id}/update-paid`,
                                    {
                                        payment_method:
                                            suretyPaidPaymentMethod?.value,
                                        transection_id: suretyPaidTransctionId,
                                        paid_amount: suretyPaidAmount,
                                    },
                                    {
                                        headers: {
                                            Authorization: token,
                                            Accept: "application/json",
                                        },
                                    }
                                )
                                .then((response) => {
                                    fetchOrder(id);
                                    getUserLog(id);
                                    if (tempStatus?.value != "Partial Return") {
                                        updateStatus(tempStatus);
                                        // toast.promise(updateStatus(tempStatus), {
                                        //   loading: "Updating..",
                                        //   success: "Updated",
                                        //   error: "Something wrong!",
                                        // });
                                    }
                                    setSuretyPaidPaymentMethod(null);
                                    setSuretyPaidAmount("");
                                    setSuretyPaidTransctionId("");
                                    setCustomerPaymentSuretyValue(null);
                                    setCustomerPaymentSuretyStatusValue(null);
                                    setPaymentModalForCallcelled_Return_CompleteReturnModal(
                                        false
                                    );
                                    setIsPaidVariable(1);
                                })
                                .catch((errors) => {
                                    console.log(errors.response);
                                    toast.error(errors.response.data?.message);
                                });
                        } else {
                            setErrorStatusPaymentSurety({
                                paymentMethodPP:
                                    "Please Select The way of Payment",
                                tId: "Give Transaction Id",
                                amount: "Give Amount",
                            });
                        }
                    }
                } else {
                    setErrorStatusPaymentSurety({
                        paymentMethod: "Please Select The Payment Method",
                    });
                }
            } else {
                //codes when customer didn't make any payment
                if (tempStatus?.value != "Partial Return") {
                    axios
                        .post(
                            `manage-orders/${id}`,
                            {
                                _method: "PUT",
                                status: tempStatus.value,
                                is_paid: 0,
                            },
                            {
                                headers: {
                                    Authorization: token,
                                },
                            }
                        )
                        .then((response) => {
                            setOrderStatus(tempStatus);
                            setPaymentModalForCallcelled_Return_CompleteReturnModal(
                                false
                            );
                            getUserLog(id);
                            setTempStatus(null);
                            setCustomerPaymentSuretyValue(null);
                        })
                        .catch((errors) => {
                            console.log(errors.response);
                        });
                } else {
                    setIsPaidVariable(0);
                    setPaymentModalForCallcelled_Return_CompleteReturnModal(
                        false
                    );
                }
            }
        } else {
            setErrorStatusPaymentSurety({ yesOrNo: "Please Select The Field" });
        }
    };

    //Codes ENDS for, when Status is changed to Return, Complete Return or Cancelled

    //Codes STARTS for, when Status is changed to Partial Return

    const [partialReturnModal, setPartialReturnModal] = useState(false);
    const [itemsForPartialReturnModal, setItemsForPartialReturnModal] =
        useState([]);
    const [
        modifiedItemArrayForPartialReturn,
        setModifiedItemArrayForPartialReturn,
    ] = useState([]);
    const [mainArrayForPartialReturn, setMainArrayForPartialReturn] = useState(
        []
    );
    const [isPaidVariable, setIsPaidVariable] = useState(null);
    const [errorStatusPartialReturn, setErrorStatusPartialReturn] =
        useState(null);

    useEffect(() => {
        if (itemsForPartialReturnModal.length > 0) {
            setModifiedItemArrayForPartialReturn([]);
            itemsForPartialReturnModal.forEach((value, index) => {
                setModifiedItemArrayForPartialReturn((prevState) => [
                    ...prevState,
                    {
                        ...value,
                        returnType: null,
                        returnQuantity: 0,
                        returnBoolPartial: false,
                        returnBoolFull: false,
                    },
                ]);
            });
        }
    }, [itemsForPartialReturnModal]);

    const handlePartialReturnModal = () => {
        setPartialReturnModal(false);
        setErrorStatusPartialReturn(null);
        setTempStatus(null);
    };

    const handlePartialChecked = (index) => {
        console.log(index);
        const temp = [...modifiedItemArrayForPartialReturn];
        temp[index].returnBoolPartial = !temp[index].returnBoolPartial;
        temp[index].returnBoolFull = false;
        if (temp[index].returnBoolPartial == true) {
            temp[index].returnType = "partial";
            temp[index].returnQuantity = 1;
        } else {
            temp[index].returnType = null;
            temp[index].returnQuantity = 0;
        }
        setModifiedItemArrayForPartialReturn(temp);
    };

    const handleFullChecked = (index) => {
        const temp = [...modifiedItemArrayForPartialReturn];
        temp[index].returnBoolFull = !temp[index].returnBoolFull;
        temp[index].returnBoolPartial = false;
        if (temp[index].returnBoolFull == true) {
            temp[index].returnType = "full";
            temp[index].returnQuantity = temp[index].quantity;
        } else {
            temp[index].returnType = null;
            temp[index].returnQuantity = 0;
        }
        setModifiedItemArrayForPartialReturn(temp);
    };

    const handleChangeReturnQuantity = (e, index) => {
        const temp = [...modifiedItemArrayForPartialReturn];
        temp[index].returnQuantity = e.target.value;
        setModifiedItemArrayForPartialReturn(temp);
    };

    const handlePartialReturnConfirm = () => {
        // let tempArray = []
        let tempArray = {};
        modifiedItemArrayForPartialReturn.forEach((value, index) => {
            if (value.returnType != null) {
                let tempObj = {
                    [index]: {
                        id: value.id,
                        status: value.returnType,
                        quantity: parseInt(value.returnQuantity),
                    },
                };
                // tempArray.push(tempObj)
                Object.assign(tempArray, tempObj);
            }
        });
        setMainArrayForPartialReturn(tempArray);
        console.log(tempStatus);
        axios
            .post(
                `/manage-orders/${id}`,
                {
                    status: tempStatus?.value,
                    _method: "PUT",
                    orderItems: tempArray,
                    is_paid: isPaidVariable,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                setOrderStatus(tempStatus);
                getUserLog(id);
                fetchOrder(id);
                setIsPaidVariable(null);
                setPartialReturnModal(false);
            })
            .catch((errors) => {
                if (errors.response?.status == 424) {
                    setPaymentModalForCallcelled_Return_CompleteReturnModal(
                        true
                    );
                }
                if (errors.response?.status == 422) {
                    // const tempError = []
                    // Object.entries(errors.response?.data?.errors).map(([key, value]) => {
                    //   tempError.push({ [key]: value })
                    // })

                    setErrorStatusPartialReturn(errors.response?.data?.errors);
                }
                if (errors.response?.status == 503) {
                    const tempError = [];
                    setErrorStatusPartialReturn(errors.response?.data);
                }
            });
    };

    useEffect(() => {
        console.log(mainArrayForPartialReturn);
    }, [mainArrayForPartialReturn]);

    useEffect(() => {
        console.log(errorStatusPartialReturn);
    }, [errorStatusPartialReturn]);

    return (
        <>
            {/* Codes STARTS for the modal that opens, when Status is changed Partial Return */}

            <Modal
                open={partialReturnModal}
                onClose={handlePartialReturnModal}
                center={true}
                blockScroll={false}
            >
                <div className="py-4 px-4" style={{ width: 750 }}>
                    <p className="font-Poppins mb-4">
                        Select Products That you want to{" "}
                        <b>{tempStatus?.label}</b>
                    </p>

                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader">Name</th>
                                <th className="tableHeader">SKU</th>
                                <th className="tableHeader">Image</th>
                                <th className="tableHeader">Order Quantity</th>
                                <th className="tableHeader">Unit Price</th>
                                <th className="tableHeader">Return Type</th>
                                <th className="tableHeader">Return Quantity</th>
                            </tr>
                        </thead>

                        <tbody>
                            {modifiedItemArrayForPartialReturn?.map(
                                (value, index) => (
                                    <tr
                                        key={index}
                                        className="border-b py-1 h-20"
                                    >
                                        <td>
                                            <p className="tableData mb-1">
                                                {value?.product?.name}
                                            </p>
                                            {value?.productAttributes?.map(
                                                (productAttribute, index) => (
                                                    <span
                                                        className="bg-gray-100 px-2 rounded-full text-sm mr-1"
                                                        key={index}
                                                    >
                                                        {Object.values(
                                                            productAttribute
                                                        )}
                                                    </span>
                                                )
                                            )}
                                        </td>

                                        <td>
                                            <p className="tableData mb-1">
                                                {value?.product?.SKU}
                                            </p>
                                        </td>

                                        <td>
                                            <img
                                                src={value?.image}
                                                alt="product"
                                                height={50}
                                                width={50}
                                            />
                                        </td>

                                        <td>
                                            <p className="tableData mb-1">
                                                {value?.quantity}
                                            </p>
                                        </td>

                                        <td>
                                            <p className="tableData mb-1">
                                                {value?.unit_price}
                                            </p>
                                        </td>

                                        <td>
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        value?.returnBoolPartial
                                                    }
                                                    onChange={() =>
                                                        handlePartialChecked(
                                                            index
                                                        )
                                                    }
                                                    id={`partial${index}`}
                                                />
                                                <label
                                                    htmlFor={`partial${index}`}
                                                    className="font-Poppins text-xs ml-1"
                                                >
                                                    Partial Return
                                                </label>
                                            </div>

                                            <div>
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        value?.returnBoolFull
                                                    }
                                                    onChange={() =>
                                                        handleFullChecked(index)
                                                    }
                                                    id={`full${index}`}
                                                />
                                                <label
                                                    htmlFor={`full${index}`}
                                                    className="font-Poppins text-xs ml-1"
                                                >
                                                    Full Return
                                                </label>
                                            </div>
                                        </td>

                                        <td>
                                            {value?.returnQuantity > 0 && (
                                                <p className="tableData text-center mb-1">
                                                    {value?.returnQuantity}
                                                </p>
                                            )}
                                            {value?.returnType == "partial" && (
                                                <input
                                                    type="number"
                                                    className="py-1"
                                                    min={1}
                                                    max={value.quantity}
                                                    value={
                                                        value?.returnQuantity
                                                    }
                                                    onChange={(e) =>
                                                        handleChangeReturnQuantity(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                />
                                            )}
                                            {
                                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                                    {errorStatusPartialReturn &&
                                                    errorStatusPartialReturn[
                                                        `orderItems.${index}.quantity`
                                                    ]
                                                        ? errorStatusPartialReturn[
                                                              `orderItems.${index}.quantity`
                                                          ][0]
                                                        : null}
                                                </p>
                                            }
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>

                    <div className="flex justify-between w-full mt-8">
                        <div>
                            {errorStatusPartialReturn && (
                                <>
                                    {
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatusPartialReturn &&
                                            errorStatusPartialReturn[
                                                `orderItems`
                                            ]
                                                ? errorStatusPartialReturn[
                                                      `orderItems`
                                                  ][0]
                                                : errorStatusPartialReturn[
                                                      `message`
                                                  ]}
                                        </p>
                                    }
                                </>
                            )}
                        </div>
                        <button
                            type="submit"
                            onClick={handlePartialReturnConfirm}
                            className="bg-green-500 hover:bg-green-400 font-semibold text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Codes ENDS for the modal that opens, when Status is changed Partial Return */}

            {/* Codes STARTS for the modal that opens, when Status is changed to Return, Complete Return or Cancelled */}

            <Modal
                open={paymentModalForCallcelled_Return_CompleteReturnModal}
                onClose={
                    handlePaymentModalForCallcelled_Return_CompleteReturnModal
                }
                center={true}
                blockScroll={false}
            >
                <div className="py-4 px-4" style={{ width: 500 }}>
                    <p className="font-Poppins mb-1">
                        Has the Customer Paid for this order?
                    </p>
                    <Select
                        isClearable={true}
                        options={customerPaymentSuretyOptions}
                        value={customerPaymentSuretyValue}
                        onChange={(option) => {
                            setCustomerPaymentSuretyValue(option);
                            setCustomerPaymentSuretyStatusValue(null);
                        }}
                        placeholder="Select Yes or No"
                    />
                    {errroStatusPaymentSurety && (
                        <p className="text-red-500 font-Poppins font-medium text-xs">
                            {errroStatusPaymentSurety.yesOrNo}
                        </p>
                    )}
                    {customerPaymentSuretyValue?.value ? (
                        <div>
                            <p className="font-Poppins mb-1 mt-4">
                                Has the Customer made Full Payment or Partial
                                Payment ?
                            </p>
                            <Select
                                isClearable={true}
                                options={customerPaymentSuretyStatusOptions}
                                value={customerPaymentSuretyStatusValue}
                                onChange={(option) => {
                                    setCustomerPaymentSuretyStatusValue(option);
                                    makingSuretyPaymentStatusAllValueToDefault();
                                }}
                                placeholder="Select Partial Paid or Full Paid"
                            />
                            {errroStatusPaymentSurety && (
                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                    {errroStatusPaymentSurety.paymentMethod}
                                </p>
                            )}
                            {customerPaymentSuretyStatusValue?.value ==
                                "partialpaid" && (
                                <div>
                                    <p className="font-Poppins font-bold mb-1 mt-4">
                                        Select Payment Method
                                    </p>
                                    <Select
                                        isClearable={true}
                                        options={suretyPartialPaidOptions}
                                        value={suretyPartialPaidPaymentMethod}
                                        onChange={(option) => {
                                            setSuretyPartialPaidPaymentMethod(
                                                option
                                            );
                                            setSuretyPartialPaidTransctionId(
                                                ""
                                            );
                                            setSuretyPartialPaidAmount("");
                                            setSuretyPartialPaidNote("");
                                        }}
                                    />
                                    {errroStatusPaymentSurety && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {
                                                errroStatusPaymentSurety.paymentMethodPP
                                            }
                                        </p>
                                    )}

                                    <div className="mt-4">
                                        <label
                                            className="font-bold"
                                            htmlFor="transaction_id"
                                        >
                                            Transaction Id
                                        </label>
                                        <input
                                            type="text"
                                            id="transaction_id"
                                            className="border-1 block w-80 h-9 focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                                            onChange={(e) =>
                                                setSuretyPartialPaidTransctionId(
                                                    e.target.value
                                                )
                                            }
                                            value={
                                                suretyPartialPaidTransctionId
                                            }
                                        />
                                        {errroStatusPaymentSurety && (
                                            <p className="text-red-500 font-Poppins font-medium text-xs">
                                                {errroStatusPaymentSurety.tId}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <label
                                            className="font-bold"
                                            htmlFor="amount"
                                        >
                                            Amount
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            id="amount"
                                            className="border-1 block w-80 h-9 focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                                            onChange={(e) =>
                                                setSuretyPartialPaidAmount(
                                                    e.target.value
                                                )
                                            }
                                            value={suretyPartialPaidAmount}
                                        />
                                        {errroStatusPaymentSurety && (
                                            <p className="text-red-500 font-Poppins font-medium text-xs">
                                                {
                                                    errroStatusPaymentSurety.amount
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <label
                                            className="font-bold"
                                            htmlFor="partial_paid_note"
                                        >
                                            Note
                                        </label>
                                        <textarea
                                            type="text"
                                            id="partial_paid_note"
                                            className="border-1 block w-full  focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                                            value={suretyPartialPaidNote}
                                            onChange={(e) =>
                                                setSuretyPartialPaidNote(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                            {customerPaymentSuretyStatusValue?.value ==
                                "paid" && (
                                <div>
                                    <p className="font-Poppins font-bold mb-1 mt-4">
                                        Select Payment Method
                                    </p>
                                    <Select
                                        isClearable={true}
                                        options={suretyPaidPaymentMethodOptions}
                                        value={suretyPaidPaymentMethod}
                                        onChange={(option) => {
                                            setSuretyPaidPaymentMethod(option);
                                            setSuretyPaidAmount("");
                                            setSuretyPaidTransctionId("");
                                        }}
                                    />
                                    {errroStatusPaymentSurety && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {
                                                errroStatusPaymentSurety.paymentMethodPP
                                            }
                                        </p>
                                    )}

                                    <div className="mt-4">
                                        <label
                                            className="font-bold"
                                            htmlFor="amount"
                                        >
                                            Amount
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            id="amount"
                                            className="border-1 block w-80 h-9 focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                                            onChange={(e) =>
                                                setSuretyPaidAmount(
                                                    e.target.value
                                                )
                                            }
                                            value={suretyPaidAmount}
                                        />
                                        {errroStatusPaymentSurety && (
                                            <p className="text-red-500 font-Poppins font-medium text-xs">
                                                {
                                                    errroStatusPaymentSurety.amount
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {suretyPaidPaymentMethod?.value != "cod" ? (
                                        <div className="mt-4">
                                            <label
                                                className="font-bold"
                                                htmlFor="transaction_id"
                                            >
                                                Transaction Id
                                            </label>
                                            <input
                                                type="text"
                                                id="transaction_id"
                                                className="border-1 block w-80 h-9 focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                                                onChange={(e) =>
                                                    setSuretyPaidTransctionId(
                                                        e.target.value
                                                    )
                                                }
                                                value={suretyPaidTransctionId}
                                            />
                                            {errroStatusPaymentSurety && (
                                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                                    {
                                                        errroStatusPaymentSurety.tId
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        ""
                    )}
                    <div className="flex justify-end w-full mt-8">
                        <button
                            type="submit"
                            onClick={handleConfirmButton}
                            className="bg-green-500 hover:bg-green-400 font-semibold text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Codes ENDS for the modal that opens, when Status is changed to Return, Complete Return or Cancelled */}

            <Modal
                open={confirmStatusModal}
                onClose={handleConfirmationModal}
                center={true}
                blockScroll={false}
            >
                <div className="py-4 px-4" style={{ width: 500 }}>
                    <p className="font-Poppins text-center mb-4">
                        Are you Sure to change the status into
                    </p>
                    <p className="font-Poppins font-bold text-lg text-center mb-4">
                        {tempStatus?.label}
                    </p>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            onClick={handleConfirmingStatus}
                            className="bg-green-500 hover:bg-green-400 font-semibold text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                        >
                            Confirm
                        </button>
                        <button
                            type="submit"
                            onClick={() => {
                                setConfirmStatusModal(false);
                                setTempStatus(null);
                            }}
                            className="bg-red-500 hover:bg-red-400 font-semibold text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                open={paidModal}
                onClose={handlePaidModal}
                center={true}
                blockScroll={false}
            >
                <div
                    className="py-4 px-4"
                    style={{ width: 500, minHeight: 250 }}
                >
                    <p className="font-bold mb-4">Select payment Method</p>
                    <Select
                        isClearable={true}
                        options={paymentOptions}
                        value={selectedPaymentOption}
                        onChange={(option) => setSelectedPaymentOption(option)}
                    />
                    {errorStatus && (
                        <p className="text-red-500 font-Poppins font-medium text-xs">
                            {errorStatus.payment_method}
                        </p>
                    )}

                    <div className="mt-4">
                        <label className="font-bold" htmlFor="transaction_id">
                            Amount
                        </label>
                        <input
                            type="number"
                            min={0}
                            id="transaction_amount"
                            className="border-1 block w-80 h-9 focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                            onChange={(e) => setPaidAmount(e.target.value)}
                            value={paid_amount}
                        />
                        {errorStatus && (
                            <p className="text-red-500 font-Poppins font-medium text-xs">
                                {errorStatus.paid_amount}
                            </p>
                        )}
                    </div>

                    {selectedPaymentOption?.value == "bkash" ||
                    selectedPaymentOption?.value == "nagad" ? (
                        <div className="mt-4">
                            <label
                                className="font-bold"
                                htmlFor="transaction_id"
                            >
                                Transaction Id
                            </label>
                            <input
                                type="text"
                                id="transaction_id"
                                className="border-1 block w-80 h-9 focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                                onChange={(e) =>
                                    setTransactionIdPaid(e.target.value)
                                }
                                value={transactionIdPaid}
                            />
                            {errorStatus && (
                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                    {errorStatus.transactionId}
                                </p>
                            )}
                        </div>
                    ) : (
                        ""
                    )}

                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            onClick={handlePaymentMethod}
                            className="bg-green-500 hover:bg-green-400 font-semibold text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                open={partialPaidModal}
                onClose={handlePartialPaidModal}
                center={true}
                blockScroll={false}
            >
                <div className="py-4 px-4" style={{ width: 500 }}>
                    <p className="font-bold mb-4">Select payment Method</p>
                    <Select
                        isClearable={true}
                        options={partialPaidOptions}
                        value={partialPaidPaymentMethod}
                        onChange={(option) =>
                            setpartialPaidPaymentMethod(option)
                        }
                    />
                    {errorStatus && (
                        <p className="text-red-500 font-Poppins font-medium text-xs">
                            {errorStatus.payment_method}
                        </p>
                    )}

                    <div className="mt-4">
                        <label className="font-bold" htmlFor="transaction_id">
                            Transaction Id
                        </label>
                        <input
                            type="text"
                            id="transaction_id"
                            className="border-1 block w-80 h-9 focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                            onChange={(e) =>
                                setPartialPaidTransactionId(e.target.value)
                            }
                            value={partialPaidTransactionId}
                        />
                        {errorStatus && (
                            <p className="text-red-500 font-Poppins font-medium text-xs">
                                {errorStatus.transactionId}
                            </p>
                        )}
                    </div>

                    <div className="mt-4">
                        <label className="font-bold" htmlFor="amount">
                            Amount
                        </label>
                        <input
                            type="number"
                            min={0}
                            id="amount"
                            className="border-1 block w-80 h-9 focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                            onChange={(e) => setPartialPaidTk(e.target.value)}
                            value={partialPaidTk}
                        />
                        {errorStatus && (
                            <p className="text-red-500 font-Poppins font-medium text-xs">
                                {errorStatus.partial_paid_amount}
                            </p>
                        )}
                    </div>

                    <div className="mt-4">
                        <label
                            className="font-bold"
                            htmlFor="partial_paid_note"
                        >
                            Note
                        </label>
                        <textarea
                            type="text"
                            id="partial_paid_note"
                            className="border-1 block w-full  focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                            value={partialPaidModalNote}
                            onChange={(e) =>
                                setPartialPaidModalNote(e.target.value)
                            }
                        />
                    </div>

                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            onClick={handlePartialPaymentMethod}
                            className="bg-green-500 hover:bg-green-400 font-semibold text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                open={variableProductModal}
                onClose={handleVariableProductModal}
                center={true}
                blockScroll={false}
            >
                <div className="py-4 px-4">
                    <p className="font-bold">Product Details: </p>
                    {specficProduct && (
                        <div className="flex h-32 mt-6 mb-6">
                            <img
                                src={specficProduct.thumbnail}
                                className="h-full w-32"
                            />
                            <div className="ml-8">
                                <p>{specficProduct.name}</p>
                                <p>SKU: {specficProduct.SKU}</p>
                                <p>Price: {specficProduct.selling_price}</p>
                                <p>Stock: {specficProduct.stock}</p>
                            </div>
                        </div>
                    )}
                    <p className="mb-4 font-bold">Product Variation:</p>
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader">Variation</th>
                                <th className="tableHeader">Stock</th>
                                <th className="tableHeader">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {specficProductVariation &&
                                specficProductVariation.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b py-4 h-20"
                                    >
                                        <td>
                                            {item?.attributes?.map(
                                                (value, index) => (
                                                    <span>{value.value}/</span>
                                                )
                                            )}
                                        </td>

                                        <td>
                                            <p className="">{item.stock}</p>
                                        </td>

                                        <td>
                                            {item.stock == "0" ? (
                                                <p>No Stock Available</p>
                                            ) : (
                                                <div>
                                                    {productVariationLoading ? (
                                                        <button
                                                            className="button button-primary w-32"
                                                            disabled
                                                        >
                                                            {" "}
                                                            <span className="fas fa-sync-alt animate-spin"></span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="button button-primary px-4"
                                                            onClick={() =>
                                                                handleAddingVariantProductToCart(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </Modal>

            <Modal
                open={statusHoldComment}
                onClose={handleModalClose}
                center={true}
                blockScroll={false}
            >
                <div className="py-4 px-4">
                    <p className="mb-4 font-bold text-red-500">
                        Reasoning for holding the Order
                    </p>
                    <textarea
                        id="customerNote"
                        className="border-1 block w-full focus:outline-none px-4 py-4 mt-2 rounded font-DMSans text-sm1"
                        rows="5"
                        cols="60"
                        value={statusHoldNote}
                        onChange={(e) => setStatusHoldNote(e.target.value)}
                    ></textarea>
                    {statusLoading ? (
                        <>
                            <button
                                className="button button-outline-primary w-full mt-8"
                                disabled
                            >
                                {" "}
                                <span className="fas fa-sync-alt animate-spin"></span>
                            </button>
                        </>
                    ) : (
                        <div
                            className="button button-outline-primary cursor-pointer mt-8"
                            onClick={submitHoldNote}
                        >
                            <p>Submit</p>
                        </div>
                    )}
                </div>
            </Modal>
            <Toast />
            <div className="px-8 mt-8 mb-8 overflow-y-auto">
                <div className="page-heading">
                    <h1 className="pageHeading">
                        Order Details of{" "}
                        <span className="font-bold uppercase">
                            #{order.order_number}
                        </span>
                    </h1>

                    <div className="flex justify-end relative">
                        <input
                            className="inputBox"
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder="Order Number, Customer Name, Phone Number"
                        />
                        {search.length >= 3 && (
                            <div className="bg-buttonColor w-80 h-80 absolute z-50 top-9.5 overflow-y-auto">
                                {searchOrderResult.map((value, index) => (
                                    <div key={index} className="p-4">
                                        <Link
                                            to={`/admin/orders/${value.id}/details`}
                                            onClick={() => setSearch("")}
                                            className="text-white"
                                        >
                                            {value.order_number}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex -mx-1">
                    <div className="w-1/2 mx-1">
                        <div className="card">
                            <div className="border-b">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">
                                            Shipping Info
                                        </h4>
                                    </div>
                                    <div>
                                        <i
                                            className="fas fa-edit cursor-pointer"
                                            onClick={() =>
                                                setUpdateShippingInfoModal(true)
                                            }
                                        ></i>
                                    </div>
                                    {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                                    {/* <input className="inputBox" placeholder="Search" /> */}
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="text-sm text-gray-600">
                                    <p className="mb-1">
                                        <span className="mr-4 font-bold">
                                            Name:{" "}
                                        </span>
                                        {order?.shipping?.name}
                                    </p>
                                    <p className="mb-1">
                                        <span className="mr-4 font-bold">
                                            Phone:{" "}
                                        </span>
                                        {order?.shipping?.phone}
                                    </p>
                                    <p className="mb-4">
                                        <span className="mr-4 font-bold">
                                            Email:{" "}
                                        </span>
                                        {order?.shipping?.email}
                                    </p>
                                </div>

                                <div className="mt-2 text-sm">
                                    <p className="text-gray-600 font-bold">
                                        Shipping Address
                                    </p>
                                    <p>{order?.shipping?.address}</p>
                                    <p>
                                        {order?.shipping?.area},{" "}
                                        {order?.shipping?.city},{" "}
                                        {order?.shipping?.region}
                                    </p>
                                </div>
                                <div className="mt-2 text-sm">
                                    <p className="text-gray-600 font-bold">
                                        Shipping Type
                                    </p>
                                    <p className="uppercase">
                                        {order?.shipping_type} Shipping
                                    </p>
                                </div>
                                <div className="mt-2 text-sm">
                                    <p className="text-gray-600 font-bold">
                                        {order?.shipping?.sender_name
                                            ? "Sender information"
                                            : ""}
                                    </p>
                                    <p>
                                        <span className="mr-4 font-bold">
                                            Name:{" "}
                                        </span>
                                        {order?.shipping?.sender_name}
                                    </p>
                                    <p>
                                        <span className="mr-4 font-bold">
                                            Phone:{" "}
                                        </span>
                                        {order?.shipping?.sender_number}
                                    </p>
                                </div>
                                <br />
                                <div className="mt-2 text-sm">
                                    <p className="text-gray-600 font-bold">
                                        Order Via
                                    </p>
                                    <p className="uppercase">
                                        {order?.order_via}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {order.transaction ? (
                            <div className="card mt-2">
                                <div className="border-b">
                                    <div className="card-header">
                                        <div>
                                            <h4 className="pageHeading">
                                                Transaction Info
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="text-sm text-gray-600">
                                        {order.transaction.transaction_id ? (
                                            <p className="mb-1">
                                                <span className="mr-4 font-bold">
                                                    Transaction ID:{" "}
                                                </span>
                                                <span className="uppercase">
                                                    {
                                                        order?.transaction
                                                            ?.transaction_id
                                                    }
                                                </span>
                                            </p>
                                        ) : (
                                            ""
                                        )}
                                        <p className="mb-1">
                                            <span className="mr-4 font-bold">
                                                Payment Method:{" "}
                                            </span>
                                            <span className="uppercase">
                                                {order?.transaction?.method}
                                            </span>
                                        </p>
                                        <p className="mb-4">
                                            <span className="mr-4 font-bold">
                                                Transaction Status:{" "}
                                            </span>
                                            <span className="uppercase">
                                                {order?.transaction?.status}
                                            </span>
                                        </p>
                                        {order?.payment_method == "cod" &&
                                        order?.set_paid == 0 &&
                                        order?.partial_paid == "" &&
                                        order?.transaction?.status != "paid" ? (
                                            <>
                                                <label className="font-bold">
                                                    Update Payment Status
                                                </label>
                                                <Select
                                                    onChange={(option) => {
                                                        setTransaction(
                                                            option.value
                                                        );
                                                    }}
                                                    value={transaction}
                                                    options={TransactionOptions}
                                                />
                                            </>
                                        ) : (
                                            ""
                                        )}

                                        {transaction &&
                                        order?.transaction?.status != "paid" ? (
                                            <>
                                                <label className="font-bold">
                                                    Transaction Id
                                                </label>
                                                <input
                                                    type="text"
                                                    name="transaction_id"
                                                    className="border-1 block w-80 h-9 focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                                                    onChange={(e) =>
                                                        setTransactionId(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <button
                                                    type="submit"
                                                    onClick={updateTransaction}
                                                    className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                                                >
                                                    Update
                                                </button>
                                            </>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}

                        {orderStatus?.value == "Processing" && (
                            <div className="mt-8">
                                <p className="font-bold mb-6">Find Products</p>
                                <div className="flex flex-col relative">
                                    <input
                                        type="text"
                                        placeholder="Search Product...."
                                        className="h-12 w-full px-7 border-2 focus:outline-none rounded"
                                        value={searchValue}
                                        onChange={(e) =>
                                            setSearchValue(e.target.value)
                                        }
                                    />
                                    <div
                                        className={`container mx-auto px-4 bg-white h-80 overflow-y-auto shadow-lg absolute top-12 ${
                                            searchValue.length > 2
                                                ? "visible"
                                                : "hidden"
                                        }`}
                                    >
                                        {searchResult.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex h-32 mt-6 mb-6 cursor-pointer"
                                                onClick={() =>
                                                    handleSelectingProduct(item)
                                                }
                                            >
                                                <img
                                                    src={item.thumbnail}
                                                    className="h-full w-32"
                                                />
                                                <div className="ml-8">
                                                    <p>{item.name}</p>
                                                    <p>SKU: {item.SKU}</p>
                                                    <p>
                                                        Price:{" "}
                                                        {item.selling_price}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-1/2 mx-1">
                        {user?.permissions &&
                        (permission(
                            user.permissions,
                            "order_history",
                            "update"
                        ) ||
                            user.user_type_id == 1) ? (
                            <div className="card">
                                <div className="border-b">
                                    <div className="card-header">
                                        <div>
                                            <h4 className="pageHeading">
                                                Order Status
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <label className="text-sm">
                                            Select Status
                                        </label>
                                        {order.status == undefined ? (
                                            ""
                                        ) : (
                                            <Select
                                                onChange={(option) => {
                                                    setTempStatus(option);
                                                }}
                                                options={statuses}
                                                value={orderStatus}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}

                        {user?.permissions &&
                        order?.order_note &&
                        (permission(
                            user.permissions,
                            "order_history",
                            "update"
                        ) ||
                            user.user_type_id == 1) ? (
                            <div className="card mt-2">
                                <div className="border-b">
                                    <div className="card-header">
                                        <div>
                                            <h4 className="pageHeading">
                                                Hold Note
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <table className="table-fixed w-full">
                                        <thead>
                                            <tr className="border-b h-12">
                                                <th className="tableHeader">
                                                    Note
                                                </th>
                                                <th className="tableHeader">
                                                    Date-Time
                                                </th>
                                                <th className="tableHeader">
                                                    User
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {holdNoteLogs?.map(
                                                (item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-b py-4 h-20"
                                                    >
                                                        <td>
                                                            <p className="tableData">
                                                                {
                                                                    item
                                                                        .properties
                                                                        .order_note
                                                                }
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p className="tableData">
                                                                <span className="font-bold">
                                                                    <Moment>
                                                                        {
                                                                            item.created_at
                                                                        }
                                                                    </Moment>
                                                                </span>
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p className="tableData">
                                                                {
                                                                    item.causer
                                                                        .name
                                                                }{" "}
                                                                <small>
                                                                    (
                                                                    {
                                                                        item
                                                                            .causer
                                                                            .email
                                                                    }
                                                                    )
                                                                </small>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}

                        {user?.permissions &&
                        (permission(
                            user.permissions,
                            "order_history",
                            "update"
                        ) ||
                            user.user_type_id == 1) ? (
                            <div className="card mt-2">
                                <div className="border-b">
                                    <div className="card-header">
                                        <div>
                                            <h4 className="pageHeading">
                                                Order Via
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <label className="text-sm">
                                            Order Via
                                        </label>
                                        <Select
                                            options={orderViaOptions}
                                            value={selectedOrderVia}
                                            onChange={(option) => {
                                                toast.promise(
                                                    updateOrderVia(option),
                                                    {
                                                        loading: "Updating..",
                                                        success: "Updated",
                                                        error: "Something wrong!",
                                                    }
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}

                        {user?.permissions &&
                        (permission(
                            user.permissions,
                            "order_history",
                            "update"
                        ) ||
                            user.user_type_id == 1) ? (
                            <div className="card mt-2">
                                <div className="border-b">
                                    <div className="card-header">
                                        <div>
                                            <h4 className="pageHeading">
                                                Courier
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <label className="text-sm">
                                            Select Courier
                                        </label>
                                        <Select
                                            options={couriers}
                                            value={mycourier}
                                            onChange={(option) => {
                                                toast.promise(
                                                    updateCourier(option),
                                                    {
                                                        loading: "Updating..",
                                                        success: "Updated",
                                                        error: "Something wrong!",
                                                    }
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}

                        <div className="card  mt-2">
                            <div className="border-b">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">
                                            Payment Info
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="text-sm text-gray-600">
                                    <div class="grid grid-cols-12 gap-4 mb-3">
                                        <div className="col-span-4">
                                            <span className="mr-4 font-bold">
                                                Payment Method:{" "}
                                            </span>
                                        </div>

                                        <div className="col-span-4">
                                            <span className="uppercase">
                                                {order?.payment_method}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-12 gap-4 mb-3">
                                        <div className="col-span-4">
                                            <span className="mr-4 font-bold">
                                                Sub Total:{" "}
                                            </span>
                                        </div>

                                        <div className="col-span-4">
                                            <span className="uppercase">
                                                {order?.sub_total} Tk
                                            </span>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-12 gap-4 mb-3">
                                        <div className="col-span-4">
                                            <span className="mr-4 font-bold">
                                                Shipping Total:{" "}
                                            </span>
                                        </div>

                                        <div className="col-span-4">
                                            <span className="uppercase">
                                                {showInput ? (
                                                    <>
                                                        <input
                                                            value={
                                                                inputShipping
                                                            }
                                                            onChange={(e) =>
                                                                setInputShipping(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            onBlur={
                                                                updateShippingCharge
                                                            }
                                                        />
                                                    </>
                                                ) : (
                                                    <span
                                                        onClick={setShowInput(
                                                            !showInput
                                                        )}
                                                    >
                                                        {order.shipping_total}{" "}
                                                        Tk
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-12 gap-4 mb-3">
                                        <div className="col-span-4">
                                            <span className="mr-4 font-bold">
                                                Discount Total:{" "}
                                            </span>
                                        </div>

                                        <div className="col-span-4">
                                            <span className="uppercase">
                                                {order?.discount_total} Tk
                                            </span>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-12 gap-4 mb-3">
                                        <div className="col-span-4">
                                            <span className="mr-4 font-bold">
                                                Special Total:{" "}
                                            </span>
                                        </div>

                                        <div className="col-span-4">
                                            <span className="uppercase">
                                                {order?.special_discount} Tk
                                            </span>
                                            {order.special_discount_note && (
                                                <p className="mt-2">
                                                    <span className="font-bold mr-2">
                                                        Special Discount Note:
                                                    </span>{" "}
                                                    {
                                                        order.special_discount_note
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-12 gap-4 mb-3">
                                        <div className="col-span-4">
                                            <span className="mr-4 font-bold">
                                                Total:{" "}
                                            </span>
                                        </div>

                                        <div className="col-span-4">
                                            <span className="uppercase">
                                                {order.total -
                                                    order.special_discount}{" "}
                                                Tk
                                            </span>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-12 gap-4 mb-3">
                                        <div className="col-span-4">
                                            <span className="mr-4 font-bold">
                                                Customer Paid:{" "}
                                            </span>
                                        </div>

                                        <div className="col-span-4">
                                            <span className="uppercase">
                                                {order?.totalTransaction} Tk
                                            </span>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-12 gap-4 mb-3">
                                        <div className="col-span-4">
                                            <span className="mr-4 font-bold">
                                                Customer Refund Money:{" "}
                                            </span>
                                        </div>

                                        <div className="col-span-4">
                                            <span className="uppercase">
                                                {order?.totalTransactionWallet}{" "}
                                                Tk
                                            </span>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-12 gap-4 mb-3">
                                        <div className="col-span-4">
                                            <span className="mr-4 font-bold">
                                                Total Payable:{" "}
                                            </span>
                                        </div>

                                        <div className="col-span-4">
                                            <span className="uppercase">
                                                {order.total +
                                                    order.totalTransactionWallet -
                                                    (order.special_discount +
                                                        order.totalTransaction)}{" "}
                                                Tk
                                            </span>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-12 gap-4 mb-3">
                                        <div className="col-span-4">
                                            <span className="mr-4 font-bold">
                                                Payment Status:{" "}
                                            </span>
                                        </div>

                                        <div className="col-span-8">
                                            <span className="uppercase">
                                                {order.set_paid == 1
                                                    ? "Paid"
                                                    : order.partial_paid == 0
                                                    ? "Unpaid"
                                                    : "Partial Paid"}
                                            </span>

                                            <div className="mt-3">
                                                {order.set_paid == 0 ? (
                                                    <>
                                                        <label className="font-bold">
                                                            Update Payment
                                                            Status
                                                        </label>
                                                        <Select
                                                            className="mt-3"
                                                            isSearchable={false}
                                                            onChange={(
                                                                option
                                                            ) =>
                                                                setMyPaymentStatus(
                                                                    option
                                                                )
                                                            }
                                                            options={options}
                                                            value={
                                                                myPaymentStatus
                                                            }
                                                        />
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </div>

                                            {order?.special_discount == "0" &&
                                            order?.set_paid != true ? (
                                                <div>
                                                    <input
                                                        className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer mt-5"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                        onChange={() =>
                                                            setSpecialDiscount(
                                                                !specialDiscount
                                                            )
                                                        }
                                                        checked={
                                                            specialDiscount
                                                        }
                                                    />
                                                    <label
                                                        className="form-check-label inline-block text-gray-800 mt-5"
                                                        for="flexCheckDefault"
                                                    >
                                                        Special Discount
                                                    </label>
                                                </div>
                                            ) : (
                                                ""
                                            )}

                                            {specialDiscount && (
                                                <>
                                                    <div className="mt-3">
                                                        <div>
                                                            <label className="font-bold">
                                                                Special Discount
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="special_discount"
                                                                className="block mt-3 w-full rounded"
                                                                defaultValue={
                                                                    order.special_discount
                                                                }
                                                                onChange={(e) =>
                                                                    setSpecialDiscountAmount(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            {
                                                                <p className="text-red-500 mt-1">
                                                                    {errors
                                                                        ? errors[
                                                                              `special_discount`
                                                                          ][0]
                                                                        : null}
                                                                </p>
                                                            }
                                                        </div>
                                                        <div className="my-3">
                                                            <label className="font-bold">
                                                                Note
                                                            </label>
                                                            <textarea
                                                                type="text"
                                                                name="special_discount_note"
                                                                className="block mt-3 w-full rounded"
                                                                defaultValue={
                                                                    order.special_discount_note
                                                                }
                                                                onChange={(e) =>
                                                                    setSpecialDiscountNote(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <input
                                                            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                                            type="checkbox"
                                                            value=""
                                                            id="flexCheckDefault"
                                                            name="special_discount_note_checkbox"
                                                            onChange={() =>
                                                                setspecialDiscountNoteCheck(
                                                                    !specialDiscountNoteCheck
                                                                )
                                                            }
                                                            checked={
                                                                specialDiscountNoteCheck
                                                            }
                                                        />
                                                        <label
                                                            className="form-check-label inline-block text-gray-800"
                                                            for="flexCheckDefault"
                                                        >
                                                            Show in invoice
                                                        </label>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        onClick={() =>
                                                            updateSpecialDiscount(
                                                                id
                                                            )
                                                        }
                                                        className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded mt-5"
                                                    >
                                                        Update
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card mt-4">
                            <div className="border-b">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">
                                            Special Note
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="grid grid-cols-12">
                                    <div className="col-span-10">
                                        <textarea
                                            className="border-1 block w-full focus:outline-none px-4 py-4 mt-2 rounded font-DMSans text-sm1"
                                            rows="3"
                                            value={specialNote}
                                            onChange={(e) =>
                                                setSpecialNote(e.target.value)
                                            }
                                        ></textarea>
                                    </div>

                                    <div className="col-span-2">
                                        <div className="flex items-center justify-center h-full">
                                            {specialNoteSubmitLoading ? (
                                                <button
                                                    className="button button-outline-primary w-24"
                                                    disabled
                                                >
                                                    {" "}
                                                    <span className="fas fa-sync-alt animate-spin"></span>
                                                </button>
                                            ) : (
                                                <div
                                                    className="button button-outline-primary w-24 cursor-pointer"
                                                    onClick={
                                                        handleSubmitSpecialNote
                                                    }
                                                >
                                                    <p>Submit</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {allSpecialNotes.length > 0 && (
                                    <div className="mt-6">
                                        <table className="table-fixed w-full">
                                            <thead>
                                                <tr className="border-b h-12">
                                                    <th className="tableHeader w-1/3">
                                                        Special Note
                                                    </th>
                                                    <th className="tableHeader w-1/3">
                                                        Status
                                                    </th>
                                                    <th className="tableHeader w-1/3">
                                                        Date-Time
                                                    </th>
                                                    <th className="tableHeader w-1/3">
                                                        User
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {allSpecialNotes.map(
                                                    (item, index) => (
                                                        <tr
                                                            key={index}
                                                            className="border-b py-4 h-20"
                                                        >
                                                            <td>
                                                                <p className="tableData">
                                                                    {item?.note}
                                                                </p>
                                                            </td>

                                                            <td>
                                                                <p className="tableData">
                                                                    {
                                                                        item?.status
                                                                    }
                                                                </p>
                                                            </td>

                                                            <td>
                                                                <p className="tableData">
                                                                    <span className="font-bold">
                                                                        <Moment>
                                                                            {
                                                                                item?.created_at
                                                                            }
                                                                        </Moment>
                                                                    </span>
                                                                </p>
                                                            </td>

                                                            <td>
                                                                <p className="tableData">
                                                                    {
                                                                        item
                                                                            ?.user
                                                                            ?.name
                                                                    }
                                                                </p>
                                                                <p className="tableData">
                                                                    {
                                                                        item
                                                                            ?.user
                                                                            ?.email
                                                                    }
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex -mx-1">
                    <div className="w-full mx-1 mt-4">
                        <div className="card">
                            <div className="border-b">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">
                                            Ordered Item
                                        </h4>
                                    </div>
                                    <div>
                                        <Link
                                            to={{
                                                pathname: `/admin/order/invoice/print/${id}`,
                                                state: "view",
                                            }}
                                            className="font-Poppins text-xs px-4 py-2 border-1 border-borderColor text-black hover:bg-buttonColor hover:text-black rounded-lg mt-4 inline-block mr-4"
                                        >
                                            View Invoice
                                        </Link>
                                        <Link
                                            to={{
                                                pathname: `/admin/order/invoice/print/${id}`,
                                            }}
                                            className="font-Poppins text-xs px-4 py-2 border-1 border-borderColor text-black hover:bg-buttonColor hover:text-black rounded-lg mt-4 inline-block"
                                        >
                                            Print Invoice
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <table className="table-fixed w-full">
                                    <thead>
                                        <tr className="border-b h-12">
                                            <th className="tableHeader w-8">
                                                #
                                            </th>
                                            <th className="tableHeader">
                                                Item
                                            </th>
                                            <th className="tableHeader">
                                                Image
                                            </th>
                                            <th className="tableHeader">SKU</th>
                                            <th className="tableHeader">Qty</th>
                                            <th className="tableHeader">
                                                Unit Price
                                            </th>
                                            <th className="tableHeader">
                                                Line Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order?.items?.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b py-4 h-20"
                                            >
                                                <td>
                                                    <p className="tableData">
                                                        <span className="font-bold">
                                                            {index + 1}
                                                        </span>
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="tableData">
                                                        {item.product.name}
                                                    </p>

                                                    {item?.productAttributes?.map(
                                                        (
                                                            productAttribute,
                                                            index
                                                        ) => (
                                                            <span
                                                                className="bg-gray-100 px-2 rounded-full text-sm mr-1"
                                                                key={index}
                                                            >
                                                                {Object.values(
                                                                    productAttribute
                                                                )}
                                                            </span>
                                                        )
                                                    )}
                                                </td>
                                                <td>
                                                    <img
                                                        src={item?.image}
                                                        alt="product"
                                                        height={150}
                                                        width={150}
                                                    />
                                                </td>
                                                <td>
                                                    <p className="tableData">
                                                        {item.product.SKU}
                                                    </p>
                                                </td>
                                                <td>
                                                    {order?.status ==
                                                    "Processing" ? (
                                                        <div className="w-1/2 h-10 border-1 flex justify-between items-center">
                                                            <div
                                                                className="w-2/4  flex justify-center items-center cursor-pointer border-r-1"
                                                                onClick={() =>
                                                                    productQuantityRemove(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                <BiMinus />
                                                            </div>
                                                            <div className="w-2/4  flex justify-center items-center">
                                                                <p className="tableData">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div
                                                                className="w-2/4  flex justify-center items-center cursor-pointer border-l-1"
                                                                onClick={() =>
                                                                    productQuantityIncrement(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                <BiPlus />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="tableData">
                                                            {item.quantity}
                                                        </p>
                                                    )}
                                                </td>
                                                <td>
                                                    <p className="tableData">
                                                        TK. {item.unit_price}
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="tableData">
                                                        TK. {item.line_total}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {order?.refundOrderItems?.length > 0 && (
                    <div className="flex -mx-1">
                        <div className="w-full mx-1 mt-4">
                            <div className="card">
                                <div className="border-b">
                                    <div className="card-header">
                                        <div>
                                            <h4 className="pageHeading">
                                                Refund Order Items
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <table className="table-fixed w-full">
                                        <thead>
                                            <tr className="border-b h-12">
                                                <th className="tableHeader w-8">
                                                    #
                                                </th>
                                                <th className="tableHeader">
                                                    Item
                                                </th>
                                                <th className="tableHeader">
                                                    Image
                                                </th>
                                                <th className="tableHeader">
                                                    SKU
                                                </th>
                                                <th className="tableHeader">
                                                    Qty
                                                </th>
                                                <th className="tableHeader">
                                                    Unit Price
                                                </th>
                                                <th className="tableHeader">
                                                    Line Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order?.refundOrderItems?.map(
                                                (item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-b py-4 h-20"
                                                    >
                                                        <td>
                                                            <p className="tableData">
                                                                <span className="font-bold">
                                                                    {index + 1}
                                                                </span>
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p className="tableData">
                                                                {
                                                                    item.product
                                                                        .name
                                                                }
                                                            </p>

                                                            {item?.productAttributes?.map(
                                                                (
                                                                    productAttribute,
                                                                    index
                                                                ) => (
                                                                    <span
                                                                        className="bg-gray-100 px-2 rounded-full text-sm mr-1"
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {Object.values(
                                                                            productAttribute
                                                                        )}
                                                                    </span>
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            <img
                                                                src={
                                                                    item?.image
                                                                }
                                                                alt="product"
                                                                height={150}
                                                                width={150}
                                                            />
                                                        </td>
                                                        <td>
                                                            <p className="tableData">
                                                                {
                                                                    item.product
                                                                        .SKU
                                                                }
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p className="tableData">
                                                                {item.quantity}
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p className="tableData">
                                                                TK.{" "}
                                                                {
                                                                    item.unit_price
                                                                }
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p className="tableData">
                                                                TK.{" "}
                                                                {
                                                                    item.line_total
                                                                }
                                                            </p>
                                                        </td>
                                                    </tr>
                                                )
                                            )}

                                            <tr className="border-b">
                                                <td
                                                    className="text-right font-bold"
                                                    colSpan="6"
                                                >
                                                    <p>Total Refund :</p>
                                                </td>
                                                <td>
                                                    <p className="ml-2">
                                                        {" "}
                                                        {order?.refundOrderItems.reduce(
                                                            (sum, item) =>
                                                                sum +
                                                                item.line_total,
                                                            0
                                                        )}{" "}
                                                        Tk
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex -mx-1">
                    <div className="w-1/2 mx-1 mt-4">
                        <div className="card">
                            <div className="border-b">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">
                                            User Logs
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <table className="table-fixed w-full">
                                    <thead>
                                        <tr className="border-b h-12">
                                            <th className="tableHeader">
                                                Action
                                            </th>
                                            <th className="tableHeader">
                                                Date-Time
                                            </th>
                                            <th className="tableHeader">
                                                User
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b py-4 h-20">
                                            <td>
                                                <p className="tableData">
                                                    Order Created at
                                                </p>
                                            </td>
                                            <td>
                                                <p className="tableData">
                                                    <span className="font-bold">
                                                        <Moment>
                                                            {order.created_at}
                                                        </Moment>
                                                    </span>
                                                </p>
                                            </td>
                                        </tr>
                                        {userLogs?.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b py-4 h-20"
                                            >
                                                <td>
                                                    <p className="tableData">
                                                        {item.action}
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="tableData">
                                                        <span className="font-bold">
                                                            <Moment>
                                                                {
                                                                    item.created_at
                                                                }
                                                            </Moment>
                                                        </span>
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="tableData">
                                                        {item.user.name}{" "}
                                                        <small>
                                                            ({item.user.email})
                                                        </small>
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 mx-1 mt-4">
                        <div className="card">
                            <div className="border-b">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">
                                            Payment History Logs
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <table className="table-fixed w-full">
                                    <thead>
                                        <tr className="border-b h-12">
                                            <th className="tableHeader">
                                                Action
                                            </th>
                                            <th className="tableHeader">
                                                Occurrence
                                            </th>
                                            <th className="tableHeader">
                                                Date-Time
                                            </th>
                                            <th className="tableHeader">
                                                User
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentHistoryLogs?.map(
                                            (item, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b py-4 h-20"
                                                >
                                                    <td>
                                                        <p className="tableData">
                                                            {item.description}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="tableData">
                                                            {
                                                                item.properties
                                                                    .payment_type
                                                            }{" "}
                                                            {
                                                                item.properties
                                                                    .amount
                                                            }{" "}
                                                            via{" "}
                                                            {
                                                                item.properties
                                                                    .method
                                                            }
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="tableData">
                                                            <span className="font-bold">
                                                                <Moment>
                                                                    {
                                                                        item.created_at
                                                                    }
                                                                </Moment>
                                                            </span>
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="tableData">
                                                            {item.causer.name}{" "}
                                                            <small>
                                                                (
                                                                {
                                                                    item.causer
                                                                        .email
                                                                }
                                                                )
                                                            </small>
                                                        </p>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <UpdateShippingInfo
                updateShippingInfoModal={updateShippingInfoModal}
                setUpdateShippingInfoModal={setUpdateShippingInfoModal}
                orderData={order}
            />
        </>
    );
}
