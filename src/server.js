const http = require('http');
const url = require('url');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  404: responseHandler.get404,
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getStyle,
  '/getUsers': responseHandler.getUsers,
  '/addUser': responseHandler.addUser,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    urlStruct['404'](request, response);
  }
};

http.createServer(onRequest).listen(port);
console.log(`Listening on port ${port}`);
