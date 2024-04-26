import React from 'react'

export default function Status({ status }) {
    // console.log(status)
    return (
        <>
            {/* {status === 1 ? (
                <span className="text-xs font-semibold uppercase bg-green-400 text-white px-3 py-1 rounded-full">Active</span>
            ) : (
                <span className="text-xs font-semibold uppercase bg-red-400 text-white px-3 py-1 rounded-full">Deactive</span>
            )} */}
            {
                status ? <span className="text-xs font-semibold uppercase bg-green-400 text-white px-3 py-1 rounded-full">Active</span> : <span className="text-xs font-semibold uppercase bg-red-400 text-white px-3 py-1 rounded-full">Deactive</span>
            }
        </>
    )
}
