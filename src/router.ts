import { Request, Response, Router } from 'express';
import * as csv from './controllers/csv';

const router = Router();

router
  .get('/', (req: Request, res: Response) => res.send('hello world'))
  .get('/hello', csv.helloWorld)
  .get('/csv', csv.renderData)
  .get('/author', csv.readaAuthor)
  .get('/books', csv.readBook)
  .get('/magzines', csv.readMagzines)
  .post('/add-data', csv.addNewData)
  .post('/csv', csv.readCSV);

export default router;
