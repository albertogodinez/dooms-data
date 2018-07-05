import app from './app';
import * as fs from 'fs';
import { promisify } from 'util';

const express = require('express');
const path = require('path');
const appRoot = require('app-root-path');
const port = process.env.PORT || 4040;

const initialise = async () => {
  console.log('in production');
  // app.get('/', (req, res) => {
  //   res.sendFile(path.join(appRoot + '/build/bundle.js'), { magAge: 0 });
  // });

  app.use(
    express.static(path.join(appRoot + '/build'), { index: 'index.html' })
  );

  app.listen(port, function() {
    console.log('Express server listening on port ' + port);
  });
};
initialise();
