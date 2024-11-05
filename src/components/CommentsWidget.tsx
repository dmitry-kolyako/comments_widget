import {ChangeEvent, FC, useCallback, useEffect, useState} from "react"
import {CommentModel, CommentModelNew, CommentsCollection} from "./entities/comment.dto.ts";
import {AuthorModel} from "./entities/author.dto.ts";

type TOnPost = (updatedComment: CommentModel | CommentModelNew) => void
type TOnEdit = (updatedComment: CommentModel) => void

type TWithChange = {
    onEdit: TOnEdit
}
type TWithDelete = {
    onDelete: (id: number) => void
}
type TWithAuthor = {
    author: AuthorModel
}
type TCommentActionPermissions = {
    canEdit?: boolean,
    canDelete?: boolean,
}

type Props = TWithChange & TWithDelete & TWithAuthor & {
    comments: CommentsCollection
    onAdd: (newComment: CommentModelNew) => void
    isCommentOwner: (comment: CommentModel) => boolean
}

export const CommentsWidget: FC<Props> = ({comments, author, onEdit, onAdd, onDelete, isCommentOwner}) => {
    const [draftList, updateDraft] = useState(comments)
    const [draftComment, setDraftComment] = useState<CommentModel | null>(null)
    useEffect(() => {
        updateDraft(comments)
    }, [comments, updateDraft]);


    const handlePost = useCallback<TOnPost>(
        (commentPosted) => {
            if (commentPosted.status === 'saved') {
                onEdit(commentPosted)
            } else {
                onAdd(commentPosted)
            }
        }, [onEdit, onAdd]
    )

    const handleEdit = useCallback<TOnEdit>(
        (commentEdit) => {
            setDraftComment(commentEdit)
        }, [setDraftComment]
    )

    const handleReset = useCallback(
        () => {
            setDraftComment(null)
        }, [setDraftComment]
    )

    return (
        <>
            <h2>Comments</h2>
            <div>
                {
                    draftList.map(comment => <CommentCard key={comment.id} comment={comment}
                                                          onEdit={handleEdit}
                                                          onDelete={onDelete}
                                                          permissions={{
                                                              canEdit: isCommentOwner(comment),
                                                              canDelete: isCommentOwner(comment),
                                                          }}/>)
                }
            </div>

            <div>
                <CommentAddForm author={author} onPost={handlePost} onReset={handleReset} comment={draftComment}/>
            </div>

        </>
    )
}

type CardProps = TWithChange & TWithDelete & {
    comment: CommentModel
    permissions: TCommentActionPermissions
}

const CommentCard: FC<CardProps> = ({
                                        onEdit, onDelete, comment,
                                        comment: {id, date, author, text}, permissions: {canDelete, canEdit}
                                    }) => {
    return <>
        <div style={{border: '1px solid gray', padding: '10px', textAlign: 'left'}}>
            <div>Author: {author.name} [{author.id}]</div>
            <div>Posted: {date}</div>
            <div>{text}</div>

            <div>

                {canEdit && <button onClick={() => onEdit(comment)}>
                    Edit
                </button>}

                {canDelete && <button onClick={() => onDelete(id)}>
                    Delete
                </button>}
            </div>
        </div>
    </>
}

type CommentFormProps = {
    author: AuthorModel
    comment: CommentModel | null
    onPost: TOnPost
    onReset: () => void
}

const CommentAddForm: FC<CommentFormProps> = ({onPost, onReset, comment, author}) => {
    const [textInput, setTextInput] = useState<string>('')

    const handleSave = useCallback(() => {
        onPost(comment?.status === 'saved' ? {
            ...comment,
            text: textInput
        } : {
            status: 'new',
            text: textInput
        })
        setTextInput('')
        onReset()
    }, [onPost, onReset, comment, textInput, setTextInput])

    useEffect(() => {
        setTextInput(comment?.text || '')
    }, [comment, setTextInput]);

    const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setTextInput(e.target.value)
    }, [setTextInput]);

    return (<>
            <div>
                <fieldset>
                    <div>
                        Comment
                    </div>
                    <div><input disabled type={'text'} value={author.name}/></div>
                    <div>
                        <textarea onChange={handleChange} value={textInput}>{textInput}</textarea>
                    </div>
                    <div>
                        input: {textInput}
                    </div>
                </fieldset>

            </div>
            <div>
                <button onClick={handleSave}>
                    Post Comment
                </button>
                {
                    comment?.id && <button onClick={() => onReset()}>
                        cancel
                    </button>
                }

            </div>
        </>
    )
}