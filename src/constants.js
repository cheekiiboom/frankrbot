const fs = require('fs');

try {
  const data = fs.readFileSync('src/credentials.txt', 'utf8');
  var lines = data.split(/\r?\n/);
  const consts = {
    CHANNEL_NAME: lines[0].substring(13,lines[0].length),
    OAUTH_TOKEN: "oauth:"+lines[1].substring(12,lines[1].length),
    BOT_USERNAME: lines[2].substring(13,lines[2].length)
}
module.exports = consts; 
} catch (err) {
  console.error(err);
}