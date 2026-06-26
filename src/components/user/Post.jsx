import useStore from '../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import UserAvatar from '../UserAvatar';
import Comment from './Comment';
import Comments from './Comments';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmModal from '../ConfirmModal';

function Post({ post, detailedMode, setPost = () => {} }) {

    const navigate = useNavigate();
    const { user, comments, getDate, getGenres, getMediums, getMostPopularComment, updatePost, removePost } = useStore();
    const [ comment, setComment ] = useState(getMostPopularComment(post));

    const handlePostLikes = async () => {
        try {
            const response = await fetch(`/api/posts/action?post=${post.id}&mode=like`, {
                method: 'POST',
                credentials: 'include'
            })
            const data = await response.json();
            if (response.ok) {
                updatePost(data.post);
                setPost(data.post);
                console.log(data.message);
            } else {
                console.error(`Like action failed:`, data.message);
            }
        } catch(err) {
            console.error(`Like request failed`, err);
        }
    }

    const handlePostDislikes = async () => {
        try {
            const response = await fetch(`/api/posts/action?post=${post.id}&mode=dislike`, {
                method: 'POST',
                credentials: 'include'
            })
            const data = await response.json();
            if (response.ok) {
                updatePost(data.post);
                setPost(data.post);
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
            const response = await fetch(`/api/posts/${post.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                removePost(post.id)
                if (detailedMode) navigate('/');

            } else {
                console.error(`Post delete failed:`, data.message);
            }
        } catch(err) {
            console.error(`Post delete request failed`, err);
        }
    }

    return (
        <>
            <div className="post">
                <div className="user-header">
                    <Link to={`/profile/${post.users.id}`} className='user'>
                        <UserAvatar username={post.users.username} size={30} />
                        <p className="name">{post.users.username}</p>
                    </Link>
                    <p className="date">{getDate(post.date)}</p>
                </div>
                <div className="post-content">
                    {post.image && <img src={post.image} alt="" className="post-image" />}
                    <h3 className="post-title">{post.title}</h3>
                    <div className="post-meta">
                        <span className="post-meta-chip">{getGenres(post)}</span>
                        <span className="post-meta-chip">⭐ {post.rate}/10</span>
                        <span className={`post-meta-chip status ${post.status ? 'completed' : 'ongoing'}`}>
                            {post.status ? 'Completed' : 'Ongoing'}
                        </span>
                        <span className="post-meta-chip">{getMediums(post)}</span>
                    </div>
                    {post.synopsis && (
                        <div className="post-section">
                            <h4 className="post-section-heading">Synopsis</h4>
                            <p className="post-body">{post.synopsis}</p>
                        </div>
                    )}
                    {post.review && (
                        <div className="post-section">
                            <h4 className="post-section-heading">Review</h4>
                            <p className="post-body">{post.review}</p>
                        </div>
                    )}
                </div>
                <div className="options">
                    <div className="likes">
                        <p className="count">{post.postlikes.length}</p>
                        <FontAwesomeIcon icon={faThumbsUp} className="menu-icon" onClick={handlePostLikes} />
                    </div>
                    <div className="dislikes">
                        <p className="count">{post.postdislikes.length}</p>
                        <FontAwesomeIcon icon={faThumbsDown} className="menu-icon" onClick={handlePostDislikes} />
                    </div>
                    <div>
                        <p className="count">{post.comments.length}</p>
                        {!detailedMode ? (
                          <Link to={`/post/${post.id}`}>
                            <FontAwesomeIcon icon={faComment} className="menu-icon" />
                          </Link>
                        ) : (
                          <span>
                            <FontAwesomeIcon icon={faComment} className="menu-icon" />
                          </span>
                        )}
                    </div>
                    {
                        post.user_id === user?.id &&
                        <>
                        <div>
                            <Link to={`/update-post/${post.id}`}>
                            <FontAwesomeIcon icon={faPenToSquare} className="menu-icon" />
                            </Link>
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
                    message="Are you sure you want to delete this post? This action cannot be undone."
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
            { detailedMode && <Comments comments={comments} /> }
            { !detailedMode && comment && <Comment key={comment.id} comment={comment} preview={true} setComment={setComment}/> }
        </>
    )
}

Post.propTypes = {
    post: PropTypes.object.isRequired,
    detailedMode: PropTypes.bool,
    setPost: PropTypes.func
};

export default Post;