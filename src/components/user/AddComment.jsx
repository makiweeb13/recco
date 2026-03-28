import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import PropTypes from 'prop-types';
import useStore from '../../store/store';

function AddComment({ postId, parentId }) {
    const [ value, setValue ] = useState('')
    const { addComment } = useStore();
    const label = parentId ? 'reply' : 'comment';

     const onSubmit = async (value) => {
        try {
            const values = { post_id: postId, content: value };
            if (parentId) {
                values.parent_id = parentId;
            }
            const response = await fetch(`${import.meta.env.VITE_API_URL}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(values)
            })
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                setValue('')
                addComment(data.comment);
                
            } else {
                console.error('Adding comment failed', data.message);
            }
        } catch(err) {
            console.error('Adding comment request failed:', err)
        }
    }
   
    return (
        <div className="add-comment">
            <textarea 
                name="comment-content" 
                id="comment-content" 
                rows="2" 
                placeholder={`Write a ${label}...`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            >
            </textarea>
            <button disabled={value.length > 0 ? false : true} onClick={() => onSubmit(value)}><FontAwesomeIcon icon={faPaperPlane} /></button>
        </div>
    )
}

AddComment.propTypes = {
    postId: PropTypes.number.isRequired,
    parentId: PropTypes.number
};

export default AddComment;