import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import { withRouter } from 'next/router';
import Layout from '../../../components/Layout';

const ActivateAccount = ({ router }) => {
    const [state, setState] = useState({
        username: '',
        token: '',
        buttonText: 'Activate Account',
        success: '',
        error: '',
    });
    const { username, token, buttonText, success, error } = state;

    // Ran as soon as component mounts
    useEffect(() => {
        let token = router.query.id;
        if (token) {
            // Decode jwt token
            const { username } = jwt.decode(token);
            setState({ ...state, username, token });
        }
        // Pass array to prevent useEffect from running indefinitely
        // Default behavoir is to run when component mounts and unmounts
    }, [router]);

    // Send token to backend to create user
    const clickSubmit = async (e) => {
        e.preventDefault();
        // console.log('activate account');

        // Make request to backend
        setState({ ...state, buttonText: 'Activating' });

        try {
            const response = await axios.post(`${API}/register/activate`, {
                token,
            });
            //console.log('account activate response', response)
            setState({
                ...state,
                name: '',
                token: '',
                buttonText: 'Activated',
                success: response.data.message,
            });
        } catch (error) {
            setState({...state, buttonText:'Activate Account', error: error.response.data.error})
        }
    };

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Hello {username}</h1>
                    <h2>Ready to activate your account?</h2>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    <button
                        className="btn btn-outline-warning btn-block"
                        onClick={clickSubmit}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default withRouter(ActivateAccount);
