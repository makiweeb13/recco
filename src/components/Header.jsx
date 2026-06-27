import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

function Header() {
    return (
        <header>
            <h1 className="app-name">recco</h1>
            <div className="guest-options">
                <SearchBar />
                <Link to="/login">
                    <button className="btn-outline">Login</button>
                </Link>
                <span className="divider" />
                <Link to="/signup">
                    <button>Register</button>
                </Link>
            </div>
        </header>
    )
}

export default Header;