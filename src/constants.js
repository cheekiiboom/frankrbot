const fs = require('fs');

try {
  const data = fs.readFileSync('src/credentials.txt', 'utf8'); // Get data from .txt
  var rows = data.split(/\r?\n/); // Split by row

  // Set environment variables
  const consts = {
    CHANNEL_NAME: rows[0].split('=')[1],
    OAUTH_TOKEN: `oauth:${rows[1].split('=')[1]}`,
    BOT_USERNAME: rows[2].split('=')[1]
  }
  module.exports = consts;
} catch (err) {
  console.error(err);
}