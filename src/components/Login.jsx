import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from 'formik';
import { userSchema } from '../schemas/login-schema';
import Cookies from 'js-cookie';
import { useState } from 'react';

function Login() {
    const navigate = useNavigate();
    const [ errorMessage, setErrorMessage ] = useState('');

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch('http://localhost:5000/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(values)
            })
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                Cookies.set('userId', data.user.id, { expires: 1 / 24 })
                Cookies.set('userEmail', data.user.email, { expires: 1 / 24 })
                resetForm();
                setSubmitting(false) 
                navigate('/');
            } else {
                console.error('Login failed', data.message);
                setErrorMessage(data.message);
            }
        } catch(err) {
            console.error('Login request failed:', err)
            setErrorMessage('An error occurred. Please try again.');
        }
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: userSchema,
        onSubmit
    })

    return (
        <div className="page">
            <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="menu-icon"/></Link>
            <form onSubmit={handleSubmit}>
                <input 
                    type="username" 
                    name="email" 
                    placeholder="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <br />
                <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <br />
                { errors.email && touched.email && <p className='error-message'>{errors.email}</p> }
                { errors.password && touched.password && <p className='error-message'>{errors.password}</p> }
                { errorMessage && <p className='error-message'>{errorMessage}</p> }
                <button type="submit">Login</button>
                <p>Dont have an account yet? <Link to="/signup" className="link">Create Account</Link></p>
            </form>
        </div>
    )
}

export default Login;