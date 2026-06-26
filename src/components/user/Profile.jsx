import { useState, useEffect } from 'react';
import Posts from './Posts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from 'react-router-dom';
import UserAvatar from '../UserAvatar';
import useStore from '../../store/store';
import LoadingScreen from '../LoadingScreen';

function Profile() {
    
    const { id } = useParams();
    const { user, setPosts } = useStore();
    const [ loggedInUser, setLoggedInUser ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        fetch(`/api/users/${id}`)
            .then(response => response.json())
            .then(json => {
                setLoggedInUser(json);
                setPosts(json.posts)
                setIsLoading(false);
            })
            .catch(() => {
                throw new Response('User Not Found', { status: 404 })
            })
    }, [id, setPosts])
    
    if (!isLoading) {
        return (
            <main className="profile-page">
                <div className="profile-card">
                    <div className="profile-header">
                        <UserAvatar username={loggedInUser?.username} size={80} />
                        { user?.id == id &&
                            <Link to={`/update-profile/${id}`} className="profile-edit-btn">
                                <FontAwesomeIcon icon={faPen} />
                            </Link>
                        }
                        <div className="profile-details">
                            <h1 className="username">{loggedInUser.username}</h1>
                            <p className="email">{loggedInUser.email}</p>
                            <p className="bio">{loggedInUser.bio || 'No bio yet.'}</p>
                        </div>
                    </div>
                </div>
                <h2 className="profile-posts-heading">Posts</h2>
                <Posts />
            </main>
        )
    }
    return <LoadingScreen />;
}

export default Profile;
