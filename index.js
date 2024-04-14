require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
require('./bin/connect');
const Koa = require('koa');
const app = new Koa();
const { userAgent } = require('koa-useragent');
const logger = require('koa-morgan');
const bodyParser = require('koa-bodyparser');
const render = require('koa-ejs');
const serve = require('koa-static');
const path = require('path');
const flash = require('koa-better-flash');

app.use(userAgent);
app.use(logger('dev'));
app.use(bodyParser());

// Sessions
const session = require('koa-session');
app.keys = ['vision-session-key']
app.use(session({}, app));
app.use(flash());

// Config template
render(app, {
    root: path.join(__dirname, 'templates'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: false
});
app.use(serve(path.join(__dirname, '/public')));

// End point
const catchError = require('./middleware/catch_error');
app.use(catchError);

// Router
const router = require('./routes');
app.use(router);

// Listen port
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Application run at port ${port}`);
});