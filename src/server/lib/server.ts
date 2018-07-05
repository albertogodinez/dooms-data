import app from './app';
const express = require('express');
const path = require('path');
const port = process.env.PORT || 4040;

app.use(express.static(__dirname + '../../public'));
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});
app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
