import express from 'express';
import router from './router';
import httpLogs from 'morgan';
import path from 'path';

const app = express();

const dirName = path.resolve();

app.disable('etag');
app.set("view engine", "ejs");
app.use(express.static(path.join(dirName, '/public')))

app.use(httpLogs('dev'));
app.use(express.json());
app.use(router);

export default app;
