import React, { useEffect, useState } from 'react';
import '../style/Comments.css';

const Comment = ({comment, removeComment, currentUser}) => {
    const [ likes, setLikes ] = useState(0);
    const [ isLike, setIsLike ] = useState(false);

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

    const getLikes = async () => {
        const likes_response = await fetch(`/api/like/get/${comment._id}`);
        const likes_list = await likes_response.json();
        setLikes(likes_list.length);
        if (likes_list.find(like => like.userid === comment.userid))
            setIsLike(true);
        else 
            setIsLike(false);
    }

    const AddLike = async () => {
        if (!currentUser) {
            return
        }
        const likes_response = await fetch(`/api/like/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                commentid: comment._id,
                userid: currentUser._id,
            })
        });
        getLikes();
    }

    const RemoveLike = async () => {
        if (!currentUser) {
            return
        }
        const likes_response = await fetch(`/api/like/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                commentid: comment._id,
                userid: currentUser._id,
            })
        });
        getLikes();
    }

    useEffect(() => {
        getLikes();
    }, [])

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
                        <p>{likes}</p>
                        <i class='fa fa-thumbs-up'/>
                    </div>
                    <div>
                        <p className='like-button'
                            onClick={() => {
                                if (isLike)
                                    RemoveLike();
                                else
                                    AddLike();
                            }}>
                                {isLike ? 'UnLike' : 'Like'}
                        </p>
                        <p className='like-button' onClick={() => {removeComment(comment)}}>Remove</p>
                        <p className='date'>{formatDate(new Date(comment.createdAt))}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Comment;