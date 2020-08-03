import React from 'react'
import { ContentState } from 'draft-js';

interface LinkProps {
    contentState: ContentState
    entityKey: string
}
const Link: React.FC<LinkProps> = (props) => {
    const { url } = props.contentState.getEntity(props.entityKey).getData()
    return (
        <a href={url} className="editor-link">{props.children}</a>
    )
}

export default Link