import express from 'express';
import router from './router';
import httpLogs from 'morgan';
import * as path from 'path';

const app = express();

app.disable('etag');
// app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(httpLogs('dev'));
app.use(express.json());
app.use(router);

export default app;
