import { useState, useEffect } from 'react';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        
        fetch('/api/users/check-auth', { credentials: 'include' }) 
            .then(response => response.json())
            .then(data => {
                if (data.isAuthenticated) {
                    setIsAuthenticated(true); 
                } else {
                    setIsAuthenticated(false); 
                }
                setLoading(false); 
            })
            .catch(error => {
                console.error('Error checking authentication', error);
                setIsAuthenticated(false); 
                setLoading(false);
            });
    }, []);

    return { isAuthenticated, loading }; 
};

export default useAuth;