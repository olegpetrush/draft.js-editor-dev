import React from 'react'
import Button from '../Button';
interface LinkCreatorProps {
    title?: string
    icon?: string
    value?: string
    onButtonClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const LinkCreator: React.FC<LinkCreatorProps> = (props) => {
    const { onInputChange, onButtonClick, value, ...rest } = props
    return (
        <form className="form-inline editor-link-creator">   <div className="form-group mb-2">
            <input type="url" className="form-control" placeholder="Enter Url" onChange={onInputChange} value={value} /> </div>
            <Button type="submit" {...rest} onClick={onButtonClick} className="btn btn-primary mb-2" /></form>
    )
}

export default LinkCreator