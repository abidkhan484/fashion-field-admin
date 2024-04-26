import React from 'react'

export default function CardHeading({title, button}) {
    return (
        <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">{title}</h6>
                {button}
            </div>
        </div>
    )
}
