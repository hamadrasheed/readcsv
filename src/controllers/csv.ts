import { Request, Response } from 'express';
import * as fs from 'fs';
import * as HttpStatus from 'http-status-codes';

export const helloWorld = async (req: Request, res: Response): Promise<Response> => {

  return res.status(200).json({ data: 'Hello World!' });

};

export const readCSV = async (req: Request, res: Response): Promise<Response> => {
  
  const { fileName } = req.body;

  const validFileNames: string[] = ['author', 'books', 'magzines'];
  const fileNameVal = fileName ? validFileNames.includes(fileName) : false;

  if (!fileNameVal) {
    return res.status(HttpStatus.FORBIDDEN).json({
      message: `Only ('author', 'books', 'magzines') is allowed in fileName key!`,
    });
  }

  const csvFile = fs.readFileSync(`./${fileName}.csv`, {encoding:'utf8', flag:'r'})
  const parsedJson = parseCsvToJson(csvFile, ';');

  return res.status(200).json(parsedJson);

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

const modifiedCSV = (csv: any) => {

  return csv.map(((z: any): any => {
    const objectKeys: string = Object.keys(z)[0];
    const objectVal: string =  z[`${objectKeys}`];
    const splitedKey = objectKeys.split(';');
    const splitedVal = objectVal.split(';');
    // console.log('objectVal',z);
    // console.log('splitedVal',splitedVal);

    const result: any = {};

    for (let index = 0; index < splitedKey.length; index++) {
      const element = splitedKey[index];

      result[`${element}`] = splitedVal[index];
      
    }

    return result;
    // console.log('values', Object.keys(z)[0]);
    return {
        DateAndTimeOfExport: z['Date And Time of Export'],
        BatchId: z['Batch ID'],
        SampleName: z['Sample Name'],
        well: z.Well,
        sampleType: z['Sample Type'],
        status: z.Status,
        interpretiveResult: z['Interpretive Result'],
        achtion: z['Action*']
    };
}));

}

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

  // return the array
  return arr;
}