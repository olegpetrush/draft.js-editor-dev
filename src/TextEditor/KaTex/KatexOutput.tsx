import React, { useEffect, useState, useRef } from 'react'
import katex from 'katex'

interface KatexOutputProps {
    content: string
}
const KatexOutput: React.FC<KatexOutputProps> = (props) => {
    const { content } = props
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const _updateView = () => {
        if (containerRef.current) {
            katex.render(
                content,
                containerRef.current,
                { displayMode: true }
            )
        }
    }
    useEffect(() => {
        _updateView()
    })
    const _onContainerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        setIsEdit(!isEdit)
    }
    return (
        <>
            <div ref={containerRef} className="katex-container" onClick={_onContainerClick} />
            {isEdit && <div>{content}</div>}
        </>
    )
}


export default KatexOutput;