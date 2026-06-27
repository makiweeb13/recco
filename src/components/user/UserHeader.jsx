import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBell, faPlus, faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import SearchBar from '../SearchBar';
import UserAvatar from '../UserAvatar';
import useStore from '../../store/store';

function UserHeader() {
    const { user, setUser } = useStore();

    const handleLogout = async () => {
        try {
            const response = await fetch(`/api/users/logout`, {
                method: 'POST',
                credentials: 'include'
            })
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                setUser(null);
            } else {
                console.error('Logout failed', data.message);
            }
        } catch(err) {
            console.error('Logout request failed:', err);
        }
    }

    return (
        <header>
            <h1 className="app-name">recco</h1>
            <div className="user-options">
                <Link to="/">
                    <FontAwesomeIcon icon={faHouse} className="menu-icon" />
                </Link>
                <span className="bell-placeholder" title="Notifications (coming soon)">
                    <FontAwesomeIcon icon={faBell} className="menu-icon" />
                </span>
                <SearchBar />
                <Link to="/create-post">
                    <button className="create-post-btn">
                        <FontAwesomeIcon icon={faPlus}/> <span className="show-btn-label">Create</span>
                    </button>
                </Link>
                <div className="dropdown align-right">
                    <UserAvatar username={user?.username} size={30} />
                    <div className="dropdown-content move-left">
                        <label>
                            <Link to={`/profile/${user?.id}`} className="user">
                                <FontAwesomeIcon icon={faUser} /> Profile
                            </Link>
                        </label>
                        <label>
                            <Link to={`/login`} className="user" onClick={handleLogout}>
                                <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                            </Link>
                        </label>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default UserHeader;