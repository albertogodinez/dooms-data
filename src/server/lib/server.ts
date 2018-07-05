import app from './app';
const path = require('path');
const port = process.env.PORT || 4040;

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
