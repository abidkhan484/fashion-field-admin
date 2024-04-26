import React from 'react'

export default function Th({children, cssClass}) {

    let styleClass = (cssClass) ? cssClass : "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100";

    return (
        <>
            <th
            className={styleClass}
            >{children}</th>
        </>
    )
}
