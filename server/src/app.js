import express from 'express';
import cors  from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';

import config from '../config'
import connect from './models';
import checkAuth from './middleware/auth-check';
import apiRoutes from './routes/api.route'
import authRoutes from './routes/auth.route'
import getLocalSignupStrategy from './passport/local-signup';
import getLocalLoginStrategy from './passport/local-login';

connect(config.dbUri);

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

const User = mongoose.model('User');
app.use(passport.initialize());
passport.use('local-signup', getLocalSignupStrategy(User));
passport.use('local-login', getLocalLoginStrategy(User));


app.use('/auth', authRoutes);
app.use('/api', checkAuth, apiRoutes);

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "0.0.0.0"
app.listen(PORT, HOST, () => console.log(`App listening at port ${PORT}`));
