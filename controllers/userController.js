const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// for saving user photo in file system
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

// for saving user photo in memory(buffer) for resizing images
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
    if(!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/img/users/${req.file.filename}`);

    next();
}

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.updateMe = catchAsync( async (req, res, next) => {
    // console.log(req.body);

    //1) Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm) {
        return next( new AppError('This is not for password updates. Please use /updateMyPassword', 400))
    }
    //2) filter fields that not allowed to be updated
    const filterBody = filterObj(req.body, 'name', 'email');
    if(req.file) filterBody.photo = req.file.filename;

    //3) Update user document
    const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true, runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: updateUser
        }
    });
})

exports.deleteMe = catchAsync(async (req,res, next)=>{
    await User.findByIdAndUpdate(req.user.id, {active: false})

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getUser = catchAsync(async (req, res, next) => {

    // if(!user) {
    //     return next(new AppError('No user found with that ID', 404))
    // }

    res.status(500)
        .json({
            statis: 'error',
            message: 'This route is not yet defined'
        })
})

exports.createUser = catchAsync(async (req, res, next) => {
    res.status(500)
        .json({
            statis: 'error',
            message: 'This route is not yet defined'
        })
})

exports.updateUser = catchAsync(async (req, res, next) => {

    // if(!user) {
    //     return next(new AppError('No user found with that ID', 404))
    // }


    res.status(500)
        .json({
            statis: 'error',
            message: 'This route is not yet defined'
        })
})

exports.deleteUser = catchAsync(async (req, res, next) => {

    // if(!user) {
    //     return next(new AppError('No user found with that ID', 404))
    // }

    res.status(500)
        .json({
            statis: 'error',
            message: 'This route is not yet defined'
        })
});
