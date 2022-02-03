import express, { json, urlencoded } from 'express';
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import passport from 'passport';
import passportMiddleware from './middlewares/passport';
import cookieParser from 'cookie-parser';

import publicRoutes from './routes/public.routes';
import privateRoutes from './routes/private.routes';

const app = express();

console.log('This is the url: ', path.join(__dirname, 'public'));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', '.hbs');
app.set("views", "./src/views");
app.set('port', process.env.PORT || 3000);

app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir:  path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials')
}));

app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
passport.use(passportMiddleware);

app.use(publicRoutes);
app.use(privateRoutes);

export default app;