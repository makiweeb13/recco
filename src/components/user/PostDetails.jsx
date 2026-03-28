import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Post from "./Post";
import AddComment from "./AddComment";
import useStore from "../../store/store";

function PostDetails() {
    const { id } = useParams();
    const [ post, setPost ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const { setComments } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/posts/${id}`)
            .then(response => response.json())
            .then(json => {
                setPost(json);
                setComments(json.comments)
                setIsLoading(false);
            })
            .catch(() => {
                throw Error('Post Not Found')
            })
    }, [id, setComments])

    if (!isLoading) {
        return (
            <main>
                <FontAwesomeIcon icon={faArrowLeft} className="menu-icon" onClick={() => navigate(-1)}/>
                <div className="posts">
                    <Post key={id} post={post} detailedMode={true} setPost={setPost}/>
                </div>
                <AddComment postId={id}/>
            </main>
        )
    }
}

export default PostDetails;