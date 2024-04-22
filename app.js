const express = require('express');
const app = express();
const cors = require('cors');

const drugRouter = require('./routes/drugRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const userRouter = require('./routes/userRoutes');

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cors());
app.use('/images', express.static('images'));


app.use('/api/v1/drugs', drugRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/users', userRouter);


// handle all unhandled routes
app.all('*', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    err.status = 'fail';
    next(err);
})

// global error handler middleware
app.use((err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})

module.exports = app;