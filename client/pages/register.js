import { useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const Register = () => {
    const [state, setState] = useState({
        username: '',
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Register',
    });

    // Destructure state
    const { username, email, password, error, success, buttonText } = state;

    const handleChange = (name) => (e) => {
        // Get field that is being updated.
        setState({
            ...state,
            [name]: e.target.value,
            error: '',
            success: '',
            buttonText: 'Register',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.table({ username, email, password });
        axios.post(`http://localhost:8000/api/register`, {
            username: username,
            email,
            password
        })
        .then(response => console.log(response))
        .catch(error => console.log(error))
    };

    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    value={username}
                    onChange={handleChange('username')}
                    type="text"
                    className="form-control"
                    placeholder="Type your name"
                />
            </div>

            <div className="form-group">
                <input
                    value={email}
                    onChange={handleChange('email')}
                    type="email"
                    className="form-control"
                    placeholder="Type your email"
                />
            </div>

            <div className="form-group">
                <input
                    value={password}
                    onChange={handleChange('password')}
                    type="password"
                    className="form-control"
                    placeholder="Type your password"
                />
            </div>

            <div className="form-group">
                <button className="btn btn-outline-warning">
                    {buttonText}
                </button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <h1>Register</h1>
                <br />
                {registerForm()}
            </div>
        </Layout>
    );
};

export default Register;
