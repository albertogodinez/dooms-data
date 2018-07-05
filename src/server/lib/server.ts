import app from './app';
const express = require('express');
const path = require('path');
const appRoot = require('app-root-path');
const port = process.env.PORT || 4040;
app.use(express.static(appRoot + '/build'));
console.log('path joined: ' + appRoot + '/build');
app.get('*', function(request, response) {
  response.sendFile(path.resolve(appRoot, 'build', 'index.html'));
});
app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
