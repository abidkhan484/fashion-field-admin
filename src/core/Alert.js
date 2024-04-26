import React from 'react'

export default function Alert({ status, type, message, changeStatus, margin, width }) {

    // const [showAlert, setShowAlert] = React.useState(false);

    React.useEffect(() => {

    }, [status])

    let background = "";
    let notice = "";

    switch (type) {
        case 'SUCCESS':
            background = "bg-green-500";
            notice = "SUCCESS!"
            break;
        case 'DANGER':
            background = "bg-red-500";
            notice = "ERROR!"
            break;
        case 'INFO':
            background = "bg-lightBlue-500"
            notice = "INFO!"
            break;
        case 'WARNING':
            background = "bg-yellow-500"
            notice = "INFO!"
            break;
        default:
            background = "bg-gray-500"
    }

    return (
        <>
            {status ? (
                <div className={`py-3 px-4 mb-4 rounded-full text-white flex items-center justify-between ${background} ${margin} ${width}`}>
                    <p><span className="fas fa-bell"></span> <span className="font-bold">{notice}</span> {message}</p> <button className="focus:outline-none" onClick={() => changeStatus({})}>
                        <span className="fa fa-times"></span>
                    </button>
                </div>
            ) : null}
        </>
    )
}
