import { useState } from 'react';
import PropTypes from 'prop-types';
import useStore from '../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faReply, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import profile from '../../assets/profile-icon.png';
import AddComment from './AddComment';
import Cookies from 'js-cookie'; 
import { Link } from 'react-router-dom';
import UpdateComment from './UpdateComment';

function Comment({ comment, preview, setComment }) {

    const { getDate, removeComment, updateComment } = useStore();
    const [ toggleReply, setToggleReply ] = useState(false);
    const [ toggleEdit, setToggleEdit ] = useState(false);
    const userId = Cookies.get('userId');

    const handleCommentLikes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/comments/action?comment=${comment.id}&mode=like`, {
                method: 'POST',
                credentials: 'include'
            })
            const data = await response.json();
            if (response.ok) {
                updateComment(data.comment);
                setComment(data.comment);
                console.log(data.message);
            } else {
                console.error(`Like action failed:`, data.message);
            }
        } catch(err) {
            console.error(`Like request failed`, err);
        }
    }

    const handleCommentDislikes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/comments/action?comment=${comment.id}&mode=dislike`, {
                method: 'POST',
                credentials: 'include'
            })
            const data = await response.json();
            if (response.ok) {
                updateComment(data.comment);
                setComment(data.comment);
                console.log(data.message);
            } else {
                console.error(`Dislike action failed:`, data.message);
            }
        } catch(err) {
            console.error(`Dislike request failed`, err);
        }
    }
    
    const handleDelete = async () => {
        const userConfirmed = window.confirm('Are you sure you want to delete this comment?');

        if (!userConfirmed) {
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:5000/comments/${comment.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                removeComment(comment.id)

            } else {
                console.error(`Comment delete failed:`, data.message);
            }
        } catch(err) {
            console.error(`Comment delete request failed`, err)
        }
    }

    return (
        <>
            <div className="comment">
                <div className="user-header">
                    <Link to={`/profile/${comment.users.id}`} className='user'>
                        <img src={profile} alt="user profile" className='user-profile'/>
                        <p className="comment-user-name">{comment.users.username}</p>
                        {comment.parent_id && <p>&nbsp;replying to {comment.comments.users.username}</p>}
                    </Link>
                    <p className="comment-date">{getDate(comment.date)}</p>
                </div>
                <p className="comment-content">{comment.content}</p>
                <div className="options">
                    <div>
                        <p className="comment-likes">{comment.commentlikes.length}&nbsp;</p>
                        <FontAwesomeIcon icon={faThumbsUp} className="menu-icon" onClick={handleCommentLikes} />
                    </div>
                    <div>
                        <p className="comment-dislikes">{comment.commentdislikes.length}&nbsp;</p>
                        <FontAwesomeIcon icon={faThumbsDown} className="menu-icon" onClick={handleCommentDislikes} />
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faReply} className="menu-icon" onClick={() => setToggleReply(!toggleReply)}/>
                    </div>
                    {
                        comment.user_id == userId && !preview &&
                        <>
                        
                        <div>
                            <Link>
                            <FontAwesomeIcon icon={faPenToSquare} className="menu-icon" onClick={() => setToggleEdit(!toggleEdit)}/>
                            </Link>
                        </div>
                        <div>
                            <Link>
                            <FontAwesomeIcon icon={faTrash} className="menu-icon" onClick={handleDelete} />
                            </Link>
                        </div>
                        </>
                    }
                </div>
            </div>
            { toggleReply && <AddComment postId={comment.post_id} parentId={comment.id} /> }
            { toggleEdit && <UpdateComment commentId={comment.id} content={comment.content} /> }
        </>
        
    )
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    preview: PropTypes.bool,
    setComment: PropTypes.func.isRequired
};

export default Comment;