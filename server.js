const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err =>{
    console.log('Uncaught Exception! Shutting Down...');
    console.log(err.name, err.message);
    process.exit(1);
})


const app = require('./app');
dotenv.config({path: './config.env'});

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(()=>console.log('DB connection successful. Mode: ' + process.env.NODE_ENV + '.'));

const port = process.env.PORT || 3000;
const server = app.listen(port, ()=>{
    // console.log(`Server is running on port ${port}...`)
});

process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection! Shutting Down...');
    console.log(err.name, err.message);
    server.close(()=>{
        process.exit(1);
    });
});


