import React from 'react'

export default function Td({children}) {
    return (
        <>
            <td
            className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >{children}</td>
        </>
    )
}
