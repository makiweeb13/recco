import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import PropTypes from 'prop-types';
import useStore from '../../store/store';

function UpdateComment({ commentId, content, onCancel }) {
    const [ value, setValue ] = useState(content)
    const { updateComment } = useStore();

     const onSubmit = async (value) => {
        try {
            const values = { content: value }
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(values)
            })
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                updateComment(data.comment);
            } else {
                console.error('Updating comment failed', data.message);
            }
        } catch(err) {
            console.error('Updating comment request failed:', err)
        }
    }
   
    return (
        <div className="add-comment">
            <div className="reply-header">
                <span>Editing comment</span>
                <button className="cancel-btn" onClick={onCancel}>Cancel</button>
            </div>
            <div className="add-comment-row">
                <textarea 
                    name="comment-content"
                    className="comment-input"
                    rows="2" 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                >
                </textarea>
                <button disabled={value.length === 0} onClick={() => onSubmit(value)}><FontAwesomeIcon icon={faPen} /></button>
            </div>
        </div>
    )
}

UpdateComment.propTypes = {
    commentId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    onCancel: PropTypes.func
};

export default UpdateComment;
