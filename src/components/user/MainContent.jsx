import { useState, useEffect } from 'react';
import useStore from '../../store/store';
import Posts from './Posts';

function MainContent() {
    const { setPosts, page, search, setPage, totalPages, setTotalPages } = useStore();
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        if (search === '') {
            fetch(`/api/posts?search=${search}&page=${page}`)
            .then((res) => res.json())
            .then((data) => {
                setPosts(data.posts);
                setTotalPages(data.totalPages);
                setIsLoading(false);
            })
            .catch((error) => console.error('Error fetching posts:', error));
        }
    }, [page, search, setPosts, setTotalPages])

    if (isLoading) {
        return <main><p className="center">Loading posts...</p></main>;
    }

    return (
        <main>
            <h2>Home</h2>
            <Posts />
            <p className="center">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                <span> | </span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </p>
        </main>
    )
}

export default MainContent