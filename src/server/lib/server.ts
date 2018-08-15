import app from './app';

const express = require('express');
const path = require('path');
const appRoot = require('app-root-path');
const port = process.env.PORT || 4040;

const initialise = async () => {
  console.log('current environment - ' + process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(appRoot + '/build'), { index: 'index.html' }));
  }

  app.listen(port, function() {
    console.log('Express server listening on port ' + port);
  });
};
initialise();
