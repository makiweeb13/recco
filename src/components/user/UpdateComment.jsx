import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import PropTypes from 'prop-types';
import useStore from '../../store/store';

function UpdateComment({ commentId, content }) {
    const [ value, setValue ] = useState(content)
    const { updateComment } = useStore();

     const onSubmit = async (value) => {
        try {
            const values = { content: value }
            const response = await fetch(`http://localhost:5000/comments/${commentId}`, {
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
            <textarea 
                name="comment-content" 
                id="comment-content" 
                rows="2" 
                value={value}
                onChange={(e) => setValue(e.target.value)}
            >
            </textarea>
            <button disabled={value.length > 0 ? false : true} onClick={() => onSubmit(value)}><FontAwesomeIcon icon={faPen} /></button>
        </div>
    )
}

UpdateComment.propTypes = {
    commentId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};

export default UpdateComment;