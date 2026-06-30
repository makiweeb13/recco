import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from 'formik';
import { userSchema } from '../schemas/login-schema';
import { useState } from 'react';
import useStore from '../store/store';

function Login() {
    const navigate = useNavigate();
    const { setUser, setToken } = useStore();
    const [ errorMessage, setErrorMessage ] = useState('');

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch(`/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem('token', data.token);
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
            <div className="page-inner">
                <Link to="/" className="back-link"><FontAwesomeIcon icon={faArrowLeft} /> Back</Link>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.email && touched.email ? 'input-error' : ''}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.password && touched.password ? 'input-error' : ''}
                    />
                    { errors.email && touched.email && <p className='error-message'>{errors.email}</p> }
                    { errors.password && touched.password && <p className='error-message'>{errors.password}</p> }
                    { errorMessage && <p className='error-message'>{errorMessage}</p> }
                    <button type="submit">Login</button>
                    <p>Dont have an account yet? <Link to="/signup" className="link">Create Account</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login;