import {useCallback, useState} from 'react';
import {CommentsWidget} from "./components/CommentsWidget.tsx";
import './App.css';
import {CommentModel, CommentModelNew, CommentsCollection} from "./components/entities/comment.dto.ts";

const author = {
    id: 123,
    name: 'Foo Bar',
}


function App() {
    const [list, setList] = useState<CommentsCollection>([{
        id: 1,
        author: {
            ...author,
            id: 2
        },
        date: (new Date()).toISOString(),
        text: 'default text',
        status: 'saved',
    }])

    const onAdd = useCallback((newComment: CommentModelNew) => {
        setList((oldList) => ([
            ...oldList,
            {
                ...newComment,
                status: 'saved',
                author,
                id: oldList.length + 1,
                date: (new Date()).toISOString(),
            }
        ]))
    }, [setList])

    const onDelete = useCallback((id: number) => {
        setList((oldList) => {
            return oldList.filter(
                (item) => (item.id !== id)
            )
        })

    }, [setList])

    const onEdit = useCallback((updatedComment: CommentModel) => {
        setList(
            (list) => {
                return list.map(
                    item => {
                        const toUpdate = updatedComment?.id && (item.id === updatedComment.id)
                        return toUpdate ? updatedComment : item
                    }
                )
            }
        )

    }, [setList])

    const handleIsCommentOwner = useCallback(
        (comment: CommentModel) => comment?.author?.id === author.id, []
    )
    return (
        <>
            <h1>Comments Widget</h1>

            <div>
                <CommentsWidget
                    isCommentOwner={
                        handleIsCommentOwner
                    }
                    comments={list} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} author={author}/>

            </div>

        </>
    );
}

export default App;