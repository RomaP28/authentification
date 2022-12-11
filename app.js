const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

//1) Global Middlewares
//Serving static files(such as style.css, index.js etc.)
app.use(express.static(path.join(__dirname, 'public')));

//Development logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Set security Http headers
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));

// limit connections to the same API (100 per hour)
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour'
})
app.use('/api', limiter);


//Body parser, reading data from body into req.body
app.use(express.json({
    limit: '10kb'
}));
//Parse dara from forms on submit
app.use(express.urlencoded({extended: true, limit: '10kb'}))
//Cookie parser, reading data from cookie
app.use(cookieParser());


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
//Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration', //parameters depends on app
    ]
}));

app.use(compression());

//Test middleware
app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
})

//3) Routes
app.use('/', viewRouter);
app.use('/api/users', userRouter);

app.all('*', (req, res, next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

//Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
