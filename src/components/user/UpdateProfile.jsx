import { useNavigate } from "react-router-dom";
import useStore from "../../store/store";
import { useFormik } from 'formik';
import { profileSchema } from "../../schemas/profile-schema";

function UpdateProfile() {
    const { user, setUser } = useStore();
    const navigate = useNavigate();
        
    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(values)
            })
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                setUser(data.user);
                resetForm();
                setSubmitting(false); 
                navigate(`/profile/${user.id}`);
            } else {
                console.error('Updating user failed', data.message);
            }
        } catch(err) {
            console.error('Updating user request failed:', err)
        }
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: {
            username: user.username,
            email: user.email,
            bio: user.bio ? user.bio : ''
        },
        validationSchema: profileSchema,
        onSubmit
    })

    console.log(values)

    return (
        <main className="center-add-post">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="add-post vertical-align">
                <label htmlFor="username">Username</label>
                <input 
                    type="text" 
                    name="username" 
                    id="title" 
                    value={values.username} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                />
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    name="email" 
                    id="title" 
                    value={values.email} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                />
                <label htmlFor="bio">Bio</label>
                <textarea
                    name="bio" 
                    id="synopsis" 
                    cols="30" 
                    rows="5" 
                    placeholder='Write your bio here..' 
                    value={values.bio}  
                    onChange={handleChange} 
                    onBlur={handleBlur}>
                </textarea><br />
                { errors.username && touched.username && <p className='error-message'>{errors.username}</p> }
                { errors.email && touched.email && <p className='error-message'>{errors.email}</p> }
                { errors.bio && touched.bio && <p className='error-message'>{errors.bio}</p> }
                <button type="submit">Update Profile</button>
            </form>
        </main>
    )
}

export default UpdateProfile;