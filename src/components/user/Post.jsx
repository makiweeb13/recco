import useStore from '../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import profile from '../../assets/profile-icon.png';
import Comment from './Comment';
import Comments from './Comments';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState } from 'react';
import PropTypes from 'prop-types';

function Post({ post, detailedMode, setPost }) {

    const { comments, getDate, getGenres, getMediums, getMostPopularComment, updatePost, removePost } = useStore();
    const [ comment, setComment ] = useState(getMostPopularComment(post));
    const userId = Cookies.get('userId');

    const handlePostLikes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/posts/action?post=${post.id}&mode=like`, {
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
            const response = await fetch(`http://localhost:5000/posts/action?post=${post.id}&mode=dislike`, {
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

    const handleDelete = async () => {
        const userConfirmed = window.confirm('Are you sure you want to delete this post?');

        if (!userConfirmed) {
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:5000/posts/${post.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                removePost(post.id)

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
                        <img src={profile} alt="user profile" className='user-profile'/>
                        <p className="name">{post.users.username}</p>
                    </Link>
                    <p className="date">{getDate(post.date)}</p>
                </div>
                <div className="post-content">
                    <h4>Title:</h4>
                    <p className="title">{post.title}</p>
                    <h4>Genre:</h4>
                    <p className="genres">{getGenres(post)}</p>
                    <h4>Status:</h4>
                    <p className="status">{post.status ? 'Completed' : 'Ongoing'}</p>
                    <h4>Rate:</h4>
                    <p className="rate">{post.rate}/10</p>
                    <h4>Medium:</h4>
                    <p className="medium">{getMediums(post)}</p>
                    <h4>Synopsis:</h4>
                    <p className="synopsis">{post.synopsis}</p>
                    <h4>Review:</h4>
                    <p className="review">{post.review}</p>
                </div>
                <div className="options">
                    <div className="likes">
                        <p>{post.postlikes.length}&nbsp;</p>
                        <FontAwesomeIcon icon={faThumbsUp} className="menu-icon" onClick={handlePostLikes} />
                    </div>
                    <div className="dislikes">
                        <p>{post.postdislikes.length}&nbsp;</p>
                        <FontAwesomeIcon icon={faThumbsDown} className="menu-icon" onClick={handlePostDislikes} />
                    </div>
                    <div>
                        <p>{post.comments.length}&nbsp;</p>
                        <Link to={!detailedMode ? `/post/${post.id}` : ''}>
                            <FontAwesomeIcon icon={faComment} className="menu-icon" />
                        </Link>
                    </div>
                    {
                        post.user_id == userId &&
                        <>
                        <div>
                            <Link to={`/update-post/${post.id}`}>
                            <FontAwesomeIcon icon={faPenToSquare} className="menu-icon" />
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
            { detailedMode && <Comments comments={comments} /> }
            { !detailedMode && comment && <Comment key={comment.id} comment={comment} preview={true} setComment={setComment}/> }
        </>
    )
}

Post.propTypes = {
    post: PropTypes.object.isRequired,
    detailedMode: PropTypes.bool,
    setPost: PropTypes.func.isRequired
};

export default Post;