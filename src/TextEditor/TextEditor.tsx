import React, { useState } from 'react';
import { EditorState, Editor, DraftEditorCommand, RichUtils, CompositeDecorator, ContentBlock, ContentState, DraftEntityMutability, AtomicBlockUtils } from 'draft-js';
import ButtonGroup from '../Components/ButtonGroup';
import { EditorStyles, EditorEntity, MUTABLE, IMMUTABLE } from './constants';
import { ButtonProps } from '../Components/Button';
import Link from './Link';
import LinkCreator from '../Components/LinkCreator';
import Photo from './Photo';
import KatexOutput from './KaTex/KatexOutput';

const TextEditor: React.FC = () => {
    const findEntities = (contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState, type: string) => {
        contentBlock.findEntityRanges(
            (character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === type
                );
            },
            callback
        );
    }
    const findLinkEntities = (contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) => {
        findEntities(contentBlock, callback, contentState, EditorEntity.LINK)
    }

    const decorator = new CompositeDecorator([
        {
            strategy: findLinkEntities,
            component: Link,
        }

    ]);

    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty(decorator))
    const [linkInputState, setLinkInputState] = useState<boolean>(false)
    const [imageInputState, setImageInputState] = useState<boolean>(false)

    const [link, setLinkState] = useState<string>('')
    const [imageUrl, setImageUrl] = useState<string>('')
    const [atomicType, setAtomicType] = useState<string>('')

    const handleKeyCommand = (command: DraftEditorCommand, editorState: EditorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            setEditorState(newState)
            return 'handled';
        }
        return 'not-handled'
    }

    const _onBoldClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setEditorState(RichUtils.toggleInlineStyle(editorState, EditorStyles.BOLD))
    }

    const _onUnderlineClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setEditorState(RichUtils.toggleInlineStyle(editorState, EditorStyles.UNDERLINE))
    }

    const _onItalicClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setEditorState(RichUtils.toggleInlineStyle(editorState, EditorStyles.ITALIC))

    }
    const createEntity = (entityType: string, mutability: DraftEntityMutability, data?: Object) => {
        const contentState = editorState.getCurrentContent()
        const contentStateWithEntity = contentState.createEntity(
            entityType,
            mutability,
            data
        )
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
        const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity })
        return { newEditorState, entityKey }
    }
    const _onCreateLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const { newEditorState, entityKey } = createEntity(EditorEntity.LINK, MUTABLE, { url: link })
        setEditorState(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey))
        setLinkInputState(false)
    }
    const _showLinkPrompt = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const selection = editorState.getSelection()
        if (!selection.isCollapsed()) {
            const contentState = editorState.getCurrentContent()
            const startKey = editorState.getSelection().getStartKey()
            const startOffset = editorState.getSelection().getStartOffset()
            const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey)
            const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset)
            let url = ''
            if (linkKey) {
                const linkInstance = contentState.getEntity(linkKey)
                url = linkInstance.getData().url
            }
            setLinkState(url)
        }
        setLinkInputState(!linkInputState)
    }
    const _showImagePrompt = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setAtomicType('')
        setImageInputState(!imageInputState)

    }
    const buttons: ButtonProps[] = [
        { icon: 'oi oi-bold', onClick: _onBoldClick },
        { icon: 'oi oi-underline', onClick: _onUnderlineClick },
        { icon: 'oi oi-italic', onClick: _onItalicClick },
        { icon: 'oi oi-link-intact', onClick: _showLinkPrompt },
        { icon: 'oi oi-image', onClick: _showImagePrompt },
        { title: 'KaTex', onClick: _showImagePrompt },
    ]
    const _onLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setLinkState(e.target.value)
    }
    const _onImageUrlChagne = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setImageUrl(e.target.value)
    }
    const _onAddImage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const { newEditorState, entityKey } = createEntity(EditorEntity.IMAGE, IMMUTABLE, { src: imageUrl })
        setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '))
        setImageInputState(false)
    }

    const customRenderFunction = (block: ContentBlock) => {
        if (block.getType() === 'atomic') {
            return {
                component: Photo,
                editable: false
            }
        }
    }

    const data = '\\left( \\sum_{k=1}^n a_k b_k \\right)^{\\!\\!2} \\leq\n' +
        '\\left( \\sum_{k=1}^n a_k^2 \\right)\n' +
        '\\left( \\sum_{k=1}^n b_k^2 \\right)'

    const iframeData = `<iframe width="1000" height="800" src="https://embed-v1.mapillary.com/embed?version=1&filter=%5B%22all%22%5D&map_filter=%5B%22all%22%5D&map_style=Mapillary streets&image_key=yp8xPmTG860b5OgcZk357w&x=0.5&y=0.5&client_id=VEtiNE8yU3hnUFlTY3NORmdQYzY1dzo4ZTUyMWI4NGRhMjUzMWIw&style=classic" frameborder="0"></iframe>`
    return (
        <div className="editor-container">
            <div dangerouslySetInnerHTML={{ __html: iframeData }} />

            <ButtonGroup buttons={buttons} />
            <div>
                {linkInputState ? <LinkCreator onInputChange={_onLinkChange} onButtonClick={_onCreateLink} value={link} title="Create Link" /> : null}
                {imageInputState ? <LinkCreator onInputChange={_onImageUrlChagne} onButtonClick={_onAddImage} value={imageUrl} title="Add Image" /> : null}

            </div>
            <Editor
                editorState={editorState}
                onChange={setEditorState}
                handleKeyCommand={handleKeyCommand}
                blockRendererFn={customRenderFunction}
            />
            <KatexOutput content={data} />
        </div>
    )
}

export default TextEditor;