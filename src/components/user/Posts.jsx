import Post from './Post';
import useStore from '../../store/store';

function Posts() {

    const { posts } = useStore();

    const renderPosts = () => {
        if (posts) {
            return posts.map(post => <Post key={post.id} post={post} />)
        } else {
            return <p>No Posts Found :(</p>
        }
    }

    return <div className="posts">{renderPosts()}</div>
}

export default Posts;