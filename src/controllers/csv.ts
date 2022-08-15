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


export const readBook = async (req: Request, res: Response): Promise<any> => {
  
  const { filter, isbn, email, sortByTitle } = req.body;

  const booksCsvFile = fs.readFileSync(`./books.csv`, {encoding:'utf8', flag:'r'})
  let booksParsedJson = parseCsvToJson(booksCsvFile , ';');

  if (filter && (isbn || email)) {
    booksParsedJson = filterData(booksParsedJson, isbn, email);
  }

  if (sortByTitle) {
    booksParsedJson.sort((a, b) => a.title.localeCompare(b.title))
  }

  const modifiedResponse = {
    books: booksParsedJson,
  }

  return res.render('../views/listing', { data : modifiedResponse });

};

export const readaAuthor = async (req: Request, res: Response): Promise<any> => {
  
  const { filter, isbn, email } = req.body;

  const authorCsvFile = fs.readFileSync(`./author.csv`, {encoding:'utf8', flag:'r'})
  let authorParsedJson = parseCsvToJson(authorCsvFile , ';');

  if (filter && (isbn || email)) {

    authorParsedJson = filterData(authorParsedJson, isbn, email);
  
  }

  const modifiedResponse = {
    author: authorParsedJson,
  }

  return res.render('../views/listing', { data : modifiedResponse });

};

export const readMagzines = async (req: Request, res: Response): Promise<any> => {
  
  const { filter, isbn, email,sortByTitle } = req.body;

  const magzinesCsvFile = fs.readFileSync(`./magzines.csv`, {encoding:'utf8', flag:'r'})
  let magzinesParsedJson = parseCsvToJson(magzinesCsvFile , ';');

  if (filter && (isbn || email)) {
    magzinesParsedJson = filterData(magzinesParsedJson, isbn, email);
  }

  if (sortByTitle) {
    magzinesParsedJson.sort((a, b) => a.title.localeCompare(b.title))
  }

  const modifiedResponse = {
    magzines: magzinesParsedJson
  }

  return res.render('../views/listing', { data : modifiedResponse });

};

export const renderData = async (req: Request, res: Response): Promise<any> => {
  
  const { filter, isbn, email, sortByTitle } = req.query as unknown as any;

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

  if (sortByTitle) {
    magzinesParsedJson.sort((a, b) => a.title.localeCompare(b.title))
    booksParsedJson.sort((a, b) => a.title.localeCompare(b.title))
  }

  const modifiedResponse = {
    books: booksParsedJson,
    author: authorParsedJson,
    magzines: magzinesParsedJson
  }

  return res.render('../views/listing', { data : modifiedResponse });

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