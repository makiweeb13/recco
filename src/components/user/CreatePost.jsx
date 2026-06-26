import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { createPostSchema } from '../../schemas/createpost-schema';
import { GENRES, MEDIUMS } from '../../data/categories';

function CreatePost() {
    const navigate = useNavigate();

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch(`/api/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(values)
            })
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                resetForm();
                setSubmitting(false) 
                navigate('/');
            } else {
                console.error('Creating post failed', data.message);
            }
        } catch(err) {
            console.error('Creating post request failed:', err)
        }
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            title: '',
            rate: '',
            status: 'true',
            genres: [],
            mediums: [],
            synopsis: '',
            review: ''
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
    };
    
    return (
        <main className="center-add-post">
            <h2>Add Recommendation</h2>
            <form onSubmit={handleSubmit} className="add-post">
                <label htmlFor="title">Title</label>
                <input 
                    type="text" 
                    name="title" 
                    id="title" 
                    value={values.title} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                /><br />
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
                <div className="dropdown-container">
                    <div className="dropdown" tabIndex={0}>
                        <label htmlFor="genre">Select Genre <FontAwesomeIcon icon={faCaretDown} /></label>
                        <div className="dropdown-content">
                            {GENRES.map(g => (
                                <label key={g.id}>
                                    <input type="checkbox" onChange={() => handleCheckboxChange('genres', g.id)} onBlur={handleBlur} />
                                    {' '}{g.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="dropdown" tabIndex={0}>
                        <label htmlFor="medium">Select Medium <FontAwesomeIcon icon={faCaretDown} /></label>
                        <div className="dropdown-content">
                            {MEDIUMS.map(m => (
                                <label key={m.id}>
                                    <input type="checkbox" onChange={() => handleCheckboxChange('mediums', m.id)} />
                                    {' '}{m.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <label htmlFor="synopsis">Synopsis</label><br />
                <textarea
                    name="synopsis" 
                    id="synopsis" 
                    cols="30" 
                    rows="10" 
                    placeholder='Write synopsis..' 
                    value={values.synopsis}  
                    onChange={handleChange} 
                    onBlur={handleBlur}>
                </textarea><br />
                <label htmlFor="review">Review</label><br />
                <textarea 
                    name="review" 
                    id="review" 
                    cols="30" 
                    rows="10" 
                    placeholder='Write review..' 
                    value={values.review}  
                    onChange={handleChange} 
                    onBlur={handleBlur}>
                </textarea><br />
                { errors.title && touched.title && <p className='error-message'>{errors.title}</p> }
                { errors.rate && touched.rate && <p className='error-message'>{errors.rate}</p> }
                { errors.status && touched.status && <p className='error-message'>{errors.status}</p> }
                { errors.review && touched.review && <p className='error-message'>{errors.review}</p> }
                <button type="submit">Post</button>
            </form>
        </main>
    )
}

export default CreatePost;