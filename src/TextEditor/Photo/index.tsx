import React from 'react'
import { ContentState, ContentBlock } from 'draft-js';

interface PhotoProps {
    contentState: ContentState
    block: ContentBlock
    // entityKey: string
}
const Photo: React.FC<PhotoProps> = (props) => {
    const entity = props.contentState.getEntity(
        props.block.getEntityAt(0)
    );
    const { src } = entity.getData();
    //   const type = entity.getType();    
    return (
        <img src={src} alt="draft-editor" />
    )
}

export default Photo