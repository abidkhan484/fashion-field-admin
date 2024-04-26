import React from 'react'

import LoadingGif from 'Loader.gif';
import { ImSpinner9 } from "react-icons/im"

export default function Loader({ loading }) {

    return (
        <>
            {(loading) ? (
                <div className="w-full flex justify-center items-center fixed z-50" style={{ height: "120%", marginTop: "-20px", paddingBottom: '50px' }}>
                    {/* <div className="lg:w-3/12 md:w-6/12 w-6/12 text-center bg-white py-10 rounded-lg shadow-lg flex justify-center absolute" style={{ top: "40%", marginTop: "-160px" }}> */}
                    <span className="text-4xl animate-spin">
                        {/* <i className="fas fa-sync-alt"></i> */}
                        <ImSpinner9 fontSize={100} color="#25bcf1" />
                    </span>
                    {/* </div> */}
                </div>
            ) : ''}

        </>
    );
}
