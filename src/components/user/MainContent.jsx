import { useState, useEffect } from 'react';
import useStore from '../../store/store';
import Posts from './Posts';
import { GENRES, MEDIUMS } from '../../data/categories';
import LoadingScreen from '../LoadingScreen';

function MainContent() {
    const { setPosts, page, searchQuery, search, setPage, totalPages, setTotalPages, limit, setLimit, filterGenre, setFilterGenre, filterMedium, setFilterMedium, filterStatus, setFilterStatus } = useStore();
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const params = new URLSearchParams({ search: searchQuery, page, limit });
        if (filterGenre) params.set('genre', filterGenre);
        if (filterMedium) params.set('medium', filterMedium);
        if (filterStatus) params.set('status', filterStatus);

        fetch(`/api/posts?${params}`)
        .then((res) => res.json())
        .then((data) => {
            setPosts(data.posts);
            setTotalPages(data.totalPages);
            setIsLoading(false);
        })
        .catch((error) => console.error('Error fetching posts:', error));
    }, [page, searchQuery, limit, filterGenre, filterMedium, filterStatus, setPosts, setTotalPages])

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <main>
            <div className="page-header">
                <h2>Home</h2>
                <div className="filters-bar">
                <div className="filter-group">
                    <label>Per page</label>
                    <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}>
                        <option value={2}>2</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Genre</label>
                    <select value={filterGenre} onChange={e => { setFilterGenre(e.target.value); setPage(1); }}>
                        <option value="">All Genres</option>
                        {GENRES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Medium</label>
                    <select value={filterMedium} onChange={e => { setFilterMedium(e.target.value); setPage(1); }}>
                        <option value="">All Mediums</option>
                        {MEDIUMS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Status</label>
                    <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
                        <option value="">All</option>
                        <option value="completed">Completed</option>
                        <option value="ongoing">Ongoing</option>
                    </select>
                </div>
                </div>
            </div>
            <Posts />
            <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </main>
    )
}

export default MainContent
