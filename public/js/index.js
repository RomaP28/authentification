import '@babel/polyfill';
import { login, logout, signup, forgotPassword, resetPassword } from "./auth";
import { updateSettings } from "./updateUserData";

const loginForm = document.querySelector('.login-form');
const signUpForm = document.querySelector('.sign-up-form');
const logoutBtn = document.querySelector('.logout');
const userDataForm = document.querySelector('.user-data');
const userPasswordForm = document.querySelector('.user-password');
const userPhoto = document.getElementById('user-photo');
const forgotPasswordForm = document.querySelector('.forgot-password');
const resetPasswordForm = document.querySelector('.reset-password');

if (loginForm)
    loginForm.addEventListener('submit', e=>{
        e.preventDefault();
        const email = document.querySelector('.email').value;
        const password = document.querySelector('.password').value;
        login(email, password);
    })


if(logoutBtn) logoutBtn.addEventListener('click', logout)

if (signUpForm)
    signUpForm.addEventListener('submit', e=>{
        e.preventDefault();
        const name = document.querySelector('.name').value;
        const email = document.querySelector('.email').value;
        const password = document.querySelector('.password').value;
        const passwordConfirm = document.querySelector('.passwordConfirm').value;
        signup(name, email, password, passwordConfirm);
    })

if(userDataForm)
    userDataForm.addEventListener('submit',   e=>{
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('user-name').value)
        form.append('email', document.getElementById('user-email').value)
        form.append('photo', document.getElementById('user-photo').files[0])
        updateSettings(form, 'data');
    });

if(userPhoto)
    userPhoto.addEventListener('change',   event => {
        const reader = new FileReader();
        const userImage = document.querySelector(".img-profile");
        reader.onload = function(event) {
            userImage.src = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    })

if(userPasswordForm)
    userPasswordForm.addEventListener('submit', async e=>{
        e.preventDefault();
        document.querySelector('.save-password').innerHTML = 'Updating...';
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({passwordCurrent, password, passwordConfirm}, 'password');

        document.querySelector('.save-password').innerHTML = 'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async e=>{
        e.preventDefault();
        const email = document.querySelector('.email').value;
        await forgotPassword(email);
    })
}

if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        const token = location.href.split('/').pop().replace('reset=', '');
        // const urlParams = new URLSearchParams(window.location.search);
        // const token = urlParams.get('reset');

        console.log(token)
        const password = document.querySelector('.password').value;
        const passwordConfirm = document.querySelector('.passwordConfirm').value;
        await resetPassword(token, password, passwordConfirm);
    })
}
