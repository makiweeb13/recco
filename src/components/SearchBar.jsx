import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import useStore from '../store/store';

function SearchBar() {
    const { setPage, search, setSearch, setSearchQuery } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 700);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const handleSearch = () => {
        setSearchQuery(search);
        setPage(1);
    }

    const openSearch = () => setIsOpen(true);
    const closeSearch = () => setIsOpen(false);

    const handleMobileClose = () => {
        setSearchQuery(search);
        setPage(1);
        closeSearch();
    };

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || isMobile) return;
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                closeSearch();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, isMobile]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeSearch();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (isMobile) {
        if (isOpen) {
            return (
                <div className="search-overlay">
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="menu-icon"
                        onClick={handleMobileClose}
                    />
                    <input
                        type="search"
                        ref={inputRef}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                                closeSearch();
                            }
                        }}
                        placeholder="Search by title..."
                    />
                </div>
            );
        }

        return (
            <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="menu-icon"
                onClick={openSearch}
            />
        );
    }

    return (
        <div className="search-desktop" ref={containerRef}>
            <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="menu-icon"
                onClick={openSearch}
            />
            <div className={`search-desktop-input${isOpen ? ' open' : ''}`}>
                <input
                    type="search"
                    ref={inputRef}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by title..."
                />
                <FontAwesomeIcon
                    icon={faXmark}
                    className="menu-icon"
                    onClick={closeSearch}
                />
            </div>
        </div>
    );
}

export default SearchBar;
