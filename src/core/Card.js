import React from 'react'

export default function Card({children}) {
    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            {children}
        </div>
    )
}
