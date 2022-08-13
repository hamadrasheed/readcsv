import { Request, Response, Router } from 'express';
import * as csv from './controllers/csv';

const router = Router();

router
  .get('/', (req: Request, res: Response) => res.send('hello world'))
  .get('/hello', csv.helloWorld)
  .get('/csv', csv.renderData)
  .post('/csv', csv.readCSV);

export default router;
