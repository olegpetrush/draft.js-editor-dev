import React from 'react'
import Button, { ButtonProps } from '../Button';

interface ButtonGroupProps {
    buttons: ButtonProps[]
}
const ButtonGroup: React.FC<ButtonGroupProps> = (props) => {
    return (
        <>
            {props.buttons.map((buttonProps, index) => (<Button key={`button-${index}`} {...buttonProps} />))}
        </>
    )
}

export default ButtonGroup;