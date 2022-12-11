import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/users/login',
            data: {
                email,
                password
            }
        });
        if(res.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        }
        // console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const logout = async () => {
    try{
        const res = await axios({
            method: 'GET',
            url: '/api/users/logout',
        });
        if (res.data.status === 'success') location.assign('/login');
    } catch (err) {
        showAlert('error', 'Error logging out! Try again.');
    }
}


export const signup = async (name, email, password, passwordConfirm) => {
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        });
        if(res.data.status === 'success') {
            showAlert('success', `Welcome to app, ${name}!`);
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        }
        // console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const forgotPassword = async (email) => {
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/users/forgotPassword',
            data: {
                email
            }
        });
        if(res.data.status === 'success') {
            showAlert('success', `PLease follow the link provided to the ${email}`);
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        }
        // console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const resetPassword = async (token, password, passwordConfirm) => {
    try{
        const res = await axios({
            method: 'PATCH',
            url: `/api/users/resetPassword/${token}`,
            data: {
                password,
                passwordConfirm
            }
        });
        if(res.data.status === 'success') {
            showAlert('success', `You successfully updated your password!`);
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        }
        // console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}
