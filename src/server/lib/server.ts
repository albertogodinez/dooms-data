import app from './app';
const express = require('express');
const path = require('path');
const appRoot = require('app-root-path');
const port = process.env.PORT || 4040;
app.use(express.static(path.join(appRoot + '/build'), { index: false }));
console.log('path joined: ' + path.join(appRoot + '/build'));

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
