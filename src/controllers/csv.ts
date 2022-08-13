import { Request, Response } from 'express';
import * as fs from 'fs';
import * as HttpStatus from 'http-status-codes';

export const helloWorld = async (req: Request, res: Response): Promise<Response> => {

  return res.status(200).json({ data: 'Hello World!' });

};

export const readCSV = async (req: Request, res: Response): Promise<Response> => {
  
  const { fileName, filter, isbn, email } = req.body;

  const validFileNames: string[] = ['author', 'books', 'magzines'];
  const fileNameVal = fileName ? validFileNames.includes(fileName) : false;

  if (!fileNameVal) {
    return res.status(HttpStatus.FORBIDDEN).json({
      message: `Only ('author', 'books', 'magzines') is allowed in fileName key!`,
    });
  }

  const csvFile = fs.readFileSync(`./${fileName}.csv`, {encoding:'utf8', flag:'r'})
  const parsedJson = parseCsvToJson(csvFile, ';');

  if (filter && (isbn || email)) {

    const results = parsedJson.filter(x => {
      
      if (x?.isbn == isbn || x?.authors?.includes(`${email}`)) {
        return x;
      }
      
    });

    return res.status(HttpStatus.OK).json(formatResponse(results));
  
  }


  return res.status(HttpStatus.OK).json(formatResponse(parsedJson));

};

export const renderData = async (req: Request, res: Response): Promise<any> => {
  
  let { fileName } = req.query as unknown as any;

  const validFileNames: string[] = ['author', 'books', 'magzines'];
  const fileNameVal = fileName ? validFileNames.includes(fileName) : false;

  if (!fileNameVal) {
    return res.status(HttpStatus.FORBIDDEN).json({
      message: `Only ('author', 'books', 'magzines') is allowed in fileName key!`,
    });
  }

  const csvFile = fs.readFileSync(`./${fileName}.csv`, {encoding:'utf8', flag:'r'})
  const parsedJson = parseCsvToJson(csvFile, ';');

  return res.render('../src/views/', {
    user: {
      firstName: "hamad"
    }
  });

};

const parseCsvToJson = (str: string, delimiter = ",") => {

  const headers: string[] = str.slice(0, str.indexOf("\n")).split(delimiter);

  const rows: string[] = str.slice(str.indexOf("\n") + 1).split("\n");

  const arr = rows.map(function (row) {
    
    const values: string[] = row.split(delimiter);
    const el = headers.reduce(function (object: any, header: string, index: number) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  return arr;

}

const formatResponse = <T>(val: Array<T> | T) => {
  
  const resposne: any =  {
    message: 'Success',
  }

  if (Array.isArray(val)) {
    resposne[`totalRecords`] = val.length;
  }

  resposne[`data`] = val;


  return resposne;
}