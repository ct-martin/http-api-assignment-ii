const fs = require('fs');
const query = require('querystring');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const users = {};

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  return response.end();
};

const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  return response.end();
};

const getUsers = (request, response) => {
  const myJson = {
    users,
  };

  const jsonString = JSON.stringify(myJson);

  response.writeHead(200, { 'Content-Type': 'application/json' });
  if (request.method === 'GET') {
    response.write(jsonString);
  }
  return response.end();
};

const addUser = (request, response) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    if (!bodyParams.name || !bodyParams.age) {
      const myJson = {
        message: 'Name and age are both required.',
        id: 'Bad Request',
      };

      const jsonString = JSON.stringify(myJson);

      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.write(jsonString);
      return response.end();
    }

    if (users[bodyParams.name]) {
      response.writeHead(204, { 'Content-Type': 'application/json' });
      return response.end();
    }

    users[bodyParams.name] = {};
    users[bodyParams.name].name = bodyParams.name;
    users[bodyParams.name].age = bodyParams.age;

    const myJson = {
      message: 'Created Successfully',
      id: 'Create',
    };

    const jsonString = JSON.stringify(myJson);

    response.writeHead(201, { 'Content-Type': 'application/json' });
    response.write(jsonString);
    return response.end();
  });
};

const get404 = (request, response) => {
  const myJson = {
    message: 'The page you are looking for was not found.',
    id: 'Resource Not Found',
  };

  const jsonString = JSON.stringify(myJson);

  response.writeHead(404, { 'Content-Type': 'application/json' });
  if (request.method === 'GET') {
    response.write(jsonString);
  }
  return response.end();
};

module.exports = {
  getIndex,
  getStyle,
  getUsers,
  addUser,
  get404,
};
