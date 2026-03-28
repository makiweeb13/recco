import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useStore from '../../store/store';
import UpdateProfile from './UpdateProfile';

function UpdateProfileHandler() {
    const { id } = useParams();
    const { setUser } = useStore();
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users/${id}`)
            .then(response => response.json())
            .then(json => {
                setUser(json);
                setIsLoading(false);
            })
            .catch(() => {
                throw Error('User Not Found')
            })
    }, [id, setUser])

    if (!isLoading) {
       return  <UpdateProfile />
    } 
}

export default UpdateProfileHandler;