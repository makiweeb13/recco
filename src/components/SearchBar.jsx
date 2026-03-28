import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useStore from '../store/store';

function SearchBar() {
    const { setPosts, setPage, search, setSearch, setTotalPages } = useStore();

    const handleSearch = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/posts?search=${search}`);
            const data = await response.json();
            if (response.ok) {
                setPosts(data.posts);
                setTotalPages(data.totalPages);
                setPage(1);
            }
        } catch(err) {
            console.error('Fetching posts failed:', err)
        }
    }

    return (
        <div className="search-bar">
            <input 
                type="search" 
                name="search"  
                id="search"
                value={search} 
                onChange={e => setSearch(e.target.value)}
                placeholder="search by title"
            />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="menu-icon" onClick={handleSearch}/>
        </div>
    )
}

export default SearchBar;