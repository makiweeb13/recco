import { useState, useEffect } from 'react';
import useStore from '../store/store';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); 
    const { setUser } = useStore();

    useEffect(() => {
        fetch('/api/users/check-auth', { credentials: 'include' }) 
            .then(response => response.json())
            .then(data => {
                if (data.isAuthenticated) {
                    setIsAuthenticated(true);
                    setUser(data.user);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error checking authentication', error);
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
            });
    }, [setUser]);

    return { isAuthenticated, loading }; 
};

export default useAuth;