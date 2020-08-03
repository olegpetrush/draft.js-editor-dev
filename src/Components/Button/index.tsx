import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    title?: string
    icon?: string
    className?: string
}
const Button: React.FC<ButtonProps> = ({ title, icon, className, ...rest }) => {
    return (
        <>
            <button className={`${className ? className : 'btn btn-light'} editor-button`} {...rest}>{title ? title : icon ? <span className={icon} /> : 'UB'}</button>
        </>
    )
}
export default Button;