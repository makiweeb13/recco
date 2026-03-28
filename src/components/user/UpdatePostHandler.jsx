import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UpdatePost from './UpdatePost';

function UpdatePostHandler() {
    const { id } = useParams();
    const [ currentPost, setCurrentPost ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/posts/${id}`)
            .then(response => response.json())
            .then(json => {
                setCurrentPost(json);
                setIsLoading(false);
            })
            .catch(() => {
                throw Error('Post Not Found')
            })
    }, [id])

    if (!isLoading) {
        return (
            <UpdatePost post={currentPost} />
        )
    } 
}

export default UpdatePostHandler;