import { Request, Response } from 'express';
import * as fs from 'fs';
import * as HttpStatus from 'http-status-codes';

export const helloWorld = async (req: Request, res: Response): Promise<Response> => {

  return res.status(200).json({ data: 'Hello World!' });

};

export const readCSV = async (req: Request, res: Response): Promise<Response> => {
  
  const { filter, isbn, email } = req.body;

  const booksCsvFile = fs.readFileSync(`./books.csv`, {encoding:'utf8', flag:'r'})
  let booksParsedJson = parseCsvToJson(booksCsvFile , ';');

  const authorCsvFile = fs.readFileSync(`./author.csv`, {encoding:'utf8', flag:'r'})
  let authorParsedJson = parseCsvToJson(authorCsvFile , ';');

  const magzinesCsvFile = fs.readFileSync(`./magzines.csv`, {encoding:'utf8', flag:'r'})
  let magzinesParsedJson = parseCsvToJson(magzinesCsvFile , ';');

  if (filter && (isbn || email)) {

    magzinesParsedJson = filterData(magzinesParsedJson, isbn, email);
    booksParsedJson = filterData(booksParsedJson, isbn, email);
    authorParsedJson = filterData(authorParsedJson, isbn, email);
  
  }

  const modifiedResponse = {
    books: booksParsedJson,
    author: authorParsedJson,
    magzines: magzinesParsedJson
  }

  return res.status(HttpStatus.OK).json(formatResponse(modifiedResponse));

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

const filterData = (parsedJson: any, isbn?: string, email?: string ) => {
  
  return parsedJson.filter((x: any) => {
      
    if ((x?.isbn && isbn && x?.isbn == isbn) || (x?.authors && x?.authors?.includes(`${email}`)) || (x?.email && x?.email?.includes(`${email}`))) {
      return x;
    }
    
  });
}