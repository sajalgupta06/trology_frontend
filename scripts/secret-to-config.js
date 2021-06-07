const fs = require('fs');

const stdin = process.openStdin();
let data = '';

stdin.on('data', function(chunk) {
  data += chunk;
});
console.log('data', data)
stdin.on('end', function() {
  const result = JSON.parse(data);

  fs.writeFileSync(process.argv[2], result["SecretString"]);
});
