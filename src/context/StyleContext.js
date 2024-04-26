import React from 'react'

export const StyleContext = React.createContext();

export const StyleProvider = ({children}) => {

    const color = {
        primary: '#6160DC',
        dark: '#22242C',
        info: '#54C5EB',
        warning: '#FFB74A',
        danger: '#FF4A55',
        success: '#00A389'
    }
    

    const [styles, setStyles] = React.useState({
        // buttons
        button: 'flex px-6 py-2 text-sm rounded-full mx-2 shadow-lg focus:outline-none focus:ring',
        buttonOutlinePrimary: 'bg-transparent border-2 border-purple-500 text-purple-500 hover:text-white hover:bg-purple-700 hover:border-purple-700',
        buttonPrimary: 'border-2 border-purple-500 bg-purple-500 text-white hover:bg-purple-700 hover:border-purple-700 active:bg-purple-900',
        buttonSuccess: 'border-2 border-green-500 bg-green-500 text-white hover:bg-green-700 hover:border-green-700 active:bg-green-900',
        buttonDanger: 'border-2 border-red-500 bg-red-500 text-white hover:bg-red-700 hover:border-red-700 active:bg-purple-900',
        buttonRoundedPrimary: 'w-8 h-8 shadow rounded-full border-2 border-purple-500 bg-purple-500 text-white hover:bg-purple-700 hover:border-purple-700 active:bg-purple-900 leading-3 mx-2 focus:ring focus:outline-none',
        buttonRoundedDefault: 'text-gray-500 mx-2 leading-3 focus:ring focus:outline-none',
        buttonRoundedDefaultOutline: 'w-8 h-8 shadow rounded-full border-2 border-gray-500 text-gray-500 hover:text-gray-700 hover:border-gray-700 mx-2 leading-3 focus:ring focus:outline-none',

        //Page Header Styles
        pageHeading: 'w-full mb-6 flex justify-between items-center',
        pageHeadingTitle: 'text-2xl font-bold text-gray-800',

        textSuccess: 'text-pink-500 bg-white shadow px-6 py-4 w-36',

        //Card Styles
        card: 'bg-white w-full shadow-xs rounded-3xl p-6',
        cardHeader: 'mb-4 pb-2 flex flex-col md:flex-row justify-between items-start md:items-end',
        cardHeaderTitle: 'text-2xl font-bold text-gray-800',
        cardHeaderSubTitle: 'text-sm text-gray-400 mb-1',
        cardBody: 'pb-4 pt-2',
        cardFooter: 'mt-6 py-3',

        // Input Text
        formLabel: 'w-full text-gray-500 text-lg',
        formControl: 'w-full mt-3 text-gray-900 border-2 border-gray-700 rounded-3xl font-semibold focus:border-purple-500 disabled:opacity-50 shadow',
        formTextarea: 'w-full mt-3 px-2 py-1 text-gray-900 border-2 border-gray-700 rounded-lg focus:border-purple-500 disabled:opacity-50 shadow',
    });

    return <StyleContext.Provider value={[styles]}>{ children }</StyleContext.Provider>
}
