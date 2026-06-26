import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Post from "./Post";
import AddComment from "./AddComment";
import useStore from "../../store/store";
import LoadingScreen from "../LoadingScreen";

function PostDetails() {
    const { id } = useParams();
    const [ post, setPost ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const { setComments } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/posts/${id}`)
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
                <div className="back-link" onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back</span>
                </div>
                <div className="posts">
                    <Post key={id} post={post} detailedMode={true} setPost={setPost}/>
                </div>
                <h3 className="comments-heading">Comments ({post.comments.length})</h3>
                <AddComment postId={Number(id)}/>
            </main>
        )
    }
    return <LoadingScreen />;
}

export default PostDetails;