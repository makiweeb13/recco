import { useState, useEffect } from 'react';
import useStore from '../store/store';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const { setUser, setToken } = useStore();

    useEffect(() => {
        const savedToken = localStorage.getItem('token');

        if (!savedToken) {
            setLoading(false);
            return;
        }

        setToken(savedToken);

        fetch('/api/users/check-auth')
            .then(response => response.json())
            .then(data => {
                if (data.isAuthenticated) {
                    setIsAuthenticated(true);
                    setUser(data.user);
                } else {
                    localStorage.removeItem('token');
                    setToken(null);
                    setIsAuthenticated(false);
                    setUser(null);
                }
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem('token');
                setToken(null);
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
            });
    }, []);

    return { isAuthenticated, loading };
};

export default useAuth;