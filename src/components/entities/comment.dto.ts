import {AuthorModel} from "./author.dto.ts";

export type CommentModelBase = {
    status: 'new' | 'saved'
    text: string;
}
export type CommentModelNew = CommentModelBase & {
    status: 'new'
    text: string;
}

export type CommentModel = CommentModelBase & {
    status: 'saved'
    id: number
    author: AuthorModel
    date: string;
}

export type CommentsCollection = Array<CommentModel>