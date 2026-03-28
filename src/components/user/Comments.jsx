import PropTypes from "prop-types";
import Comment from "./Comment";

function Comments({ comments }) {
   
    const renderComments = () => {
        return comments.map(comment => <Comment key={comment.id} comment={comment} />);
    }

    return <div className="comments">{renderComments()}</div>
}

Comments.propTypes = {
    comments: PropTypes.array.isRequired,
};

export default Comments;