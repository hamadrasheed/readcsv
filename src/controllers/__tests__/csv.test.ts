import { Id } from 'objection';
import HttpStatus from 'http-status-codes';
import request from 'supertest';

import app from '../../app';
import urlJoin from 'url-join';

const server = app.listen();

afterAll(() => server.close());

describe('Get All Data', () => {
  let bagId: Id;

  beforeEach(async () => {
    console.log('test is running');
  });

  it('should get all records from csv', async () => {

    const response = await request(server).post('/csv');

    expect(response.status).toBe(HttpStatus.OK);

    // response.body.forEach((cuboid: Cuboid) => {
    //   expect(cuboid.width).toBeDefined();
    //   expect(cuboid.height).toBeDefined();
    //   expect(cuboid.depth).toBeDefined();
    //   expect(cuboid.bag?.id).toBe(bagId);
    // });
  });

});
