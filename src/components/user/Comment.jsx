import { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmModal from '../ConfirmModal';
import useStore from '../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faReply, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import UserAvatar from '../UserAvatar';
import AddComment from './AddComment';
import { Link } from 'react-router-dom';
import UpdateComment from './UpdateComment';

function Comment({ comment, preview, setComment = () => {} }) {

    const { user, getDate, removeComment, updateComment } = useStore();
    const [ toggleReply, setToggleReply ] = useState(false);
    const [ toggleEdit, setToggleEdit ] = useState(false);

    const handleCommentLikes = async () => {
        try {
            const response = await fetch(`/api/comments/action?comment=${comment.id}&mode=like`, {
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
            const response = await fetch(`/api/comments/action?comment=${comment.id}&mode=dislike`, {
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
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleConfirmDelete = async () => {
        setShowDeleteModal(false);
        try {
            const response = await fetch(`/api/comments/${comment.id}`, {
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
            <div className={`comment ${comment.parent_id ? 'reply' : ''}`}>
                <div className="user-header">
                    <Link to={`/profile/${comment.users.id}`} className='user'>
                        <UserAvatar username={comment.users.username} size={30} />
                        <p className="comment-user-name">{comment.users.username}</p>
                    </Link>
                    <p className="comment-date">{getDate(comment.date)}</p>
                </div>
                {comment.parent_id && comment.comments?.users?.username && (
                    <p className="comment-reply-to">↪ replying to @{comment.comments.users.username}</p>
                )}
                <p className="comment-content">{comment.content}</p>
                <div className="options">
                    <div>
                        <p className="comment-likes count">{comment.commentlikes.length}</p>
                        <FontAwesomeIcon icon={faThumbsUp} className="menu-icon" onClick={handleCommentLikes} />
                    </div>
                    <div>
                        <p className="comment-dislikes count">{comment.commentdislikes.length}</p>
                        <FontAwesomeIcon icon={faThumbsDown} className="menu-icon" onClick={handleCommentDislikes} />
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faReply} className={`menu-icon ${toggleReply ? 'active' : ''}`} onClick={() => setToggleReply(!toggleReply)}/>
                    </div>
                    {
                        comment.user_id === user?.id && !preview &&
                        <>
                        <div>
                        <span>
                        <FontAwesomeIcon icon={faPenToSquare} className="menu-icon" onClick={() => setToggleEdit(!toggleEdit)}/>
                        </span>
                        </div>
                        <div>
                        <span>
                        <FontAwesomeIcon icon={faTrash} className="menu-icon" onClick={() => setShowDeleteModal(true)} />
                        </span>
                        </div>
                        </>
                    }
                </div>
            </div>
            {showDeleteModal && (
                <ConfirmModal
                    message="Are you sure you want to delete this comment? This action cannot be undone."
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
            { toggleReply && <AddComment postId={comment.post_id} parentId={comment.id} parentUsername={comment.users.username} onCancel={() => setToggleReply(false)} /> }
            { toggleEdit && <UpdateComment commentId={comment.id} content={comment.content} onCancel={() => setToggleEdit(false)} /> }
        </>
        
    )
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    preview: PropTypes.bool,
    setComment: PropTypes.func
};

export default Comment;