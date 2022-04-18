import React from 'react';
import '../style/Comments.css';

const Comment = ({comment, removeComment}) => {
    const padTo2Digits = (num) => {
        return num.toString().padStart(2, '0');
    }

    const formatDate = (date) => {
        return [
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),
            date.getFullYear(),
        ].join('/');
    }

    return (
        <div className="comment">
            <div className="comment-avatar">
                <img src={comment.avatar}/>
            </div>
            <div className='comment-text'>
                <p className='name'>{comment.name}</p>
                <p className='content'>
                    {comment.content}
                </p>
                <div className='comment-info'>
                    <div>
                        <p>{comment.rating}</p>
                        <i class='fa fa-thumbs-up'/>
                    </div>
                    <div>
                        <p className='like-button'>Like</p>
                        <p className='like-button' onClick={() => {removeComment(comment)}}>Remove</p>
                        <p className='date'>{formatDate(new Date(comment.createdAt))}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Comment;