import React from 'react'

export default function Label({label}) {
    return (
        <label
            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
        >
            {label}
        </label>
    )
}
