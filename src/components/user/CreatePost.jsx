import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { createPostSchema } from '../../schemas/createpost-schema';

function CreatePost() {
    const navigate = useNavigate();

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
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
                    <div className="dropdown">
                        <label htmlFor="genre">Select Genre <FontAwesomeIcon icon={faCaretDown} /></label>
                        <div className="dropdown-content">
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Action" 
                                    onChange={() => handleCheckboxChange('genres', 1)} 
                                    onBlur={handleBlur}
                                /> &nbsp; Action
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Adventure" 
                                    onChange={() => handleCheckboxChange('genres', 2)}  
                                    onBlur={handleBlur} 
                                /> &nbsp; Adventure
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Comedy" 
                                    onChange={() => handleCheckboxChange('genres', 3)} 
                                    onBlur={handleBlur} 
                                /> &nbsp; Comedy
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Drama" 
                                    onChange={() => handleCheckboxChange('genres', 4)}  
                                    onBlur={handleBlur} 
                                /> &nbsp; Drama
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Fantasy" 
                                    onChange={() => handleCheckboxChange('genres', 5)} 
                                    onBlur={handleBlur} 
                                /> &nbsp; Fantasy
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Horror"  
                                    onChange={() => handleCheckboxChange('genres', 6)} 
                                    onBlur={handleBlur} 
                                /> &nbsp; Horror
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Mystery" 
                                    onChange={() => handleCheckboxChange('genres', 7)}  
                                    onBlur={handleBlur} 
                                /> &nbsp; Mystery
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Romance" 
                                    onChange={() => handleCheckboxChange('genres', 8)} 
                                    onBlur={handleBlur} 
                                /> &nbsp; Romance
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Sci-Fi" 
                                    onChange={() => handleCheckboxChange('genres', 9)} 
                                    onBlur={handleBlur} 
                                /> &nbsp; Sci-Fi
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Thriller" 
                                    onChange={() => handleCheckboxChange('genres', 10)} 
                                    onBlur={handleBlur} 
                                /> &nbsp; Thriller
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Supernatural" 
                                    onChange={() => handleCheckboxChange('genres', 11)} 
                                    onBlur={handleBlur} 
                                /> &nbsp; Supernatural
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Psychological" 
                                    onChange={() => handleCheckboxChange('genres', 12)} 
                                    onBlur={handleBlur} 
                                /> &nbsp; Psychological
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Historical" 
                                    onChange={() => handleCheckboxChange('genres', 13)} 
                                    onBlur={handleBlur} 
                                /> &nbsp; Historical
                            </label>
                        </div>
                    </div>
                    <div className="dropdown">
                        <label htmlFor="medium">Select Medium <FontAwesomeIcon icon={faCaretDown} /></label>
                        <div className="dropdown-content">
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Movie"
                                    onChange={() => handleCheckboxChange('mediums', 1)} 
                                /> &nbsp; Movie
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Anime"
                                    onChange={() => handleCheckboxChange('mediums', 2)}  
                                /> &nbsp; Anime
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Manga"
                                    onChange={() => handleCheckboxChange('mediums', 3)} 
                                /> &nbsp; Manga
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Novel"
                                    onChange={() => handleCheckboxChange('mediums', 4)} 
                                /> &nbsp; Novel
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Comic" 
                                    onChange={() => handleCheckboxChange('mediums', 5)} 
                                /> &nbsp; Comic
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="TV Show"
                                    onChange={() => handleCheckboxChange('mediums', 6)} 
                                /> &nbsp; TV Show
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Video Game"
                                    onChange={() => handleCheckboxChange('mediums', 7)} 
                                /> &nbsp; Video Game
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Webtoon" 
                                    onChange={() => handleCheckboxChange('mediums', 8)} 
                                /> &nbsp; Webtoon
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Light Novel" 
                                    onChange={() => handleCheckboxChange('mediums', 9)} 
                                /> &nbsp; Light Novel
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="TV Series" 
                                    onChange={() => handleCheckboxChange('mediums', 10)} 
                                /> &nbsp; TV Series
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="Movie Series" 
                                    onChange={() => handleCheckboxChange('mediums', 11)} 
                                /> &nbsp; Movie Series
                            </label>
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