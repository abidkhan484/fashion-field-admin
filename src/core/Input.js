import React from 'react'

export default function Input({type='text', name, value, change, required}) {

    const thisRef = React.useRef(null);

    React.useEffect(() => {
        if(type === 'tel')
            thisRef.current.pattern = "[0-9]{11}";

        if(required)
            thisRef.current.required = true;
            

    })

    return (
        <input
            type={type}
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            value={value}
            name={name}
            onChange={(e) => change(e)}
            ref={thisRef}
        />
    )
}
