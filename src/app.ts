import express from 'express';
import router from './router';
import httpLogs from 'morgan';
// import * as path from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disable('etag');
// app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, '../public')))

app.use(httpLogs('dev'));
app.use(express.json());
app.use(router);

export default app;
