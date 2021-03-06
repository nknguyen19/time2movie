import React, { useEffect, useState } from 'react'
import BASE_URL from '../BaseUrl';
import '../style/Comments.css';
import Comment from './Comment';

const Comments = ({currentUser, movie}) => {
    const [comments, setComments] = useState([]);

    useEffect(async () => {
        getComments();
    }, [])

    const getComments = async () => {
        const comment_response = await fetch(`${BASE_URL}/api/comment/get/${movie._id}`);
        const _comments = await comment_response.json();
        setComments(_comments);
    }

    const removeComment = async (comment) => {
        if (!currentUser) {
            return
        }
        if (comment.userid !== currentUser._id) 
            return;
        const response = await fetch(`${BASE_URL}/api/comment/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: comment._id,
            })
        });
        getComments();
    }

    const handleSubmit = async () => {
        const comment_response = await fetch(`${BASE_URL}/api/comment/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userid: currentUser._id,
                movieid: movie._id,
                content: document.getElementById('input-comment').value,
            })
        });
        const _comment = await comment_response.json();
        setComments([...comments, _comment]);
        document.getElementById('input-comment').value = '';
        getComments();
    }

    return (
        <div className="comments"> 
            <h2>Comments</h2>
            
            <div className="comments-list">
                {comments.map((comment, index) => 
                    <Comment comment={comment} 
                            removeComment={removeComment}
                            currentUser={currentUser}
                />)}
            </div>
            
            {currentUser ?
             <div className="add-comment">
                <img src={`${BASE_URL}${currentUser.image}`}/>
                <input id='input-comment' type='text' placeholder='Add your comment here ...'/>
                <button onClick={handleSubmit}>Send</button>
            </div>
            : ''}
        </div>
    )
}

export default Comments;