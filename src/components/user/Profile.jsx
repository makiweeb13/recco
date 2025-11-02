import { useState, useEffect } from 'react';
import Posts from './Posts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from 'react-router-dom';
import profile from '../../assets/profile-icon.png';
import useStore from '../../store/store';
import Cookies from 'js-cookie';

function Profile() {
    
    const { id } = useParams();
    const { setPosts } = useStore();
    const [ loggedInUser, setLoggedInUser ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const userId = Cookies.get('userId');

    useEffect(() => {
        fetch(`http://localhost:5000/users/${id}`)
            .then(response => response.json())
            .then(json => {
                setLoggedInUser(json);
                setPosts(json.posts)
                setIsLoading(false);
            })
            .catch(() => {
                throw new Response('User Not Found', { status: 404 })
            })
    }, [id])
    
    if (!isLoading) {
        return (
            <main>
                <div className="profile">
                    <img src={profile} alt="profile picture" />
                    { userId == id &&
                        <Link to={`/update-profile/${id}`}>
                            <FontAwesomeIcon icon={faPen} className="menu-icon edit"/>
                        </Link> 
                    }
                    <div className="profile-details">
                        <h1 className="username">{loggedInUser.username}</h1>
                        <h4 className="email">{loggedInUser.email}</h4>
                        <p className="bio">{loggedInUser.bio}</p>
                    </div>
                </div>
                <h2>Posts</h2>
                <Posts />
            </main>
        )
    }
}

export default Profile;