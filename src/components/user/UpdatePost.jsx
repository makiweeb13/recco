import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/store";
import { useFormik } from 'formik';
import { createPostSchema } from '../../schemas/createpost-schema';
import { GENRES, MEDIUMS } from '../../data/categories';
import PropTypes from 'prop-types';

function UpdatePost({ post }) {
    const { updatePost } = useStore();
    const navigate = useNavigate();
        

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            values.rate = parseInt(values.rate);
            values.status = JSON.parse(values.status)
            const response = await fetch(`/api/posts/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(values)
            })
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                updatePost(data.post)
                resetForm();
                setSubmitting(false) 
                navigate(`/post/${post.id}`);
            } else {
                console.error('Updating post failed', data.message);
            }
        } catch(err) {
            console.error('Updating post request failed:', err)
        }
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            title: post.title || '',
            rate: post.rate,
            status: post.status ? 'true' : 'false',
            genres: post.postgenres.map(genre => genre.genre_id),
            mediums: post.postmediums.map(medium => medium.medium_id),
            synopsis: post.synopsis || '',
            review: post.review || ''
        },
        validationSchema: createPostSchema,
        onSubmit
    })

    const handleCheckboxChange = (field, value) => {
        const fieldValue = values[field];
        if (fieldValue.includes(value)) {
        // Remove the value if it's already selected
        setFieldValue(field, fieldValue.filter((item) => item !== value));
        } else {
        // Add the value if it's not selected
        setFieldValue(field, [...fieldValue, value]);
        }
    }

    return (
        <main className="create-post-page">
            <h2>Edit Post</h2>
            <form onSubmit={handleSubmit} className="post-form-card">
                <label htmlFor="title">Title</label>
                <input 
                    type="text" 
                    name="title" 
                    id="title" 
                    value={values.title} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                />
                <div className="form-row">
                    <div>
                        <label htmlFor="rate">Rate</label>
                        <select 
                            id="rate" 
                            name="rate" 
                            value={values.rate} 
                            onChange={handleChange} 
                            onBlur={handleBlur}
                        >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                            <option value={9}>9</option>
                            <option value={10}>10</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status">Status</label>
                        <select 
                            id="status" 
                            name="status" 
                            value={values.status}  
                            onChange={handleChange} 
                            onBlur={handleBlur}
                        >
                            <option value={true}>Completed</option>
                            <option value={false}>Ongoing</option>
                        </select>
                    </div>
                </div>
                <div className="dropdown-container">
                    <div className="dropdown" tabIndex={0}>
                        <label>Select Genre <FontAwesomeIcon icon={faCaretDown} /></label>
                        <div className="dropdown-content">
                            {GENRES.map(g => (
                                <label key={g.id}>
                                    <input type="checkbox" name="genres" onChange={() => handleCheckboxChange('genres', g.id)} onBlur={handleBlur} checked={values.genres.includes(g.id)} />
                                    {' '}{g.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="dropdown" tabIndex={0}>
                        <label>Select Medium <FontAwesomeIcon icon={faCaretDown} /></label>
                        <div className="dropdown-content">
                            {MEDIUMS.map(m => (
                                <label key={m.id}>
                                    <input type="checkbox" name="mediums" onChange={() => handleCheckboxChange('mediums', m.id)} checked={values.mediums.includes(m.id)} />
                                    {' '}{m.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <label htmlFor="synopsis">Synopsis</label>
                <textarea
                    name="synopsis" 
                    id="synopsis" 
                    cols="30" 
                    rows="6" 
                    placeholder='Write synopsis..' 
                    value={values.synopsis || ''}  
                    onChange={handleChange} 
                    onBlur={handleBlur}>
                </textarea>
                <label htmlFor="review">Review</label>
                <textarea 
                    name="review" 
                    id="review" 
                    cols="30" 
                    rows="6" 
                    placeholder='Write review..' 
                    value={values.review}  
                    onChange={handleChange} 
                    onBlur={handleBlur}>
                </textarea>
                                { errors.title && touched.title && <p className='error-message'>{errors.title}</p> }
                { errors.rate && touched.rate && <p className='error-message'>{errors.rate}</p> }
                { errors.status && touched.status && <p className='error-message'>{errors.status}</p> }
                { errors.review && touched.review && <p className='error-message'>{errors.review}</p> }
                <button type="submit">Edit</button>
            </form>
        </main>
    )
}

UpdatePost.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        rate: PropTypes.number.isRequired,
        status: PropTypes.bool.isRequired,
        postgenres: PropTypes.array.isRequired,
        postmediums: PropTypes.array.isRequired,
        synopsis: PropTypes.string,
        review: PropTypes.string.isRequired
    }).isRequired
};

export default UpdatePost;