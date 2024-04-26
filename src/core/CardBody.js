import React from 'react'

export default function CardBody({children}) {
    return (
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            {children}
        </div>
    )
}
