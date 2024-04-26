import React from 'react'
import Checkbox from './Checkbox';
import Input from './Input'
import Label from './Label'
import Textarea from './Textarea'

export default function InputGroup({label, type='text', name, value, change, required=false, checked}) {

    if(type === 'textarea')
    {
        return (
            <>
                <Label label={label} />
                <Textarea name={name} value={value} change={change} />
            </>
        );

    }else if(type === 'checkbox'){

        return (
            <>
                <Checkbox name={name} id={name} change={change} checked={checked} /> <label htmlFor={name}>{label}</label>
            </>
        );

    }else{

        return (
            <>
                <Label label={label} />
                <Input type={type} name={name} value={value} change={change} required={required} />
            </>
        );
    }

}
