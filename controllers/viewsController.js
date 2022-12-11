const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getLoginForm = (req, res)=> {
    res.status(200).render('login', {
        title: 'Login'
    });
}

exports.getSignUpForm = (req, res)=> {
    res.status(200).render('signup', {
        title: 'Sign up'
    });
}

exports.getHome = (req, res)=> {
    res.status(200).render('home', {
        title: 'Home'
    });
}

exports.getAccount =(req, res)=> {
    res.status(200).render('account', {
        title: 'Account'
    });
}

exports.forgotPassword =(req, res)=> {
    res.status(200).render('forgotPassword', {
        title: 'Forgot Password'
    });
}
exports.resetPassword =(req, res)=> {
    res.status(200).render('resetPassword', {
        title: 'Reset Password'
    });
}
// Update user data via form. Disabled
exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {   new: true,
            runValidators: true
        });

    res.status(200).render('account', {
        title: 'Account',
        user: updatedUser
    });
});
