const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false  //hide password field when getting user info
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide a confirmation password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false //hide active field when getting user info
    }
});

//encryption password when signing up
userSchema.pre('save', async function(next) {
    //Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //Hash the password
    this.password = await bcrypt.hash(this.password, 12);

    // delete confirm password
    this.passwordConfirm = undefined;
    next();
})

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

//find unactive users and hide them from query, it will run before User.find method
userSchema.pre(/^find/, function(next) {
    this.find({active: {$ne: false}}); // $ne = not equal
    next();
});


//encryption unhashed user password and comapre with hashed password (from database)
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(JWTTimestamp, changedTimestamp);
        return JWTTimestamp < changedTimestamp; // 100 < 200 if true means password was change
    }
    //False means password wasn't changed
    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex'); //crypting by built-in node functionality
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    //console.log({resetToken},this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //token gonna work 10 minutes
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
